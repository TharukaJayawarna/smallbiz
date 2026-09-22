"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

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

type PaymentMethod =
  | "COD"
  | "PAYHERE";

export default function CheckoutPage({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const [slug, setSlug] =
    useState("");

  const [cart, setCart] =
    useState<CartItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [
    customerName,
    setCustomerName,
  ] = useState("");

  const [
    customerPhone,
    setCustomerPhone,
  ] = useState("");

  const [
    customerEmail,
    setCustomerEmail,
  ] = useState("");

  const [city, setCity] =
    useState("");

  const [
    deliveryAddress,
    setDeliveryAddress,
  ] = useState("");

  const [
    customerNote,
    setCustomerNote,
  ] = useState("");

  const [
    paymentMethod,
    setPaymentMethod,
  ] =
    useState<PaymentMethod>("COD");

  const [error, setError] =
    useState("");

  useEffect(() => {
    params.then(({ slug }) => {
      setSlug(slug);

      const storedCart =
        localStorage.getItem(
          `cart_${slug}`
        );

      if (storedCart) {
        try {
          const parsed =
            JSON.parse(
              storedCart
            );

          if (
            Array.isArray(parsed)
          ) {
            setCart(parsed);
          } else {
            setCart([]);
          }
        } catch {
          setCart([]);
        }
      }

      setLoading(false);
    });
  }, [params]);

  const subtotal =
    cart.reduce(
      (total, item) =>
        total +
        item.price *
          item.quantity,
      0
    );

  const deliveryFee = 0;

  const total =
    subtotal + deliveryFee;

  const totalItems =
    cart.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );

  async function redirectToPayHere(
    payment: {
      action: string;
      fields: Record<
        string,
        string
      >;
    }
  ) {
    const form =
      document.createElement(
        "form"
      );

    form.method = "POST";
    form.action =
      payment.action;

    form.style.display = "none";

    Object.entries(
      payment.fields
    ).forEach(
      ([name, value]) => {
        const input =
          document.createElement(
            "input"
          );

        input.type = "hidden";
        input.name = name;
        input.value =
          String(value);

        form.appendChild(input);
      }
    );

    document.body.appendChild(
      form
    );

    form.submit();
  }

  async function placeOrder(
    event: FormEvent
  ) {
    event.preventDefault();

    setError("");

    if (cart.length === 0) {
      setError(
        "Your cart is empty."
      );
      return;
    }

    if (!customerName.trim()) {
      setError(
        "Please enter your full name."
      );
      return;
    }

    if (!customerPhone.trim()) {
      setError(
        "Please enter your phone number."
      );
      return;
    }

    if (!customerEmail.trim()) {
      setError(
        "Please enter your email address."
      );
      return;
    }

    if (!city.trim()) {
      setError(
        "Please enter your city."
      );
      return;
    }

    if (!deliveryAddress.trim()) {
      setError(
        "Please enter your delivery address."
      );
      return;
    }

    try {
      setSubmitting(true);

      const response =
        await fetch(
          `/api/store/${slug}/checkout`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              customerName:
                customerName.trim(),

              customerPhone:
                customerPhone.trim(),

              customerEmail:
                customerEmail
                  .trim()
                  .toLowerCase(),

              city:
                city.trim(),

              deliveryAddress:
                deliveryAddress.trim(),

              customerNote:
                customerNote.trim(),

              paymentMethod,

              items: cart.map(
                (item) => ({
                  productId:
                    item.productId,

                  quantity:
                    item.quantity,

                  size:
                    item.size,

                  color:
                    item.color,
                })
              ),
            }),
          }
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        setError(
          data.message ||
            "Failed to place order."
        );

        return;
      }

      /*
       * PAYHERE
       */
      if (
        data.paymentMethod ===
          "PAYHERE" &&
        data.payment
      ) {
        localStorage.removeItem(
          `cart_${slug}`
        );

        await redirectToPayHere(
          data.payment
        );

        return;
      }

      /*
       * COD
       */
      localStorage.removeItem(
        `cart_${slug}`
      );

      if (
        data.whatsappUrl
      ) {
        window.location.href =
          data.whatsappUrl;
      } else {
        setError(
          "Order was created, but WhatsApp could not be opened."
        );
      }
    } catch (error) {
      console.error(error);

      setError(
        "Something went wrong while placing your order."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f8f6]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-gray-200 border-t-black" />

          <p className="mt-4 text-sm text-gray-500">
            Loading checkout...
          </p>
        </div>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-[#f8f8f6]">
        <header className="border-b border-black/5 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
            <Link
              href={`/shop/${slug}`}
              className="text-lg font-bold tracking-tight text-gray-900"
            >
              Store
            </Link>
          </div>
        </header>

        <div className="mx-auto flex min-h-[75vh] max-w-3xl items-center justify-center px-6 py-16">
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/5">
              <svg
                className="h-9 w-9 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1 5h13M9 21h.01M18 21h.01"
                />
              </svg>
            </div>

            <h1 className="mt-7 text-3xl font-bold tracking-tight text-gray-900">
              Your cart is empty
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
              There are no products in your cart yet. Browse the store and add something you love.
            </p>

            <Link
              href={`/shop/${slug}`}
              className="mt-8 inline-flex items-center rounded-full bg-black px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f8f6] text-gray-900">
      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link
            href={`/shop/${slug}`}
            className="text-xl font-bold tracking-tight"
          >
            Store
          </Link>

          <Link
            href={`/shop/${slug}/cart`}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-black"
          >
            ← Back to Cart
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-12">
        <div className="mb-10">
          <div className="flex items-center gap-3 text-xs font-medium text-gray-400">
            <Link
              href={`/shop/${slug}`}
              className="hover:text-gray-700"
            >
              Store
            </Link>

            <span>/</span>

            <Link
              href={`/shop/${slug}/cart`}
              className="hover:text-gray-700"
            >
              Cart
            </Link>

            <span>/</span>

            <span className="text-gray-900">
              Checkout
            </span>
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
            Checkout
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Complete your details and choose your payment method.
          </p>
        </div>

        <div className="mb-10 hidden items-center sm:flex">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
              ✓
            </div>

            <span className="text-sm font-medium">
              Cart
            </span>
          </div>

          <div className="mx-4 h-px w-16 bg-black" />

          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
              2
            </div>

            <span className="text-sm font-semibold">
              Checkout
            </span>
          </div>

          <div className="mx-4 h-px w-16 bg-gray-200" />

          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-400">
              3
            </div>

            <span className="text-sm text-gray-400">
              Confirmation
            </span>
          </div>
        </div>

        <form
          onSubmit={placeOrder}
          className="grid gap-8 lg:grid-cols-[1fr_420px]"
        >
          <div className="space-y-6">
            <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-7">
                <h2 className="text-xl font-bold">
                  Customer Information
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Enter your contact and delivery details.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold">
                    Full Name
                  </label>

                  <input
                    value={customerName}
                    onChange={(e) =>
                      setCustomerName(
                        e.target.value
                      )
                    }
                    placeholder="Your full name"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-black focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Phone Number
                  </label>

                  <input
                    value={customerPhone}
                    onChange={(e) =>
                      setCustomerPhone(
                        e.target.value
                      )
                    }
                    placeholder="0771234567"
                    type="tel"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-black focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Email
                  </label>

                  <input
                    value={customerEmail}
                    onChange={(e) =>
                      setCustomerEmail(
                        e.target.value
                      )
                    }
                    placeholder="you@example.com"
                    type="email"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-black focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    City
                  </label>

                  <input
                    value={city}
                    onChange={(e) =>
                      setCity(
                        e.target.value
                      )
                    }
                    placeholder="Colombo"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-black focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Delivery Address
                  </label>

                  <input
                    value={
                      deliveryAddress
                    }
                    onChange={(e) =>
                      setDeliveryAddress(
                        e.target.value
                      )
                    }
                    placeholder="House number, street..."
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-black focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold">
                    Order Note{" "}
                    <span className="font-normal text-gray-400">
                      (Optional)
                    </span>
                  </label>

                  <textarea
                    value={customerNote}
                    onChange={(e) =>
                      setCustomerNote(
                        e.target.value
                      )
                    }
                    placeholder="Any special instructions..."
                    rows={4}
                    className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-black focus:bg-white"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-7">
                <h2 className="text-xl font-bold">
                  Payment Method
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Choose how you would like to pay.
                </p>
              </div>

              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() =>
                    setPaymentMethod(
                      "COD"
                    )
                  }
                  className={`w-full rounded-2xl border p-5 text-left transition ${
                    paymentMethod ===
                    "COD"
                      ? "border-black bg-gray-50 ring-2 ring-black"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border ${
                        paymentMethod ===
                        "COD"
                          ? "border-black"
                          : "border-gray-300"
                      }`}
                    >
                      {paymentMethod ===
                        "COD" && (
                        <div className="h-2.5 w-2.5 rounded-full bg-black" />
                      )}
                    </div>

                    <div>
                      <p className="font-semibold">
                        Cash on Delivery
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        Pay when your order is delivered.
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setPaymentMethod(
                      "PAYHERE"
                    )
                  }
                  className={`w-full rounded-2xl border p-5 text-left transition ${
                    paymentMethod ===
                    "PAYHERE"
                      ? "border-black bg-gray-50 ring-2 ring-black"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border ${
                        paymentMethod ===
                        "PAYHERE"
                          ? "border-black"
                          : "border-gray-300"
                      }`}
                    >
                      {paymentMethod ===
                        "PAYHERE" && (
                        <div className="h-2.5 w-2.5 rounded-full bg-black" />
                      )}
                    </div>

                    <div>
                      <p className="font-semibold">
                        PayHere
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        Secure online payment using PayHere.
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              {paymentMethod ===
                "PAYHERE" && (
                <div className="mt-5 rounded-2xl bg-gray-50 p-4">
                  <p className="text-sm font-semibold">
                    Secure online payment
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    You will be redirected to PayHere to securely complete your payment.
                  </p>
                </div>
              )}
            </section>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                {error}
              </div>
            )}
          </div>

          <div>
            <div className="sticky top-24 overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm">
              <div className="border-b border-gray-100 p-6">
                <h2 className="text-lg font-bold">
                  Order Summary
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {totalItems}{" "}
                  {totalItems === 1
                    ? "item"
                    : "items"}
                </p>
              </div>

              <div className="max-h-[360px] space-y-4 overflow-auto p-6">
                {cart.map(
                  (item) => (
                    <div
                      key={`${item.productId}-${item.size}-${item.color}`}
                      className="flex gap-4"
                    >
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                        {item.image ? (
                          <img
                            src={
                              item.image
                            }
                            alt={
                              item.name
                            }
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">
                          {item.name}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          Qty:{" "}
                          {
                            item.quantity
                          }
                        </p>

                        {item.size && (
                          <p className="text-xs text-gray-500">
                            Size:{" "}
                            {
                              item.size
                            }
                          </p>
                        )}

                        {item.color && (
                          <p className="text-xs text-gray-500">
                            Color:{" "}
                            {
                              item.color
                            }
                          </p>
                        )}
                      </div>

                      <p className="text-sm font-semibold">
                        Rs.{" "}
                        {(
                          item.price *
                          item.quantity
                        ).toLocaleString()}
                      </p>
                    </div>
                  )
                )}
              </div>

              <div className="border-t border-gray-100 p-6">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Subtotal
                    </span>

                    <span className="font-medium">
                      Rs.{" "}
                      {subtotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Delivery
                    </span>

                    <span className="font-medium">
                      Rs.{" "}
                      {deliveryFee.toLocaleString()}
                    </span>
                  </div>

                  <div className="my-4 h-px bg-gray-100" />

                  <div className="flex items-center justify-between">
                    <span className="font-semibold">
                      Total
                    </span>

                    <span className="text-xl font-bold">
                      Rs.{" "}
                      {total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-6 w-full rounded-2xl bg-black px-5 py-4 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting
                    ? paymentMethod ===
                      "PAYHERE"
                      ? "Redirecting to PayHere..."
                      : "Placing Order..."
                    : paymentMethod ===
                      "PAYHERE"
                    ? "Continue to PayHere"
                    : "Place Order"}
                </button>

                <p className="mt-4 text-center text-xs leading-5 text-gray-400">
                  By placing your order, you agree to the store's terms and conditions.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}