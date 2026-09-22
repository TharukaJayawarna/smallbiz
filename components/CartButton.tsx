"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface CartItem {
  quantity?: number;
}

interface CartButtonProps {
  href: string;
  slug: string;
}

export default function CartButton({
  href,
  slug,
}: CartButtonProps) {
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    if (!slug) return;

    const cartKey = `cart_${slug}`;

    const updateCartCount = () => {
      try {
        const storedCart = localStorage.getItem(cartKey);

        if (!storedCart) {
          setItemCount(0);
          return;
        }

        const cart: CartItem[] = JSON.parse(storedCart);

        if (!Array.isArray(cart)) {
          setItemCount(0);
          return;
        }

        // Total quantity
        // Example:
        // Product A = 2
        // Product B = 3
        // Total = 5
        const count = cart.reduce(
          (total, item) =>
            total + Math.max(0, Number(item.quantity || 0)),
          0
        );

        setItemCount(count);
      } catch {
        setItemCount(0);
      }
    };

    // Initial load
    updateCartCount();

    // Other tabs/windows
    window.addEventListener("storage", updateCartCount);

    // Custom event if AddToCart dispatches it
    window.addEventListener("cartUpdated", updateCartCount);

    // Fallback polling.
    // This makes the badge update even if AddToCart
    // doesn't dispatch a custom event.
    const interval = window.setInterval(updateCartCount, 500);

    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cartUpdated", updateCartCount);
      window.clearInterval(interval);
    };
  }, [slug]);

  return (
    <Link
      href={href}
      aria-label={`Shopping cart${itemCount > 0 ? `, ${itemCount} items` : ""}`}
      className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/20 sm:px-3.5 sm:text-sm"
    >
      <div className="relative">
        {/* Cart Icon */}
        <svg
          className="h-4 w-4 sm:h-[18px] sm:w-[18px]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M3 3h2l2.4 12.2a2 2 0 002 1.6h7.9a2 2 0 001.9-1.4L21 8H6"
          />

          <circle
            cx="10"
            cy="20"
            r="1.2"
            fill="currentColor"
          />

          <circle
            cx="18"
            cy="20"
            r="1.2"
            fill="currentColor"
          />
        </svg>

        {/* ITEM COUNT */}
        {itemCount > 0 && (
          <span
            className="
              absolute
              -right-2.5
              -top-2.5
              flex
              h-[18px]
              min-w-[18px]
              items-center
              justify-center
              rounded-full
              bg-red-500
              px-1
              text-[9px]
              font-extrabold
              leading-none
              text-white
              shadow-sm
              ring-2
              ring-slate-900
            "
          >
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        )}
      </div>

      <span>Cart</span>
    </Link>
  );
}