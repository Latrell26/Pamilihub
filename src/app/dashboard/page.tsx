import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/roles";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h1 className="text-xl font-bold text-foreground">Sign In Required</h1>
        <p className="text-xs text-muted-foreground">
          Please sign in to access your personal role dashboard.
        </p>
        <Link
          href="/login"
          className="inline-block px-5 py-2.5 rounded-lg bg-primary text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (user.role === "admin") {
    redirect("/admin/dashboard");
  }

  if (user.role === "seller") {
    redirect("/seller/orders");
  }

  redirect("/products");
}
