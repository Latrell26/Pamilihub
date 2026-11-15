"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";

export default function MobileBottomNav({
  user,
}: {
  user: HeaderUser | null;
}) {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isStorePage = pathname.startsWith("/stores/");

  // Hide mobile bottom navigation on login, register, and store menu pages
  if (isAuthPage || isStorePage) {
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
        { href: "/orders", label: "Orders", icon: Receipt, badge: undefined },
        { href: user ? "/profile" : "/login", label: user ? "Account" : "Sign In", icon: User, badge: undefined },
      ];

  const gridCols = isSeller ? "grid-cols-3" : "grid-cols-4";

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-lg border-t border-border shadow-lg safe-bottom"
      aria-label="Mobile and Tablet Navigation"
    >
      <div className={`grid ${gridCols} h-14 max-w-lg mx-auto items-center px-1`}>
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 py-1 px-1 rounded-xl transition-all ${
                isActive
                  ? "text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5 shrink-0" strokeWidth={isActive ? 2.5 : 2} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-primary text-[10px] font-black text-primary-foreground shadow-sm">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] leading-tight tracking-tight font-medium truncate max-w-[64px] text-center">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
