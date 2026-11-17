"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Package,
  ShoppingBag,
  LayoutDashboard,
  MapPin,
  UserRound,
  Pencil,
  ChevronRight,
  LogOut,
  Store,
  CircleHelp,
} from "lucide-react";
import { updateProfileAction, signoutAction } from "@/modules/accounts/actions";
import { getSellerStatus } from "@/modules/accounts/queries";
import { AddressPicker } from "@/components/ui/address-picker";
import ProfileLoading from "./loading";

const inputClass =
  "w-full rounded-xl border border-input bg-background px-3 py-2.5 text-xs sm:text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all";

type Editing = "profile" | "address" | null;

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="px-1 text-xs font-bold text-muted-foreground">{children}</h2>;
}

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
  const [editing, setEditing] = useState<Editing>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    address: "",
  });
  // Live value of the address edit form (driven by the PSGC picker).
  const [draftAddress, setDraftAddress] = useState("");

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
      setEditing(null);
      await loadProfile();
    } else {
      setError(result.message || "Failed to update profile.");
    }

    setSaving(false);
  }

  function startEdit(which: Exclude<Editing, null>) {
    setMessage("");
    setError("");
    if (which === "address") {
      setDraftAddress(formData.address);
    }
    setEditing(which);
  }

  if (!loaded) {
    return <ProfileLoading />;
  }

  if (!profile) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h1 className="text-lg font-bold text-foreground">Sign in required</h1>
        <p className="text-xs text-muted-foreground">Please sign in to see your account.</p>
        <Link href="/login" className="inline-block px-5 py-2.5 rounded-2xl bg-primary text-xs font-bold text-primary-foreground shadow">
          Sign in
        </Link>
      </div>
    );
  }

  const initial = (profile.full_name?.trim()[0] ?? profile.role[0]).toUpperCase();

  const orderLinks =
    profile.role === "admin"
      ? [{ href: "/admin/dashboard", label: "Admin dashboard", hint: "Orders, sellers, and products", icon: LayoutDashboard }]
      : profile.role === "seller"
      ? []
      : [
          { href: "/orders", label: "My orders", hint: "Track active and past orders", icon: Package },
          { href: "/cart", label: "Basket", hint: "Items ready for checkout", icon: ShoppingBag },
        ];

  return (
    <div className="max-w-3xl mx-auto pb-6 sm:px-6 lg:px-8 sm:py-8 space-y-5">
      {/* Header */}
      <section className="bg-accent sm:rounded-3xl px-4 sm:px-6 pt-6 pb-5 border-b border-primary/10 sm:border sm:border-primary/15">
        <div className="flex items-center gap-4">
          <div
            className="h-16 w-16 shrink-0 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-black ring-4 ring-card"
            aria-hidden="true"
          >
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl font-black text-foreground truncate">
              {formData.full_name || "Your account"}
            </h1>
            <p className="text-xs text-muted-foreground truncate">
              {formData.phone || "No contact number yet"}
            </p>
            <span className="mt-1.5 inline-block rounded-full bg-card px-2.5 py-0.5 text-[11px] font-bold capitalize text-primary">
              {profile.role}
            </span>
          </div>
        </div>
      </section>

      <div className="px-3 sm:px-0 space-y-5">
        {error && (
          <div role="alert" className="rounded-2xl bg-red-50 border border-red-200 p-4 text-xs text-red-700">
            {error}
          </div>
        )}
        {message && (
          <div role="status" className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-800">
            {message}
          </div>
        )}

        {/* My account: details and address are separate cards, each with its own Edit */}
        <section className="space-y-2">
          <SectionTitle>My account</SectionTitle>

          {/* Delivery address */}
          <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
            {editing !== "address" ? (
              <div className="flex items-start gap-3.5 p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <MapPin className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] text-muted-foreground">Delivering to</p>
                  <p className="text-sm font-bold text-foreground">
                    {formData.address || "Add your San Pablo delivery address"}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Each store delivers separately with a flat ₱50 fee.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => startEdit("address")}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold text-primary hover:bg-primary/10 transition-colors"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
              </div>
            ) : (
              <form action={handleSubmit} className="space-y-3 p-4">
                <input type="hidden" name="full_name" value={formData.full_name} />
                <input type="hidden" name="phone" value={formData.phone} />
                <input type="hidden" name="address" value={draftAddress} />
                <div className="space-y-1">
                  <label htmlFor="address" className="block text-xs font-bold text-foreground">
                    Delivery address
                  </label>
                  <AddressPicker
                    value={draftAddress}
                    onChange={setDraftAddress}
                    disabled={saving}
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Pick your barangay in San Pablo City so the seller can find you.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 sm:flex-none rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-60 transition-all active:scale-95"
                  >
                    {saving ? "Saving..." : "Save address"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(null)}
                    disabled={saving}
                    className="rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-bold text-foreground hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Profile details */}
          <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
            {editing !== "profile" ? (
              <div className="flex items-start gap-3.5 p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <UserRound className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1 space-y-2">
                  <div>
                    <p className="text-[11px] text-muted-foreground">Name</p>
                    <p className="text-sm font-bold text-foreground">
                      {formData.full_name || "Add your name"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground">Contact number</p>
                    <p className="text-sm font-bold text-foreground">
                      {formData.phone || "Add a number so sellers can reach you"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => startEdit("profile")}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold text-primary hover:bg-primary/10 transition-colors"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
              </div>
            ) : (
              <form action={handleSubmit} className="space-y-3 p-4">
                <input type="hidden" name="address" value={formData.address} />
                <div className="space-y-1">
                  <label htmlFor="full_name" className="block text-xs font-bold text-foreground">
                    Full name
                  </label>
                  <input
                    id="full_name"
                    type="text"
                    name="full_name"
                    defaultValue={formData.full_name}
                    required
                    autoComplete="name"
                    autoFocus
                    className={inputClass}
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="phone" className="block text-xs font-bold text-foreground">
                    Contact number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    defaultValue={formData.phone}
                    autoComplete="tel"
                    className={inputClass}
                    placeholder="0912 345 6789"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 sm:flex-none rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-60 transition-all active:scale-95"
                  >
                    {saving ? "Saving..." : "Save details"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(null)}
                    disabled={saving}
                    className="rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-bold text-foreground hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* Orders */}
        {orderLinks.length > 0 && (
          <section className="space-y-2">
            <SectionTitle>{profile.role === "admin" ? "Admin" : "Orders"}</SectionTitle>
            <nav
              aria-label="Orders"
              className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm divide-y divide-border"
            >
              {orderLinks.map((s) => {
                const Icon = s.icon;
                return (
                  <Link
                    key={s.href}
                    href={s.href}
                    className="flex items-center gap-3.5 p-4 hover:bg-muted/30 transition-colors"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold text-foreground">{s.label}</span>
                      <span className="block text-[11px] text-muted-foreground">{s.hint}</span>
                    </span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </Link>
                );
              })}
            </nav>
          </section>
        )}

        {/* Sell on Pamilihub */}
        {profile.role !== "admin" && (
          <section className="space-y-2">
            <SectionTitle>Sell on Pamilihub</SectionTitle>
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-3">
              <div className="flex items-center gap-3.5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                  <Store className="h-5 w-5" />
                </span>
                <p className="text-sm font-bold text-foreground">
                  {sellerStatus?.store_name || "Open your own store"}
                </p>
              </div>

              {!sellerStatus ? (
                <div className="space-y-3 text-xs">
                  <p className="leading-relaxed text-muted-foreground">
                    Make buko pie, kakanin, or Laguna coffee? Apply to sell here.
                    The admin reviews every application.
                  </p>
                  <Link
                    href="/apply"
                    className="inline-block rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90 transition-all active:scale-95"
                  >
                    Apply to sell
                  </Link>
                </div>
              ) : sellerStatus.status === "pending" ? (
                <div className="space-y-2 text-xs">
                  <span className="inline-block rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-800">
                    Under review
                  </span>
                  <p className="leading-relaxed text-muted-foreground">
                    The admin is reviewing your application. You can list products once it is approved.
                  </p>
                </div>
              ) : sellerStatus.status === "approved" ? (
                <div className="space-y-3 text-xs">
                  <span className="inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                    Approved
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href="/seller/products"
                      className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90 transition-all"
                    >
                      My products
                    </Link>
                    <Link
                      href="/seller/orders"
                      className="rounded-xl border border-border bg-background px-4 py-2 text-xs font-bold text-foreground hover:bg-muted transition-colors"
                    >
                      Incoming orders
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5 text-xs">
                  <p className="text-muted-foreground">
                    Your last application was not approved. You can update it and apply again.
                  </p>
                  <Link
                    href="/apply"
                    className="inline-block rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow"
                  >
                    Apply again
                  </Link>
                </div>
              )}
            </div>
          </section>
        )}

        {/* How ordering works: static explainer, no new pages or features */}
        <section className="space-y-2">
          <SectionTitle>Help</SectionTitle>
          <details className="group rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
            <summary className="flex cursor-pointer list-none items-center gap-3.5 p-4 hover:bg-muted/30 transition-colors [&::-webkit-details-marker]:hidden">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CircleHelp className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-foreground">How ordering works</span>
                <span className="block text-[11px] text-muted-foreground">Fees, payment, and order status</span>
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-[[open]]:rotate-90" />
            </summary>
            <ul className="space-y-2.5 border-t border-border p-4 text-xs leading-relaxed text-muted-foreground">
              <li>
                <strong className="text-foreground">One order per store.</strong> If your basket has items from
                two stores, you get two orders, each with its own status.
              </li>
              <li>
                <strong className="text-foreground">Flat ₱50 delivery fee</strong> for every store in your basket.
              </li>
              <li>
                <strong className="text-foreground">MockPay</strong> is a demo payment, so no real money moves.
                You can also choose cash on delivery.
              </li>
              <li>
                <strong className="text-foreground">Status updates</strong> come from the seller:
                pending, accepted, preparing, delivering, then completed.
              </li>
            </ul>
          </details>
        </section>

        {/* Sign out, apart from everything else */}
        <form action={signoutAction}>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card p-3.5 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}