import Link from "next/link";
import { logoutAction } from "@/modules/accounts/actions";
import { getHeaderUser } from "@/lib/auth/header-user";

export type HeaderUser = {
  id: string;
  email: string | null;
  role: string;
};

export default async function SiteHeader({
  user,
}: Readonly<{
  user: HeaderUser | null;
}>) {
  async function handleSignout(_formData: FormData) {
    await logoutAction();
  }

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
          {!user ? (
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
          ) : (
            <form action={handleSignout} className="ml-2">
              <button
                type="submit"
                className="text-sm font-medium text-destructive hover:underline"
              >
                Sign out
              </button>
            </form>
          )}
        </div>
      </div>
    </nav>
  );
}
