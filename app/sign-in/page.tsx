"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import Link from "next/link";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || "Login failed");
        return;
      }

      window.location.href = "/dashboard";
    } catch (error) {
      console.error(error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f7f5]">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-gray-200/60 blur-3xl" />
        <div className="absolute -bottom-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-gray-200/50 blur-3xl" />

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
              <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-white shadow-lg">
                              <Image
                                src="/icon.jpeg"
                                alt="SmallBiz"
                                width={44}
                                height={44}
                                className="h-full w-full object-contain p-1"
                                priority
                              />
                            </div>

              <span className="text-2xl font-bold tracking-tight text-gray-950">
                SmallBiz
              </span>
            </Link>

            <p className="mt-3 text-sm text-gray-500">
              Everything you need to manage your business
            </p>
          </div>

          {/* Card */}
          <div className="rounded-3xl border border-gray-200/80 bg-white/95 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.08)] backdrop-blur sm:p-8">
            {/* Heading */}
            <div className="mb-7">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-6 w-6 text-gray-900"
                  aria-hidden="true"
                >
                  <path
                    d="M15 3H6.5A2.5 2.5 0 0 0 4 5.5v13A2.5 2.5 0 0 0 6.5 21H15"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M11 12H20M20 12L16.5 8.5M20 12L16.5 15.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
                Welcome back
              </h1>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Sign in to your SmallBiz account and continue managing your
                store.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-700">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="mt-0.5 h-5 w-5 shrink-0"
                  aria-hidden="true"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M12 8V12.5M12 16H12.01"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>

                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  Email address
                </label>

                <div className="group relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 transition-colors group-focus-within:text-gray-900">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-5 w-5"
                      aria-hidden="true"
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

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-800"
                  >
                    Password
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-gray-500 transition-colors hover:text-gray-950"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="group relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 transition-colors group-focus-within:text-gray-900">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      <rect
                        x="5"
                        y="10"
                        width="14"
                        height="10"
                        rx="2"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      />
                      <path
                        d="M8 10V7.5A4 4 0 0 1 16 7.5V10"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  <input
                    id="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50/70 pl-11 pr-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-gray-900 focus:bg-white focus:ring-4 focus:ring-gray-900/5"
                  />
                </div>
              </div>

              {/* Remember */}
              <div className="flex items-center">
                <label className="flex cursor-pointer items-center gap-2.5 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-black accent-black focus:ring-black"
                  />
                  <span>Keep me signed in</span>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gray-950 px-4 text-sm font-semibold text-white shadow-lg shadow-gray-950/10 transition-all hover:-translate-y-0.5 hover:bg-black hover:shadow-xl hover:shadow-gray-950/15 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <svg
                      className="h-5 w-5 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                        className="opacity-25"
                        stroke="currentColor"
                        strokeWidth="3"
                      />
                      <path
                        d="M21 12a9 9 0 0 0-9-9"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    >
                      <path
                        d="M5 12H19M13 6L19 12L13 18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs font-medium text-gray-400">
                NEW TO SMALLBIZ?
              </span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            {/* Signup */}
            <Link
              href="/sign-up"
              className="flex h-12 w-full items-center justify-center rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-900 transition-all hover:border-gray-400 hover:bg-gray-50"
            >
              Create your store
            </Link>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-xs leading-5 text-gray-400">
            By continuing, you agree to SmallBiz&apos;s{" "}
            <Link
              href="/terms"
              className="font-medium text-gray-600 hover:text-gray-950"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="font-medium text-gray-600 hover:text-gray-950"
            >
              Privacy Policy
            </Link>
            .
          </p>

          <div className="mt-5 text-center">
            <Link
              href="/"
              className="text-xs font-medium text-gray-400 transition-colors hover:text-gray-800"
            >
              ← Back to SmallBiz
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
