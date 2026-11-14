"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart/cart-context";

type AddToCartButtonProps = {
  productId: string;
  name: string;
  price: number;
  stock: number;
  sellerId: string;
  sellerName: string;
  imageUrl: string | null;
  size?: "sm" | "md";
  /** Current user role — hides button for seller & admin. Defaults to customer. */
  userRole?: string | null;
};

export function AddToCartButton({
  productId,
  name,
  price,
  stock,
  sellerId,
  sellerName,
  imageUrl,
  size = "md",
  userRole,
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  // Sellers and admins should not see the Add to Cart button
  if (userRole === "seller" || userRole === "admin") {
    return null;
  }

  if (stock === 0) {
    return (
      <button
        disabled
        className="w-full rounded-lg border border-border bg-muted/60 px-3 py-2 text-xs font-semibold text-muted-foreground cursor-not-allowed"
      >
        Out of Stock
      </button>
    );
  }

  const py = size === "sm" ? "py-1.5 text-xs" : "py-2 text-xs sm:text-sm";

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        addItem({ productId, name, price, stock, sellerId, sellerName, imageUrl });
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
      }}
      className={`w-full rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] ${py} ${
        added
          ? "bg-emerald-600 text-white"
          : "bg-primary text-primary-foreground hover:bg-primary/90"
      }`}
    >
      {added ? (
        <>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          <span>Added to Cart!</span>
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>Add to Cart</span>
        </>
      )}
    </button>
  );
}
