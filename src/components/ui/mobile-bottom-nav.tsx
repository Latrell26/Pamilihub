"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { HeaderUser } from "@/lib/auth/header-user";
import { useCart } from "@/lib/cart/cart-context";
import {
  Utensils,
  Receipt,
  User,
  ShoppingBag,
  ClipboardList,
  Store,
  ShieldCheck,
  FolderKanban,
  Search,
} from "lucide-react";

function MobileBottomNavContent({
  user,
}: {
  user: HeaderUser | null;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { itemCount } = useCart();

  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isStorePage = pathname.startsWith("/stores/");
  const isCheckoutPage = pathname.startsWith("/checkout");

  const fromParam = searchParams.get("from");
  const storeIdParam = searchParams.get("storeId") || searchParams.get("store");

  const isSearchPage = pathname.startsWith("/search");
  const isReorderCart =
    pathname.startsWith("/cart") &&
    (searchParams.get("reorder") === "1" || searchParams.has("reorder"));
  // Erase the mobile navbar if user clicked the searchbar in delicacies or in stores.
  // Do NOT erase it when user clicked the icon searchbar in the navbar (e.g. from === "nav").
  const hideOnSearch =
    isSearchPage &&
    (fromParam === "delicacies" ||
      fromParam === "bar" ||
      fromParam === "store" ||
      Boolean(storeIdParam));

  // Hide mobile bottom navigation on login, register, store menu pages, checkout, search page when opened via searchbar, and reorder cart
  if (isAuthPage || isStorePage || isCheckoutPage || hideOnSearch || isReorderCart) {
    return null;
  }

  // If user is a seller or admin, show their corresponding main workspaces
  const isSeller = user?.role === "seller";
  const isAdmin = user?.role === "admin";

  const navItems = isSeller
    ? [
        { href: "/seller/orders", label: "Orders", icon: ClipboardList, badge: undefined },
        { href: "/seller/products", label: "Products", icon: Store, badge: undefined },
        { href: "/profile", label: "Account", icon: User, badge: undefined },
      ]
    : isAdmin
    ? [
        { href: "/admin/sellers", label: "Approvals", icon: ShieldCheck, badge: undefined },
        { href: "/admin/categories", label: "Categories", icon: FolderKanban, badge: undefined },
        { href: "/products", label: "Catalog", icon: Utensils, badge: undefined },
        { href: "/profile", label: "Account", icon: User, badge: undefined },
      ]
    : [
        { href: "/products", label: "Delicacies", icon: Utensils, badge: undefined },
        { href: "/cart", label: "Cart", icon: ShoppingBag, badge: itemCount },
        { href: "/search?from=nav", label: "Search", icon: Search, badge: undefined },
        { href: "/orders", label: "Orders", icon: Receipt, badge: undefined },
        { href: user ? "/profile" : "/login", label: user ? "Account" : "Sign In", icon: User, badge: undefined },
      ];

  const gridCols = isSeller ? "grid-cols-3" : isAdmin ? "grid-cols-4" : "grid-cols-5";

  return (
    /*
      Floating pill, Foodpanda-style.
      Height = 4rem (h-16) + bottom gap, which is what --bottom-nav-h
      in globals.css accounts for, so the cart/checkout bars sit above it.
    */
    <nav
      className="lg:hidden fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pointer-events-none"
      aria-label="Mobile and Tablet Navigation"
    >
      <div
        className={`pointer-events-auto mx-auto grid ${gridCols} h-16 max-w-lg items-stretch gap-1 rounded-full border border-border/60 bg-card/95 p-1.5 shadow-[0_6px_24px_rgba(0,0,0,0.12)] backdrop-blur-lg`}
      >
        {navItems.map((item) => {
          const basePath = item.href.split("?")[0];
          const isActive =
            pathname === basePath ||
            (basePath !== "/" && pathname.startsWith(basePath));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex flex-col items-center justify-center gap-0.5 rounded-full px-1 transition-all active:scale-95 ${
                isActive
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="relative">
                <Icon
                  className="h-5 w-5 shrink-0"
                  strokeWidth={isActive ? 2.5 : 2}
                  aria-hidden="true"
                />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -right-3 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1 text-[11px] font-black leading-none text-background shadow-sm">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </div>
              <span
                className={`max-w-[72px] truncate text-center text-[11px] leading-tight tracking-tight ${
                  isActive ? "font-extrabold" : "font-semibold"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default function MobileBottomNav({
  user,
}: {
  user: HeaderUser | null;
}) {
  return (
    <Suspense fallback={null}>
      <MobileBottomNavContent user={user} />
    </Suspense>
  );
}