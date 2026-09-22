import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Business from "@/models/Business";
import Order from "@/models/Order";

function createWhatsAppUrl(
  business: any,
  order: any
): string {
  let message =
    `Payment Confirmed - ${business.name}\n\n`;

  message +=
    `Order Number: ${order.orderNumber}\n\n`;

  message +=
    `Customer:\n${order.customerName}\n\n`;

  message +=
    `Phone:\n${order.customerPhone}\n\n`;

  message +=
    `Delivery Address:\n${order.deliveryAddress}\n\n`;

  message +=
    `Payment Method:\nPayHere - Online Payment\n\n`;

  message +=
    `Payment Status:\nPAID\n\n`;

  message += `Items:\n`;

  for (const item of order.items) {
    message += `\n${item.name}`;
    message += `\nQty: ${item.quantity}`;
    message += `\nPrice: Rs. ${item.price.toLocaleString()}`;

    if (item.size) {
      message += `\nSize: ${item.size}`;
    }

    if (item.color) {
      message += `\nColor: ${item.color}`;
    }

    message += `\n`;
  }

  message +=
    `\nTotal: Rs. ${order.total.toLocaleString()}`;

  let whatsappNumber =
    String(
      business.whatsappNumber || ""
    ).replace(/\D/g, "");

  if (
    whatsappNumber.startsWith("0")
  ) {
    whatsappNumber =
      "94" +
      whatsappNumber.substring(1);
  }

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    message
  )}`;
}

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      slug: string;
    }>;
  }
) {
  try {
    const { slug } =
      await params;

    const url =
      new URL(request.url);

    const orderId =
      url.searchParams.get(
        "orderId"
      );

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Order ID is required",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const business =
      await Business.findOne({
        slug,
      }).lean();

    if (!business) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Store not found",
        },
        { status: 404 }
      );
    }

    const order =
      await Order.findOne({
        businessId:
          business._id,

        orderNumber:
          orderId,
      }).lean();

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Order not found",
        },
        { status: 404 }
      );
    }

    let whatsappUrl = "";

    if (
      order.paymentStatus ===
      "PAID"
    ) {
      whatsappUrl =
        createWhatsAppUrl(
          business,
          order
        );
    }

    return NextResponse.json({
      success: true,

      order: {
        orderNumber:
          order.orderNumber,

        total:
          order.total,

        paymentMethod:
          order.paymentMethod,

        paymentStatus:
          order.paymentStatus,

        paymentId:
          order.paymentId || "",

        paidAt:
          order.paidAt || null,

        status:
          order.status,
      },

      whatsappUrl,
    });
  } catch (error) {
    console.error(
      "Payment status error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to get payment status",
      },
      { status: 500 }
    );
  }
}