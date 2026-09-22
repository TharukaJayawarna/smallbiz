"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type AnalyticsRange = "7d" | "30d" | "12m";

interface RecentOrder {
  _id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

interface LowStockProduct {
  _id: string;
  name: string;
  stock: number;
  price: number;
  images?: string[];
}

interface BestSellingProduct {
  _id: string;
  name: string;
  quantitySold: number;
  revenue: number;
}

interface SalesChartItem {
  date: string;
  sales: number;
  orders: number;
}

interface AnalyticsData {
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalSales: number;

  recentOrders: RecentOrder[];

  lowStockProducts: LowStockProduct[];

  bestSellingProducts: BestSellingProduct[];

  orderStatusStats: {
    PENDING: number;
    CONFIRMED: number;
    PROCESSING: number;
    SHIPPED: number;
    DELIVERED: number;
    CANCELLED: number;
  };

  salesChart: SalesChartItem[];

  range?: AnalyticsRange;
}

const defaultAnalytics: AnalyticsData = {
  totalProducts: 0,
  totalOrders: 0,
  pendingOrders: 0,
  completedOrders: 0,
  totalSales: 0,

  recentOrders: [],

  lowStockProducts: [],

  bestSellingProducts: [],

  orderStatusStats: {
    PENDING: 0,
    CONFIRMED: 0,
    PROCESSING: 0,
    SHIPPED: 0,
    DELIVERED: 0,
    CANCELLED: 0,
  },

  salesChart: [],

  range: "7d",
};

const statusLabels: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const statusClasses: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-purple-100 text-purple-700",
  SHIPPED: "bg-indigo-100 text-indigo-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 2,
  }).format(value || 0);
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-LK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatChartDate(
  dateString: string,
  range: AnalyticsRange
) {
  if (range === "12m") {
    return new Date(
      `${dateString}-01T00:00:00`
    ).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  }

  return new Date(
    `${dateString}T00:00:00`
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function DashboardPage() {
  const [analytics, setAnalytics] =
    useState<AnalyticsData>(defaultAnalytics);

  const [range, setRange] =
    useState<AnalyticsRange>("7d");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const fetchAnalytics = async (
    selectedRange: AnalyticsRange = range
  ) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/dashboard/analytics?range=${selectedRange}`,
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        const errorText = await response.text();

        console.error(
          "Analytics API error:",
          response.status,
          errorText
        );

        throw new Error(
          `Analytics request failed (${response.status})`
        );
      }

      const text = await response.text();

      if (!text) {
        throw new Error(
          "Analytics API returned an empty response."
        );
      }

      const data = JSON.parse(text);

      setAnalytics({
        ...defaultAnalytics,
        ...data,

        orderStatusStats: {
          ...defaultAnalytics.orderStatusStats,
          ...(data.orderStatusStats || {}),
        },

        salesChart: Array.isArray(data.salesChart)
          ? data.salesChart
          : [],

        recentOrders: Array.isArray(
          data.recentOrders
        )
          ? data.recentOrders
          : [],

        lowStockProducts: Array.isArray(
          data.lowStockProducts
        )
          ? data.lowStockProducts
          : [],

        bestSellingProducts: Array.isArray(
          data.bestSellingProducts
        )
          ? data.bestSellingProducts
          : [],
      });
    } catch (error) {
      console.error(
        "Dashboard analytics error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load dashboard analytics."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics("7d");
  }, []);

  const handleRangeChange = (
    selectedRange: AnalyticsRange
  ) => {
    setRange(selectedRange);
    fetchAnalytics(selectedRange);
  };

  const maxSales = Math.max(
    ...analytics.salesChart.map(
      (item) => item.sales
    ),
    1
  );

  const statusEntries = [
    {
      key: "PENDING",
      label: "Pending",
      count: analytics.orderStatusStats.PENDING,
    },
    {
      key: "CONFIRMED",
      label: "Confirmed",
      count: analytics.orderStatusStats.CONFIRMED,
    },
    {
      key: "PROCESSING",
      label: "Processing",
      count: analytics.orderStatusStats.PROCESSING,
    },
    {
      key: "SHIPPED",
      label: "Shipped",
      count: analytics.orderStatusStats.SHIPPED,
    },
    {
      key: "DELIVERED",
      label: "Delivered",
      count: analytics.orderStatusStats.DELIVERED,
    },
    {
      key: "CANCELLED",
      label: "Cancelled",
      count: analytics.orderStatusStats.CANCELLED,
    },
  ];

  const maxStatusCount = Math.max(
    ...statusEntries.map(
      (item) => item.count
    ),
    1
  );

  const periodSales =
    analytics.salesChart.reduce(
      (sum, item) => sum + item.sales,
      0
    );

  const periodOrders =
    analytics.salesChart.reduce(
      (sum, item) => sum + item.orders,
      0
    );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Dashboard
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Overview of your store performance and activity.
            </p>
          </div>

          <button
            onClick={() =>
              fetchAnalytics(range)
            }
            disabled={loading}
            className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg
              className={`mr-2 h-4 w-4 ${
                loading ? "animate-spin" : ""
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v5h5M20 20v-5h-5M5.07 18.93A9 9 0 1018.93 5.07L20 6"
              />
            </svg>

            Refresh
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">

          {/* PRODUCTS */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Products
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {loading
                    ? "..."
                    : analytics.totalProducts}
                </p>
              </div>

              <div className="rounded-lg bg-blue-50 p-3">
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
            </div>

            <Link
              href="/dashboard/products"
              className="mt-4 inline-block text-xs font-medium text-blue-600 hover:underline"
            >
              Manage products →
            </Link>
          </div>

          {/* ORDERS */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Orders
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {loading
                    ? "..."
                    : analytics.totalOrders}
                </p>
              </div>

              <div className="rounded-lg bg-purple-50 p-3">
                <svg
                  className="h-6 w-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a3 3 0 006 0M9 5h6"
                  />
                </svg>
              </div>
            </div>

            <Link
              href="/dashboard/orders"
              className="mt-4 inline-block text-xs font-medium text-purple-600 hover:underline"
            >
              View orders →
            </Link>
          </div>

          {/* PENDING */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Pending Orders
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {loading
                    ? "..."
                    : analytics.pendingOrders}
                </p>
              </div>

              <div className="rounded-lg bg-yellow-50 p-3">
                <svg
                  className="h-6 w-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>

            <Link
              href="/dashboard/orders"
              className="mt-4 inline-block text-xs font-medium text-yellow-600 hover:underline"
            >
              Review pending →
            </Link>
          </div>

          {/* COMPLETED */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Completed Orders
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {loading
                    ? "..."
                    : analytics.completedOrders}
                </p>
              </div>

              <div className="rounded-lg bg-green-50 p-3">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>

            <Link
              href="/dashboard/orders"
              className="mt-4 inline-block text-xs font-medium text-green-600 hover:underline"
            >
              View completed →
            </Link>
          </div>

          {/* SALES */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Sales
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {loading
                    ? "..."
                    : formatCurrency(
                        analytics.totalSales
                      )}
                </p>
              </div>

              <div className="rounded-lg bg-green-50 p-3">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V6m0 12v-2m0-10a9 9 0 110 18 9 9 0 010-18z"
                  />
                </svg>
              </div>
            </div>

            <p className="mt-4 text-xs text-gray-400">
              Excludes cancelled orders
            </p>
          </div>
        </div>

        {/* SALES OVERVIEW */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Sales Overview
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Track your sales and orders over time.
              </p>
            </div>

            {/* RANGE SELECTOR */}
            <div className="flex w-fit rounded-lg border border-gray-200 bg-gray-50 p-1">

              <button
                onClick={() =>
                  handleRangeChange("7d")
                }
                disabled={loading}
                className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                  range === "7d"
                    ? "bg-gray-900 text-white shadow-sm"
                    : "text-gray-600 hover:bg-white"
                }`}
              >
                7 Days
              </button>

              <button
                onClick={() =>
                  handleRangeChange("30d")
                }
                disabled={loading}
                className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                  range === "30d"
                    ? "bg-gray-900 text-white shadow-sm"
                    : "text-gray-600 hover:bg-white"
                }`}
              >
                30 Days
              </button>

              <button
                onClick={() =>
                  handleRangeChange("12m")
                }
                disabled={loading}
                className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                  range === "12m"
                    ? "bg-gray-900 text-white shadow-sm"
                    : "text-gray-600 hover:bg-white"
                }`}
              >
                12 Months
              </button>

            </div>
          </div>

          {/* CHART */}
          <div className="mt-8">

            {analytics.salesChart.length === 0 ? (
              <div className="flex h-64 items-center justify-center rounded-lg bg-gray-50">
                <p className="text-sm text-gray-500">
                  No sales data available for this period.
                </p>
              </div>
            ) : (
              <>
                <div className="flex h-64 items-end gap-1 overflow-x-auto border-b border-gray-200 px-2 sm:gap-2">

                  {analytics.salesChart.map(
                    (item) => {
                      const height =
                        item.sales === 0
                          ? 2
                          : Math.max(
                              (item.sales /
                                maxSales) *
                                100,
                              5
                            );

                      return (
                        <div
                          key={item.date}
                          className="group flex min-w-[28px] flex-1 flex-col items-center justify-end"
                        >

                          {/* TOOLTIP */}
                          <div className="pointer-events-none mb-2 hidden rounded-lg bg-gray-900 px-3 py-2 text-xs text-white shadow-lg group-hover:block">

                            <p className="font-medium">
                              {formatChartDate(
                                item.date,
                                range
                              )}
                            </p>

                            <p className="mt-1">
                              Sales:{" "}
                              {formatCurrency(
                                item.sales
                              )}
                            </p>

                            <p>
                              Orders:{" "}
                              {item.orders}
                            </p>

                          </div>

                          <div
                            className="w-full max-w-[42px] rounded-t-md bg-gray-900 transition-all duration-300 group-hover:bg-gray-700"
                            style={{
                              height: `${height}%`,
                            }}
                          />
                        </div>
                      );
                    }
                  )}

                </div>

                {/* X AXIS */}
                <div className="mt-2 flex gap-1 overflow-x-auto px-2 sm:gap-2">

                  {analytics.salesChart.map(
                    (item) => (
                      <div
                        key={item.date}
                        className="min-w-[28px] flex-1 text-center"
                      >
                        <span className="whitespace-nowrap text-[10px] text-gray-400 sm:text-xs">
                          {formatChartDate(
                            item.date,
                            range
                          )}
                        </span>
                      </div>
                    )
                  )}

                </div>

                {/* PERIOD SUMMARY */}
                <div className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-100 pt-5">

                  <div>
                    <p className="text-xs text-gray-500">
                      Period Sales
                    </p>

                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      {formatCurrency(
                        periodSales
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Period Orders
                    </p>

                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      {periodOrders}
                    </p>
                  </div>

                </div>
              </>
            )}

          </div>
        </div>

        {/* RECENT ORDERS + STATUS */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* RECENT ORDERS */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">

            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">

              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent Orders
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Latest customer orders.
                </p>
              </div>

              <Link
                href="/dashboard/orders"
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                View all
              </Link>

            </div>

            {analytics.recentOrders.length ===
            0 ? (
              <div className="flex min-h-[220px] items-center justify-center px-5">

                <div className="text-center">
                  <p className="font-medium text-gray-700">
                    No orders yet
                  </p>

                  <p className="mt-1 text-sm text-gray-400">
                    Customer orders will appear here.
                  </p>
                </div>

              </div>
            ) : (
              <div className="divide-y divide-gray-100">

                {analytics.recentOrders.map(
                  (order) => (
                    <Link
                      href={`/dashboard/orders/${order._id}`}
                      key={order._id}
                      className="block px-5 py-4 transition hover:bg-gray-50"
                    >

                      <div className="flex items-center justify-between gap-4">

                        <div className="min-w-0">

                          <p className="truncate text-sm font-semibold text-gray-900">
                            #{order.orderNumber}
                          </p>

                          <p className="mt-1 truncate text-xs text-gray-500">
                            {order.customerName}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            {formatDate(
                              order.createdAt
                            )}
                          </p>

                        </div>

                        <div className="text-right">

                          <p className="text-sm font-semibold text-gray-900">
                            {formatCurrency(
                              order.total
                            )}
                          </p>

                          <span
                            className={`mt-1 inline-flex rounded-full px-2 py-1 text-[10px] font-medium ${
                              statusClasses[
                                order.status
                              ] ||
                              "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {statusLabels[
                              order.status
                            ] ||
                              order.status}
                          </span>

                        </div>

                      </div>

                    </Link>
                  )
                )}

              </div>
            )}

          </div>

          {/* ORDER STATUS */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Order Status
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Current distribution of your orders.
              </p>
            </div>

            <div className="mt-6 space-y-5">

              {statusEntries.map(
                (item) => {
                  const percentage =
                    (item.count /
                      maxStatusCount) *
                    100;

                  return (
                    <div key={item.key}>

                      <div className="mb-2 flex items-center justify-between">

                        <span className="text-sm font-medium text-gray-700">
                          {item.label}
                        </span>

                        <span className="text-sm font-semibold text-gray-900">
                          {item.count}
                        </span>

                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-gray-100">

                        <div
                          className="h-full rounded-full bg-gray-900 transition-all duration-500"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          </div>

        </div>

        {/* BEST SELLING + LOW STOCK */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* BEST SELLING */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">

            <div className="border-b border-gray-100 px-5 py-4">

              <h2 className="text-lg font-semibold text-gray-900">
                Best-Selling Products
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Products with the highest quantity sold.
              </p>

            </div>

            {analytics.bestSellingProducts
              .length === 0 ? (
              <div className="flex min-h-[220px] items-center justify-center px-5">

                <div className="text-center">
                  <p className="font-medium text-gray-700">
                    No sales yet
                  </p>

                  <p className="mt-1 text-sm text-gray-400">
                    Product sales will appear here.
                  </p>
                </div>

              </div>
            ) : (
              <div className="divide-y divide-gray-100">

                {analytics.bestSellingProducts.map(
                  (product, index) => (
                    <div
                      key={product._id}
                      className="flex items-center justify-between gap-4 px-5 py-4"
                    >

                      <div className="flex min-w-0 items-center gap-3">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-sm font-bold text-gray-600">
                          {index + 1}
                        </div>

                        <div className="min-w-0">

                          <p className="truncate text-sm font-medium text-gray-900">
                            {product.name}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {product.quantitySold}{" "}
                            units sold
                          </p>

                        </div>

                      </div>

                      <div className="shrink-0 text-right">

                        <p className="text-sm font-semibold text-gray-900">
                          {formatCurrency(
                            product.revenue
                          )}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          Revenue
                        </p>

                      </div>

                    </div>
                  )
                )}

              </div>
            )}

          </div>

          {/* LOW STOCK */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">

            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">

              <div>

                <h2 className="text-lg font-semibold text-gray-900">
                  Low Stock Products
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Products with 5 or fewer items remaining.
                </p>

              </div>

              <Link
                href="/dashboard/products"
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                Manage
              </Link>

            </div>

            {analytics.lowStockProducts
              .length === 0 ? (
              <div className="flex min-h-[220px] items-center justify-center px-5">

                <div className="text-center">

                  <p className="font-medium text-green-700">
                    Stock looks good
                  </p>

                  <p className="mt-1 text-sm text-gray-400">
                    No products are currently low in stock.
                  </p>

                </div>

              </div>
            ) : (
              <div className="divide-y divide-gray-100">

                {analytics.lowStockProducts.map(
                  (product) => (
                    <Link
                      key={product._id}
                      href={`/dashboard/products/${product._id}/edit`}
                      className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-gray-50"
                    >

                      <div className="flex min-w-0 items-center gap-3">

                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">

                            <svg
                              className="h-5 w-5 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                              />
                            </svg>

                          </div>
                        )}

                        <div className="min-w-0">

                          <p className="truncate text-sm font-medium text-gray-900">
                            {product.name}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {formatCurrency(
                              product.price
                            )}
                          </p>

                        </div>

                      </div>

                      <div className="shrink-0 text-right">

                        <p
                          className={`text-sm font-bold ${
                            product.stock === 0
                              ? "text-red-600"
                              : "text-orange-600"
                          }`}
                        >
                          {product.stock === 0
                            ? "Out of stock"
                            : `${product.stock} left`}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          Stock
                        </p>

                      </div>

                    </Link>
                  )
                )}

              </div>
            )}

          </div>

        </div>

        {/* QUICK ACTIONS */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

          <h2 className="text-lg font-semibold text-gray-900">
            Quick Actions
          </h2>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

            <Link
              href="/dashboard/products/new"
              className="rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
            >
              + Add Product
            </Link>

            <Link
              href="/dashboard/categories"
              className="rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
            >
              Manage Categories
            </Link>

            <Link
              href="/dashboard/orders"
              className="rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
            >
              Manage Orders
            </Link>

            <Link
              href="/dashboard/settings/customization"
              className="rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
            >
              Customize Store
            </Link>

          </div>

        </div>

      </div>
    </div>
  );
}
