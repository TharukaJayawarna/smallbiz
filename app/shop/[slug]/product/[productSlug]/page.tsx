import Link from "next/link";
import { notFound } from "next/navigation";

import { connectDB } from "@/lib/mongodb";
import Business from "@/models/Business";
import Product from "@/models/Product";
import AddToCart from "./AddToCart";

interface ProductPageProps {
  params: Promise<{
    slug: string;
    productSlug: string;
  }>;
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug, productSlug } = await params;

  await connectDB();

  const business = await Business.findOne({
    slug,
  }).lean();

  if (!business) {
    notFound();
  }

  const product = await Product.findOne({
    businessId: business._id,
    slug: productSlug,
    isActive: true,
  })
    .populate("categoryId", "name")
    .lean();

  if (!product) {
    notFound();
  }

  const productData = {
    id: product._id.toString(),
    name: product.name,
    description: product.description || "",
    price: product.price,
    discountPrice: product.discountPrice ?? null,
    stock: product.stock,
    images: product.images || [],
    sizes: product.sizes || [],
    colors: product.colors || [],
    businessSlug: business.slug,
    categoryName:
      typeof product.categoryId === "object" &&
      product.categoryId !== null &&
      "name" in product.categoryId
        ? String(product.categoryId.name)
        : "",
  };

  return (
    <main className="min-h-screen bg-[#f8f8f6] text-gray-900">
      {/* HEADER */}
      <header className="sticky top-0 z-30 border-b border-gray-200/80 bg-[#f8f8f6]/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link
            href={`/shop/${business.slug}`}
            className="group flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition-transform duration-300 group-hover:scale-105">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M3 6h18" />
                <path d="M6 6l1 14h10l1-14" />
                <path d="M9 6V4a3 3 0 0 1 6 0v2" />
              </svg>
            </div>

            <span className="text-lg font-semibold tracking-tight">
              {business.name}
            </span>
          </Link>

          <Link
            href={`/shop/${business.slug}/cart`}
            className="group flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:bg-gray-800 hover:shadow-lg"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M3 3h2l2.5 12.5a2 2 0 0 0 2 1.5h7.8a2 2 0 0 0 1.9-1.4L21 8H6" />
              <circle cx="10" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
            </svg>

            <span>View Cart</span>
          </Link>
        </div>
      </header>

      {/* CONTENT */}
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
        {/* BREADCRUMB */}
        <div className="mb-8 flex items-center gap-2 text-sm text-gray-400">
          <Link
            href={`/shop/${business.slug}`}
            className="transition-colors hover:text-gray-900"
          >
            Store
          </Link>

          <span>/</span>

          {productData.categoryName && (
            <>
              <span>{productData.categoryName}</span>
              <span>/</span>
            </>
          )}

          <span className="max-w-[220px] truncate text-gray-600">
            {productData.name}
          </span>
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(400px,0.9fr)] lg:gap-16">
          {/* IMAGE GALLERY */}
          <ProductGallery
            images={productData.images}
            name={productData.name}
          />

          {/* PRODUCT DETAILS */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              {/* CATEGORY */}
              {productData.categoryName && (
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                  {productData.categoryName}
                </p>
              )}

              {/* NAME */}
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-gray-950 sm:text-4xl">
                {productData.name}
              </h1>

              {/* PRICE */}
              <div className="mt-6">
                {productData.discountPrice !== null ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-3xl font-bold tracking-tight text-gray-950">
                      Rs.{" "}
                      {productData.discountPrice.toLocaleString()}
                    </span>

                    <span className="text-lg text-gray-400 line-through">
                      Rs. {productData.price.toLocaleString()}
                    </span>

                    <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
                      {Math.round(
                        ((productData.price -
                          productData.discountPrice) /
                          productData.price) *
                          100
                      )}
                      % OFF
                    </span>
                  </div>
                ) : (
                  <span className="text-3xl font-bold tracking-tight text-gray-950">
                    Rs. {productData.price.toLocaleString()}
                  </span>
                )}
              </div>

              {/* STOCK */}
              <div className="mt-5 flex items-center gap-2">
                {productData.stock > 0 ? (
                  <>
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-sm font-medium text-green-700">
                      {productData.stock <= 5
                        ? `Only ${productData.stock} left in stock`
                        : "In stock"}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    <span className="text-sm font-medium text-red-600">
                      Out of stock
                    </span>
                  </>
                )}
              </div>

              {/* DESCRIPTION */}
              {productData.description && (
                <div className="mt-7 border-t border-gray-100 pt-7">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                    Description
                  </h2>

                  <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-600">
                    {productData.description}
                  </p>
                </div>
              )}

              {/* ADD TO CART */}
              {productData.stock > 0 ? (
                <AddToCart product={productData} />
              ) : (
                <div className="mt-8 rounded-xl bg-red-50 px-5 py-4 text-center text-sm font-semibold text-red-700">
                  This product is currently unavailable
                </div>
              )}

              {/* TRUST FEATURES */}
              <div className="mt-8 grid grid-cols-3 gap-2 border-t border-gray-100 pt-7">
                <Feature
                  icon={
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M12 3l8 4v5c0 4.5-3.2 7.8-8 9-4.8-1.2-8-4.5-8-9V7l8-4z" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                  }
                  text="Secure"
                />

                <Feature
                  icon={
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M3 12h18" />
                      <path d="M5 12l2-7h10l2 7" />
                      <path d="M5 12v6h14v-6" />
                    </svg>
                  }
                  text="Quality"
                />

                <Feature
                  icon={
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M3 12a9 9 0 1 0 3-6.7" />
                      <path d="M3 4v6h6" />
                    </svg>
                  }
                  text="Reliable"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

/* --------------------------------
   PRODUCT GALLERY
-------------------------------- */

function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  if (images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-3xl border border-gray-200 bg-white text-sm text-gray-400 shadow-sm">
        No image available
      </div>
    );
  }

  return (
    <div>
      {/* MAIN IMAGE */}
      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <img
          src={images[0]}
          alt={name}
          className="aspect-square w-full object-cover"
        />
      </div>

      {/* ADDITIONAL IMAGES */}
      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {images.slice(1, 5).map((image, index) => (
            <div
              key={`${image}-${index}`}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white"
            >
              <img
                src={image}
                alt={`${name} ${index + 2}`}
                className="aspect-square w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* --------------------------------
   FEATURE
-------------------------------- */

function Feature({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl bg-[#f7f7f5] px-2 py-3 text-center">
      <div className="text-gray-600">{icon}</div>

      <span className="mt-1.5 text-[10px] font-medium text-gray-500 sm:text-xs">
        {text}
      </span>
    </div>
  );
}
