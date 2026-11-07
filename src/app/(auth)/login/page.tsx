"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/modules/accounts/actions";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setMessage("");
    setError("");

    const result = await loginAction(null, formData);

    if (result.success) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setError(result.message || "Login failed.");
    }

    setLoading(false);
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <h1 className="text-2xl font-bold text-center">Sign in</h1>
      <p className="text-center text-muted-foreground">
        Welcome back to Pamilihub
      </p>

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

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            required
            className="mt-1 block w-full rounded-md border input bg-background text-foreground"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            name="password"
            required
            className="mt-1 block w-full rounded-md border input bg-background text-foreground"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-70"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </div>

      <p className="text-center text-sm">
        Don&#39;t have an account?{" "}
        <a href="/register" className="font-semibold underline">
          Create one
        </a>
      </p>
    </form>
  );
}
