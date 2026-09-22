import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { getCurrentUserId } from "@/lib/auth";
import User from "@/models/User";
import Product from "@/models/Product";
import Order from "@/models/Order";

type AnalyticsRange = "7d" | "30d" | "12m";

type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export async function GET(
  request: NextRequest
) {
  try {
    // -----------------------------------------
    // AUTHENTICATION
    // -----------------------------------------

    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    // -----------------------------------------
    // GET CURRENT USER
    // -----------------------------------------

    const user = await User.findById(userId).lean();

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    if (!user.businessId) {
      return NextResponse.json(
        {
          message: "Business not found",
        },
        {
          status: 404,
        }
      );
    }

    // -----------------------------------------
    // TENANT ID
    // -----------------------------------------

    const businessId =
      user.businessId instanceof mongoose.Types.ObjectId
        ? user.businessId
        : new mongoose.Types.ObjectId(
            user.businessId.toString()
          );

    // -----------------------------------------
    // RANGE
    // -----------------------------------------

    const searchParams =
      request.nextUrl.searchParams;

    const requestedRange =
      searchParams.get("range") || "7d";

    const range: AnalyticsRange =
      requestedRange === "30d" ||
      requestedRange === "12m"
        ? requestedRange
        : "7d";

    // -----------------------------------------
    // BASIC ANALYTICS
    // -----------------------------------------

    const [
      totalProducts,
      totalOrders,
      pendingOrders,
      completedOrders,
      totalSalesResult,
    ] = await Promise.all([
      Product.countDocuments({
        businessId,
        isActive: true,
      }),

      Order.countDocuments({
        businessId,
      }),

      Order.countDocuments({
        businessId,
        status: "PENDING",
      }),

      Order.countDocuments({
        businessId,
        status: "DELIVERED",
      }),

      Order.aggregate([
        {
          $match: {
            businessId,
            status: {
              $ne: "CANCELLED",
            },
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$total",
            },
          },
        },
      ]),
    ]);

    const totalSales =
      totalSalesResult[0]?.total || 0;

    // -----------------------------------------
    // RECENT ORDERS
    // -----------------------------------------

    const recentOrders = await Order.find({
      businessId,
    })
      .sort({
        createdAt: -1,
      })
      .limit(5)
      .select(
        "orderNumber customerName total status paymentStatus createdAt"
      )
      .lean();

    // -----------------------------------------
    // LOW STOCK PRODUCTS
    // -----------------------------------------

    const lowStockProducts =
      await Product.find({
        businessId,
        isActive: true,
        stock: {
          $lte: 5,
        },
      })
        .sort({
          stock: 1,
        })
        .limit(5)
        .select(
          "name stock price images"
        )
        .lean();

    // -----------------------------------------
    // BEST SELLING PRODUCTS
    // -----------------------------------------

    const bestSellingProducts =
      await Order.aggregate([
        {
          $match: {
            businessId,
            status: {
              $ne: "CANCELLED",
            },
          },
        },

        {
          $unwind: "$items",
        },

        {
          $group: {
            _id: "$items.productId",

            name: {
              $first: "$items.name",
            },

            quantitySold: {
              $sum: "$items.quantity",
            },

            revenue: {
              $sum: {
                $multiply: [
                  "$items.price",
                  "$items.quantity",
                ],
              },
            },
          },
        },

        {
          $sort: {
            quantitySold: -1,
          },
        },

        {
          $limit: 5,
        },
      ]);

    // -----------------------------------------
    // ORDER STATUS STATISTICS
    // -----------------------------------------

    const statusAggregation =
      await Order.aggregate([
        {
          $match: {
            businessId,
          },
        },

        {
          $group: {
            _id: "$status",
            count: {
              $sum: 1,
            },
          },
        },
      ]);

    const orderStatusStats: Record<
      OrderStatus,
      number
    > = {
      PENDING: 0,
      CONFIRMED: 0,
      PROCESSING: 0,
      SHIPPED: 0,
      DELIVERED: 0,
      CANCELLED: 0,
    };

    for (const item of statusAggregation) {
      const status = item._id as OrderStatus;

      if (
        Object.prototype.hasOwnProperty.call(
          orderStatusStats,
          status
        )
      ) {
        orderStatusStats[status] =
          Number(item.count) || 0;
      }
    }

    // -----------------------------------------
    // SALES CHART DATE RANGE
    // -----------------------------------------

    const now = new Date();

    let startDate: Date;

    let groupFormat: "%Y-%m-%d" | "%Y-%m";

    if (range === "7d") {
      startDate = new Date(now);

      startDate.setDate(
        startDate.getDate() - 6
      );

      startDate.setHours(
        0,
        0,
        0,
        0
      );

      groupFormat = "%Y-%m-%d";
    } else if (range === "30d") {
      startDate = new Date(now);

      startDate.setDate(
        startDate.getDate() - 29
      );

      startDate.setHours(
        0,
        0,
        0,
        0
      );

      groupFormat = "%Y-%m-%d";
    } else {
      startDate = new Date(now);

      startDate.setMonth(
        startDate.getMonth() - 11
      );

      startDate.setDate(1);

      startDate.setHours(
        0,
        0,
        0,
        0
      );

      groupFormat = "%Y-%m";
    }

    // -----------------------------------------
    // SALES AGGREGATION
    // -----------------------------------------

    const salesByPeriod =
      await Order.aggregate([
        {
          $match: {
            businessId,

            status: {
              $ne: "CANCELLED",
            },

            createdAt: {
              $gte: startDate,
              $lte: now,
            },
          },
        },

        {
          $group: {
            _id: {
              $dateToString: {
                format: groupFormat,
                date: "$createdAt",
                timezone: "Asia/Colombo",
              },
            },

            sales: {
              $sum: "$total",
            },

            orders: {
              $sum: 1,
            },
          },
        },

        {
          $sort: {
            _id: 1,
          },
        },
      ]);

    // -----------------------------------------
    // CREATE ZERO-FILLED CHART
    // -----------------------------------------

    const salesChart: {
      date: string;
      sales: number;
      orders: number;
    }[] = [];

    if (
      range === "7d" ||
      range === "30d"
    ) {
      const numberOfDays =
        range === "7d" ? 7 : 30;

      for (
        let i = 0;
        i < numberOfDays;
        i++
      ) {
        const date = new Date(
          startDate
        );

        date.setDate(
          startDate.getDate() + i
        );

        const year =
          date.getFullYear();

        const month = String(
          date.getMonth() + 1
        ).padStart(2, "0");

        const day = String(
          date.getDate()
        ).padStart(2, "0");

        const dateString =
          `${year}-${month}-${day}`;

        const existingDay =
          salesByPeriod.find(
            (item) =>
              item._id === dateString
          );

        salesChart.push({
          date: dateString,

          sales:
            Number(
              existingDay?.sales
            ) || 0,

          orders:
            Number(
              existingDay?.orders
            ) || 0,
        });
      }
    } else {
      for (
        let i = 0;
        i < 12;
        i++
      ) {
        const date = new Date(
          startDate
        );

        date.setMonth(
          startDate.getMonth() + i
        );

        const year =
          date.getFullYear();

        const month = String(
          date.getMonth() + 1
        ).padStart(2, "0");

        const monthString =
          `${year}-${month}`;

        const existingMonth =
          salesByPeriod.find(
            (item) =>
              item._id === monthString
          );

        salesChart.push({
          date: monthString,

          sales:
            Number(
              existingMonth?.sales
            ) || 0,

          orders:
            Number(
              existingMonth?.orders
            ) || 0,
        });
      }
    }

    // -----------------------------------------
    // RESPONSE
    // -----------------------------------------

    return NextResponse.json({
      totalProducts,

      totalOrders,

      pendingOrders,

      completedOrders,

      totalSales,

      recentOrders,

      lowStockProducts,

      bestSellingProducts,

      orderStatusStats,

      salesChart,

      range,
    });
  } catch (error) {
    console.error(
      "Dashboard analytics error:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to load dashboard analytics",
      },
      {
        status: 500,
      }
    );
  }
}
