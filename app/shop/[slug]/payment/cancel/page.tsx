"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function PaymentCancelPage() {
  const params = useParams();

  const slug =
    params.slug as string;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f8f6] px-5 py-12">
      <div className="w-full max-w-xl rounded-3xl border border-black/5 bg-white p-8 text-center shadow-sm sm:p-10">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-yellow-50">
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
        </div>

        <h1 className="mt-7 text-3xl font-bold">
          Payment Cancelled
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
          Your PayHere payment was cancelled. No payment was confirmed for this order.
        </p>

        <div className="mt-8 space-y-3">
          <Link
            href={`/shop/${slug}/checkout`}
            className="flex w-full items-center justify-center rounded-2xl bg-black px-5 py-4 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Return to Checkout
          </Link>

          <Link
            href={`/shop/${slug}`}
            className="flex w-full items-center justify-center rounded-2xl border border-gray-200 px-5 py-4 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}