"use client";

import { useEffect, useState } from "react";
import { reviewSellerAction } from "@/modules/admin/actions";
import AdminNav from "@/components/admin/AdminNav";
import AdminLoading from "../loading";
import {
  ShieldCheck,
  Store,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MapPin,
  User,
  Loader2,
  Calendar,
} from "lucide-react";

type Seller = {
  id: string;
  store_name: string;
  description: string | null;
  location: string | null;
  status: string;
  created_at: string;
  profile_id: string;
};

type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
};

type SellerWithProfile = Seller & { profile: Profile | null };

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("fil-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<SellerWithProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [reviewing, setReviewing] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected" | "all">("pending");

  async function loadSellers() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/sellers");
      if (res.ok) {
        const data = await res.json();
        setSellers(data);
      } else {
        setError("Failed to load seller list.");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSellers();
  }, []);

  async function handleReview(formData: FormData) {
    const sellerId = formData.get("seller_id") as string;
    setReviewing(sellerId);
    setMessage("");
    setError("");

    const result = await reviewSellerAction(null, formData);

    if (result.success) {
      setMessage(result.message);
      await loadSellers();
    } else {
      setError(result.message || "Review action failed.");
    }

    setReviewing(null);
  }

  if (loading) {
    return <AdminLoading />;
  }

  const filtered = activeTab === "all" ? sellers : sellers.filter((s) => s.status === activeTab);
  const pendingCount = sellers.filter((s) => s.status === "pending").length;
  const approvedCount = sellers.filter((s) => s.status === "approved").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-red-500/25 bg-red-500/10 text-[11px] font-black uppercase tracking-wider text-red-600 mb-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Merchant Governance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
          Seller Approvals & Verification
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Review credentials, approve local San Pablo delicacy stores, or decline unauthorized applications.
        </p>
      </div>

      <AdminNav />

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
        <div className="flex items-center gap-4 rounded-3xl border border-border/70 bg-card p-5 shadow-xs">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Pending Approvals
            </span>
            <p className="text-2xl font-black text-amber-900 dark:text-amber-200 mt-0.5">
              {pendingCount}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-3xl border border-border/70 bg-card p-5 shadow-xs">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Active Merchants
            </span>
            <p className="text-2xl font-black text-emerald-900 dark:text-emerald-200 mt-0.5">
              {approvedCount}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-3xl border border-border/70 bg-card p-5 shadow-xs">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <User className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Total Applicants
            </span>
            <p className="text-2xl font-black text-foreground mt-0.5">
              {sellers.length}
            </p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-xs font-semibold text-red-600 dark:text-red-400"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {message && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-700 dark:text-emerald-400"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {(["pending", "approved", "rejected", "all"] as const).map((tab) => {
          const isActive = activeTab === tab;
          const count = tab === "all" ? sellers.length : sellers.filter((s) => s.status === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-extrabold capitalize transition-all cursor-pointer ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <span>{tab}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-black ${
                  isActive ? "bg-white/20 text-white" : "bg-card text-muted-foreground"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Applications Section */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-border/70 bg-card p-12 text-center space-y-2 shadow-xs">
            <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-3xl bg-muted/60 text-muted-foreground">
              <Store className="w-8 h-8" />
            </div>
            <h3 className="text-sm font-bold text-foreground">No applications found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              New merchant applications submitted by users will appear here for review and authorization.
            </p>
          </div>
        ) : (
          <>
            {/* ── MOBILE / TABLET CARD VIEW (< 768px) ────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
              {filtered.map((s) => (
                <div
                  key={s.id}
                  className="rounded-3xl border border-border/70 bg-card p-5 shadow-xs space-y-3.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-black text-base text-foreground">{s.store_name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {s.description || "No store description provided."}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 ${
                        s.status === "approved"
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                          : s.status === "rejected"
                          ? "bg-red-500/10 text-red-600 border border-red-500/20"
                          : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                      }`}
                    >
                      {s.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs border-t border-border/50 pt-2.5 text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="font-bold text-foreground">{s.profile?.full_name ?? "Unnamed"}</span>
                      {s.profile?.email && <span>({s.profile.email})</span>}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>{s.location || "San Pablo City, Laguna"}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <span>Applied on {formatDate(s.created_at)}</span>
                    </div>
                  </div>

                  {/* Actions for Mobile */}
                  <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                    {s.status === "pending" && (
                      <>
                        <form action={handleReview} className="flex-1">
                          <input type="hidden" name="seller_id" value={s.id} />
                          <input type="hidden" name="action" value="approve" />
                          <button
                            type="submit"
                            disabled={reviewing === s.id}
                            className="w-full h-9 rounded-full bg-emerald-600 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 active:scale-95 disabled:opacity-60 cursor-pointer"
                          >
                            {reviewing === s.id ? "Saving..." : "Approve Store"}
                          </button>
                        </form>
                        <form action={handleReview} className="flex-1">
                          <input type="hidden" name="seller_id" value={s.id} />
                          <input type="hidden" name="action" value="reject" />
                          <button
                            type="submit"
                            disabled={reviewing === s.id}
                            className="w-full h-9 rounded-full bg-red-500/10 text-xs font-bold text-red-600 border border-red-500/30 hover:bg-red-500/20 active:scale-95 disabled:opacity-60 cursor-pointer"
                          >
                            Decline
                          </button>
                        </form>
                      </>
                    )}
                    {s.status === "rejected" && (
                      <form action={handleReview} className="w-full">
                        <input type="hidden" name="seller_id" value={s.id} />
                        <input type="hidden" name="action" value="approve" />
                        <button
                          type="submit"
                          disabled={reviewing === s.id}
                          className="w-full h-9 rounded-full bg-emerald-600 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 active:scale-95 disabled:opacity-60 cursor-pointer"
                        >
                          Re-approve Store
                        </button>
                      </form>
                    )}
                    {s.status === "approved" && (
                      <form action={handleReview} className="w-full">
                        <input type="hidden" name="seller_id" value={s.id} />
                        <input type="hidden" name="action" value="reject" />
                        <button
                          type="submit"
                          disabled={reviewing === s.id}
                          className="w-full h-9 rounded-full bg-red-500/10 text-xs font-bold text-red-600 border border-red-500/30 hover:bg-red-500/20 active:scale-95 disabled:opacity-60 cursor-pointer"
                        >
                          Revoke Approval
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* ── DESKTOP TABLE VIEW (>= 768px) ──────────────────────────────── */}
            <div className="hidden md:block rounded-3xl border border-border/70 bg-card overflow-hidden shadow-xs">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/40 border-b border-border/60 text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                    <th className="text-left px-6 py-4">Store / Brand</th>
                    <th className="text-left px-5 py-4">Location</th>
                    <th className="text-left px-5 py-4">Applicant</th>
                    <th className="text-left px-5 py-4">Status</th>
                    <th className="text-left px-5 py-4">Applied</th>
                    <th className="text-right px-6 py-4 w-52 min-w-[190px]">Review Decision</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filtered.map((s) => (
                    <tr key={s.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-extrabold text-foreground text-sm">{s.store_name}</p>
                        {s.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                            {s.description}
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-4 text-xs text-muted-foreground">
                        {s.location || "San Pablo City"}
                      </td>
                      <td className="px-5 py-4 text-xs font-bold text-foreground">
                        {s.profile?.full_name ?? "—"}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider ${
                            s.status === "approved"
                              ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                              : s.status === "rejected"
                              ? "bg-red-500/10 text-red-600 border border-red-500/20"
                              : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-muted-foreground whitespace-nowrap">
                        {formatDate(s.created_at)}
                      </td>
                      {/* Non-overlapping Actions */}
                      <td className="px-6 py-4 text-right whitespace-nowrap min-w-[190px]">
                        <div className="inline-flex items-center justify-end gap-2 shrink-0">
                          {s.status === "pending" && (
                            <>
                              <form action={handleReview} className="inline-block shrink-0">
                                <input type="hidden" name="seller_id" value={s.id} />
                                <input type="hidden" name="action" value="approve" />
                                <button
                                  type="submit"
                                  disabled={reviewing === s.id}
                                  className="h-8 px-4 rounded-full bg-emerald-600 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 active:scale-95 disabled:opacity-60 cursor-pointer"
                                >
                                  {reviewing === s.id ? "Saving..." : "Approve"}
                                </button>
                              </form>
                              <form action={handleReview} className="inline-block shrink-0">
                                <input type="hidden" name="seller_id" value={s.id} />
                                <input type="hidden" name="action" value="reject" />
                                <button
                                  type="submit"
                                  disabled={reviewing === s.id}
                                  className="h-8 px-4 rounded-full bg-red-500/10 text-xs font-bold text-red-600 border border-red-500/30 hover:bg-red-500/20 active:scale-95 disabled:opacity-60 cursor-pointer"
                                >
                                  Decline
                                </button>
                              </form>
                            </>
                          )}
                          {s.status === "rejected" && (
                            <form action={handleReview} className="inline-block shrink-0">
                              <input type="hidden" name="seller_id" value={s.id} />
                              <input type="hidden" name="action" value="approve" />
                              <button
                                type="submit"
                                disabled={reviewing === s.id}
                                className="h-8 px-4 rounded-full bg-emerald-600 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 active:scale-95 disabled:opacity-60 cursor-pointer"
                              >
                                Re-approve
                              </button>
                            </form>
                          )}
                          {s.status === "approved" && (
                            <form action={handleReview} className="inline-block shrink-0">
                              <input type="hidden" name="seller_id" value={s.id} />
                              <input type="hidden" name="action" value="reject" />
                              <button
                                type="submit"
                                disabled={reviewing === s.id}
                                className="h-8 px-4 rounded-full bg-red-500/10 text-xs font-bold text-red-600 border border-red-500/30 hover:bg-red-500/20 active:scale-95 disabled:opacity-60 cursor-pointer"
                              >
                                Revoke
                              </button>
                            </form>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
