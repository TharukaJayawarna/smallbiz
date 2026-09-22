import { NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectDB } from "@/lib/mongodb";
import { getCurrentUserId } from "@/lib/auth";

import User from "@/models/User";
import Order from "@/models/Order";
import Product from "@/models/Product"

const allowedStatuses = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const { id } = await params;

    await connectDB();

    const user = await User.findById(userId);

    if (!user || !user.businessId) {
      return NextResponse.json(
        {
          success: false,
          message: "Business not found",
        },
        { status: 404 }
      );
    }

    const order = await Order.findOne({
      _id: id,
      businessId: user.businessId,
    });

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get order error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch order",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await mongoose.startSession();

  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const { id } = await params;

    const body = await request.json();
    const { status } = body;

    if (!status || !allowedStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid order status",
        },
        { status: 400 }
      );
    }

    await connectDB();

    let updatedOrder: any = null;

    await session.withTransaction(async () => {
      const user = await User.findById(userId).session(session);

      if (!user || !user.businessId) {
        throw new Error("BUSINESS_NOT_FOUND");
      }

      const order = await Order.findOne({
        _id: id,
        businessId: user.businessId,
      }).session(session);

      if (!order) {
        throw new Error("ORDER_NOT_FOUND");
      }

      /*
       * Once an order is cancelled, don't allow it
       * to become active again.
       *
       * This prevents stock from being restored
       * and deducted repeatedly.
       */
      if (
        order.status === "CANCELLED" &&
        status !== "CANCELLED"
      ) {
        throw new Error("CANCELLED_ORDER_LOCKED");
      }

      /*
       * If changing an active order → CANCELLED,
       * return all ordered quantities to stock.
       */
      if (
        order.status !== "CANCELLED" &&
        status === "CANCELLED"
      ) {
        for (const item of order.items) {
          await Product.findOneAndUpdate(
            {
              _id: item.productId,
              businessId: user.businessId,
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
      }

      order.status = status;

      await order.save({ session });

      updatedOrder = order;
    });

    return NextResponse.json({
      success: true,
      message: "Order status updated",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Update order error:", error);

    const message =
      error instanceof Error ? error.message : "";

    if (message === "BUSINESS_NOT_FOUND") {
      return NextResponse.json(
        {
          success: false,
          message: "Business not found",
        },
        { status: 404 }
      );
    }

    if (message === "ORDER_NOT_FOUND") {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found",
        },
        { status: 404 }
      );
    }

    if (message === "CANCELLED_ORDER_LOCKED") {
      return NextResponse.json(
        {
          success: false,
          message:
            "A cancelled order cannot be reopened.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update order",
      },
      { status: 500 }
    );
  } finally {
    await session.endSession();
  }
}