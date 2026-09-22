"use client";

import { useEffect, useState } from "react";

interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  buttonColor: string;
  layout: "GRID" | "LIST";
  showCategories: boolean;
  showFeaturedProducts: boolean;
}

interface Business {
  _id: string;
  name: string;
  slug: string;
  theme?: ThemeSettings;
}

const defaultTheme: ThemeSettings = {
  primaryColor: "#111827",
  secondaryColor: "#6B7280",
  buttonColor: "#111827",
  layout: "GRID",
  showCategories: true,
  showFeaturedProducts: true,
};

function PaletteIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3a9 9 0 0 0 0 18h1.2a1.8 1.8 0 0 0 1.2-3.1 1.8 1.8 0 0 1 1.2-3.1H18a3 3 0 0 0 3-3A9 9 0 0 0 12 3Z"
      />
      <circle cx="7.5" cy="10" r="1" fill="currentColor" />
      <circle cx="9.5" cy="6.5" r="1" fill="currentColor" />
      <circle cx="13.5" cy="6" r="1" fill="currentColor" />
    </svg>
  );
}

function LayoutIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 9h18M9 9v12"
      />
    </svg>
  );
}

function EyeIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
      />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

function CheckIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m5 12 4 4L19 6"
      />
    </svg>
  );
}

function AlertIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v4"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 17h.01"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.3 4.2 2.8 17a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3l-7.5-12.8a2 2 0 0 0-3.4 0Z"
      />
    </svg>
  );
}

function ExternalIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14 5h5v5"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m19 5-8 8"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"
      />
    </svg>
  );
}

function ColorField({
  label,
  description,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  description: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div className="flex gap-2">
        <div className="relative h-11 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-full w-full cursor-pointer rounded-lg border-0 bg-transparent p-0"
          />
        </div>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium uppercase text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
        />
      </div>

      <p className="mt-2 text-xs leading-5 text-slate-400">
        {description}
      </p>
    </div>
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${
        checked ? "bg-slate-900" : "bg-slate-200"
      }`}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
          checked ? "left-6" : "left-1"
        }`}
      />
    </button>
  );
}

export default function StoreCustomizationPage() {
  const [business, setBusiness] = useState<Business | null>(null);
  const [theme, setTheme] = useState<ThemeSettings>(defaultTheme);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBusiness();
  }, []);

  const fetchBusiness = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/business");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to load business settings"
        );
      }

      setBusiness(data.business);

      setTheme({
        ...defaultTheme,
        ...(data.business.theme || {}),
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load customization settings"
      );
    } finally {
      setLoading(false);
    }
  };

  const updateTheme = <K extends keyof ThemeSettings>(
    key: K,
    value: ThemeSettings[K]
  ) => {
    setTheme((current) => ({
      ...current,
      [key]: value,
    }));

    setMessage("");
    setError("");
  };

  const saveCustomization = async () => {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await fetch("/api/business", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          theme,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to save customization"
        );
      }

      setBusiness(data.business);

      setTheme({
        ...defaultTheme,
        ...(data.business.theme || theme),
      });

      setMessage("Store customization saved successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save customization"
      );
    } finally {
      setSaving(false);
    }
  };

  const resetTheme = () => {
    setTheme(defaultTheme);
    setMessage("");
    setError("");
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl animate-pulse">
        <div className="mb-8">
          <div className="h-4 w-36 rounded bg-slate-200" />
          <div className="mt-4 h-9 w-72 rounded-lg bg-slate-200" />
          <div className="mt-3 h-4 w-96 max-w-full rounded bg-slate-200" />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-200 bg-white p-6"
              >
                <div className="h-6 w-48 rounded bg-slate-200" />

                <div className="mt-6 space-y-4">
                  <div className="h-11 rounded-xl bg-slate-100" />
                  <div className="h-11 rounded-xl bg-slate-100" />
                  <div className="h-11 rounded-xl bg-slate-100" />
                </div>
              </div>
            ))}
          </div>

          <div className="h-[600px] rounded-2xl bg-slate-100" />
        </div>
      </div>
    );
  }

  if (error && !business) {
    return (
      <div className="mx-auto max-w-6xl">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <div className="flex gap-3">
            <div className="mt-0.5 text-red-600">
              <AlertIcon />
            </div>

            <div>
              <h2 className="font-semibold text-red-800">
                Unable to load customization
              </h2>

              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>

              <button
                onClick={fetchBusiness}
                className="mt-4 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl pb-12">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
          <span>Dashboard</span>

          <svg
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="m7.5 15 5-5-5-5 1.4-1.4L15.3 10l-6.4 6.4L7.5 15Z" />
          </svg>

          <span>Settings</span>

          <svg
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="m7.5 15 5-5-5-5 1.4-1.4L15.3 10l-6.4 6.4L7.5 15Z" />
          </svg>

          <span className="font-medium text-slate-900">
            Customization
          </span>
        </div>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
              <PaletteIcon />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Store Customization
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Customize how your online store looks and feels.
              </p>
            </div>
          </div>

          {business?.slug && (
            <a
              href={`/shop/${business.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 sm:self-auto"
            >
              <EyeIcon className="h-4 w-4" />
              View Store
              <ExternalIcon className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Alerts */}
      {message && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
            <CheckIcon className="h-3.5 w-3.5" />
          </div>

          <div>
            <p className="font-semibold">Changes saved</p>
            <p className="mt-0.5 text-emerald-600">{message}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertIcon className="mt-0.5 h-5 w-5 shrink-0" />

          <div>
            <p className="font-semibold">Something went wrong</p>
            <p className="mt-0.5 text-red-600">{error}</p>
          </div>
        </div>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* LEFT SIDE */}
        <div className="space-y-6">
          {/* Colors */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-5 sm:px-7">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                  <PaletteIcon className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900">
                    Store Colors
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Choose the colors used throughout your public
                    store.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 p-6 sm:grid-cols-3 sm:p-7">
              <ColorField
                label="Primary Color"
                description="Used for headings and important text."
                value={theme.primaryColor}
                placeholder="#111827"
                onChange={(value) =>
                  updateTheme("primaryColor", value)
                }
              />

              <ColorField
                label="Secondary Color"
                description="Used for supporting text and elements."
                value={theme.secondaryColor}
                placeholder="#6B7280"
                onChange={(value) =>
                  updateTheme("secondaryColor", value)
                }
              />

              <ColorField
                label="Button Color"
                description="Used for action buttons and CTAs."
                value={theme.buttonColor}
                placeholder="#111827"
                onChange={(value) =>
                  updateTheme("buttonColor", value)
                }
              />
            </div>
          </section>

          {/* Product Layout */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-5 sm:px-7">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                  <LayoutIcon className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900">
                    Product Layout
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Choose how products are displayed in your store.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-7">
              {/* Grid */}
              <button
                type="button"
                onClick={() => updateTheme("layout", "GRID")}
                className={`group rounded-2xl border-2 p-4 text-left transition ${
                  theme.layout === "GRID"
                    ? "border-slate-900 bg-slate-50 shadow-sm"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div className="mb-5 rounded-xl border border-slate-200 bg-white p-3">
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                      <div
                        key={item}
                        className="aspect-square rounded-lg bg-slate-100"
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      Grid Layout
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Products displayed in a compact grid.
                    </p>
                  </div>

                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                      theme.layout === "GRID"
                        ? "border-slate-900 bg-slate-900"
                        : "border-slate-300"
                    }`}
                  >
                    {theme.layout === "GRID" && (
                      <CheckIcon className="h-3 w-3 text-white" />
                    )}
                  </div>
                </div>
              </button>

              {/* List */}
              <button
                type="button"
                onClick={() => updateTheme("layout", "LIST")}
                className={`group rounded-2xl border-2 p-4 text-left transition ${
                  theme.layout === "LIST"
                    ? "border-slate-900 bg-slate-50 shadow-sm"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div className="mb-5 space-y-2 rounded-xl border border-slate-200 bg-white p-3">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="flex gap-3 rounded-lg border border-slate-100 p-2"
                    >
                      <div className="h-10 w-10 shrink-0 rounded bg-slate-100" />

                      <div className="flex-1 space-y-2 pt-1">
                        <div className="h-2 w-2/3 rounded bg-slate-200" />
                        <div className="h-2 w-1/2 rounded bg-slate-100" />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      List Layout
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Products displayed one below another.
                    </p>
                  </div>

                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                      theme.layout === "LIST"
                        ? "border-slate-900 bg-slate-900"
                        : "border-slate-300"
                    }`}
                  >
                    {theme.layout === "LIST" && (
                      <CheckIcon className="h-3 w-3 text-white" />
                    )}
                  </div>
                </div>
              </button>
            </div>
          </section>

          {/* Store Sections */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-5 sm:px-7">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                  <EyeIcon className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900">
                    Store Sections
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Choose which sections are visible on your public
                    store.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-7">
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-5 rounded-xl p-3 transition hover:bg-slate-50">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">
                      Show Categories
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Display product categories on your store.
                    </p>
                  </div>

                  <Toggle
                    checked={theme.showCategories}
                    onChange={(checked) =>
                      updateTheme("showCategories", checked)
                    }
                  />
                </div>

                <div className="border-t border-slate-100" />

                <div className="flex items-center justify-between gap-5 rounded-xl p-3 transition hover:bg-slate-50">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">
                      Featured Products
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Display featured products on your store homepage.
                    </p>
                  </div>

                  <Toggle
                    checked={theme.showFeaturedProducts}
                    onChange={(checked) =>
                      updateTheme("showFeaturedProducts", checked)
                    }
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="sticky bottom-4 z-20">
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Store appearance
                </p>

                <p className="text-xs text-slate-500">
                  Save your changes when you are finished.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={resetTheme}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Reset
                </button>

                <button
                  type="button"
                  onClick={saveCustomization}
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <svg
                        className="h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="9"
                          stroke="currentColor"
                          strokeWidth="3"
                        />

                        <path
                          className="opacity-90"
                          d="M21 12a9 9 0 0 0-9-9"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </svg>

                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckIcon className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - PREVIEW */}
        <div className="lg:sticky lg:top-6">
          <div className="mb-3 flex items-end justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Live Preview
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                See your changes before saving.
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Store Header */}
            <div
              className="px-5 py-5"
              style={{
                backgroundColor: theme.primaryColor,
              }}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-white">
                    {business?.name || "Your Store"}
                  </p>

                  <p className="mt-1 text-[11px] text-white/60">
                    Online Store
                  </p>
                </div>

                <div className="rounded-lg bg-white/10 px-2.5 py-1.5 text-[11px] font-medium text-white">
                  Cart
                </div>
              </div>
            </div>

            {/* Hero */}
            <div className="p-4">
              <div
                className="rounded-2xl p-5"
                style={{
                  backgroundColor: `${theme.primaryColor}12`,
                }}
              >
                <p
                  className="text-[10px] font-bold tracking-widest"
                  style={{
                    color: theme.secondaryColor,
                  }}
                >
                  WELCOME
                </p>

                <h3
                  className="mt-1.5 truncate text-xl font-bold"
                  style={{
                    color: theme.primaryColor,
                  }}
                >
                  {business?.name || "Your Store"}
                </h3>

                <p
                  className="mt-2 text-xs leading-5"
                  style={{
                    color: theme.secondaryColor,
                  }}
                >
                  Discover our latest products and offers.
                </p>

                <button
                  type="button"
                  className="mt-4 rounded-lg px-4 py-2 text-xs font-semibold text-white shadow-sm"
                  style={{
                    backgroundColor: theme.buttonColor,
                  }}
                >
                  Shop Now
                </button>
              </div>
            </div>

            {/* Categories */}
            {theme.showCategories && (
              <div className="px-4 pb-4">
                <div className="mb-3 flex items-center justify-between">
                  <p
                    className="text-sm font-bold"
                    style={{
                      color: theme.primaryColor,
                    }}
                  >
                    Categories
                  </p>

                  <span
                    className="text-[10px]"
                    style={{
                      color: theme.secondaryColor,
                    }}
                  >
                    View all
                  </span>
                </div>

                <div className="flex gap-2 overflow-hidden">
                  {["All", "New", "Popular"].map(
                    (category, index) => (
                      <div
                        key={category}
                        className="whitespace-nowrap rounded-full px-3 py-1.5 text-[10px] font-medium"
                        style={{
                          backgroundColor:
                            index === 0
                              ? theme.primaryColor
                              : `${theme.primaryColor}12`,
                          color:
                            index === 0
                              ? "#FFFFFF"
                              : theme.primaryColor,
                        }}
                      >
                        {category}
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Products */}
            {theme.showFeaturedProducts && (
              <div className="px-4 pb-5">
                <div className="mb-3 flex items-center justify-between">
                  <p
                    className="text-sm font-bold"
                    style={{
                      color: theme.primaryColor,
                    }}
                  >
                    Products
                  </p>

                  <span
                    className="text-[10px]"
                    style={{
                      color: theme.secondaryColor,
                    }}
                  >
                    View all
                  </span>
                </div>

                {theme.layout === "GRID" ? (
                  <div className="grid grid-cols-2 gap-3">
                    {[1, 2, 3, 4].map((product) => (
                      <div
                        key={product}
                        className="overflow-hidden rounded-xl border border-slate-100 bg-white"
                      >
                        <div className="aspect-square bg-slate-100" />

                        <div className="p-2.5">
                          <div
                            className="h-2 w-3/4 rounded"
                            style={{
                              backgroundColor: `${theme.primaryColor}25`,
                            }}
                          />

                          <div
                            className="mt-2 h-2 w-1/2 rounded"
                            style={{
                              backgroundColor: `${theme.secondaryColor}25`,
                            }}
                          />

                          <div
                            className="mt-3 h-6 rounded-md"
                            style={{
                              backgroundColor: theme.buttonColor,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {[1, 2, 3].map((product) => (
                      <div
                        key={product}
                        className="flex gap-3 rounded-xl border border-slate-100 p-2"
                      >
                        <div className="h-16 w-16 shrink-0 rounded-lg bg-slate-100" />

                        <div className="flex-1 pt-1">
                          <div
                            className="h-2 w-3/4 rounded"
                            style={{
                              backgroundColor: `${theme.primaryColor}25`,
                            }}
                          />

                          <div
                            className="mt-2 h-2 w-1/2 rounded"
                            style={{
                              backgroundColor: `${theme.secondaryColor}25`,
                            }}
                          />

                          <div
                            className="mt-3 h-5 w-16 rounded"
                            style={{
                              backgroundColor: theme.buttonColor,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="border-t border-slate-100 px-4 py-4">
              <div
                className="text-center text-[10px]"
                style={{
                  color: theme.secondaryColor,
                }}
              >
                © {new Date().getFullYear()}{" "}
                {business?.name || "Your Store"}
              </div>
            </div>
          </div>

          {/* Live Store Button */}
          {business?.slug && (
            <a
              href={`/shop/${business.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
            >
              <EyeIcon className="h-4 w-4" />
              Open Live Store
              <ExternalIcon className="h-3.5 w-3.5" />
            </a>
          )}

          {/* Current Theme */}
          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Current Theme
            </p>

            <div className="flex items-center gap-2">
              <div
                className="h-8 w-8 rounded-lg border border-slate-200"
                style={{
                  backgroundColor: theme.primaryColor,
                }}
                title="Primary color"
              />

              <div
                className="h-8 w-8 rounded-lg border border-slate-200"
                style={{
                  backgroundColor: theme.secondaryColor,
                }}
                title="Secondary color"
              />

              <div
                className="h-8 w-8 rounded-lg border border-slate-200"
                style={{
                  backgroundColor: theme.buttonColor,
                }}
                title="Button color"
              />

              <div className="ml-auto rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                {theme.layout === "GRID"
                  ? "Grid"
                  : "List"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}