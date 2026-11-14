import Link from "next/link";
import { getAdminUsers } from "@/modules/admin/queries";
import AdminNav from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";

interface AdminUsersPageProps {
  searchParams: {
    role?: string;
    search?: string;
  };
}

export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
  const { role, search } = searchParams;
  const users = await getAdminUsers({ role, search });

  // Compute counts from all users if not filtered, or display counts
  const roles = [
    { value: "all", label: "All Roles" },
    { value: "customer", label: "Customer" },
    { value: "seller", label: "Seller" },
    { value: "admin", label: "Admin" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-primary/20 bg-primary/10 text-[11px] font-bold text-primary mb-1">
          <span>👥</span>
          <span>Access & Identity</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
          Platform User Directory
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Directory of registered customers, food merchants, and platform administrators.
        </p>
      </div>

      <AdminNav />

      {/* Filter and Search Controls */}
      <div className="p-4 rounded-2xl border border-border bg-card shadow-sm space-y-3">
        <form method="GET" className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <input
              type="text"
              name="search"
              defaultValue={search ?? ""}
              placeholder="Search by name, phone, address, or store name..."
              className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <select
            name="role"
            defaultValue={role ?? "all"}
            className="px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {roles.map((r) => (
              <option key={r.value} value={r.value}>
                Role: {r.label}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-primary text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-all shrink-0"
          >
            Filter
          </button>

          {(role || search) && (
            <Link
              href="/admin/users"
              className="px-3 py-2 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-foreground text-center"
            >
              Reset
            </Link>
          )}
        </form>
      </div>

      {/* Users Table / Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
          <span>Showing {users.length} registered user{users.length === 1 ? "" : "s"}</span>
        </div>

        {users.length === 0 ? (
          <div className="p-12 rounded-2xl border border-dashed border-border text-center space-y-2">
            <p className="text-sm font-bold text-foreground">No users match your filters</p>
            <p className="text-xs text-muted-foreground">Try clearing your search query or role filter.</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden divide-y divide-border">
            {users.map((user) => {
              const joinedDate = new Date(user.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });

              return (
                <div
                  key={user.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  {/* Left: Avatar + Details */}
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`h-10 w-10 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 ${
                        user.role === "admin"
                          ? "bg-purple-500/10 text-purple-700 border border-purple-500/20"
                          : user.role === "seller"
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "bg-muted text-muted-foreground border border-border"
                      }`}
                    >
                      {user.full_name ? user.full_name[0].toUpperCase() : user.role[0].toUpperCase()}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground text-sm">
                          {user.full_name || "Anonymous User"}
                        </span>
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                            user.role === "admin"
                              ? "bg-purple-500/10 text-purple-700 border-purple-500/20"
                              : user.role === "seller"
                              ? "bg-primary/10 text-primary border border-primary/20"
                              : "bg-muted text-muted-foreground border border-border"
                          }`}
                        >
                          {user.role}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-muted-foreground text-xs">
                        {user.phone ? (
                          <span>📞 {user.phone}</span>
                        ) : (
                          <span className="italic">No phone set</span>
                        )}
                        {user.address ? (
                          <span>📍 {user.address}</span>
                        ) : (
                          <span className="italic">No address set</span>
                        )}
                      </div>

                      {user.seller && (
                        <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-primary">
                          <span>🏪 Store:</span>
                          <span className="font-bold">{user.seller.store_name}</span>
                          <span className="text-[10px] uppercase font-bold text-muted-foreground">
                            ({user.seller.status})
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Timestamp & ID */}
                  <div className="text-right sm:self-center shrink-0 text-muted-foreground space-y-0.5">
                    <p className="text-[11px]">Joined {joinedDate}</p>
                    <p className="font-mono text-[10px] text-muted-foreground/70">
                      ID: {user.id.slice(0, 8)}...
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
