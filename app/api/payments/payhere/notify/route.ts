import crypto from "crypto";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";

import {
  generatePayHereNotificationHash,
} from "@/lib/payhere";

function safeCompare(a: string, b: string): boolean {
  const aBuffer = Buffer.from(a.toUpperCase(), "utf8");
  const bBuffer = Buffer.from(b.toUpperCase(), "utf8");

  if (aBuffer.length !== bBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(aBuffer, bBuffer);
}

export async function POST(request: Request) {
  const session = await mongoose.startSession();

  try {
    const formData = await request.formData();

    const merchantId = String(
      formData.get("merchant_id") || ""
    );

    const orderId = String(
      formData.get("order_id") || ""
    );

    const paymentId = String(
      formData.get("payment_id") || ""
    );

    const payhereAmount = String(
      formData.get("payhere_amount") || ""
    );

    const payhereCurrency = String(
      formData.get("payhere_currency") || ""
    );

    const statusCode = String(
      formData.get("status_code") || ""
    );

    const md5sig = String(
      formData.get("md5sig") || ""
    );

    console.log("========== PAYHERE NOTIFICATION ==========");
    console.log({
      merchantId,
      orderId,
      paymentId,
      payhereAmount,
      payhereCurrency,
      statusCode,
      md5sig,
    });

    if (
      !merchantId ||
      !orderId ||
      !payhereAmount ||
      !payhereCurrency ||
      !statusCode ||
      !md5sig
    ) {
      return new NextResponse("Invalid notification", {
        status: 400,
      });
    }

    const configuredMerchantId =
      process.env.PAYHERE_MERCHANT_ID;

    const merchantSecret =
      process.env.PAYHERE_MERCHANT_SECRET;

    if (!configuredMerchantId || !merchantSecret) {
      console.error(
        "PayHere credentials are not configured"
      );

      return new NextResponse(
        "Server configuration error",
        { status: 500 }
      );
    }

    if (merchantId !== configuredMerchantId) {
      console.error("Invalid PayHere merchant ID");

      return new NextResponse("Invalid merchant", {
        status: 400,
      });
    }

    const localMd5sig =
      generatePayHereNotificationHash(
        merchantId,
        orderId,
        payhereAmount,
        payhereCurrency,
        statusCode,
        merchantSecret
      );

    console.log("PayHere signature:", {
      received: md5sig,
      generated: localMd5sig,
    });

    if (!safeCompare(localMd5sig, md5sig)) {
      console.error(
        "Invalid PayHere notification signature",
        { orderId }
      );

      return new NextResponse("Invalid signature", {
        status: 400,
      });
    }

    await connectDB();

    const order = await Order.findOne({
      orderNumber: orderId,
    });

    if (!order) {
      console.error(
        "PayHere order not found:",
        orderId
      );

      return new NextResponse("Order not found", {
        status: 404,
      });
    }

    if (payhereCurrency !== "LKR") {
      console.error("Invalid PayHere currency");

      return new NextResponse("Invalid currency", {
        status: 400,
      });
    }

    const expectedAmount = Number(order.total).toFixed(2);
    const receivedAmount = Number(payhereAmount).toFixed(2);

    if (expectedAmount !== receivedAmount) {
      console.error("PayHere amount mismatch", {
        orderId,
        expectedAmount,
        receivedAmount,
      });

      return new NextResponse("Amount mismatch", {
        status: 400,
      });
    }

    /*
     * SUCCESS
     */
    if (statusCode === "2") {
      if (order.paymentStatus === "PAID") {
        console.log(
          `PayHere duplicate success notification: ${orderId}`
        );

        return new NextResponse("OK", {
          status: 200,
        });
      }

      if (order.paymentStatus === "FAILED") {
        console.error(
          "Attempted to mark failed order as paid:",
          orderId
        );

        return new NextResponse(
          "Order already failed",
          { status: 400 }
        );
      }

      const updated = await Order.updateOne(
        {
          _id: order._id,
          paymentStatus: "PENDING",
        },
        {
          $set: {
            paymentStatus: "PAID",
            paymentId: paymentId || "",
            paidAt: new Date(),
            status: "CONFIRMED",
          },
        }
      );

      console.log(
        `PayHere payment successful: ${orderId}`,
        updated
      );

      return new NextResponse("OK", {
        status: 200,
      });
    }

    /*
     * PENDING
     */
    if (statusCode === "0") {
      console.log(
        `PayHere payment pending: ${orderId}`
      );

      return new NextResponse("OK", {
        status: 200,
      });
    }

    /*
     * FAILED / CANCELLED / CHARGEBACK
     */
    if (
      statusCode === "-1" ||
      statusCode === "-2" ||
      statusCode === "-3"
    ) {
      await session.withTransaction(async () => {
        const currentOrder = await Order.findOne({
          _id: order._id,
        }).session(session);

        if (!currentOrder) {
          throw new Error("ORDER_NOT_FOUND");
        }

        if (
          currentOrder.paymentStatus === "FAILED"
        ) {
          return;
        }

        if (
          currentOrder.paymentStatus === "PAID"
        ) {
          return;
        }

        for (const item of currentOrder.items) {
          await Product.findOneAndUpdate(
            {
              _id: item.productId,
              businessId: currentOrder.businessId,
            },
            {
              $inc: {
                stock: item.quantity,
              },
            },
            {
              session,
            }
          );
        }

        await Order.updateOne(
          {
            _id: currentOrder._id,
            paymentStatus: "PENDING",
          },
          {
            $set: {
              paymentStatus: "FAILED",
              paymentId: paymentId || "",
            },
          },
          {
            session,
          }
        );
      });

      console.log(
        `PayHere payment failed/cancelled: ${orderId}`
      );

      return new NextResponse("OK", {
        status: 200,
      });
    }

    console.log(
      `Unhandled PayHere status ${statusCode}: ${orderId}`
    );

    return new NextResponse("OK", {
      status: 200,
    });
  } catch (error) {
    console.error(
      "PayHere notification error:",
      error
    );

    return new NextResponse(
      "Notification processing failed",
      { status: 500 }
    );
  } finally {
    await session.endSession();
  }
}