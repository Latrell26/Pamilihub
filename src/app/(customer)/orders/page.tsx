import Link from "next/link";
import { getCustomerOrders } from "@/modules/orders/queries";
import { getHeaderUser } from "@/lib/auth/header-user";

export default async function OrdersPage() {
  const user = await getHeaderUser();
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Not signed in</h1>
          <p className="mt-4 text-muted-foreground">
            Please sign in to view your orders.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90"
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  const orders = await getCustomerOrders();

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">My orders</h1>
        <p className="text-muted-foreground">
          Track your purchases and their status.
        </p>
      </div>

      {(orders ?? []).length === 0 ? (
        <div className="rounded-lg border bg-card p-12 text-center">
          <p className="text-muted-foreground">No orders yet.</p>
          <Link
            href="/products"
            className="mt-4 inline-block rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90"
          >
            Browse catalog
          </Link>
        </div>
      ) : (
        <div className="rounded-lg border bg-card p-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Order</th>
                <th className="text-left p-2">Seller</th>
                <th className="text-right p-2">Total</th>
                <th className="text-right p-2">Payment</th>
                <th className="text-right p-2">Status</th>
                <th className="text-right p-2">Date</th>
                <th className="text-right p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {(orders ?? []).map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="p-2">
                    <Link
                      href={`/orders/${order.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      #{order.id.slice(0, 8)}
                    </Link>
                  </td>
                  <td className="p-2">
                    {order.sellerStoreName || "Unknown seller"}
                  </td>
                  <td className="p-2 text-right font-medium">
                    ₱{order.total.toFixed(2)}
                  </td>
                  <td className="p-2 text-right">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.payment_method === "mockpay"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-amber-100 text-amber-800"
                    }`}>
                      {order.payment_method === "mockpay" ? "MockPay" : "COD"}
                    </span>
                  </td>
                  <td className="p-2 text-right">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.order_status === "completed"
                        ? "bg-success/10 text-success"
                        : order.order_status === "rejected" ||
                          order.order_status === "cancelled"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-muted/50 text-muted-foreground"
                    }`}>
                      {order.order_status}
                    </span>
                  </td>
                  <td className="p-2 text-right text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-2 text-right">
                    {order.payment_method === "mockpay" &&
                    order.payment_status === "pending" ? (
                      <Link
                        href={`/orders/${order.id}/pay`}
                        className="inline-block rounded-md bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90"
                      >
                        Pay now
                      </Link>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
