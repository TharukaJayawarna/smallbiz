"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface PaymentOrder {
  orderNumber: string;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  paymentId: string;
  paidAt: string | null;
  status: string;
}

export default function PaymentSuccessPage() {
  const params = useParams();

  const slug =
    params.slug as string;

  const [
    order,
    setOrder,
  ] =
    useState<PaymentOrder | null>(
      null
    );

  const [
    whatsappUrl,
    setWhatsappUrl,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    checking,
    setChecking,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  useEffect(() => {
    const searchParams =
      new URLSearchParams(
        window.location.search
      );

    const orderId =
      searchParams.get(
        "orderId"
      );

    if (!orderId) {
      setError(
        "Order ID is missing."
      );

      setLoading(false);
      return;
    }

    let attempts = 0;

    async function checkPayment() {
      try {
        const response =
          await fetch(
            `/api/store/${encodeURIComponent(
              slug
            )}/payment-status?orderId=${encodeURIComponent(
              orderId
            )}`,
            {
              cache: "no-store",
            }
          );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Failed to check payment"
          );
        }

        setOrder(
          data.order
        );

        if (
          data.whatsappUrl
        ) {
          setWhatsappUrl(
            data.whatsappUrl
          );
        }

        if (
          data.order
            .paymentStatus ===
          "PAID"
        ) {
          setChecking(false);
          setLoading(false);
          return;
        }

        if (
          data.order
            .paymentStatus ===
          "FAILED"
        ) {
          setChecking(false);
          setLoading(false);
          return;
        }

        attempts++;

        /*
         * PayHere notification can arrive
         * shortly after redirect.
         *
         * Poll for approximately 30 seconds.
         */
        if (attempts < 10) {
          setTimeout(
            checkPayment,
            3000
          );
        } else {
          setChecking(false);
          setLoading(false);
        }
      } catch (error) {
        console.error(error);

        setError(
          "Unable to check payment status."
        );

        setChecking(false);
        setLoading(false);
      }
    }

    checkPayment();
  }, [slug]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f8f6] px-6">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-gray-200 border-t-black" />

          <h1 className="mt-6 text-xl font-bold">
            Checking your payment...
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Please wait while we confirm your payment.
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f8f6] px-6">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold">
            Something went wrong
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            {error}
          </p>

          <Link
            href={`/shop/${slug}`}
            className="mt-7 inline-flex rounded-full bg-black px-6 py-3 text-sm font-semibold text-white"
          >
            Back to Store
          </Link>
        </div>
      </main>
    );
  }

  const paid =
    order?.paymentStatus ===
    "PAID";

  const failed =
    order?.paymentStatus ===
    "FAILED";

  return (
    <main className="min-h-screen bg-[#f8f8f6] px-5 py-12">
      <div className="mx-auto max-w-xl">
        <div className="rounded-3xl border border-black/5 bg-white p-8 text-center shadow-sm sm:p-10">
          <div
            className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${
              paid
                ? "bg-green-50"
                : failed
                ? "bg-red-50"
                : "bg-yellow-50"
            }`}
          >
            {paid ? (
              <svg
                className="h-10 w-10 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : failed ? (
              <svg
                className="h-10 w-10 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-10 w-10 text-yellow-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 2"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  strokeWidth="2"
                />
              </svg>
            )}
          </div>

          <h1 className="mt-7 text-3xl font-bold">
            {paid
              ? "Payment Successful"
              : failed
              ? "Payment Failed"
              : "Payment Processing"}
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            {paid
              ? "Your payment has been successfully confirmed."
              : failed
              ? "Your PayHere payment was not completed."
              : checking
              ? "We are waiting for confirmation from PayHere."
              : "Payment confirmation is taking longer than expected."}
          </p>

          {order && (
            <div className="mt-8 rounded-2xl bg-gray-50 p-5 text-left">
              <div className="flex justify-between border-b border-gray-200 pb-3">
                <span className="text-sm text-gray-500">
                  Order Number
                </span>

                <span className="text-sm font-semibold">
                  {order.orderNumber}
                </span>
              </div>

              <div className="flex justify-between border-b border-gray-200 py-3">
                <span className="text-sm text-gray-500">
                  Amount
                </span>

                <span className="text-sm font-semibold">
                  Rs.{" "}
                  {order.total.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between pt-3">
                <span className="text-sm text-gray-500">
                  Payment Status
                </span>

                <span
                  className={`text-sm font-bold ${
                    paid
                      ? "text-green-600"
                      : failed
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          )}

          {paid &&
            whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex w-full items-center justify-center rounded-2xl bg-black px-5 py-4 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Send Confirmation on WhatsApp
              </a>
            )}

          <Link
            href={`/shop/${slug}`}
            className="mt-4 flex w-full items-center justify-center rounded-2xl border border-gray-200 px-5 py-4 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}