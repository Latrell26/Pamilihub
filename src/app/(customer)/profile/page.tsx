"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateProfileAction, signoutAction } from "@/modules/accounts/actions";
import { getSellerStatus } from "@/modules/accounts/queries";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<{
    id: string;
    role: string;
    full_name: string | null;
    phone: string | null;
    address: string | null;
  } | null>(null);
  const [sellerStatus, setSellerStatus] = useState<{
    id: string;
    store_name: string | null;
    status: string | null;
  } | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    address: "",
  });

  const loadProfile = useCallback(async () => {
    const res = await fetch("/api/me");
    if (res.status === 401) {
      router.push("/login");
      setLoaded(true);
      return;
    }
    if (!res.ok) {
      setLoaded(true);
      return;
    }
    const data = await res.json();
    setProfile(data);
    setFormData({
      full_name: data.full_name || "",
      phone: data.phone || "",
      address: data.address || "",
    });

    try {
      const seller = await getSellerStatus();
      setSellerStatus(seller);
    } catch {
      setSellerStatus(null);
    }

    setLoaded(true);
  }, [router]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    setMessage("");
    setError("");

    const result = await updateProfileAction(null, formData);

    if (result.success) {
      setMessage(result.message);
      await loadProfile();
    } else {
      setError(result.message || "Failed to update profile.");
    }

    setSaving(false);
  }

  if (!loaded) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-6">
        <div className="text-sm text-muted-foreground animate-pulse">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h1 className="text-lg font-bold text-foreground">Sign In Required</h1>
        <p className="text-xs text-muted-foreground">Please sign in to access your profile settings.</p>
        <Link href="/login" className="inline-block px-5 py-2.5 rounded-2xl bg-primary text-xs font-bold text-primary-foreground shadow">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-5">
      {/* User Card Header (Food app account header) */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="h-14 w-14 rounded-2xl bg-primary text-primary-foreground font-black flex items-center justify-center text-xl shadow-md shadow-primary/20 uppercase shrink-0">
            {profile.full_name ? profile.full_name[0] : profile.role[0]}
          </div>
          <div className="space-y-0.5 min-w-0">
            <h1 className="font-extrabold text-foreground text-base sm:text-lg truncate">
              {formData.full_name || "Pamilihub User"}
            </h1>
            <p className="text-xs text-muted-foreground truncate">
              {profile.id.slice(0, 16)}...
            </p>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-primary/10 text-primary">
              {profile.role} account
            </span>
          </div>
        </div>

        <form action={signoutAction}>
          <button
            type="submit"
            className="px-3 py-1.5 rounded-xl border border-border text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
          >
            Sign out
          </button>
        </form>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-xs text-red-700">
          {error}
        </div>
      )}

      {message && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-800">
          {message}
        </div>
      )}

      {/* Quick Nav Links for mobile user (Foodpanda style account navigation) */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm divide-y divide-border">
        <Link
          href="/orders"
          className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">📦</span>
            <div>
              <p className="font-bold text-xs sm:text-sm text-foreground">My Orders</p>
              <p className="text-[11px] text-muted-foreground">View status of active & past food orders</p>
            </div>
          </div>
          <span className="text-muted-foreground text-xs">→</span>
        </Link>

        <Link
          href="/cart"
          className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">🛍️</span>
            <div>
              <p className="font-bold text-xs sm:text-sm text-foreground">Shopping Basket</p>
              <p className="text-[11px] text-muted-foreground">Manage delicacies chosen for checkout</p>
            </div>
          </div>
          <span className="text-muted-foreground text-xs">→</span>
        </Link>
      </div>

      {/* Profile Form Card */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-border">
          <span className="text-base">👤</span>
          <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">
            Contact & Delivery Details
          </h2>
        </div>

        <form action={handleSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Full Name
            </label>
            <input
              type="text"
              name="full_name"
              defaultValue={formData.full_name}
              required
              className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-xs sm:text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Contact Phone
              </label>
              <input
                type="tel"
                name="phone"
                defaultValue={formData.phone}
                className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-xs sm:text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="0912 345 6789"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                San Pablo Delivery Address
              </label>
              <input
                type="text"
                name="address"
                defaultValue={formData.address}
                className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-xs sm:text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Brgy. San Rafael, San Pablo City"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-primary text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-60 transition-all cursor-pointer active:scale-95"
          >
            {saving ? "Saving Changes..." : "Save Details"}
          </button>
        </form>
      </div>

      {/* Seller Application Card */}
      {profile.role !== "admin" && (
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-3.5">
          <div className="flex items-center gap-2 pb-2 border-b border-border">
            <span className="text-base">🏪</span>
            <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Food Merchant Portal
            </h2>
          </div>

          {sellerStatus ? (
            sellerStatus.status === "pending" ? (
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-foreground">{sellerStatus.store_name}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    Application Under Review
                  </span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Your merchant store application is being reviewed by the platform administrator.
                </p>
              </div>
            ) : sellerStatus.status === "approved" ? (
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-foreground">{sellerStatus.store_name}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Verified Seller
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Link
                    href="/seller/products"
                    className="px-4 py-2 rounded-xl bg-primary text-xs font-bold text-primary-foreground shadow hover:bg-primary/90 transition-all"
                  >
                    Inventory
                  </Link>
                  <Link
                    href="/seller/orders"
                    className="px-4 py-2 rounded-xl border border-border bg-background text-xs font-bold text-foreground hover:bg-muted transition-colors"
                  >
                    Manage Orders
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                <p className="text-muted-foreground">Previous application was rejected.</p>
                <Link
                  href="/apply"
                  className="inline-block px-4 py-2 rounded-xl bg-primary text-xs font-bold text-primary-foreground shadow"
                >
                  Reapply Now
                </Link>
              </div>
            )
          ) : (
            <div className="space-y-2.5 text-xs">
              <p className="text-muted-foreground leading-relaxed">
                Are you a local producer of buko pie, espasol, kakanin, or Laguna coffee? Join as a verified merchant.
              </p>
              <Link
                href="/apply"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-xs font-bold text-primary-foreground shadow hover:bg-primary/90 transition-all active:scale-95"
              >
                <span>Become a Food Seller</span>
                <span>→</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
