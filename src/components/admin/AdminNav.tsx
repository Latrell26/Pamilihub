"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/admin/orders", label: "Orders & Payments", icon: "📦" },
    { href: "/admin/products", label: "Product Moderation", icon: "🥧" },
    { href: "/admin/sellers", label: "Seller Approvals", icon: "🛡️" },
    { href: "/admin/categories", label: "Categories", icon: "📁" },
    { href: "/admin/users", label: "User Directory", icon: "👥" },
  ];

  return (
    <div className="border-b border-border bg-card/60 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
      <div className="flex items-center gap-1 overflow-x-auto py-2.5 no-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
