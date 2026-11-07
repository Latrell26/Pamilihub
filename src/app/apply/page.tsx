"use client";

import { useState, useEffect } from "react";
import { applySellerAction } from "@/modules/accounts/actions";
import { getSellerStatus } from "@/modules/accounts/queries";

export default function SellerApplyPage() {
  const [application, setApplication] = useState<{
    id: string;
    store_name: string | null;
    status: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    store_name: "",
    description: "",
    location: "",
  });

  async function loadStatus() {
    const data = await getSellerStatus();
    setApplication(data);
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setMessage("");
    setError("");

    const result = await applySellerAction(null, formData);

    if (result.success) {
      setMessage(result.message);
      await loadStatus();
    } else {
      setError(result.message || "Application failed.");
    }

    setLoading(false);
  }

  useEffect(() => {
    loadStatus();
  }, []);

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Seller Application</h1>
        <p className="text-muted-foreground">
          Apply to sell your products on Pamilihub
        </p>
      </div>

      {application && application.status && (
        <div className="rounded-lg border bg-card p-4">
          <h2 className="text-lg font-semibold mb-2">Current application</h2>
          <p className="mb-1"><strong>Store:</strong> {application.store_name}</p>
          <p className="mb-1"><strong>Status:</strong> {application.status}</p>
          {application.status === "pending" && (
            <p className="text-sm text-muted-foreground">
              An admin will review your application. You will be notified once
              approved.
            </p>
          )}
          {application.status === "rejected" && (
            <p className="text-sm text-muted-foreground">
              Your application was not approved. You may reapply.
            </p>
          )}
          {application.status === "approved" && (
            <p className="text-sm text-success">
              Congratulations! Your store is approved. You can now list
              products.
            </p>
          )}
        </div>
      )}

      {(application && application.status !== "approved") || !application ? (
        <form action={handleSubmit} className="space-y-4">
          <h2 className="text-lg font-semibold">Apply to be a seller</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Store name</label>
              <input
                type="text"
                name="store_name"
                defaultValue={formData.store_name}
                required
                className="block w-full rounded-md border input bg-background text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea
                name="description"
                defaultValue={formData.description}
                rows={3}
                className="block w-full rounded-md border input bg-background text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Location</label>
              <input
                type="text"
                name="location"
                defaultValue={formData.location}
                required
                className="block w-full rounded-md border input bg-background text-foreground"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-70"
            >
              {loading ? "Submitting..." : "Submit application"}
            </button>
          </div>
        </form>
      ) : null}

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
