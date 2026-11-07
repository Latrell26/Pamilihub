"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerAction } from "@/modules/accounts/actions";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setMessage("");
    setError("");
    setFieldErrors({});

    const result = await registerAction(null, formData);

    if (result.success) {
      setMessage(result.message);
      setTimeout(() => router.push("/login"), 1500);
    } else {
      if (result.errors) setFieldErrors(result.errors);
      setError(result.message || "Registration failed.");
    }

    setLoading(false);
  }

  const getFieldError = (name: string) => fieldErrors[name]?.[0];

  return (
    <form action={handleSubmit} className="space-y-4">
      <h1 className="text-2xl font-bold text-center">Create account</h1>
      <p className="text-center text-muted-foreground">
        Join Pamilihub as a customer
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
            className={`mt-1 block w-full rounded-md border ${getFieldError("email") ? "border-destructive" : "input"} bg-background text-foreground`}
            placeholder="you@example.com"
          />
          {getFieldError("email") && (
            <p className="mt-1 text-sm text-destructive">{getFieldError("email")}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            name="password"
            required
            className={`mt-1 block w-full rounded-md border ${getFieldError("password") ? "border-destructive" : "input"} bg-background text-foreground`}
            minLength={6}
          />
          {getFieldError("password") && (
            <p className="mt-1 text-sm text-destructive">{getFieldError("password")}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Full name</label>
          <input
            type="text"
            name="full_name"
            required
            className={`mt-1 block w-full rounded-md border ${getFieldError("full_name") ? "border-destructive" : "input"} bg-background text-foreground`}
          />
          {getFieldError("full_name") && (
            <p className="mt-1 text-sm text-destructive">{getFieldError("full_name")}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Phone (optional)</label>
          <input
            type="tel"
            name="phone"
            className={`mt-1 block w-full rounded-md border ${getFieldError("phone") ? "border-destructive" : "input"} bg-background text-foreground`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Address (optional)</label>
          <input
            type="text"
            name="address"
            className={`mt-1 block w-full rounded-md border ${getFieldError("address") ? "border-destructive" : "input"} bg-background text-foreground`}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-70"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </div>

      <p className="text-center text-sm">
        Already have an account?{" "}
        <a href="/login" className="font-semibold underline">
          Sign in
        </a>
      </p>
    </form>
  );
}
