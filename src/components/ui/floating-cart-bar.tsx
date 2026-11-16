"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart/cart-context";
import { ArrowRight } from "lucide-react";

export default function FloatingCartBar() {
  const pathname = usePathname();
  const { items } = useCart();

  const isStorePage = pathname.startsWith("/stores/");
  const isProductDetailPage =
    pathname.startsWith("/products/") && pathname !== "/products";

  // Only display on store pages
  if (
    !isStorePage ||
    pathname === "/cart" ||
    pathname === "/checkout" ||
    pathname === "/login" ||
    pathname === "/register" ||
    isProductDetailPage
  ) {
    return null;
  }

  // Extract current store ID from pathname (/stores/<storeId>)
  const storeIdMatch = pathname.match(/^\/stores\/([^/]+)/);
  const currentStoreId = storeIdMatch ? storeIdMatch[1] : null;

  if (!currentStoreId) {
    return null;
  }

  // Filter items specifically for this store
  const storeItems = items.filter((item) => item.sellerId === currentStoreId);
  const storeItemCount = storeItems.reduce((sum, item) => sum + item.quantity, 0);

  // If no items were added for this specific store, keep the bar hidden
  if (storeItemCount === 0) {
    return null;
  }

  const storeSubtotal = storeItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const storeName =
    storeItems[0]?.sellerName ||
    (typeof window !== "undefined"
      ? localStorage.getItem("pamilihub_active_store_name") ?? ""
      : "");

  return (
    <div className="fixed bottom-4 left-0 right-0 z-30 px-4 pointer-events-none md:hidden animate-in slide-in-from-bottom-5 duration-200">
      <Link
        href={`/cart?store=${currentStoreId}`}
        className="pointer-events-auto flex items-center w-full max-w-md mx-auto p-3 rounded-2xl bg-primary text-primary-foreground shadow-xl shadow-primary/25 border border-primary/20 active:scale-[0.98] transition-transform"
      >
        {/* Left — item count badge for this specific store */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 text-sm font-extrabold">
          {storeItemCount}
        </div>

        {/* Center — "View your cart" + store name */}
        <div className="flex flex-1 flex-col items-center justify-center px-2 min-w-0">
          <span className="font-bold text-xs leading-tight">View your cart</span>
          {storeName && (
            <span className="text-[10px] text-white/80 leading-tight truncate max-w-[160px]">
              {storeName}
            </span>
          )}
        </div>

        {/* Right — amount for this store + proceed arrow */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="font-extrabold text-sm tracking-tight">
            ₱{storeSubtotal.toFixed(2)}
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20">
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </Link>
    </div>
  );
}
