"use client";

import { useEffect, useState } from "react";
import { reviewSellerAction } from "@/modules/admin/actions";

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

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<SellerWithProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [reviewing, setReviewing] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadSellers() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/sellers");
      if (res.ok) {
        const data = await res.json();
        setSellers(data);
      } else {
        setError("Failed to load sellers.");
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
      setError(result.message || "Review failed.");
    }

    setReviewing(null);
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-muted-foreground">Loading sellers...</div>
      </div>
    );
  }

  const pendingSellers = sellers.filter((s) => s.status === "pending");

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Seller Applications</h1>
        <p className="text-muted-foreground">
          Review and approve or reject seller applications
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 border border-destructive/50 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
      {message && (
        <div className="rounded-md bg-success/10 border border-success/50 p-3 text-sm text-success">
          {message}
        </div>
      )}

      <div className="rounded-lg border bg-card p-4">
        <h2 className="text-lg font-semibold mb-4">Pending applications</h2>
        {pendingSellers.length === 0 ? (
          <p className="text-muted-foreground">No pending applications.</p>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Store</th>
                <th className="text-left p-2">Location</th>
                <th className="text-left p-2">Applicant</th>
                <th className="text-left p-2">Applied</th>
                <th className="text-right p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingSellers.map((s) => (
                <tr key={s.id} className="border-b">
                  <td className="p-2 font-medium">{s.store_name}</td>
                  <td className="p-2">{s.location}</td>
                  <td className="p-2">{s.profile?.full_name ?? "—"}</td>
                  <td className="p-2">{new Date(s.created_at).toLocaleDateString()}</td>
                  <td className="p-2 text-right space-x-2">
                    <form action={handleReview} className="inline">
                      <input type="hidden" name="seller_id" value={s.id} />
                      <input type="hidden" name="action" value="approve" />
                      <button
                        type="submit"
                        disabled={reviewing === s.id}
                        className="rounded-md border border-transparent bg-success px-3 py-1 text-xs font-semibold text-success-foreground shadow hover:bg-success/90 disabled:opacity-70"
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
                        className="rounded-md border border-transparent bg-destructive px-3 py-1 text-xs font-semibold text-destructive-foreground shadow hover:bg-destructive/90 disabled:opacity-70"
                      >
                        Reject
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
