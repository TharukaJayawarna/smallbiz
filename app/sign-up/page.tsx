"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import Link from "next/link";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          businessName,
          whatsappNumber,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || "Registration failed");
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
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-gray-200/60 blur-3xl" />

        <div className="absolute -bottom-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-gray-200/50 blur-3xl" />

        <div className="absolute inset-0 opacity-[0.025] [background-image:linear-gradient(#000_1px,transparent_1px),linear-gradient(90deg,#000_1px,transparent_1px)] [background-size:40px_40px]" />
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-[500px]">
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
              Start selling online with your own store
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
                    d="M15 20H6.5A2.5 2.5 0 0 1 4 17.5V6.5A2.5 2.5 0 0 1 6.5 4H15"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />

                  <path
                    d="M12 12H21M17 8L21 12L17 16"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
                Create your store
              </h1>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Create your account and get your business online in just a few
                steps.
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
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  Your name
                </label>

                <div className="group relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 transition-colors group-focus-within:text-gray-900">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      <circle
                        cx="12"
                        cy="8"
                        r="3.2"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      />

                      <path
                        d="M5 20C5.7 16.8 8.1 15 12 15C15.9 15 18.3 16.8 19 20"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  <input
                    id="name"
                    required
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tharuka Jayawarna"
                    className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50/70 pl-11 pr-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-gray-900 focus:bg-white focus:ring-4 focus:ring-gray-900/5"
                  />
                </div>
              </div>

              {/* Business */}
              <div>
                <label
                  htmlFor="businessName"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  Business name
                </label>

                <div className="group relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 transition-colors group-focus-within:text-gray-900">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      <path
                        d="M4 20V8.5L12 4L20 8.5V20"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      <path
                        d="M8 20V14H16V20M9 9H9.01M12 9H12.01M15 9H15.01"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  <input
                    id="businessName"
                    required
                    autoComplete="organization"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Tharuka Fashion"
                    className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50/70 pl-11 pr-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-gray-900 focus:bg-white focus:ring-4 focus:ring-gray-900/5"
                  />
                </div>
              </div>

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
                    required
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50/70 pl-11 pr-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-gray-900 focus:bg-white focus:ring-4 focus:ring-gray-900/5"
                  />
                </div>
              </div>

              {/* WhatsApp */}
              <div>
                <label
                  htmlFor="whatsappNumber"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  WhatsApp number
                </label>

                <div className="group relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 transition-colors group-focus-within:text-gray-900">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      <path
                        d="M20 11.5A8 8 0 0 1 8.1 19L4 20L5 16A8 8 0 1 1 20 11.5Z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      <path
                        d="M8.5 9.5C9 11.5 10.5 13 12.5 13.5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  <input
                    id="whatsappNumber"
                    required
                    type="tel"
                    autoComplete="tel"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="94771234567"
                    className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50/70 pl-11 pr-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-gray-900 focus:bg-white focus:ring-4 focus:ring-gray-900/5"
                  />
                </div>

                <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-3.5 w-3.5"
                    aria-hidden="true"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />

                    <path
                      d="M12 10.5V16"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />

                    <path
                      d="M12 7.5H12.01"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>

                  <span>Use international format, e.g. 94771234567</span>
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  Password
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
                    required
                    type="password"
                    minLength={8}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50/70 pl-11 pr-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-gray-900 focus:bg-white focus:ring-4 focus:ring-gray-900/5"
                  />
                </div>

                <p className="mt-2 text-xs text-gray-400">
                  Your password must contain at least 8 characters.
                </p>
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
                    Creating your store...
                  </>
                ) : (
                  <>
                    Create my store
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
                ALREADY REGISTERED?
              </span>

              <div className="h-px flex-1 bg-gray-200" />
            </div>

            {/* Sign in */}
            <Link
              href="/sign-in"
              className="flex h-12 w-full items-center justify-center rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-900 transition-all hover:border-gray-400 hover:bg-gray-50"
            >
              Sign in to your account
            </Link>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-xs leading-5 text-gray-400">
            By creating an account, you agree to SmallBiz&apos;s{" "}
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

          {/* Back */}
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
