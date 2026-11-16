"use client";

import { useEffect, useState } from "react";
import { reviewSellerAction } from "@/modules/admin/actions";
import AdminNav from "@/components/admin/AdminNav";
import AdminLoading from "../loading";

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-border bg-muted/40 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            <span>Administration</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Seller Verification</h1>
          <p className="text-xs text-muted-foreground">
            Review and approve San Pablo food merchant applications
          </p>
        </div>
      </div>

      <AdminNav />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <span className="text-xs text-amber-800 font-medium">Pending Approvals</span>
          <p className="text-2xl font-extrabold text-amber-800 mt-1">{pendingCount}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <span className="text-xs text-emerald-800 font-medium">Active Merchants</span>
          <p className="text-2xl font-extrabold text-emerald-800 mt-1">{approvedCount}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <span className="text-xs text-muted-foreground">Total Applicants</span>
          <p className="text-2xl font-extrabold text-foreground mt-1">{sellers.length}</p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-xs text-red-700">
          {error}
        </div>
      )}
      {message && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-800">
          {message}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 border-b border-border pb-2 text-xs">
        {(["pending", "approved", "rejected", "all"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors capitalize ${
              activeTab === tab
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {tab} ({tab === "all" ? sellers.length : sellers.filter((s) => s.status === tab).length})
          </button>
        ))}
      </div>

      {/* Applications Table Card */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="p-5 border-b border-border bg-muted/20">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Merchant Applications ({filtered.length})
          </h2>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <span className="text-3xl block">📋</span>
            <p className="text-sm font-semibold text-foreground">No applications in this category</p>
            <p className="text-xs text-muted-foreground">
              New merchant applications submitted by customers will appear here for review.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/40 border-b border-border text-xs text-muted-foreground">
                  <th className="text-left px-5 py-3 font-semibold">Store / Brand</th>
                  <th className="text-left px-5 py-3 font-semibold">Location</th>
                  <th className="text-left px-5 py-3 font-semibold">Applicant</th>
                  <th className="text-left px-5 py-3 font-semibold">Status</th>
                  <th className="text-left px-5 py-3 font-semibold">Applied</th>
                  <th className="text-right px-5 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-foreground text-sm">{s.store_name}</p>
                      {s.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                          {s.description}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">
                      {s.location || "San Pablo City"}
                    </td>
                    <td className="px-5 py-4 text-xs font-medium text-foreground">
                      {s.profile?.full_name ?? "—"}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                          s.status === "approved"
                            ? "bg-emerald-100 text-emerald-800"
                            : s.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">
                      {formatDate(s.created_at)}
                    </td>
                    <td className="px-5 py-4 text-right space-x-2">
                      {s.status === "pending" ? (
                        <>
                          <form action={handleReview} className="inline">
                            <input type="hidden" name="seller_id" value={s.id} />
                            <input type="hidden" name="action" value="approve" />
                            <button
                              type="submit"
                              disabled={reviewing === s.id}
                              className="px-3 py-1 rounded-md bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                            >
                              {reviewing === s.id ? "Approving..." : "Approve"}
                            </button>
                          </form>
                          <form action={handleReview} className="inline">
                            <input type="hidden" name="seller_id" value={s.id} />
                            <input type="hidden" name="action" value="reject" />
                            <button
                              type="submit"
                              disabled={reviewing === s.id}
                              className="px-3 py-1 rounded-md border border-red-200 bg-red-50 text-red-700 text-xs font-bold hover:bg-red-100 disabled:opacity-50 transition-colors"
                            >
                              Reject
                            </button>
                          </form>
                        </>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
