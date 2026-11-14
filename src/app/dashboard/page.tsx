import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/roles";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h1 className="text-xl font-bold text-foreground">Sign In Required</h1>
        <p className="text-xs text-muted-foreground">
          Please sign in to access your personal role dashboard.
        </p>
        <Link
          href="/login"
          className="inline-block px-5 py-2.5 rounded-lg bg-primary text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const roleWorkspaces: Record<
    string,
    Array<{ href: string; label: string; desc: string; icon: string }>
  > = {
    customer: [
      { href: "/products", label: "Catalog & Delicacies", desc: "Discover freshly prepared buko pie, espasol, and pasalubong", icon: "🥧" },
      { href: "/orders", label: "My Orders & Delivery", desc: "Track live status and review purchases", icon: "📦" },
      { href: "/cart", label: "Shopping Cart", desc: "Review chosen food items and proceed to checkout", icon: "🛍️" },
      { href: "/profile", label: "Profile & Address", desc: "Manage contact numbers and delivery addresses", icon: "👤" },
    ],
    seller: [
      { href: "/seller/orders", label: "Incoming Orders", desc: "Review customer orders, accept, and mark dispatched", icon: "📋" },
      { href: "/seller/products", label: "Inventory & Products", desc: "Add new local food listings, adjust pricing and stock", icon: "🏪" },
      { href: "/profile", label: "Store Account", desc: "Manage seller profile and store contact information", icon: "⚙️" },
    ],
    admin: [
      { href: "/admin/sellers", label: "Merchant Approvals", desc: "Review and approve incoming local food merchant applications", icon: "🛡️" },
      { href: "/admin/categories", label: "Product Taxonomy", desc: "Manage platform delicacy categories", icon: "📂" },
      { href: "/products", label: "Public Catalog", desc: "Monitor all active product listings across sellers", icon: "👀" },
    ],
  };

  const workspaces = roleWorkspaces[user.role] || roleWorkspaces.customer;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner */}
      <div className="rounded-2xl border border-border bg-gradient-to-br from-card via-card to-muted/30 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-border bg-background text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            <span>Dashboard</span>
            <span>•</span>
            <span className="font-bold text-foreground capitalize">{user.role}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Workspace Hub
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Manage your Pamilihub local commerce operations
          </p>
        </div>

        <Link
          href="/profile"
          className="px-4 py-2 rounded-lg border border-border bg-background text-xs font-semibold text-foreground hover:bg-muted transition-colors self-start sm:self-auto"
        >
          Account Settings
        </Link>
      </div>

      {/* Grid of Workspaces */}
      <div className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Available Workspaces
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {workspaces.map((ws) => (
            <Link
              key={ws.href}
              href={ws.href}
              className="p-5 rounded-2xl border border-border bg-card hover:bg-muted/30 hover:border-primary/40 hover:shadow-md transition-all group flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-muted/60 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                {ws.icon}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                    {ws.label}
                  </h3>
                  <span className="text-muted-foreground group-hover:translate-x-1 group-hover:text-primary transition-all text-xs">
                    →
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {ws.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
