"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Store,
  ShieldCheck,
  FolderKanban,
  Users,
} from "lucide-react";

export default function AdminNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/orders", label: "Orders & Audit", icon: ClipboardList },
    { href: "/admin/sellers", label: "Seller Approvals", icon: ShieldCheck },
    { href: "/admin/products", label: "Product Moderation", icon: Store },
    { href: "/admin/categories", label: "Categories", icon: FolderKanban },
    { href: "/admin/users", label: "User Directory", icon: Users },
  ];

  return (
    <div className="sticky top-0 z-30 border-b border-border/60 bg-background/95 backdrop-blur-md -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-2.5 mb-6 sm:mb-8">
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-7xl mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
