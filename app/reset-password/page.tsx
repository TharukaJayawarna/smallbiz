"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing password reset link.");
    }
  }, [token]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!token) {
      setError("Invalid or missing password reset link.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const contentType = response.headers.get("content-type");

      if (!contentType?.includes("application/json")) {
        throw new Error("Server returned an invalid response.");
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Unable to reset password.");
        return;
      }

      setSuccess(true);

      setTimeout(() => {
        router.push("/sign-in");
      }, 2000);
    } catch (error) {
      console.error("Reset password error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f7f5]">
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
              Create a new password
            </p>
          </div>

          {/* Card */}
          <div className="rounded-3xl border border-gray-200/80 bg-white/95 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.08)] backdrop-blur sm:p-8">

            {!success ? (
              <>
                <div className="mb-7">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-6 w-6 text-gray-900"
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
                        d="M8 10V7.5C8 5.57 9.57 4 11.5 4H12.5C14.43 4 16 5.57 16 7.5V10"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  <h1 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
                    Reset your password
                  </h1>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    Enter your new password below. Make sure it is at least
                    6 characters long.
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
                      htmlFor="password"
                      className="mb-2 block text-sm font-semibold text-gray-800"
                    >
                      New password
                    </label>

                    <input
                      id="password"
                      type="password"
                      required
                      minLength={6}
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50/70 px-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-gray-900 focus:bg-white focus:ring-4 focus:ring-gray-900/5"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="mb-2 block text-sm font-semibold text-gray-800"
                    >
                      Confirm password
                    </label>

                    <input
                      id="confirmPassword"
                      type="password"
                      required
                      minLength={6}
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(e.target.value)
                      }
                      placeholder="Confirm new password"
                      className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50/70 px-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-gray-900 focus:bg-white focus:ring-4 focus:ring-gray-900/5"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !token}
                    className="flex h-12 w-full items-center justify-center rounded-xl bg-gray-950 px-4 text-sm font-semibold text-white shadow-lg shadow-gray-950/10 transition-all hover:-translate-y-0.5 hover:bg-black disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
                  >
                    {loading
                      ? "Updating password..."
                      : "Reset password"}
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
                  Password updated
                </h1>

                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-gray-500">
                  Your password has been reset successfully. Redirecting
                  you to sign in...
                </p>

                <Link
                  href="/sign-in"
                  className="mt-7 flex h-12 w-full items-center justify-center rounded-xl bg-gray-950 text-sm font-semibold text-white transition hover:bg-black"
                >
                  Go to sign in
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