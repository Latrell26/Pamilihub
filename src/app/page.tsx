import Link from "next/link";
import { getHeaderUser } from "@/lib/auth/header-user";

type RoleLinks = Array<{ href: string; label: string }>;

const ROLE_LINKS: Record<string, RoleLinks> = {
  customer: [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/products", label: "Catalog" },
  ],
  seller: [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/seller/products", label: "My Products" },
  ],
  admin: [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/admin/categories", label: "Categories" },
    { href: "/admin/sellers", label: "Seller Approvals" },
  ],
};

export default async function HomePage() {
  const user = await getHeaderUser();

  if (!user) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-2xl text-center">
          <h1 className="text-3xl font-bold mb-2">Pamilihub</h1>
          <p className="text-muted-foreground mb-6">
            Local food products of San Pablo City, Laguna
          </p>
          <p className="text-muted-foreground mb-8">
            Customer catalog, seller dashboard, and admin approval pages are
            under construction.
          </p>

          <div className="space-y-3">
            <Link
              href="/products"
              className="rounded-md border border-transparent bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90"
            >
              Browse catalog
            </Link>
            <Link
              href="/login"
              className="rounded-md border border-transparent bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-md border border-input bg-background px-6 py-2 text-sm font-semibold text-foreground shadow hover:bg-muted"
            >
              Create account
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const links = ROLE_LINKS[user.role] ?? ROLE_LINKS.customer;
  const displayName = user.full_name || user.email || "there";

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {displayName}!
        </h1>
        <p className="text-muted-foreground mb-8">
          What would you like to do today?
        </p>

        <div className="space-y-3">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block rounded-md border border-transparent bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
