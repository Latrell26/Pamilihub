import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-3xl font-bold mb-2">Pamilihub</h1>
        <p className="text-muted-foreground mb-6">
          Local food products of San Pablo City, Laguna
        </p>
        <p className="text-muted-foreground mb-8">
          Customer catalog, seller dashboard, and admin approval pages are
          under construction.
        </p>

        <div className="space-y-3">
          <Link
            href="/login"
            className="rounded-md border border-transparent bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded-md border border-input bg-background px-6 py-2 text-sm font-semibold text-foreground shadow hover:bg-muted"
          >
            Create account
          </Link>
          <Link
            href="/dashboard"
            className="rounded-md border border-border bg-background px-6 py-2 text-sm font-semibold text-foreground shadow hover:bg-muted"
          >
            Go to dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
