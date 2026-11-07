"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signoutAction } from "@/modules/accounts/actions";
import type { HeaderUser } from "@/lib/auth/header-user";

export default function SiteHeader({
  user,
}: Readonly<{
  user: HeaderUser | null;
}>) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";

  const roleLinks: Record<string, Array<{ href: string; label: string }>> = {
    customer: [
      { href: "/products", label: "Catalog" },
      { href: "/apply", label: "Apply to sell" },
    ],
    seller: [{ href: "/seller/products", label: "My Products" }],
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
          {!isAuthPage && !user ? (
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
          ) : null}
          {user ? (
            <form action={signoutAction} className="ml-2">
              <button
                type="submit"
                className="text-sm font-medium text-destructive hover:underline"
              >
                Sign out
              </button>
            </form>
          ) : null}
        </div>
      </div>

      {/* Mobile navigation row — visible below the header on phones */}
      {links.length > 0 && (
        <div className="hidden md:flex flex-col items-start gap-2 py-2 px-4 md:hidden border-t border-border">
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
