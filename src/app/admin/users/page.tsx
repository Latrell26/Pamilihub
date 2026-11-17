import Link from "next/link";
import { getAdminUsers } from "@/modules/admin/queries";
import AdminNav from "@/components/admin/AdminNav";
import {
  Users,
  Search,
  RotateCcw,
  ShieldCheck,
  Store,
  Phone,
  MapPin,
  Calendar,
} from "lucide-react";

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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-red-500/25 bg-red-500/10 text-[11px] font-black uppercase tracking-wider text-red-600 mb-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Identity & Access</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
          Platform User Directory
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Directory of registered customers, verified merchants, and platform administrators across Pamilihub.
        </p>
      </div>

      <AdminNav />

      {/* Filter and Search Controls */}
      <div className="p-4 sm:p-5 rounded-3xl border border-border/70 bg-card shadow-xs">
        <form method="GET" className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              name="search"
              defaultValue={search ?? ""}
              placeholder="Search by name, phone, address, or store name..."
              className="h-11 w-full rounded-2xl border border-transparent bg-muted/70 pl-11 pr-4 text-xs text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:bg-background focus:outline-none focus:ring-4 focus:ring-primary/15"
            />
          </div>

          <select
            name="role"
            defaultValue={role ?? "all"}
            className="h-11 rounded-2xl border border-transparent bg-muted/70 px-4 text-xs font-bold text-foreground focus:border-primary focus:bg-background focus:outline-none focus:ring-4 focus:ring-primary/15 transition-all"
          >
            {roles.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="h-11 px-6 rounded-full bg-primary text-xs font-extrabold text-primary-foreground shadow-md shadow-primary/25 hover:bg-primary/90 transition-all active:scale-95 shrink-0 cursor-pointer"
          >
            Filter
          </button>

          {(role || search) && (
            <Link
              href="/admin/users"
              className="h-11 flex items-center justify-center gap-1.5 px-4 rounded-full border border-border/70 bg-card text-xs font-bold text-muted-foreground hover:text-foreground transition-all shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </Link>
          )}
        </form>
      </div>

      {/* Users Table / Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
          <span className="font-bold">
            Showing {users.length} registered user{users.length === 1 ? "" : "s"}
          </span>
        </div>

        {users.length === 0 ? (
          <div className="p-12 rounded-3xl border border-border/70 bg-card text-center space-y-2 shadow-xs">
            <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-3xl bg-muted/60 text-muted-foreground">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-sm font-bold text-foreground">No users match your filters</h3>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              Try clearing your search query or role filter.
            </p>
          </div>
        ) : (
          <div className="rounded-3xl border border-border/70 bg-card shadow-xs overflow-hidden divide-y divide-border/50">
            {users.map((user) => {
              const joinedDate = new Date(user.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });

              return (
                <div
                  key={user.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs hover:bg-muted/20 transition-colors"
                >
                  {/* Left: Avatar + Details */}
                  <div className="flex items-start gap-4">
                    <div
                      className={`h-11 w-11 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 ${
                        user.role === "admin"
                          ? "bg-red-500/10 text-red-600 border border-red-500/20"
                          : user.role === "seller"
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "bg-muted/80 text-muted-foreground border border-border/60"
                      }`}
                    >
                      {user.full_name ? user.full_name[0].toUpperCase() : user.role[0].toUpperCase()}
                    </div>

                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-foreground text-sm">
                          {user.full_name || "Anonymous User"}
                        </span>
                        <span
                          className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                            user.role === "admin"
                              ? "bg-red-500/10 text-red-600 border border-red-500/20"
                              : user.role === "seller"
                              ? "bg-primary/10 text-primary border border-primary/20"
                              : "bg-muted text-muted-foreground border border-border/60"
                          }`}
                        >
                          {user.role}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-muted-foreground text-xs">
                        {user.phone ? (
                          <span className="inline-flex items-center gap-1">
                            <Phone className="w-3 h-3 text-primary" />
                            <span>{user.phone}</span>
                          </span>
                        ) : (
                          <span className="italic text-muted-foreground/60">No phone set</span>
                        )}
                        {user.address ? (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-primary" />
                            <span>{user.address}</span>
                          </span>
                        ) : (
                          <span className="italic text-muted-foreground/60">No address set</span>
                        )}
                      </div>

                      {user.seller && (
                        <div className="inline-flex items-center gap-1.5 text-xs text-primary font-bold pt-0.5">
                          <Store className="w-3.5 h-3.5" />
                          <span>Store: {user.seller.store_name}</span>
                          <span className="text-[10px] uppercase font-black px-1.5 py-0.2 rounded-full bg-primary/10">
                            {user.seller.status}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Timestamp & ID */}
                  <div className="text-left sm:text-right sm:self-center shrink-0 text-muted-foreground space-y-0.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
                    <p className="text-xs font-semibold inline-flex items-center gap-1 sm:justify-end">
                      <Calendar className="w-3 h-3" />
                      <span>Joined {joinedDate}</span>
                    </p>
                    <p className="font-mono text-[11px] text-muted-foreground/70">
                      ID: #{user.id.slice(0, 8).toUpperCase()}
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
