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

interface OrderStatusStats {
  PENDING: number;
  CONFIRMED: number;
  PROCESSING: number;
  SHIPPED: number;
  DELIVERED: number;
  CANCELLED: number;
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
  orderStatusStats: OrderStatusStats;
  salesChart: SalesChartItem[];
  range: AnalyticsRange;
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

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 ring-amber-600/10",
  CONFIRMED: "bg-blue-50 text-blue-700 ring-blue-600/10",
  PROCESSING: "bg-violet-50 text-violet-700 ring-violet-600/10",
  SHIPPED: "bg-indigo-50 text-indigo-700 ring-indigo-600/10",
  DELIVERED: "bg-emerald-50 text-emerald-700 ring-emerald-600/10",
  CANCELLED: "bg-red-50 text-red-700 ring-red-600/10",
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

function formatChartDate(dateString: string, range: AnalyticsRange) {
  if (range === "12m") {
    return new Date(`${dateString}-01T00:00:00`).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  }

  return new Date(`${dateString}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function StatIcon({
  type,
}: {
  type: "products" | "orders" | "pending" | "completed" | "sales";
}) {
  if (type === "products") {
    return (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
      </svg>
    );
  }

  if (type === "orders") {
    return (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a3 3 0 006 0M9 5h6"
        />
      </svg>
    );
  }

  if (type === "pending") {
    return (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    );
  }

  if (type === "completed") {
    return (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    );
  }

  return (
  <svg
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="1.7"
  >
    <circle
      cx="12"
      cy="12"
      r="9"
    />

    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 7v10"
    />

    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.5 9.2c-.55-.7-1.35-1.1-2.5-1.1-1.5 0-2.5.75-2.5 1.8 0 1.15 1.05 1.6 2.5 2 1.45.4 2.5.85 2.5 2s-1 1.8-2.5 1.8c-1.15 0-1.95-.4-2.5-1.1"
    />
  </svg>
);
}

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData>(defaultAnalytics);

  const [range, setRange] = useState<AnalyticsRange>("7d");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const fetchAnalytics = async (selectedRange: AnalyticsRange) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/dashboard/analytics?range=${selectedRange}`,
        {
          method: "GET",
          cache: "no-store",
        },
      );

      const responseText = await response.text();

      if (!response.ok) {
        console.error("Analytics API error:", response.status, responseText);

        throw new Error(`Failed to load analytics (${response.status})`);
      }

      if (!responseText.trim()) {
        throw new Error("Analytics API returned an empty response.");
      }

      let data: Partial<AnalyticsData>;

      try {
        data = JSON.parse(responseText);
      } catch {
        console.error("Invalid analytics JSON:", responseText);

        throw new Error("Analytics API returned invalid JSON.");
      }

      setAnalytics({
        ...defaultAnalytics,
        ...data,

        orderStatusStats: {
          ...defaultAnalytics.orderStatusStats,
          ...(data.orderStatusStats || {}),
        },

        recentOrders: Array.isArray(data.recentOrders) ? data.recentOrders : [],

        lowStockProducts: Array.isArray(data.lowStockProducts)
          ? data.lowStockProducts
          : [],

        bestSellingProducts: Array.isArray(data.bestSellingProducts)
          ? data.bestSellingProducts
          : [],

        salesChart: Array.isArray(data.salesChart) ? data.salesChart : [],

        range: selectedRange,
      });
    } catch (err) {
      console.error("Dashboard analytics error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load dashboard analytics.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics("7d");
  }, []);

  const changeRange = (selectedRange: AnalyticsRange) => {
    setRange(selectedRange);
    fetchAnalytics(selectedRange);
  };

  const maxSales = Math.max(
    ...analytics.salesChart.map((item) => item.sales),
    1,
  );

  const statusItems = [
    {
      key: "PENDING",
      label: "Pending",
      count: analytics.orderStatusStats.PENDING,
      dot: "bg-amber-500",
    },
    {
      key: "CONFIRMED",
      label: "Confirmed",
      count: analytics.orderStatusStats.CONFIRMED,
      dot: "bg-blue-500",
    },
    {
      key: "PROCESSING",
      label: "Processing",
      count: analytics.orderStatusStats.PROCESSING,
      dot: "bg-violet-500",
    },
    {
      key: "SHIPPED",
      label: "Shipped",
      count: analytics.orderStatusStats.SHIPPED,
      dot: "bg-indigo-500",
    },
    {
      key: "DELIVERED",
      label: "Delivered",
      count: analytics.orderStatusStats.DELIVERED,
      dot: "bg-emerald-500",
    },
    {
      key: "CANCELLED",
      label: "Cancelled",
      count: analytics.orderStatusStats.CANCELLED,
      dot: "bg-red-500",
    },
  ];

  const maxStatusCount = Math.max(...statusItems.map((item) => item.count), 1);

  const periodSales = analytics.salesChart.reduce(
    (sum, item) => sum + item.sales,
    0,
  );

  const periodOrders = analytics.salesChart.reduce(
    (sum, item) => sum + item.orders,
    0,
  );

  const totalStatusOrders = Object.values(analytics.orderStatusStats).reduce(
    (sum, value) => sum + value,
    0,
  );

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Header */}
        <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
              Dashboard
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
              Keep track of your products, orders and store performance from one
              place.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => fetchAnalytics(range)}
              disabled={loading}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20 11a8.1 8.1 0 0 0-14.7-4.7L4 8"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 4v4h4"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 13a8.1 8.1 0 0 0 14.7 4.7L20 16"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20 20v-4h-4"
                />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
            <svg
              className="mt-0.5 h-5 w-5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.5m0 3h.01M10.3 4.8l-7.1 12.3A2 2 0 005 20h14a2 2 0 001.8-2.9L13.7 4.8a2 2 0 00-3.4 0z"
              />
            </svg>

            <div>
              <p className="font-semibold">Unable to load dashboard data</p>
              <p className="mt-1 text-red-600/80">{error}</p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {/* Products */}
          <div className="group rounded-2xl border border-gray-200/80 bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Products
                </p>

                <p className="mt-3 text-3xl font-bold tracking-tight text-gray-950">
                  {loading ? "..." : analytics.totalProducts}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <StatIcon type="products" />
              </div>
            </div>

            <Link
              href="/dashboard/products"
              className="mt-5 inline-flex items-center text-xs font-semibold text-blue-600 transition group-hover:gap-1"
            >
              Manage products
              <span className="ml-1">→</span>
            </Link>
          </div>

          {/* Orders */}
          <div className="group rounded-2xl border border-gray-200/80 bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Orders
                </p>

                <p className="mt-3 text-3xl font-bold tracking-tight text-gray-950">
                  {loading ? "..." : analytics.totalOrders}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <StatIcon type="orders" />
              </div>
            </div>

            <Link
              href="/dashboard/orders"
              className="mt-5 inline-flex items-center text-xs font-semibold text-violet-600"
            >
              View orders
              <span className="ml-1">→</span>
            </Link>
          </div>

          {/* Pending */}
          <div className="group rounded-2xl border border-gray-200/80 bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Pending Orders
                </p>

                <p className="mt-3 text-3xl font-bold tracking-tight text-gray-950">
                  {loading ? "..." : analytics.pendingOrders}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <StatIcon type="pending" />
              </div>
            </div>

            <Link
              href="/dashboard/orders"
              className="mt-5 inline-flex items-center text-xs font-semibold text-amber-600"
            >
              Review pending
              <span className="ml-1">→</span>
            </Link>
          </div>

          {/* Completed */}
          <div className="group rounded-2xl border border-gray-200/80 bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Completed Orders
                </p>

                <p className="mt-3 text-3xl font-bold tracking-tight text-gray-950">
                  {loading ? "..." : analytics.completedOrders}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <StatIcon type="completed" />
              </div>
            </div>

            <Link
              href="/dashboard/orders"
              className="mt-5 inline-flex items-center text-xs font-semibold text-emerald-600"
            >
              View completed
              <span className="ml-1">→</span>
            </Link>
          </div>

          {/* Sales */}
          {/* Sales */}
<div className="group rounded-2xl border border-gray-900 bg-gray-950 p-5 shadow-[0_4px_18px_rgba(0,0,0,0.08)] transition hover:-translate-y-0.5">
  <div className="flex items-start gap-4">
    <div className="min-w-0 flex-1">
      <p className="text-sm font-medium text-gray-400">
        Total Sales
      </p>

      <p className="mt-3 whitespace-nowrap text-2xl font-bold tracking-tight text-white">
        {loading ? "..." : formatCurrency(analytics.totalSales)}
      </p>
    </div>

    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
      <StatIcon type="sales" />
    </div>
  </div>

  <p className="mt-5 text-xs font-medium text-gray-500">
    Excludes cancelled orders
  </p>
</div>
        </div>

        {/* Main chart */}
        <div className="mt-6 rounded-2xl border border-gray-200/80 bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-950">
                  Sales overview
                </h2>

                <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                  Live
                </span>
              </div>

              <p className="mt-1 text-sm text-gray-500">
                Track your sales and order activity over time.
              </p>
            </div>

            <div className="flex w-fit rounded-xl border border-gray-200 bg-gray-50 p-1">
              {(
                [
                  ["7d", "7 Days"],
                  ["30d", "30 Days"],
                  ["12m", "12 Months"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => changeRange(value)}
                  disabled={loading}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                    range === value
                      ? "bg-gray-950 text-white shadow-sm"
                      : "text-gray-500 hover:bg-white hover:text-gray-900"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8">
            {loading ? (
              <div className="flex h-72 items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-gray-200 border-t-gray-900" />
                  <p className="mt-3 text-sm text-gray-400">
                    Loading sales data...
                  </p>
                </div>
              </div>
            ) : analytics.salesChart.length === 0 ? (
              <div className="flex h-72 flex-col items-center justify-center rounded-2xl bg-gray-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3v18h18M7 16l4-5 3 3 5-7"
                    />
                  </svg>
                </div>

                <p className="mt-4 font-semibold text-gray-700">
                  No sales data yet
                </p>

                <p className="mt-1 text-sm text-gray-400">
                  Sales activity will appear here.
                </p>
              </div>
            ) : (
              <>
                <div className="relative flex h-72 items-end gap-1 overflow-x-auto border-b border-gray-100 px-2 sm:gap-3">
                  {/* Grid lines */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 flex h-full flex-col justify-between py-1">
                    <div className="border-t border-dashed border-gray-100" />
                    <div className="border-t border-dashed border-gray-100" />
                    <div className="border-t border-dashed border-gray-100" />
                    <div className="border-t border-dashed border-gray-100" />
                    <div className="border-t border-dashed border-gray-100" />
                  </div>

                  {analytics.salesChart.map((item) => {
                    const height =
                      item.sales === 0
                        ? 2
                        : Math.max((item.sales / maxSales) * 100, 5);

                    return (
                      <div
                        key={item.date}
                        className="group relative z-10 flex h-full min-w-[30px] flex-1 flex-col items-center justify-end"
                      >
                        <div className="pointer-events-none absolute bottom-[calc(100%-2rem)] z-20 mb-2 hidden w-max rounded-xl bg-gray-950 px-3 py-2 text-xs text-white shadow-xl group-hover:block">
                          <p className="font-semibold">
                            {formatChartDate(item.date, range)}
                          </p>

                          <p className="mt-1 text-gray-300">
                            Sales: {formatCurrency(item.sales)}
                          </p>

                          <p className="text-gray-300">Orders: {item.orders}</p>
                        </div>

                        <div
                          className="w-full max-w-[38px] rounded-t-lg bg-gray-950 transition-all duration-300 group-hover:bg-gray-700"
                          style={{
                            height: `${height}%`,
                          }}
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="mt-3 flex gap-1 overflow-x-auto px-2 sm:gap-3">
                  {analytics.salesChart.map((item) => (
                    <div
                      key={item.date}
                      className="min-w-[30px] flex-1 text-center"
                    >
                      <span className="whitespace-nowrap text-[9px] font-medium text-gray-400 sm:text-[10px]">
                        {formatChartDate(item.date, range)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-7 grid grid-cols-2 gap-4 border-t border-gray-100 pt-5">
                  <div>
                    <p className="text-xs font-medium text-gray-400">
                      Period sales
                    </p>

                    <p className="mt-1 text-xl font-bold text-gray-950">
                      {formatCurrency(periodSales)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-400">
                      Period orders
                    </p>

                    <p className="mt-1 text-xl font-bold text-gray-950">
                      {periodOrders}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Recent orders + status */}
        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          {/* Recent Orders */}
          <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5 sm:px-6">
              <div>
                <h2 className="font-bold text-gray-950">Recent orders</h2>

                <p className="mt-1 text-xs text-gray-400">
                  Your latest customer orders
                </p>
              </div>

              <Link
                href="/dashboard/orders"
                className="rounded-lg px-3 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-50 hover:text-gray-950"
              >
                View all →
              </Link>
            </div>

            {analytics.recentOrders.length === 0 ? (
              <div className="flex min-h-[260px] flex-col items-center justify-center px-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a3 3 0 006 0M9 5h6"
                    />
                  </svg>
                </div>

                <p className="mt-4 font-semibold text-gray-700">
                  No orders yet
                </p>

                <p className="mt-1 text-sm text-gray-400">
                  Customer orders will appear here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {analytics.recentOrders.map((order) => (
                  <Link
                    href={`/dashboard/orders/${order._id}`}
                    key={order._id}
                    className="group flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-gray-50 sm:px-6"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-xs font-bold text-gray-600">
                        {order.customerName?.charAt(0)?.toUpperCase() || "C"}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-gray-900">
                          #{order.orderNumber}
                        </p>

                        <p className="mt-0.5 truncate text-xs text-gray-500">
                          {order.customerName}
                        </p>

                        <p className="mt-1 text-[11px] text-gray-400">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-sm font-bold text-gray-950">
                        {formatCurrency(order.total)}
                      </p>

                      <span
                        className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ring-1 ring-inset ${
                          statusStyles[order.status] ||
                          "bg-gray-100 text-gray-600 ring-gray-500/10"
                        }`}
                      >
                        {statusLabels[order.status] || order.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Order Status */}
          <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] sm:p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-bold text-gray-950">Order status</h2>

                <p className="mt-1 text-xs text-gray-400">
                  Current order distribution
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 px-2.5 py-1.5 text-xs font-semibold text-gray-600">
                {totalStatusOrders} total
              </div>
            </div>

            <div className="mt-7 space-y-5">
              {statusItems.map((item) => {
                const percentage = (item.count / maxStatusCount) * 100;

                return (
                  <div key={item.key}>
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${item.dot}`} />

                        <span className="text-sm font-medium text-gray-600">
                          {item.label}
                        </span>
                      </div>

                      <span className="text-sm font-bold text-gray-950">
                        {item.count}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className={`h-full rounded-full ${item.dot} transition-all duration-500`}
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Best selling + low stock */}
        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
          {/* Best Selling */}
          <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
              <h2 className="font-bold text-gray-950">Best-selling products</h2>

              <p className="mt-1 text-xs text-gray-400">
                Products generating the most sales
              </p>
            </div>

            {analytics.bestSellingProducts.length === 0 ? (
              <div className="flex min-h-[230px] flex-col items-center justify-center px-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>

                <p className="mt-4 font-semibold text-gray-700">No sales yet</p>

                <p className="mt-1 text-sm text-gray-400">
                  Product performance will appear here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {analytics.bestSellingProducts.map((product, index) => (
                  <div
                    key={product._id}
                    className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-950 text-xs font-bold text-white">
                        {index + 1}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-900">
                          {product.name}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {product.quantitySold} units sold
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-sm font-bold text-gray-950">
                        {formatCurrency(product.revenue)}
                      </p>

                      <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-gray-400">
                        Revenue
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Low Stock */}
          <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5 sm:px-6">
              <div>
                <h2 className="font-bold text-gray-950">Low stock</h2>

                <p className="mt-1 text-xs text-gray-400">
                  Products that need your attention
                </p>
              </div>

              <Link
                href="/dashboard/products"
                className="rounded-lg px-3 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-50 hover:text-gray-950"
              >
                Manage →
              </Link>
            </div>

            {analytics.lowStockProducts.length === 0 ? (
              <div className="flex min-h-[230px] flex-col items-center justify-center px-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
                  <svg
                    className="h-5 w-5 text-emerald-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>

                <p className="mt-4 font-semibold text-emerald-700">
                  Stock looks good
                </p>

                <p className="mt-1 text-sm text-gray-400">
                  No products are currently low in stock.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {analytics.lowStockProducts.map((product) => (
                  <Link
                    key={product._id}
                    href={`/dashboard/products/${product._id}/edit`}
                    className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-gray-50 sm:px-6"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-11 w-11 shrink-0 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                          <svg
                            className="h-5 w-5 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="1.7"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                            />
                          </svg>
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-900">
                          {product.name}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {formatCurrency(product.price)}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <p
                        className={`text-sm font-bold ${
                          product.stock === 0
                            ? "text-red-600"
                            : "text-amber-600"
                        }`}
                      >
                        {product.stock === 0
                          ? "Out of stock"
                          : `${product.stock} left`}
                      </p>

                      <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-gray-400">
                        Stock
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="mt-6 rounded-2xl border border-gray-200/80 bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] sm:p-6">
          <div className="mb-4">
            <h2 className="font-bold text-gray-950">Quick actions</h2>

            <p className="mt-1 text-xs text-gray-400">
              Jump directly to the things you use most.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/dashboard/products/new"
              className="group flex items-center justify-between rounded-xl border border-gray-200 px-4 py-4 transition hover:border-gray-300 hover:bg-gray-50"
            >
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Add product
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Create a new product
                </p>
              </div>

              <span className="text-lg text-gray-400 transition group-hover:translate-x-1 group-hover:text-gray-900">
                →
              </span>
            </Link>

            <Link
              href="/dashboard/categories"
              className="group flex items-center justify-between rounded-xl border border-gray-200 px-4 py-4 transition hover:border-gray-300 hover:bg-gray-50"
            >
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Categories
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Organize your products
                </p>
              </div>

              <span className="text-lg text-gray-400 transition group-hover:translate-x-1 group-hover:text-gray-900">
                →
              </span>
            </Link>

            <Link
              href="/dashboard/orders"
              className="group flex items-center justify-between rounded-xl border border-gray-200 px-4 py-4 transition hover:border-gray-300 hover:bg-gray-50"
            >
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Manage orders
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Review customer orders
                </p>
              </div>

              <span className="text-lg text-gray-400 transition group-hover:translate-x-1 group-hover:text-gray-900">
                →
              </span>
            </Link>

            <Link
              href="/dashboard/settings/customization"
              className="group flex items-center justify-between rounded-xl border border-gray-200 px-4 py-4 transition hover:border-gray-300 hover:bg-gray-50"
            >
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Customize store
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Change your storefront
                </p>
              </div>

              <span className="text-lg text-gray-400 transition group-hover:translate-x-1 group-hover:text-gray-900">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
