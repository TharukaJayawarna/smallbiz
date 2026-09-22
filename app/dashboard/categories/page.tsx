"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Category {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function fetchCategories() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/categories");
      const data = await response.json();

      if (!data.success) {
        setError(data.message || "Failed to load categories");
        return;
      }

      setCategories(data.categories);
    } catch (error) {
      console.error(error);
      setError("Something went wrong while loading categories.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteCategory(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!data.success) {
        alert(data.message || "Failed to delete category");
        return;
      }

      setCategories((current) =>
        current.filter((category) => category._id !== id)
      );
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  /* ---------------- Loading ---------------- */

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Header Skeleton */}
        <div className="animate-pulse">
          <div className="h-3 w-32 rounded bg-slate-200" />
          <div className="mt-3 h-8 w-44 rounded-lg bg-slate-200" />
          <div className="mt-3 h-4 w-72 rounded bg-slate-200" />
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-2xl border border-slate-200 bg-white p-5"
            >
              <div className="h-4 w-28 rounded bg-slate-100" />
              <div className="mt-4 h-7 w-16 rounded bg-slate-100" />
            </div>
          ))}
        </div>

        {/* Table Skeleton */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="space-y-6 p-6">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="flex items-center gap-5"
              >
                <div className="h-11 w-11 rounded-xl bg-slate-100" />

                <div className="flex-1">
                  <div className="h-4 w-36 rounded bg-slate-100" />
                  <div className="mt-2 h-3 w-64 rounded bg-slate-100" />
                </div>

                <div className="h-7 w-20 rounded-full bg-slate-100" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const activeCategories = categories.filter(
    (category) => category.isActive
  ).length;

  const inactiveCategories = categories.filter(
    (category) => !category.isActive
  ).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {/* Breadcrumb */}
          <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
            <Link
              href="/dashboard"
              className="transition hover:text-slate-700"
            >
              Dashboard
            </Link>

            <span>/</span>

            <span className="text-slate-600">
              Categories
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Categories
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Organize your products into clear and manageable
            categories.
          </p>
        </div>

        <Link
          href="/dashboard/categories/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 hover:shadow-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-4 w-4"
          >
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>

          Add Category
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4 w-4"
            >
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
              <circle cx="12" cy="12" r="9" />
            </svg>
          </div>

          <div className="flex-1">
            <p className="text-sm font-semibold">
              Unable to load categories
            </p>

            <p className="mt-1 text-sm text-red-600">
              {error}
            </p>
          </div>

          <button
            onClick={fetchCategories}
            className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-50"
          >
            Retry
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Total */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Categories
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {categories.length}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5 text-slate-700"
              >
                <path d="M20.59 13.41 13.41 20.59a2 2 0 0 1-2.82 0L3.41 13.41a2 2 0 0 1 0-2.82l7.18-7.18a2 2 0 0 1 1.41-.59H19a2 2 0 0 1 2 2v7a2 2 0 0 1-.59 1.41Z" />
                <circle cx="16" cy="8" r="1" />
              </svg>
            </div>
          </div>
        </div>

        {/* Active */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Active
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {activeCategories}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-5 w-5 text-emerald-600"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
          </div>
        </div>

        {/* Inactive */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Inactive
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {inactiveCategories}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5 text-slate-500"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {categories.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              className="h-8 w-8 text-slate-500"
            >
              <path d="M20.59 13.41 13.41 20.59a2 2 0 0 1-2.82 0L3.41 13.41a2 2 0 0 1 0-2.82l7.18-7.18a2 2 0 0 1 1.41-.59H19a2 2 0 0 1 2 2v7a2 2 0 0 1-.59 1.41Z" />
              <circle cx="16" cy="8" r="1" />
            </svg>
          </div>

          <h2 className="mt-5 text-lg font-semibold text-slate-900">
            No categories yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            Create your first category to organize your
            products and make your store easier to manage.
          </p>

          <Link
            href="/dashboard/categories/new"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <span>+</span>
            Create Category
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Table header */}
          <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                All Categories
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                {categories.length} categor
                {categories.length === 1 ? "y" : "ies"} in
                your store
              </p>
            </div>
          </div>

          {/* Desktop */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Category
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Description
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {categories.map((category) => (
                  <tr
                    key={category._id}
                    className="transition hover:bg-slate-50/70"
                  >
                    {/* Category */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-600">
                          {category.name
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900">
                            {category.name}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-400">
                            ID: {category._id.slice(-6)}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Description */}
                    <td className="max-w-md px-6 py-5">
                      <p className="line-clamp-2 text-sm text-slate-500">
                        {category.description ||
                          "No description provided"}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-5">
                      {category.isActive ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500">
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                          Inactive
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/dashboard/categories/${category._id}/edit`}
                          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() =>
                            deleteCategory(category._id)
                          }
                          disabled={
                            deletingId === category._id
                          }
                          className="rounded-lg border border-red-100 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingId === category._id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="divide-y divide-slate-100 md:hidden">
            {categories.map((category) => (
              <div
                key={category._id}
                className="p-5"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-600">
                    {category.name
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-slate-900">
                          {category.name}
                        </h3>

                        <p className="mt-1 text-xs text-slate-400">
                          ID: {category._id.slice(-6)}
                        </p>
                      </div>

                      {category.isActive ? (
                        <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
                          Active
                        </span>
                      ) : (
                        <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-500">
                          Inactive
                        </span>
                      )}
                    </div>

                    <p className="mt-4 text-sm leading-6 text-slate-500">
                      {category.description ||
                        "No description provided"}
                    </p>

                    <div className="mt-4 flex gap-2">
                      <Link
                        href={`/dashboard/categories/${category._id}/edit`}
                        className="flex-1 rounded-xl border border-slate-200 py-2.5 text-center text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        Edit Category
                      </Link>

                      <button
                        onClick={() =>
                          deleteCategory(category._id)
                        }
                        disabled={
                          deletingId === category._id
                        }
                        className="rounded-xl border border-red-100 px-4 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                      >
                        {deletingId === category._id
                          ? "..."
                          : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
