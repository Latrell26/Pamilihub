import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/roles";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="max-w-md mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold">Not signed in</h1>
        <p className="mt-4 text-muted-foreground">
          Please <Link href="/login" className="font-semibold underline">sign in</Link>
          to continue.
        </p>
      </div>
    );
  }

  const roleLinks: Record<
    string,
    Array<{ href: string; label: string }>
  > = {
    customer: [
      { href: "/products", label: "Browse Catalog" },
      { href: "/apply", label: "Apply to be a seller" },
      { href: "/profile", label: "Profile" },
    ],
    seller: [
      { href: "/seller/products", label: "My Products" },
      { href: "/profile", label: "Profile" },
    ],
    admin: [
      { href: "/admin/categories", label: "Manage Categories" },
      { href: "/admin/sellers", label: "Seller Approvals" },
      { href: "/profile", label: "Profile" },
    ],
  };

  const links = roleLinks[user.role] || roleLinks.customer;

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <span className="font-bold text-lg tracking-tight">Pamilihub</span>
        <span className="text-sm text-muted-foreground">
          • Dashboard
        </span>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h1 className="text-lg font-semibold mb-2">Welcome back</h1>
        <p className="text-sm text-muted-foreground mb-4">
          Role: <span className="font-medium capitalize">{user.role}</span>
        </p>

        <div className="space-y-3">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block rounded-lg border px-4 py-3 text-sm hover:bg-muted transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t">
          <Link
            href="/profile"
            className="text-sm font-medium text-primary hover:underline"
          >
            Edit profile
          </Link>
        </div>
      </div>
    </div>
  );
}
