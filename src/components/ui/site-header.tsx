"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signoutAction } from "@/modules/accounts/actions";
import type { HeaderUser } from "@/lib/auth/header-user";
import { useCart } from "@/lib/cart/cart-context";

export default function SiteHeader({
  user,
}: Readonly<{
  user: HeaderUser | null;
}>) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";
  const { items, itemCount } = useCart();

  const roleLinks: Record<string, Array<{ href: string; label: string }>> = {
    customer: [{ href: "/products", label: "Catalog" }],
    seller: [
      { href: "/seller/products", label: "My Products" },
      { href: "/seller/orders", label: "Orders" },
    ],
    admin: [
      { href: "/admin/categories", label: "Categories" },
      { href: "/admin/sellers", label: "Seller Approvals" },
    ],
  };

  const links = user ? roleLinks[user.role] ?? [] : [];

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="font-bold text-lg tracking-tight">
            Pamilihub
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-4 text-sm">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {l.label}
            </Link>
          ))}
          {user && (
            <Link
              href="/profile"
              className="font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Profile
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2">
          {user && (
            <>
              <Link
                href="/cart"
                className="relative flex items-center justify-center w-8 h-8 rounded-full border border-border bg-background hover:bg-muted transition-colors"
                title="Cart"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="6" cy="19" r="1" />
                  <circle cx="18" cy="19" r="1" />
                  <path d="M3 17l8-12h4l8 12" />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border border-background bg-primary px-1 text-[10px] text-primary-foreground font-bold leading-none">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </Link>
              <form action={signoutAction} className="ml-2">
                <button
                  type="submit"
                  className="text-sm font-medium text-destructive hover:underline"
                >
                  Sign out
                </button>
              </form>
            </>
          )}
          {!user && !isAuthPage && (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-md border border-transparent bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile navigation row — visible below the header on phones */}
      {links.length > 0 && (
        <div className="flex md:hidden flex-col items-start gap-2 py-2 px-4 border-t border-border">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {l.label}
            </Link>
          ))}
          {user && (
            <Link
              href="/profile"
              className="block py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Profile
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
