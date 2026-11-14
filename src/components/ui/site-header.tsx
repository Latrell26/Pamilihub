"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signoutAction } from "@/modules/accounts/actions";
import type { HeaderUser } from "@/lib/auth/header-user";
import { useCart } from "@/lib/cart/cart-context";
import { ShoppingBag, MapPin, Sparkles } from "lucide-react";

export default function SiteHeader({
  user,
}: Readonly<{
  user: HeaderUser | null;
}>) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";
  const { itemCount } = useCart();

  // Hide header completely on login and register pages
  if (isAuthPage) {
    return null;
  }

  const roleLinks: Record<string, Array<{ href: string; label: string }>> = {
    customer: [
      { href: "/products", label: "Delicacies" },
      { href: "/orders", label: "My Orders" },
    ],
    seller: [
      { href: "/seller/orders", label: "Orders" },
      { href: "/seller/products", label: "Products" },
    ],
    admin: [
      { href: "/admin/dashboard", label: "Dashboard" },
      { href: "/admin/orders", label: "Orders" },
      { href: "/admin/products", label: "Products" },
      { href: "/admin/sellers", label: "Approvals" },
      { href: "/admin/categories", label: "Categories" },
      { href: "/admin/users", label: "Users" },
    ],
  };

  const links = user ? roleLinks[user.role] ?? [{ href: "/products", label: "Delicacies" }] : [
    { href: "/products", label: "Delicacies" },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur-md">
      {/* Top Location Bar (PWA Food Delivery feel) */}
      <div className="bg-primary/5 border-b border-primary/10 py-1 px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1.5 mx-auto sm:mx-0 truncate">
            <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="font-semibold text-foreground truncate">Delivering to San Pablo City, Laguna</span>
            <span className="hidden sm:inline text-primary/60">• Flat ₱50 Delivery Fee</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-primary/80">
            <Sparkles className="w-3 h-3" />
            <span className="font-medium">Direct from Local Food Producers</span>
          </div>
        </div>
      </div>

      {/* Main App Bar */}
{/* Main App Bar: desktop only (>= 1024px) */}
<div className="hidden lg:flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 items-center justify-between gap-4">        {/* Brand / Logo */}
        <div className="flex items-center gap-6">
          <Link
          href={user?.role === "customer" ? "/products" : "/"}
          className="hidden lg:flex items-center gap-2.5 group font-extrabold text-base sm:text-lg tracking-tight text-foreground transition-colors"
        >
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-black text-sm shadow-md shadow-primary/25 group-hover:scale-105 transition-transform">
            P
          </div>
          <div className="flex flex-col">
            <span className="leading-tight font-black text-foreground">Pamilihub</span>
            <span className="text-[9px] font-semibold text-primary uppercase tracking-wider">Food Delicacies</span>
          </div>
        </Link>

          {/* Desktop Nav Links (Large screens >= 1024px) */}
          <nav className="hidden lg:flex items-center gap-1">
            {links.map((l) => {
              const active = pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href));
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right side actions — Desktop only (>= 1024px). On phone & tablet, Cart and Account belong in the bottom navbar */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Cart Icon Button - only for authenticated customers */}
          {user?.role === "customer" && (
            <Link
              href="/cart"
              className="relative flex items-center justify-center w-10 h-10 rounded-xl border border-border bg-card text-foreground hover:bg-muted transition-all active:scale-95"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-primary text-[10px] font-extrabold text-primary-foreground shadow-md animate-in zoom-in-50">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>
          )}

          {/* User Section */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/profile"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-card text-xs font-semibold text-foreground hover:bg-muted transition-colors"
              >
                <div className="h-5 w-5 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-[10px] uppercase">
                  {user.role[0]}
                </div>
                <span className="capitalize">{user.role}</span>
              </Link>
              <form action={signoutAction}>
                <button
                  type="submit"
                  className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  Sign out
                </button>
              </form>
            </div>
          ) : !isAuthPage ? (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="px-3.5 py-1.5 rounded-xl bg-primary text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all active:scale-95"
              >
                Sign Up
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
