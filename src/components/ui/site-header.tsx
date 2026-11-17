"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signoutAction } from "@/modules/accounts/actions";
import type { HeaderUser } from "@/lib/auth/header-user";
import { useCart } from "@/lib/cart/cart-context";
import {
  ShoppingBag,
  Utensils,
  Receipt,
  ClipboardList,
  Store,
  LayoutDashboard,
  ShieldCheck,
  FolderKanban,
  Users,
  LogOut,
  User,
} from "lucide-react";

export default function SiteHeader({
  user,
}: Readonly<{
  user: HeaderUser | null;
}>) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isStorePage = pathname.startsWith("/stores/");
  const isSearchPage = pathname === "/search";
  const { itemCount } = useCart();

  // Hide header completely on login, register, search, and store menu pages
  if (isAuthPage || isStorePage || isSearchPage) {
    return null;
  }

  const roleLinks: Record<string, Array<{ href: string; label: string; icon: React.ComponentType<{ className?: string }> }>> = {
    customer: [
      { href: "/products", label: "Delicacies", icon: Utensils },
      { href: "/orders", label: "My Orders", icon: Receipt },
    ],
    seller: [
      { href: "/seller/orders", label: "Store Orders", icon: ClipboardList },
      { href: "/seller/products", label: "Inventory", icon: Store },
    ],
    admin: [
      { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/orders", label: "Orders", icon: ClipboardList },
      { href: "/admin/products", label: "Products", icon: Store },
      { href: "/admin/sellers", label: "Approvals", icon: ShieldCheck },
      { href: "/admin/categories", label: "Categories", icon: FolderKanban },
      { href: "/admin/users", label: "Users", icon: Users },
    ],
  };

  const links = user
    ? roleLinks[user.role] ?? [{ href: "/products", label: "Delicacies", icon: Utensils }]
    : [{ href: "/products", label: "Delicacies", icon: Utensils }];

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 ">
      {/* Main Desktop & Tablet App Bar (>= 768px) */}
      <div className="hidden md:flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 items-center justify-between gap-6">
        {/* Brand / Logo + Navigation */}
        <div className="flex items-center gap-8">
          <Link
            href={user?.role === "seller" ? "/seller/orders" : user?.role === "admin" ? "/admin/dashboard" : "/products"}
            className="flex items-center gap-2.5 group transition-transform active:scale-95"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-black text-base shadow-md shadow-primary/25 transition-transform group-hover:scale-105">
              P
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-foreground leading-none">
                  Pamilihub
                </span>
                {user?.role === "seller" && (
                  <span className="rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-primary">
                    Merchant
                  </span>
                )}
                {user?.role === "admin" && (
                  <span className="rounded-full border border-red-500/25 bg-red-500/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-red-600">
                    Admin
                  </span>
                )}
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="flex items-center gap-1.5" aria-label="Main Navigation">
            {links.map((l) => {
              const active = pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href));
              const Icon = l.icon;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-extrabold transition-all cursor-pointer ${
                    active
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{l.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {/* Cart Icon Button - only for authenticated customers */}
          {user?.role === "customer" && (
            <Link
              href="/cart"
              className="relative flex items-center justify-center w-10 h-10 rounded-full border border-border/70 bg-card text-foreground hover:bg-muted transition-all active:scale-95 shadow-xs"
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
                className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-border/70 bg-card text-xs font-bold text-foreground hover:bg-muted transition-all active:scale-95 shadow-xs"
              >
                <div className="h-6 w-6 rounded-full bg-primary/10 text-primary font-black flex items-center justify-center text-[11px] uppercase">
                  {user.role[0]}
                </div>
                <div className="flex flex-col text-left">
                  <span className="capitalize leading-tight">{user.full_name || user.role}</span>
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase">{user.role}</span>
                </div>
              </Link>
              <form action={signoutAction}>
                <button
                  type="submit"
                  aria-label="Sign out"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-muted-foreground hover:text-red-600 hover:bg-red-500/10 transition-colors cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign out</span>
                </button>
              </form>
            </div>
          ) : !isAuthPage ? (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 rounded-full text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-sm shadow-primary/25 hover:bg-primary/90 transition-all active:scale-95"
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
