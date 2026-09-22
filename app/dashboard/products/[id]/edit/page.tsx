"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

interface Category {
  _id: string;
  name: string;
  isActive: boolean;
}

interface ProductImage {
  url: string;
  publicId: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  sizes: string[];
  colors: string[];
  images: string[];
  isActive: boolean;
  categoryId?: {
    _id: string;
    name: string;
  };
}

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [categories, setCategories] = useState<Category[]>([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [sizes, setSizes] = useState("");
  const [colors, setColors] = useState("");

  const [images, setImages] = useState<ProductImage[]>([]);

  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [productResponse, categoryResponse] =
          await Promise.all([
            fetch(`/api/products/${id}`),
            fetch("/api/categories"),
          ]);

        const productData = await productResponse.json();
        const categoryData = await categoryResponse.json();

        if (!productData.success) {
          setError(
            productData.message || "Failed to load product"
          );
          return;
        }

        const product: Product = productData.product;

        setName(product.name || "");
        setDescription(product.description || "");
        setPrice(String(product.price ?? ""));
        setDiscountPrice(
          product.discountPrice !== undefined
            ? String(product.discountPrice)
            : ""
        );
        setStock(String(product.stock ?? ""));

        setSizes(product.sizes?.join(", ") || "");
        setColors(product.colors?.join(", ") || "");

        setCategoryId(product.categoryId?._id || "");

        setIsActive(product.isActive);

        setImages(
          (product.images || []).map((url, index) => ({
            url,
            publicId: `existing-${index}-${url}`,
          }))
        );

        if (categoryData.success) {
          setCategories(categoryData.categories || []);
        }
      } catch (error) {
        console.error(error);
        setError("Something went wrong while loading the product.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  async function handleImageUpload(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const files = event.target.files;

    if (!files || files.length === 0) {
      return;
    }

    setUploadingImage(true);
    setError("");

    try {
      for (const file of Array.from(files)) {
        if (file.size > 5 * 1024 * 1024) {
          setError(
            `${file.name} is larger than 5MB and was skipped.`
          );
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          setError(
            data.message || `Failed to upload ${file.name}`
          );
          continue;
        }

        setImages((current) => [
  ...current,
  {
    url: data.url,
    publicId: data.publicId,
  },
]);
      }
    } catch (error) {
      console.error(error);
      setError("Failed to upload image.");
    } finally {
      setUploadingImage(false);
      event.target.value = "";
    }
  }

  function removeImage(publicId: string) {
    setImages((current) =>
      current.filter((image) => image.publicId !== publicId)
    );
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Please enter a product name.");
      return;
    }

    if (!price || Number(price) < 0) {
      setError("Please enter a valid product price.");
      return;
    }

    if (discountPrice && Number(discountPrice) < 0) {
      setError("Discount price cannot be negative.");
      return;
    }

    if (
      discountPrice &&
      Number(discountPrice) >= Number(price)
    ) {
      setError(
        "Discount price should be lower than the original price."
      );
      return;
    }

    if (!stock || Number(stock) < 0) {
      setError("Please enter a valid stock quantity.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          price,
          discountPrice,
          stock,
          categoryId: categoryId || undefined,

          sizes: sizes
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),

          colors: colors
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),

          images: images.map((image) => image.url),

          isActive,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(
          data.message || "Failed to update product."
        );
        return;
      }

      router.push("/dashboard/products");
      router.refresh();
    } catch (error) {
      console.error(error);
      setError("Something went wrong while saving the product.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-[#f8f8f6] p-6">
        <div className="mx-auto max-w-5xl">
          <div className="animate-pulse">
            <div className="h-4 w-32 rounded bg-gray-200" />

            <div className="mt-5 h-9 w-56 rounded bg-gray-200" />

            <div className="mt-2 h-4 w-72 rounded bg-gray-200" />

            <div className="mt-8 h-[700px] rounded-2xl bg-white shadow-sm" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8f6]">
      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:py-10">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/products"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-black"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M15 19l-7-7 7-7"
              />
            </svg>

            Back to Products
          </Link>

          <div className="mt-5">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Edit Product
              </h1>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  isActive
                    ? "bg-green-50 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <p className="mt-2 text-sm text-gray-500">
              Update your product information, images, pricing and
              availability.
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
            <svg
              className="mt-0.5 h-5 w-5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M12 9v4m0 4h.01M10.29 3.86l-8.18 14A2 2 0 003.84 21h16.32a2 2 0 001.73-3.14l-8.18-14a2 2 0 00-3.42 0z"
              />
            </svg>

            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Images */}
            <section className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-6 py-5 sm:px-8">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold">
                      Product Images
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Add clear images of your product.
                    </p>
                  </div>

                  <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600">
                    {images.length}{" "}
                    {images.length === 1 ? "image" : "images"}
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                {/* Upload */}
                <label
                  className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition ${
                    uploadingImage
                      ? "cursor-not-allowed border-gray-200 bg-gray-50"
                      : "border-gray-200 bg-gray-50 hover:border-gray-400 hover:bg-white"
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition group-hover:scale-105">
                    {uploadingImage ? (
                      <svg
                        className="h-6 w-6 animate-spin text-gray-700"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="3"
                        />

                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-6 w-6 text-gray-700"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.7}
                          d="M12 16V4m0 0L7 9m5-5l5 5M5 20h14"
                        />
                      </svg>
                    )}
                  </div>

                  <p className="mt-4 text-sm font-semibold text-gray-900">
                    {uploadingImage
                      ? "Uploading images..."
                      : "Click to upload product images"}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    PNG, JPG, JPEG or WEBP · Maximum 5MB per image
                  </p>
                </label>

                {/* Images */}
                {images.length > 0 && (
                  <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {images.map((image, index) => (
                      <div
                        key={image.publicId}
                        className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-50"
                      >
                        <div className="aspect-square overflow-hidden">
                          <img
                            src={image.url}
                            alt={`Product image ${index + 1}`}
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                          />
                        </div>

                        {index === 0 && (
                          <span className="absolute left-3 top-3 rounded-full bg-black px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                            Main Image
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            removeImage(image.publicId)
                          }
                          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-gray-600 shadow-sm transition hover:bg-red-50 hover:text-red-600"
                          aria-label="Remove image"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.8}
                              d="M6 6l12 12M18 6L6 18"
                            />
                          </svg>
                        </button>

                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-3 pb-3 pt-8">
                          <p className="text-xs font-medium text-white">
                            Image {index + 1}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Basic Information */}
            <section className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-6 py-5 sm:px-8">
                <h2 className="text-lg font-bold">
                  Basic Information
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  The main information customers will see.
                </p>
              </div>

              <div className="space-y-6 p-6 sm:p-8">
                {/* Name */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Product Name
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Classic Cotton T-Shirt"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-black focus:bg-white focus:ring-4 focus:ring-black/5"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Category
                  </label>

                  <select
                    value={categoryId}
                    onChange={(e) =>
                      setCategoryId(e.target.value)
                    }
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-black focus:bg-white focus:ring-4 focus:ring-black/5"
                  >
                    <option value="">Uncategorized</option>

                    {categories
                      .filter((category) => category.isActive)
                      .map((category) => (
                        <option
                          key={category._id}
                          value={category._id}
                        >
                          {category.name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-semibold">
                      Description
                    </label>

                    <span className="text-xs text-gray-400">
                      {description.length} characters
                    </span>
                  </div>

                  <textarea
                    value={description}
                    onChange={(e) =>
                      setDescription(e.target.value)
                    }
                    rows={6}
                    placeholder="Describe your product..."
                    className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm leading-6 outline-none transition placeholder:text-gray-400 focus:border-black focus:bg-white focus:ring-4 focus:ring-black/5"
                  />
                </div>
              </div>
            </section>

            {/* Pricing & Inventory */}
            <section className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-6 py-5 sm:px-8">
                <h2 className="text-lg font-bold">
                  Pricing & Inventory
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Set your product price and available stock.
                </p>
              </div>

              <div className="grid gap-6 p-6 sm:grid-cols-3 sm:p-8">
                {/* Price */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Price
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400">
                      Rs.
                    </span>

                    <input
                      required
                      type="number"
                      min="0"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-black focus:bg-white focus:ring-4 focus:ring-black/5"
                    />
                  </div>
                </div>

                {/* Discount */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Discount Price
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400">
                      Rs.
                    </span>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={discountPrice}
                      onChange={(e) =>
                        setDiscountPrice(e.target.value)
                      }
                      placeholder="Optional"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-black focus:bg-white focus:ring-4 focus:ring-black/5"
                    />
                  </div>
                </div>

                {/* Stock */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Stock Quantity
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-black focus:bg-white focus:ring-4 focus:ring-black/5"
                  />
                </div>
              </div>

              {/* Price preview */}
              {discountPrice &&
                Number(discountPrice) < Number(price) && (
                  <div className="mx-6 mb-6 rounded-xl bg-green-50 p-4 sm:mx-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-green-700">
                          Discount Preview
                        </p>

                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-lg font-bold text-green-800">
                            Rs.{" "}
                            {Number(
                              discountPrice
                            ).toLocaleString()}
                          </span>

                          <span className="text-sm text-green-600 line-through">
                            Rs.{" "}
                            {Number(price).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <span className="rounded-full bg-green-100 px-3 py-1.5 text-xs font-bold text-green-700">
                        {Math.round(
                          ((Number(price) -
                            Number(discountPrice)) /
                            Number(price)) *
                            100
                        )}
                        % OFF
                      </span>
                    </div>
                  </div>
                )}
            </section>

            {/* Variants */}
            <section className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-6 py-5 sm:px-8">
                <h2 className="text-lg font-bold">
                  Product Variants
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Add available sizes and colors. Separate each option
                  with a comma.
                </p>
              </div>

              <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
                {/* Sizes */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Sizes
                  </label>

                  <input
                    value={sizes}
                    onChange={(e) => setSizes(e.target.value)}
                    placeholder="S, M, L, XL"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-black focus:bg-white focus:ring-4 focus:ring-black/5"
                  />

                  <p className="mt-2 text-xs text-gray-400">
                    Example: S, M, L, XL
                  </p>

                  {sizes.trim() && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {sizes
                        .split(",")
                        .map((item) => item.trim())
                        .filter(Boolean)
                        .map((size) => (
                          <span
                            key={size}
                            className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700"
                          >
                            {size}
                          </span>
                        ))}
                    </div>
                  )}
                </div>

                {/* Colors */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Colors
                  </label>

                  <input
                    value={colors}
                    onChange={(e) => setColors(e.target.value)}
                    placeholder="Black, White, Blue"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-black focus:bg-white focus:ring-4 focus:ring-black/5"
                  />

                  <p className="mt-2 text-xs text-gray-400">
                    Example: Black, White, Blue
                  </p>

                  {colors.trim() && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {colors
                        .split(",")
                        .map((item) => item.trim())
                        .filter(Boolean)
                        .map((color) => (
                          <span
                            key={color}
                            className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700"
                          >
                            {color}
                          </span>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Status */}
            <section className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
              <div className="flex items-center justify-between gap-5 p-6 sm:p-8">
                <div>
                  <h2 className="font-bold">Product Visibility</h2>

                  <p className="mt-1 text-sm leading-5 text-gray-500">
                    Control whether customers can see and purchase this
                    product.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                    isActive ? "bg-black" : "bg-gray-200"
                  }`}
                  aria-label="Toggle product visibility"
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
                      isActive ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>

              <div
                className={`border-t px-6 py-4 text-sm sm:px-8 ${
                  isActive
                    ? "border-green-100 bg-green-50 text-green-700"
                    : "border-gray-100 bg-gray-50 text-gray-500"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isActive ? "bg-green-500" : "bg-gray-400"
                    }`}
                  />

                  {isActive
                    ? "This product is visible to customers."
                    : "This product is hidden from customers."}
                </div>
              </div>
            </section>
          </div>

          {/* Sticky Save Bar */}
          <div className="sticky bottom-4 z-30 mt-8">
            <div className="flex flex-col gap-4 rounded-2xl border border-black/10 bg-white/95 p-4 shadow-xl backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-gray-900">
                  Ready to save?
                </p>

                <p className="mt-0.5 text-xs text-gray-500">
                  Your product changes will be updated immediately.
                </p>
              </div>

              <div className="flex w-full gap-3 sm:w-auto">
                <Link
                  href="/dashboard/products"
                  className="flex flex-1 items-center justify-center rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 sm:flex-none"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={saving || uploadingImage}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
                >
                  {saving ? (
                    <>
                      <svg
                        className="h-4 w-4 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="3"
                        />

                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                      </svg>

                      Saving...
                    </>
                  ) : (
                    <>
                      Save Changes

                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.8}
                          d="M5 12h14M13 6l6 6-6 6"
                        />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}