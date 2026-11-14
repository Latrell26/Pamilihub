"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart/cart-context";
import { ShoppingBag, ArrowRight } from "lucide-react";

export default function FloatingCartBar() {
  const pathname = usePathname();
  const { itemCount, subtotal } = useCart();
  const isProductDetailPage = pathname.startsWith("/products/") && pathname !== "/products";

  // Don't show floating cart if empty, or on cart/checkout/auth/product-detail pages
  if (
    itemCount === 0 ||
    pathname === "/cart" ||
    pathname === "/checkout" ||
    pathname === "/login" ||
    pathname === "/register" ||
    isProductDetailPage
  ) {
    return null;
  }

  return (
    <div className="fixed bottom-16 sm:bottom-6 left-0 right-0 z-30 px-4 pointer-events-none md:hidden animate-in slide-in-from-bottom-5 duration-200">
      <Link
        href="/cart"
        className="pointer-events-auto flex items-center justify-between gap-3 w-full max-w-md mx-auto p-3.5 rounded-2xl bg-primary text-primary-foreground shadow-xl shadow-primary/25 border border-primary/20 active:scale-[0.98] transition-transform"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 font-bold text-xs shrink-0">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-bold text-xs leading-none">View Cart ({itemCount})</span>
            <span className="text-[10px] text-white/80 leading-tight">
              {itemCount} delicacy item{itemCount !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-extrabold text-sm tracking-tight">
            ₱{subtotal.toFixed(2)}
          </span>
          <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-white/20 text-xs font-bold">
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </Link>
    </div>
  );
}
