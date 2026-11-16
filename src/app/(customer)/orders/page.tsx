import Link from "next/link";
import { ArrowLeft, Receipt } from "lucide-react";
import { getCustomerOrders } from "@/modules/orders/queries";
import { getHeaderUser } from "@/lib/auth/header-user";
import { OrdersClientView } from "./orders-client-view";

export default async function OrdersPage({
  searchParams,
}: Readonly<{
  searchParams: { tab?: string };
}>) {
  const [user, orders] = await Promise.all([
    getHeaderUser(),
    getCustomerOrders(),
  ]);

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl pb-20">
        {/* Sticky Top Header with Back Button to Delicacies */}
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border/60">
          <div className="mx-auto max-w-3xl flex items-center gap-3 px-4 py-3">
            <Link
              href="/products"
              aria-label="Back to delicacies"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border/50 bg-card text-foreground shadow-sm transition active:scale-90 hover:bg-muted"
            >
              <ArrowLeft className="h-5 w-5" strokeWidth={2.5} />
            </Link>
            <div className="min-w-0">
              <h1 className="text-lg font-black leading-tight text-foreground">
                Orders
              </h1>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-md space-y-4 px-4 py-20 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Receipt className="h-7 w-7" aria-hidden="true" />
          </div>
          <h2 className="text-xl font-black text-foreground">Sign in to view orders</h2>
          <p className="text-sm text-muted-foreground">
            Please sign in to access your order history and live delivery statuses.
          </p>
          <Link
            href="/login"
            className="inline-flex h-12 items-center rounded-full bg-primary px-8 text-sm font-extrabold text-primary-foreground shadow-md shadow-primary/25 transition active:scale-95 hover:bg-primary/90"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const initialTab = searchParams?.tab === "past" ? "past" : "active";

  return (
    <OrdersClientView
      orders={orders ?? []}
      initialTab={initialTab}
    />
  );
}
