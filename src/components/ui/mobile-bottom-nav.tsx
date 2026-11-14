"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { HeaderUser } from "@/lib/auth/header-user";
import {
  Home,
  Utensils,
  Receipt,
  User,
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

  // If user is a seller or admin, show their corresponding main workspaces
  const isSeller = user?.role === "seller";
  const isAdmin = user?.role === "admin";

  const navItems = isSeller
    ? [
        { href: "/seller/orders", label: "Orders", icon: ClipboardList },
        { href: "/seller/products", label: "Products", icon: Store },
        { href: "/products", label: "Catalog", icon: Utensils },
        { href: "/profile", label: "Account", icon: User },
      ]
    : isAdmin
    ? [
        { href: "/admin/sellers", label: "Approvals", icon: ShieldCheck },
        { href: "/admin/categories", label: "Categories", icon: FolderKanban },
        { href: "/products", label: "Catalog", icon: Utensils },
        { href: "/profile", label: "Account", icon: User },
      ]
    : [
        { href: "/", label: "Home", icon: Home },
        { href: "/products", label: "Delicacies", icon: Utensils },
        { href: "/orders", label: "Orders", icon: Receipt },
        { href: user ? "/profile" : "/login", label: user ? "Account" : "Sign In", icon: User },
      ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-lg border-t border-border shadow-lg safe-bottom"
      aria-label="Mobile Navigation"
    >
      <div className="grid grid-cols-4 h-14 max-w-md mx-auto items-center px-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-xl transition-all ${
                isActive
                  ? "text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] leading-tight tracking-tight font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
