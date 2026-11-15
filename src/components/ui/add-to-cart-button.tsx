"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart/cart-context";
import { Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

type AddToCartButtonProps = {
  productId: string;
  name: string;
  price: number;
  stock: number;
  sellerId: string;
  sellerName: string;
  imageUrl: string | null;
  size?: "sm" | "md";
  /** "fab" = small round + button for menu rows. Default = full-width button. */
  variant?: "default" | "fab";
  /** Current user role — only customer can see and use. */
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
  variant = "default",
  userRole,
}: AddToCartButtonProps) {
  const { addItem, items } = useCart();
  const [added, setAdded] = useState(false);

  // Only authenticated customers can see and use the Add to Cart button
  if (userRole !== "customer") {
    return null;
  }

  const inCartQty = items.find((i) => i.productId === productId)?.quantity ?? 0;
  const isMaxReached = stock > 0 && inCartQty >= stock;

  // Round "+" button used on menu rows
  if (variant === "fab") {
    if (stock === 0) return null;

    const fabBase =
      "flex h-9 w-9 items-center justify-center rounded-full shadow-md ring-1 ring-black/5 transition active:scale-90";

    if (isMaxReached) {
      return (
        <button
          type="button"
          disabled
          aria-label={`${name}: maximum stock already in cart`}
          className={`${fabBase} cursor-not-allowed bg-white/80 text-muted-foreground`}
        >
          <Check className="h-4 w-4" strokeWidth={2.5} />
        </button>
      );
    }

    return (
      <button
        type="button"
        aria-label={`Add ${name} to cart`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (inCartQty >= stock) return;
          addItem({ productId, name, price, stock, sellerId, sellerName, imageUrl });
          setAdded(true);
          setTimeout(() => setAdded(false), 1200);
        }}
        className={`${fabBase} ${
          added ? "bg-emerald-600 text-white" : "bg-white text-foreground hover:bg-white/90"
        }`}
      >
        {added ? (
          <Check className="h-4 w-4" strokeWidth={3} />
        ) : (
          <Plus className="h-5 w-5" strokeWidth={2.5} />
        )}
        {inCartQty > 0 && !added && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-black text-primary-foreground">
            {inCartQty}
          </span>
        )}
      </button>
    );
  }

  if (stock === 0) {
    return (
      <Button
        disabled
        variant="outline"
        size={size === "sm" ? "sm" : "default"}
        className="w-full text-xs font-semibold text-muted-foreground cursor-not-allowed bg-muted/60"
      >
        Out of Stock
      </Button>
    );
  }

  if (isMaxReached) {
    return (
      <Button
        disabled
        variant="outline"
        size={size === "sm" ? "sm" : "default"}
        className="w-full text-xs font-semibold text-muted-foreground cursor-not-allowed bg-muted/60"
      >
        Max stock in cart
      </Button>
    );
  }

  return (
    <Button
      type="button"
      size={size === "sm" ? "sm" : "default"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (inCartQty >= stock) return;
        addItem({ productId, name, price, stock, sellerId, sellerName, imageUrl });
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
      }}
      className={`w-full transition-all flex items-center justify-center gap-1.5 ${
        added
          ? "bg-emerald-600 hover:bg-emerald-700 text-white"
          : "bg-primary text-primary-foreground hover:bg-primary/90"
      }`}
    >
      {added ? (
        <>
          <Check className="w-4 h-4 shrink-0" strokeWidth={2.5} />
          <span>Added to Cart!</span>
        </>
      ) : (
        <>
          <Plus className="w-3.5 h-3.5 shrink-0" strokeWidth={2.5} />
          <span>Add to Cart</span>
        </>
      )}
    </Button>
  );
}