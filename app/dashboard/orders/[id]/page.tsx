
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image?: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  customerNote: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items: OrderItem[];
}

const statusStyles: Record<string, string> = {
  PENDING:
    "bg-amber-50 text-amber-700 ring-amber-600/20",
  CONFIRMED:
    "bg-blue-50 text-blue-700 ring-blue-600/20",
  PROCESSING:
    "bg-violet-50 text-violet-700 ring-violet-600/20",
  SHIPPED:
    "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
  DELIVERED:
    "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  CANCELLED:
    "bg-red-50 text-red-700 ring-red-600/20",
};

const paymentStyles: Record<string, string> = {
  PAID:
    "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  PENDING:
    "bg-amber-50 text-amber-700 ring-amber-600/20",
  FAILED:
    "bg-red-50 text-red-700 ring-red-600/20",
  REFUNDED:
    "bg-gray-100 text-gray-700 ring-gray-500/20",
};

function StatusBadge({
  status,
}: {
  status: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${
        statusStyles[status] ||
        "bg-gray-100 text-gray-700 ring-gray-500/20"
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

function PaymentBadge({
  status,
}: {
  status: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${
        paymentStyles[status] ||
        "bg-gray-100 text-gray-700 ring-gray-500/20"
      }`}
    >
      {status}
    </span>
  );
}

function LoadingState() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="h-5 w-32 rounded bg-gray-200" />

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="h-8 w-56 rounded bg-gray-200" />
          <div className="mt-3 h-4 w-40 rounded bg-gray-200" />
        </div>

        <div className="h-11 w-44 rounded-xl bg-gray-200" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="h-64 rounded-2xl bg-gray-200" />
          <div className="h-80 rounded-2xl bg-gray-200" />
        </div>

        <div className="h-96 rounded-2xl bg-gray-200" />
      </div>
    </div>
  );
}

export default function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] =
    useState(false);

  useEffect(() => {
    params.then(({ id }) => {
      setOrderId(id);
      fetchOrder(id);
    });
  }, [params]);

  async function fetchOrder(id: string) {
    try {
      const response = await fetch(`/api/orders/${id}`);

      const data = await response.json();

      if (!response.ok || !data.success) {
        return;
      }

      setOrder(data.order);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(status: string) {
    if (!order || status === order.status) return;

    setUpdatingStatus(true);

    try {
      const response = await fetch(
        `/api/orders/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(
          data.message || "Failed to update status"
        );
        return;
      }

      setOrder({
        ...order,
        status,
      });
    } catch (error) {
      console.error(error);
      alert("Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <LoadingState />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <svg
              className="h-8 w-8 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.7}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h1 className="mt-5 text-xl font-bold text-gray-900">
            Order not found
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            The order you are looking for could not
            be found.
          </p>

          <Link
            href="/dashboard/orders"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            ← Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/dashboard/orders"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>

            Back to Orders
          </Link>
        </div>

        {/* Header */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                  {order.orderNumber}
                </h1>

                <StatusBadge status={order.status} />
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                <span className="inline-flex items-center gap-2">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>

                  {new Date(
                    order.createdAt
                  ).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>

                <span className="hidden h-1 w-1 rounded-full bg-gray-300 sm:block" />

                <span>
                  {new Date(
                    order.createdAt
                  ).toLocaleTimeString(undefined, {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>

            {/* Status selector */}
            <div className="flex items-center gap-3">
              <label
                htmlFor="order-status"
                className="hidden text-sm font-medium text-gray-500 sm:block"
              >
                Update status
              </label>

              <div className="relative">
                <select
                  id="order-status"
                  value={order.status}
                  disabled={updatingStatus}
                  onChange={(e) =>
                    updateStatus(e.target.value)
                  }
                  className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 py-3 pl-4 pr-11 text-sm font-semibold text-gray-900 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 disabled:cursor-not-allowed disabled:opacity-60 sm:w-48"
                >
                  <option value="PENDING">
                    Pending
                  </option>

                  <option value="CONFIRMED">
                    Confirmed
                  </option>

                  <option value="PROCESSING">
                    Processing
                  </option>

                  <option value="SHIPPED">
                    Shipped
                  </option>

                  <option value="DELIVERED">
                    Delivered
                  </option>

                  <option value="CANCELLED">
                    Cancelled
                  </option>
                </select>

                <svg
                  className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 9l6 6 6-6"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Left */}
          <div className="space-y-6 lg:col-span-2">
            {/* Customer Information */}
            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                    <svg
                      className="h-5 w-5 text-gray-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.8}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 19a4 4 0 00-8 0M11 11a4 4 0 100-8 4 4 0 000 8zM17 11a3 3 0 00-2.83-4M19 19a4 4 0 00-3-3.87"
                      />
                    </svg>
                  </div>

                  <div>
                    <h2 className="font-bold text-gray-900">
                      Customer Information
                    </h2>

                    <p className="text-sm text-gray-500">
                      Contact and delivery details
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-6">
                {/* Name */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Customer
                  </p>

                  <p className="mt-2 font-semibold text-gray-900">
                    {order.customerName}
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Phone
                  </p>

                  <a
                    href={`tel:${order.customerPhone}`}
                    className="mt-2 inline-flex items-center gap-2 font-semibold text-gray-900 transition hover:text-blue-600"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.8}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 5a2 2 0 012-2h2.28a2 2 0 011.94 1.515L10 7a2 2 0 01-.55 1.95l-1.27 1.27a16 16 0 005.6 5.6l1.27-1.27A2 2 0 0117 14l2.485.78A2 2 0 0121 16.72V19a2 2 0 01-2 2C9.611 21 3 14.389 3 5z"
                      />
                    </svg>

                    {order.customerPhone}
                  </a>
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Delivery Address
                  </p>

                  <div className="mt-3 rounded-xl bg-gray-50 p-4">
                    <div className="flex items-start gap-3">
                      <svg
                        className="mt-0.5 h-5 w-5 shrink-0 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.8}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 21s7-4.35 7-10a7 7 0 10-14 0c0 5.65 7 10 7 10z"
                        />
                        <circle
                          cx="12"
                          cy="11"
                          r="2.2"
                        />
                      </svg>

                      <p className="whitespace-pre-line text-sm font-medium leading-6 text-gray-700">
                        {order.deliveryAddress}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Note */}
                {order.customerNote && (
                  <div className="sm:col-span-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Customer Note
                    </p>

                    <div className="mt-3 rounded-xl border border-amber-100 bg-amber-50 p-4">
                      <div className="flex items-start gap-3">
                        <svg
                          className="mt-0.5 h-5 w-5 shrink-0 text-amber-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.8}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11.05 11H13v5h-1.95v-5zM12 7.5h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>

                        <p className="whitespace-pre-line text-sm leading-6 text-amber-900">
                          {order.customerNote}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Ordered Products */}
            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                    <svg
                      className="h-5 w-5 text-gray-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.8}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 8h12M7 8l1 12h8l1-12M9 8V6a3 3 0 016 0v2"
                      />
                    </svg>
                  </div>

                  <div>
                    <h2 className="font-bold text-gray-900">
                      Ordered Products
                    </h2>

                    <p className="text-sm text-gray-500">
                      {order.items.length}{" "}
                      {order.items.length === 1
                        ? "item"
                        : "items"}{" "}
                      in this order
                    </p>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {order.items.map((item, index) => (
                  <div
                    key={`${item.productId}-${index}`}
                    className="flex gap-4 p-5 transition hover:bg-gray-50/70 sm:p-6"
                  >
                    {/* Product image */}
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-100 sm:h-24 sm:w-24">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <svg
                            className="h-8 w-8 text-gray-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 16M5 20h14a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v14a1 1 0 001 1z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Product details */}
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-semibold text-gray-900">
                        {item.name}
                      </h3>

                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                          Qty: {item.quantity}
                        </span>

                        {item.size && (
                          <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                            Size: {item.size}
                          </span>
                        )}

                        {item.color && (
                          <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                            Color: {item.color}
                          </span>
                        )}
                      </div>

                      <p className="mt-2 text-xs text-gray-400">
                        Rs.{" "}
                        {item.price.toLocaleString()}{" "}
                        per item
                      </p>
                    </div>

                    {/* Price */}
                    <div className="shrink-0 text-right">
                      <p className="font-bold text-gray-900">
                        Rs.{" "}
                        {(
                          item.price *
                          item.quantity
                        ).toLocaleString()}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {item.quantity} × Rs.{" "}
                        {item.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right */}
          <div>
            <div className="space-y-6 lg:sticky lg:top-6">
              {/* Summary */}
              <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
                  <h2 className="font-bold text-gray-900">
                    Order Summary
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Payment and pricing details
                  </p>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        Subtotal
                      </span>

                      <span className="font-medium text-gray-900">
                        Rs.{" "}
                        {order.subtotal.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        Delivery fee
                      </span>

                      <span className="font-medium text-gray-900">
                        Rs.{" "}
                        {order.deliveryFee.toLocaleString()}
                      </span>
                    </div>

                    <div className="border-t border-dashed border-gray-200 pt-4">
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Total amount
                          </p>

                          <p className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
                            Rs.{" "}
                            {order.total.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Status Card */}
              <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="font-bold text-gray-900">
                  Order Status
                </h2>

                <div className="mt-5 space-y-4">
                  <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
                    <div>
                      <p className="text-xs font-medium text-gray-400">
                        Current status
                      </p>

                      <div className="mt-2">
                        <StatusBadge
                          status={order.status}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
                    <div>
                      <p className="text-xs font-medium text-gray-400">
                        Payment status
                      </p>

                      <div className="mt-2">
                        <PaymentBadge
                          status={
                            order.paymentStatus
                          }
                        />
                      </div>
                    </div>

                    <svg
                      className="h-5 w-5 text-gray-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.8}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
              </section>

              {/* Quick Contact */}
              <section className="rounded-2xl bg-gray-900 p-5 text-white shadow-sm sm:p-6">
                <p className="text-sm font-medium text-gray-400">
                  Need to contact the customer?
                </p>

                <p className="mt-2 font-semibold">
                  {order.customerName}
                </p>

                <a
                  href={`tel:${order.customerPhone}`}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-100"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 5a2 2 0 012-2h2.28a2 2 0 011.94 1.515L10 7a2 2 0 01-.55 1.95l-1.27 1.27a16 16 0 005.6 5.6l1.27-1.27A2 2 0 0117 14l2.485.78A2 2 0 0121 16.72V19a2 2 0 01-2 2C9.611 21 3 14.389 3 5z"
                    />
                  </svg>

                  Call Customer
                </a>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}