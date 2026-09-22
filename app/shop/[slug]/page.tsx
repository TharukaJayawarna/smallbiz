import Link from "next/link";

import { connectDB } from "@/lib/mongodb";
import Business from "@/models/Business";
import Category from "@/models/Category";
import Product from "@/models/Product";
import CartButton from "@/components/CartButton";

interface ShopPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ShopPage({ params }: ShopPageProps) {
  const { slug } = await params;

  await connectDB();

  const business = await Business.findOne({
    slug,
  }).lean();

  if (!business) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
            <svg
              className="h-8 w-8 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 7h18M5 7l1 12h12l1-12M9 7V5a3 3 0 016 0v2"
              />
            </svg>
          </div>

          <h1 className="mt-5 text-xl font-bold text-slate-900">
            Store Not Found
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            The store you're looking for doesn't exist or may have been
            removed.
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Go Home
            <span>→</span>
          </Link>
        </div>
      </main>
    );
  }

  const categories = await Category.find({
    businessId: business._id,
    isActive: true,
  })
    .sort({ name: 1 })
    .lean();

const products = (await Product.find({
  businessId: business._id,
  isActive: true,
})
  .populate("categoryId", "name")
  .sort({ createdAt: -1 })
  .lean()) as any[];

  const theme = business.theme || {
    primaryColor: "#111827",
    secondaryColor: "#64748B",
    buttonColor: "#111827",
    layout: "GRID",
    showCategories: true,
    showFeaturedProducts: true,
  };

  return (
    <main
      className="min-h-screen bg-[#f8fafc] text-slate-900"
      style={
        {
          "--primary-color": theme.primaryColor,
          "--secondary-color": theme.secondaryColor,
          "--button-color": theme.buttonColor,
        } as React.CSSProperties
      }
    >
      {/* ========================================================= */}
      {/* HEADER */}
      {/* ========================================================= */}

      <header
  className="sticky top-0 z-50 border-b border-white/10 text-white shadow-sm"
  style={{
    backgroundColor: theme.primaryColor,
  }}
>
  <div className="mx-auto max-w-7xl px-4 sm:px-6">
    <div className="flex h-16 items-center justify-between gap-4">
      {/* Store Logo & Name */}
      <Link
  href={`/shop/${business.slug}`}
  className="flex min-w-0 items-center gap-2.5"
>
  {business.logo ? (
    <div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-xl border border-white/20 bg-white">
      <img
        src={String(business.logo)}
        alt={`${business.name} logo`}
        className="h-full w-full object-contain p-1"
        loading="eager"
      />
    </div>
  ) : (
    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-white/15 text-sm font-bold">
      {business.name.charAt(0).toUpperCase()}
    </div>
  )}

  <div className="min-w-0">
    <h1 className="truncate text-sm font-bold sm:text-base">
      {business.name}
    </h1>

    <p className="hidden text-[10px] text-white/55 sm:block">
      Online Store
    </p>
  </div>
</Link>

      {/* Cart */}
      <CartButton
  href={`/shop/${business.slug}/cart`}
  slug={business.slug}
/>
    </div>
  </div>
</header>

      {/* ========================================================= */}
      {/* COMPACT HERO */}
      {/* ========================================================= */}

      {business.coverImage ? (
  <div className="relative h-[230px] overflow-hidden sm:h-[260px]">
    <img
      src={String(business.coverImage)}
      alt={`${business.name} cover`}
      className="h-full w-full object-cover"
      loading="eager"
    />

    <div className="absolute inset-0 bg-black/40" />

    <div
      className="absolute inset-0"
      style={{
        background: `linear-gradient(90deg, ${theme.primaryColor}dd 0%, ${theme.primaryColor}55 45%, transparent 80%)`,
      }}
    />

    <div className="absolute inset-0">
      <div className="mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6">
        <div className="max-w-xl text-white">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            {business.name}
          </h2>

          {business.description && (
            <p className="mt-2 line-clamp-2 max-w-lg text-xs leading-5 text-white/80 sm:text-sm">
              {business.description}
            </p>
          )}

          <Link
            href="#products"
            className="mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-white shadow-lg transition hover:-translate-y-0.5"
            style={{
              backgroundColor: theme.buttonColor,
            }}
          >
            Shop Now
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  </div>
) : (
  <div
    className="relative overflow-hidden px-4 py-16 text-white sm:px-6 sm:py-20"
    style={{
      backgroundColor: theme.primaryColor,
    }}
  >
    <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

    <div className="absolute -bottom-28 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

    <div className="relative mx-auto max-w-7xl">
      <div className="max-w-2xl">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          {business.name}
        </h2>

        {business.description && (
          <p className="mt-3 max-w-lg text-xs leading-5 text-white/70 sm:text-sm">
            {business.description}
          </p>
        )}

        <Link
          href="#products"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold shadow-lg transition hover:-translate-y-0.5"
          style={{
            color: theme.primaryColor,
          }}
        >
          Shop Now
          <span>→</span>
        </Link>
      </div>
    </div>
  </div>
)}

      {/* ========================================================= */}
      {/* SMALL TRUST BAR */}
      {/* ========================================================= */}

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center divide-x divide-slate-200 px-4 sm:px-6">
          <div className="flex items-center gap-2 px-5 py-3.5">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold"
              style={{
                backgroundColor: `${theme.primaryColor}12`,
                color: theme.primaryColor,
              }}
            >
              ✓
            </span>

            <span className="text-xs font-semibold text-slate-700">
              Quality Products
            </span>
          </div>

          <div className="flex items-center gap-2 px-5 py-3.5">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold"
              style={{
                backgroundColor: `${theme.primaryColor}12`,
                color: theme.primaryColor,
              }}
            >
              ⚡
            </span>

            <span className="text-xs font-semibold text-slate-700">
              Easy Shopping
            </span>
          </div>

          <div className="hidden items-center gap-2 px-5 py-3.5 sm:flex">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold"
              style={{
                backgroundColor: `${theme.primaryColor}12`,
                color: theme.primaryColor,
              }}
            >
              ♥
            </span>

            <span className="text-xs font-semibold text-slate-700">
              Customer Focused
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* CONTENT */}
      {/* ========================================================= */}

      <div className="mx-auto max-w-7xl px-4 py-9 sm:px-6 sm:py-12">
        {/* ======================================================= */}
        {/* CATEGORIES */}
        {/* ======================================================= */}

        {theme.showCategories && categories.length > 0 && (
          <section className="mb-10">
            <div className="mb-4">
              <p
                className="text-[10px] font-bold uppercase tracking-[0.2em]"
                style={{
                  color: theme.secondaryColor,
                }}
              >
                Browse
              </p>

              <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
                Categories
              </h2>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              <Link
                href={`/shop/${business.slug}`}
                className="flex-shrink-0 rounded-xl px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:-translate-y-0.5"
                style={{
                  backgroundColor: theme.primaryColor,
                }}
              >
                All Products
              </Link>

              {categories.map((category) => (
                <Link
                  key={category._id.toString()}
                  href={`/shop/${business.slug}?category=${category.slug}`}
                  className="flex-shrink-0 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                  style={{
                    color: theme.secondaryColor,
                  }}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ======================================================= */}
        {/* PRODUCTS */}
        {/* ======================================================= */}

        {theme.showFeaturedProducts && (
          <section id="products" className="scroll-mt-24">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p
                  className="text-[10px] font-bold uppercase tracking-[0.2em]"
                  style={{
                    color: theme.secondaryColor,
                  }}
                >
                  Collection
                </p>

                <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
                  Our Products
                </h2>

                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  Discover something you'll love.
                </p>
              </div>

              <div className="flex-shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold text-slate-500 shadow-sm">
                {products.length}{" "}
                {products.length === 1 ? "product" : "products"}
              </div>
            </div>

            {products.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                  <svg
                    className="h-7 w-7 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4-4 3 3 4-5 5 6M5 19h14a1 1 0 001-1V6a1 1 0 00-1-1H5a1 1 0 00-1 1v12a1 1 0 001 1z"
                    />
                  </svg>
                </div>

                <h3 className="mt-4 text-base font-bold text-slate-900">
                  No products available
                </h3>

                <p className="mx-auto mt-1.5 max-w-md text-xs leading-5 text-slate-500">
                  This store has not added any products yet. Please check back
                  later.
                </p>
              </div>
            ) : (
              <div
                className={
                  theme.layout === "GRID"
                    ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "space-y-3"
                }
              >
                {products.map((product) => {
                  const hasDiscount =
                    product.discountPrice !== undefined &&
                    product.discountPrice !== null &&
                    product.discountPrice < product.price;

                  const displayPrice = hasDiscount
                    ? product.discountPrice
                    : product.price;

                  const category =
                    product.categoryId &&
                    typeof product.categoryId === "object"
                      ? product.categoryId
                      : null;

                  return (
                    <Link
                      key={product._id.toString()}
                      href={`/shop/${business.slug}/product/${product.slug}`}
                      className={
                        theme.layout === "GRID"
                          ? "group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
                          : "group flex gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:border-slate-300 hover:shadow-lg"
                      }
                    >
                      {/* Product Image */}

                      <div
                        className={
                          theme.layout === "GRID"
                            ? "relative aspect-[1.05/1] overflow-hidden bg-slate-100"
                            : "relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-32 sm:w-32"
                        }
                      >
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full flex-col items-center justify-center text-slate-400">
                            <svg
                              className="h-7 w-7"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M4 16l4-4 3 3 4-5 5 6M5 19h14a1 1 0 001-1V6a1 1 0 00-1-1H5a1 1 0 00-1 1v12a1 1 0 001 1z"
                              />
                            </svg>

                            <span className="mt-1 text-[10px]">
                              No Image
                            </span>
                          </div>
                        )}

                        {hasDiscount && (
                          <span className="absolute left-2.5 top-2.5 rounded-lg bg-red-500 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-white shadow-sm">
                            Sale
                          </span>
                        )}

                        {product.stock <= 0 && (
                          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50">
                            <span className="rounded-lg bg-white px-3 py-1.5 text-[10px] font-bold text-slate-900 shadow">
                              Out of Stock
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Product Details */}

                      <div
                        className={
                          theme.layout === "GRID"
                            ? "p-4"
                            : "flex min-w-0 flex-1 flex-col justify-center"
                        }
                      >
                        {category && (
                          <p
                            className="mb-1 text-[9px] font-bold uppercase tracking-[0.15em]"
                            style={{
                              color: theme.secondaryColor,
                            }}
                          >
                            {category.name}
                          </p>
                        )}

                        <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-slate-900">
                          {product.name}
                        </h3>

                        <div className="mt-2.5 flex flex-wrap items-center gap-2">
                          <span className="text-base font-extrabold tracking-tight text-slate-950">
                            Rs. {Number(displayPrice).toLocaleString()}
                          </span>

                          {hasDiscount && (
                            <span className="text-[10px] font-medium text-slate-400 line-through">
                              Rs. {Number(product.price).toLocaleString()}
                            </span>
                          )}
                        </div>

                        <div className="mt-2 flex items-center gap-1.5">
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{
                              backgroundColor:
                                product.stock > 0
                                  ? "#22C55E"
                                  : "#EF4444",
                            }}
                          />

                          <span
                            className="text-[10px] font-medium"
                            style={{
                              color:
                                product.stock > 0
                                  ? theme.secondaryColor
                                  : "#DC2626",
                            }}
                          >
                            {product.stock > 0
                              ? `${product.stock} available`
                              : "Out of stock"}
                          </span>
                        </div>

                        {theme.layout === "GRID" && (
                          <div
                            className="mt-3 rounded-xl px-3 py-2 text-center text-[10px] font-bold text-white transition group-hover:opacity-90"
                            style={{
                              backgroundColor: theme.buttonColor,
                            }}
                          >
                            View Product →
                          </div>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </div>

      {/* ========================================================= */}
      {/* SHOP DETAILS FOOTER */}
      {/* ========================================================= */}

      <footer
        className="mt-8 border-t border-white/10 text-white"
        style={{
          backgroundColor: theme.primaryColor,
        }}
      >
        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6">
          <div className="grid gap-6 md:grid-cols-[1.2fr_1fr_1fr] md:items-start">
            {/* Shop Information */}

            <div>
              <div className="flex items-center gap-3">
                {business.logo ? (
                  <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-xl bg-white">
                    <img
  src={String(business.logo)}
  alt={`${business.name} logo`}
  className="h-full w-full object-contain p-1"
/>
                  </div>
                ) : (
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/10 text-sm font-bold">
                    {business.name.charAt(0).toUpperCase()}
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-bold">
                    {business.name}
                  </h3>

                  <p className="mt-0.5 text-[10px] text-white/45">
                    Online Store
                  </p>
                </div>
              </div>

              {business.description && (
                <p className="mt-3 max-w-md text-xs leading-5 text-white/55">
                  {business.description}
                </p>
              )}
            </div>

            {/* Contact Details */}

            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/80">
                Contact Details
              </h3>

              <div className="mt-3 space-y-2 text-xs text-white/55">
                {business.phoneNumber && (
                  <a
                    href={`tel:${business.phoneNumber}`}
                    className="flex items-start gap-2 transition hover:text-white"
                  >
                    <svg
                      className="mt-0.5 h-3.5 w-3.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.7}
                        d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.12.9.33 1.78.62 2.63a2 2 0 01-.45 2.11L8 9.73a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0122 16.92z"
                      />
                    </svg>

                    <span>{business.phoneNumber}</span>
                  </a>
                )}

                {business.whatsappNumber && (
                  <div className="flex items-start gap-2">
                    <svg
                      className="mt-0.5 h-3.5 w-3.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20 11.5a8 8 0 01-11.7 7.1L4 20l1.5-4.1A8 8 0 1120 11.5z"
                      />
                    </svg>

                    <span>{business.whatsappNumber}</span>
                  </div>
                )}

                {business.address && (
                  <div className="flex items-start gap-2">
                    <svg
                      className="mt-0.5 h-3.5 w-3.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.7}
                        d="M12 21s7-6.1 7-12a7 7 0 10-14 0c0 5.9 7 12 7 12z"
                      />

                      <circle
                        cx="12"
                        cy="9"
                        r="2.2"
                        strokeWidth="1.7"
                      />
                    </svg>

                    <span className="leading-5">
                      {business.address}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Store Information */}

            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/80">
                Store Information
              </h3>

              <div className="mt-3 space-y-2 text-xs text-white/55">
                <div className="flex items-center justify-between gap-3">
                  <span>Products</span>
                  <span className="font-semibold text-white/75">
                    {products.length}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span>Categories</span>
                  <span className="font-semibold text-white/75">
                    {categories.length}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span>Shopping</span>
                  <span className="font-semibold text-white/75">
                    Online
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}

          <div className="mt-6 border-t border-white/10 pt-4 text-center text-[10px] text-white/30">
            © {new Date().getFullYear()} {business.name}. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}