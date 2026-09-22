"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
const [email, setEmail] = useState("");
const [loading, setLoading] = useState(false);
const [sent, setSent] = useState(false);
const [error, setError] = useState("");

async function handleSubmit(event: FormEvent<HTMLFormElement>) {
event.preventDefault();


setLoading(true);
setError("");

try {
  const response = await fetch("/api/auth/forgot-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (!data.success) {
    setError(data.message || "Unable to send reset email.");
    return;
  }

  setSent(true);
} catch (error) {
  console.error(error);
  setError("Something went wrong. Please try again.");
} finally {
  setLoading(false);
}


}

return ( <main className="relative min-h-screen overflow-hidden bg-[#f7f7f5]"> <div className="pointer-events-none absolute inset-0"> <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-gray-200/60 blur-3xl" /> <div className="absolute -bottom-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-gray-200/50 blur-3xl" />


    <div className="absolute inset-0 opacity-[0.025] [background-image:linear-gradient(#000_1px,transparent_1px),linear-gradient(90deg,#000_1px,transparent_1px)] [background-size:40px_40px]" />
  </div>

  <div className="relative flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
    <div className="w-full max-w-[460px]">

      {/* Brand */}
      <div className="mb-8 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-black text-white shadow-lg">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5"
            >
              <path
                d="M4 19V9.5L12 4L20 9.5V19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 19V13H16V19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <span className="text-2xl font-bold tracking-tight text-gray-950">
            SmallBiz
          </span>
        </Link>

        <p className="mt-3 text-sm text-gray-500">
          Get back into your account
        </p>
      </div>

      {/* Card */}
      <div className="rounded-3xl border border-gray-200/80 bg-white/95 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.08)] backdrop-blur sm:p-8">

        {!sent ? (
          <>
            <div className="mb-7">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-6 w-6 text-gray-900"
                >
                  <rect
                    x="4"
                    y="6"
                    width="16"
                    height="12"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M5 7L12 13L19 7"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
                Forgot your password?
              </h1>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                No worries. Enter the email address associated with your
                account and we&apos;ll send you instructions to reset your
                password.
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  Email address
                </label>

                <div className="group relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-gray-900">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-5 w-5"
                    >
                      <rect
                        x="3"
                        y="5"
                        width="18"
                        height="14"
                        rx="2"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      />
                      <path
                        d="M4 7L12 13L20 7"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50/70 pl-11 pr-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-gray-900 focus:bg-white focus:ring-4 focus:ring-gray-900/5"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gray-950 px-4 text-sm font-semibold text-white shadow-lg shadow-gray-950/10 transition-all hover:-translate-y-0.5 hover:bg-black disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
              >
                {loading ? "Sending instructions..." : "Send reset link"}

                {!loading && (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  >
                    <path
                      d="M5 12H19M13 6L19 12L13 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            </form>

            <div className="mt-7 border-t border-gray-200 pt-6 text-center">
              <Link
                href="/sign-in"
                className="text-sm font-semibold text-gray-700 hover:text-black"
              >
                ← Back to sign in
              </Link>
            </div>
          </>
        ) : (
          <div className="py-5 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-8 w-8 text-gray-900"
              >
                <path
                  d="M5 12.5L9.5 17L19 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-gray-950">
              Check your email
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-gray-500">
              If an account exists for{" "}
              <span className="font-semibold text-gray-800">
                {email}
              </span>
              , you&apos;ll receive password reset instructions shortly.
            </p>

            <Link
              href="/sign-in"
              className="mt-7 flex h-12 w-full items-center justify-center rounded-xl bg-gray-950 text-sm font-semibold text-white transition hover:bg-black"
            >
              Back to sign in
            </Link>
          </div>
        )}
      </div>

      <p className="mt-6 text-center text-xs text-gray-400">
        Need help? Contact SmallBiz support.
      </p>
    </div>
  </div>
</main>


);
}
