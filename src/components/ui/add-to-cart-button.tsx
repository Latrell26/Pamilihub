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
};

export function AddToCartButton({
  productId,
  name,
  price,
  stock,
  sellerId,
  sellerName,
  imageUrl,
}: AddToCartButtonProps) {
  const { addItem, itemCount } = useCart();
  const [added, setAdded] = useState(false);

  if (stock === 0) {
    return (
      <button
        disabled
        className="w-full rounded-md border border-transparent bg-muted px-4 py-2 text-sm font-semibold text-muted-foreground shadow disabled:opacity-70"
      >
        Out of stock
      </button>
    );
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        addItem({ productId, name, price, stock, sellerId, sellerName, imageUrl });
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
      }}
      className={`w-full rounded-md border px-4 py-2 text-sm font-semibold shadow transition-all ${
        added
          ? "border-transparent bg-success text-success-foreground"
          : "border-transparent bg-primary text-primary-foreground hover:bg-primary/90"
      }`}
    >
      {added ? "Added!" : "Add to cart"}
    </button>
  );
}
