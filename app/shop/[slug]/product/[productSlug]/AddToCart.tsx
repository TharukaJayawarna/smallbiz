"use client";

import { useState } from "react";

interface Product {
  id: string;
  name: string;
  price: number;
  discountPrice: number | null;
  stock: number;
  images: string[];
  sizes: string[];
  colors: string[];
  businessSlug: string;
}

export default function AddToCart({
  product,
}: {
  product: Product;
}) {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  function addToCart() {
    const cartKey = `cart_${product.businessSlug}`;

    const existingCart = JSON.parse(
      localStorage.getItem(cartKey) || "[]"
    );

    const existingIndex = existingCart.findIndex(
      (item: {
        productId: string;
        size: string;
        color: string;
      }) =>
        item.productId === product.id &&
        item.size === selectedSize &&
        item.color === selectedColor
    );

    if (existingIndex >= 0) {
      existingCart[existingIndex].quantity = Math.min(
        existingCart[existingIndex].quantity + quantity,
        product.stock
      );
    } else {
      existingCart.push({
        productId: product.id,
        name: product.name,
        price: product.discountPrice ?? product.price,
        image: product.images?.[0] || "",
        size: selectedSize,
        color: selectedColor,
        quantity,
        stock: product.stock,
      });
    }

    localStorage.setItem(
      cartKey,
      JSON.stringify(existingCart)
    );

    setMessage("Product added to cart!");
    

    setTimeout(() => {
      setMessage("");
    }, 3000);
  }

  return (
    <div className="mt-8 space-y-7">

      {/* ================= SIZE ================= */}
      {product.sizes?.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">
              Select Size
            </h3>

            {selectedSize && (
              <span className="text-xs text-gray-400">
                Selected: {selectedSize}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`min-w-12 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                  selectedSize === size
                    ? "border-black bg-black text-white shadow-sm"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ================= COLOR ================= */}
      {product.colors?.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">
              Select Color
            </h3>

            {selectedColor && (
              <span className="text-xs text-gray-400">
                Selected: {selectedColor}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {product.colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                  selectedColor === color
                    ? "border-black bg-black text-white shadow-sm"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ================= QUANTITY ================= */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">
            Quantity
          </h3>

          <span className="text-xs text-gray-400">
            {product.stock} available
          </span>
        </div>

        <div className="flex h-12 w-fit items-center overflow-hidden rounded-xl border border-gray-200 bg-white">
          {/* MINUS */}
          <button
            type="button"
            disabled={quantity <= 1}
            onClick={() =>
              setQuantity((value) =>
                Math.max(1, value - 1)
              )
            }
            className="flex h-full w-12 items-center justify-center text-xl text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
          >
            −
          </button>

          {/* NUMBER */}
          <span className="flex h-full min-w-14 items-center justify-center border-x border-gray-200 text-sm font-semibold text-gray-900">
            {quantity}
          </span>

          {/* PLUS */}
          <button
            type="button"
            disabled={quantity >= product.stock}
            onClick={() =>
              setQuantity((value) =>
                Math.min(product.stock, value + 1)
              )
            }
            className="flex h-full w-12 items-center justify-center text-xl text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
          >
            +
          </button>
        </div>
      </div>

      {/* ================= ADD TO CART ================= */}
      <button
        type="button"
        onClick={addToCart}
        className="group flex w-full items-center justify-center gap-3 rounded-xl bg-black px-6 py-4 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 hover:shadow-lg"
      >
        {/* CART ICON */}
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M3 3h2l2.5 12.5a2 2 0 0 0 2 1.5h7.8a2 2 0 0 0 1.9-1.4L21 8H6" />
          <circle cx="10" cy="20" r="1" />
          <circle cx="18" cy="20" r="1" />
        </svg>

        <span>Add to Cart</span>

        {/* ARROW */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="transition-transform duration-300 group-hover:translate-x-1"
        >
          <path d="M5 12h14" />
          <path d="M13 6l6 6-6 6" />
        </svg>
      </button>

      {/* ================= SUCCESS MESSAGE ================= */}
      {message && (
        <div className="flex items-center justify-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>

          {message}
        </div>
      )}
    </div>
  );
}
