import Link from "next/link";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="font-bold text-lg tracking-tight">
            Pamilihub
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-sm font-medium hover:text-primary">
            Home
          </Link>
          <a
            href="/profile"
            className="text-sm font-medium hover:text-primary"
          >
            Profile
          </a>
          <form
            action="/api/auth/signout"
            method="POST"
            className="ml-2"
          >
            <button
              type="submit"
              className="text-sm font-medium text-destructive hover:underline"
            >
              Sign out
            </button>
          </form>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-6">{children}</main>
    </div>
  );
}
