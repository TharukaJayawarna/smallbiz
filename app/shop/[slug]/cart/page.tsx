"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
  stock: number;
}

export default function CartPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [slug, setSlug] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then(({ slug }) => {
      setSlug(slug);

      const cartKey = `cart_${slug}`;
      const storedCart = localStorage.getItem(cartKey);

      if (storedCart) {
        try {
          setCart(JSON.parse(storedCart));
        } catch {
          setCart([]);
        }
      }

      setLoading(false);
    });
  }, [params]);

  function saveCart(updatedCart: CartItem[]) {
    setCart(updatedCart);
    localStorage.setItem(`cart_${slug}`, JSON.stringify(updatedCart));
  }

  function increaseQuantity(index: number) {
    const updatedCart = [...cart];
    const item = updatedCart[index];

    if (item.quantity >= item.stock) return;

    item.quantity += 1;
    saveCart(updatedCart);
  }

  function decreaseQuantity(index: number) {
    const updatedCart = [...cart];
    const item = updatedCart[index];

    if (item.quantity <= 1) return;

    item.quantity -= 1;
    saveCart(updatedCart);
  }

  function removeItem(index: number) {
    const updatedCart = cart.filter((_, itemIndex) => itemIndex !== index);
    saveCart(updatedCart);
  }

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f8f6]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-200 border-t-black" />
          <p className="text-sm text-gray-500">Loading your cart...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f8f6] text-gray-900">
      {/* HEADER */}
      <header className="sticky top-0 z-30 border-b border-gray-200/80 bg-[#f8f8f6]/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link
            href={`/shop/${slug}`}
            className="group flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white shadow-sm transition-transform duration-300 group-hover:scale-105">
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
              Store
            </span>
          </Link>

          <Link
            href={`/shop/${slug}`}
            className="group flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Continue Shopping</span>
            <span className="sm:hidden">Shop</span>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        {/* PAGE TITLE */}
        <div className="mb-10">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
            Your Selection
          </p>

          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Shopping Cart
              </h1>

              {cart.length > 0 && (
                <p className="mt-2 text-sm text-gray-500">
                  {totalItems} {totalItems === 1 ? "item" : "items"} in your
                  cart
                </p>
              )}
            </div>

            {cart.length > 0 && (
              <div className="hidden rounded-full bg-white px-4 py-2 text-xs font-medium text-gray-500 shadow-sm sm:block">
                {cart.length}{" "}
                {cart.length === 1 ? "product" : "products"}
              </div>
            )}
          </div>
        </div>

        {cart.length === 0 ? (
          /* EMPTY CART */
          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white">
            <div className="flex min-h-[500px] flex-col items-center justify-center px-6 py-16 text-center">
              <div className="relative mb-8">
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#f5f5f2]">
                  <svg
                    width="42"
                    height="42"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    className="text-gray-400"
                  >
                    <path d="M3 3h2l2.5 12.5a2 2 0 0 0 2 1.5h7.8a2 2 0 0 0 1.9-1.4L21 8H6" />
                    <circle cx="10" cy="20" r="1" />
                    <circle cx="18" cy="20" r="1" />
                  </svg>
                </div>

                <div className="absolute -right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-black text-xs text-white">
                  0
                </div>
              </div>

              <h2 className="text-2xl font-semibold tracking-tight">
                Your cart is empty
              </h2>

              <p className="mt-3 max-w-md text-sm leading-6 text-gray-500">
                Looks like you haven't added anything yet. Explore our
                collection and find something you'll love.
              </p>

              <Link
                href={`/shop/${slug}`}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-black px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 hover:shadow-lg"
              >
                Start Shopping
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14" />
                  <path d="M13 6l6 6-6 6" />
                </svg>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            {/* CART ITEMS */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                  Cart Items
                </h2>
              </div>

              <div className="space-y-4">
                {cart.map((item, index) => (
                  <div
                    key={`${item.productId}-${item.size}-${item.color}`}
                    className="group rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:border-gray-300 hover:shadow-md sm:p-5"
                  >
                    <div className="flex gap-4 sm:gap-6">
                      {/* PRODUCT IMAGE */}
                      <Link
                        href={`/shop/${slug}`}
                        className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-xl bg-[#f5f5f2] sm:h-36 sm:w-36"
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-gray-400">
                            No image
                          </div>
                        )}
                      </Link>

                      {/* PRODUCT INFO */}
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="truncate text-base font-semibold text-gray-900 sm:text-lg">
                              {item.name}
                            </h3>

                            {(item.size || item.color) && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {item.size && (
                                  <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                                    Size: {item.size}
                                  </span>
                                )}

                                {item.color && (
                                  <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                                    {item.color}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* REMOVE */}
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            aria-label={`Remove ${item.name}`}
                            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                          >
                            <svg
                              width="17"
                              height="17"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.7"
                            >
                              <path d="M3 6h18" />
                              <path d="M8 6V4h8v2" />
                              <path d="M19 6l-1 15H6L5 6" />
                              <path d="M10 11v6" />
                              <path d="M14 11v6" />
                            </svg>
                          </button>
                        </div>

                        {/* BOTTOM */}
                        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
                          {/* QUANTITY */}
                          <div>
                            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                              Quantity
                            </p>

                            <div className="flex h-9 items-center overflow-hidden rounded-lg border border-gray-200 bg-white">
                              <button
                                type="button"
                                onClick={() => decreaseQuantity(index)}
                                disabled={item.quantity <= 1}
                                className="flex h-full w-9 items-center justify-center text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
                              >
                                −
                              </button>

                              <span className="flex h-full min-w-9 items-center justify-center border-x border-gray-200 text-sm font-medium">
                                {item.quantity}
                              </span>

                              <button
                                type="button"
                                onClick={() => increaseQuantity(index)}
                                disabled={item.quantity >= item.stock}
                                className="flex h-full w-9 items-center justify-center text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* PRICE */}
                          <div className="text-right">
                            <p className="text-lg font-bold tracking-tight text-gray-900 sm:text-xl">
                              Rs.{" "}
                              {(item.price * item.quantity).toLocaleString()}
                            </p>

                            <p className="mt-0.5 text-xs text-gray-400">
                              Rs. {item.price.toLocaleString()} each
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CONTINUE SHOPPING */}
              <Link
                href={`/shop/${slug}`}
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-black"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M19 12H5" />
                  <path d="M12 19l-7-7 7-7" />
                </svg>
                Continue shopping
              </Link>
            </section>

            {/* ORDER SUMMARY */}
            <aside>
              <div className="sticky top-28 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                {/* SUMMARY HEADER */}
                <div className="border-b border-gray-100 px-6 py-5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">
                      Order Summary
                    </h2>

                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      >
                        <path d="M3 3h2l2.5 12.5a2 2 0 0 0 2 1.5h7.8a2 2 0 0 0 1.9-1.4L21 8H6" />
                        <circle cx="10" cy="20" r="1" />
                        <circle cx="18" cy="20" r="1" />
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="px-6 py-6">
                  {/* ITEMS */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        Items ({totalItems})
                      </span>
                      <span className="font-medium text-gray-900">
                        Rs. {subtotal.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Shipping</span>
                      <span className="font-medium text-gray-700">
                        Calculated at checkout
                      </span>
                    </div>
                  </div>

                  <div className="my-6 border-t border-dashed border-gray-200" />

                  {/* TOTAL */}
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Total
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        Including selected items
                      </p>
                    </div>

                    <p className="text-2xl font-bold tracking-tight text-gray-900">
                      Rs. {subtotal.toLocaleString()}
                    </p>
                  </div>

                  {/* CHECKOUT */}
                  <Link
                    href={`/shop/${slug}/checkout`}
                    className="group mt-7 flex w-full items-center justify-center gap-3 rounded-xl bg-black px-6 py-4 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 hover:shadow-lg"
                  >
                    Proceed to Checkout

                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    >
                      <path d="M5 12h14" />
                      <path d="M13 6l6 6-6 6" />
                    </svg>
                  </Link>

                  {/* TRUST */}
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-[#f7f7f5] p-3 text-center">
                      <svg
                        className="mx-auto mb-1.5 text-gray-600"
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

                      <p className="text-[10px] font-medium text-gray-500">
                        Secure Checkout
                      </p>
                    </div>

                    <div className="rounded-xl bg-[#f7f7f5] p-3 text-center">
                      <svg
                        className="mx-auto mb-1.5 text-gray-600"
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
                        <path d="M9 18v-3h6v3" />
                      </svg>

                      <p className="text-[10px] font-medium text-gray-500">
                        Quality Products
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
