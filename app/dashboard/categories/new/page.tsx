"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewCategoryPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || "Failed to create category");
        return;
      }

      router.push("/dashboard/categories");
    } catch (error) {
      console.error(error);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-full bg-gray-50/50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/categories"
            className="group inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-950"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white transition group-hover:border-gray-300 group-hover:bg-gray-50">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M19 12H5M12 19l-7-7 7-7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            Back to Categories
          </Link>

          <div className="mt-6">
            

            <h1 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
              Add Category
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
              Create a new product category to keep your store organized
              and make products easier to discover.
            </p>
          </div>
        </div>

        {/* Main Card */}
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_8px_40px_rgba(0,0,0,0.06)]">
          {/* Card Header */}
          <div className="border-b border-gray-100 px-6 py-6 sm:px-8">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gray-950 text-white shadow-lg">
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5v-11Z"
                    strokeLinecap="round"
                  />
                  <path
                    d="M8 9h8M8 13h5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div>
                <h2 className="text-base font-semibold text-gray-950">
                  Category Details
                </h2>
                <p className="mt-0.5 text-sm text-gray-500">
                  Enter the basic information for your new category.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-7 px-6 py-7 sm:px-8 sm:py-8">
              {/* Error */}
              {error && (
                <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100">
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        d="M12 8v4M12 16h.01"
                        strokeLinecap="round"
                      />
                      <circle cx="12" cy="12" r="9" />
                    </svg>
                  </div>

                  <div>
                    <p className="font-semibold">Unable to create category</p>
                    <p className="mt-0.5 text-red-600">{error}</p>
                  </div>
                </div>
              )}

              {/* Category Name */}
              <div>
                <div className="mb-2.5 flex items-center justify-between">
                  <label
                    htmlFor="category-name"
                    className="text-sm font-semibold text-gray-900"
                  >
                    Category Name
                  </label>

                  <span className="text-xs text-gray-400">
                    Required
                  </span>
                </div>

                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        d="M4 7.5A3.5 3.5 0 0 1 7.5 4h9A3.5 3.5 0 0 1 20 7.5v9a3.5 3.5 0 0 1-3.5 3.5h-9A3.5 3.5 0 0 1 4 16.5v-9Z"
                        strokeLinecap="round"
                      />
                      <path
                        d="M8 9h8M8 13h5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  <input
                    id="category-name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Women's Clothing"
                    className="h-13 w-full rounded-xl border border-gray-200 bg-gray-50/70 pl-12 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-300 hover:bg-white focus:border-gray-950 focus:bg-white focus:ring-4 focus:ring-gray-950/5"
                  />
                </div>

                <p className="mt-2 text-xs text-gray-400">
                  Choose a clear and recognizable name for your category.
                </p>
              </div>

              {/* Description */}
              <div>
                <div className="mb-2.5 flex items-center justify-between">
                  <label
                    htmlFor="category-description"
                    className="text-sm font-semibold text-gray-900"
                  >
                    Description
                  </label>

                  <span className="text-xs text-gray-400">
                    Optional
                  </span>
                </div>

                <div className="relative">
                  <div className="pointer-events-none absolute left-4 top-4 text-gray-400">
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        d="M6 4h12M6 8h12M6 12h8M6 16h12M6 20h8"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  <textarea
                    id="category-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Clothing products for women"
                    rows={5}
                    className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50/70 px-4 py-4 pl-12 text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-300 hover:bg-white focus:border-gray-950 focus:bg-white focus:ring-4 focus:ring-gray-950/5"
                  />
                </div>

                <p className="mt-2 text-xs text-gray-400">
                  A short description helps explain what products belong
                  in this category.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 bg-gray-50/70 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <p className="hidden text-xs text-gray-400 sm:block">
                You can edit this category later.
              </p>

              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                <Link
                  href="/dashboard/categories"
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-gray-200 bg-white px-5 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gray-950 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-950/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <svg
                        className="h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="9"
                          stroke="currentColor"
                          strokeWidth="3"
                          className="opacity-25"
                        />
                        <path
                          d="M21 12a9 9 0 0 0-9-9"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </svg>
                      Creating...
                    </>
                  ) : (
                    <>
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          d="M12 5v14M5 12h14"
                          strokeLinecap="round"
                        />
                      </svg>
                      Create Category
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Bottom hint */}
        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-400">
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11v5M12 8h.01" strokeLinecap="round" />
          </svg>
          Keep category names short, clear, and easy to understand.
        </div>
      </div>
    </div>
  );
}