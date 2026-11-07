"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateProfileAction } from "@/modules/accounts/actions";
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

    // Load seller status
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
      setError(result.message || "Update failed.");
    }

    setSaving(false);
  }

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-muted-foreground">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-muted-foreground">
          Not signed in.{" "}
          <Link href="/login" className="font-semibold underline">
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account details
        </p>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Role
          </span>
          <span className="text-sm">{profile.role}</span>
        </div>
        <div className="grid gap-2 mb-4">
          <div>
            <label className="text-sm font-medium block">ID</label>
            <p className="text-muted-foreground truncate">{profile.id}</p>
          </div>
        </div>
      </div>

      <form action={handleSubmit} className="space-y-4">
        <h2 className="text-lg font-semibold">Edit details</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Full name</label>
            <input
              type="text"
              name="full_name"
              defaultValue={formData.full_name}
              className="block w-full rounded-md border input bg-background text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Phone</label>
            <input
              type="tel"
              name="phone"
              defaultValue={formData.phone}
              className="block w-full rounded-md border input bg-background text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Address</label>
            <input
              type="text"
              name="address"
              defaultValue={formData.address}
              className="block w-full rounded-md border input bg-background text-foreground"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-70"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>

      {/* Seller account card */}
      {profile.role !== "admin" && (
        <div className="rounded-lg border bg-card p-4">
        <h2 className="text-lg font-semibold mb-2">Seller account</h2>
        {sellerStatus ? (
          sellerStatus.status === "pending" ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Your seller application is under review.
              </p>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                Pending
              </span>
              <p className="text-sm text-muted-foreground">
                An admin will review your application. You will be notified once
                approved.
              </p>
            </div>
          ) : sellerStatus.status === "approved" ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                You&apos;re an approved seller. You can now list products.
              </p>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-success/10 text-success border border-success/20">
                Approved
              </span>
              <Link
                href="/seller/products"
                className="rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 inline-block"
              >
                Manage products
              </Link>
            </div>
          ) : sellerStatus.status === "rejected" ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Your seller application was not approved.
              </p>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-destructive/10 text-destructive border border-destructive/20">
                Rejected
              </span>
              <p className="text-sm text-muted-foreground">
                You may reapply if you&apos;d like to try again.
              </p>
              <Link
                href="/apply"
                className="rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 inline-block"
              >
                Reapply
              </Link>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              Unknown status: {sellerStatus.status}
            </div>
          )
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Want to sell your products on Pamilihub? Apply to become a
              seller.
            </p>
            <Link
              href="/apply"
              className="rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 inline-block"
            >
              Apply to sell
            </Link>
          </div>
        )}
      </div>
      )}

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
    </div>
  );
}
