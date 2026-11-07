import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card p-6 rounded-lg shadow-sm border border-border text-center">
        <h1 className="text-2xl font-bold mb-2">Not authorized</h1>
        <p className="text-muted-foreground mb-6">
          You don&apos;t have permission to view this page.
        </p>
        <Link
          href="/dashboard"
          className="rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90"
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}
