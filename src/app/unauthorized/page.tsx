import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card p-8 rounded-2xl shadow-sm border border-border text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-full bg-red-50 text-red-600 flex items-center justify-center text-2xl font-bold">
          🛡️
        </div>
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight text-foreground">Access Restricted</h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            You don&apos;t have the necessary account role or merchant permissions to access this specific workspace.
          </p>
        </div>
        <div className="pt-2 flex flex-col gap-2">
          <Link
            href="/dashboard"
            className="w-full py-2.5 rounded-lg bg-primary text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-all"
          >
            Go to My Dashboard
          </Link>
          <Link
            href="/products"
            className="w-full py-2.5 rounded-lg border border-border bg-background text-xs font-medium text-foreground hover:bg-muted transition-colors"
          >
            Browse Food Catalog
          </Link>
        </div>
      </div>
    </div>
  );
}
