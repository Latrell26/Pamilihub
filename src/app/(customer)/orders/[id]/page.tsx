import Link from "next/link";
import { getOrderById } from "@/modules/orders/queries";
import { getHeaderUser } from "@/lib/auth/header-user";

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getHeaderUser();
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Not signed in</h1>
          <p className="mt-4 text-muted-foreground">
            Please sign in to view your order.
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

  const order = await getOrderById(params.id);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Order not found</h1>
          <p className="mt-4 text-muted-foreground">
            We couldn’t find this order.
          </p>
          <Link
            href="/orders"
            className="mt-6 inline-block rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90"
          >
            Back to my orders
          </Link>
        </div>
      </div>
    );
  }

  // Access control: customer sees own orders; seller sees own store's orders
  const isOwner = order.customer_id === user.id;
  const isSeller =
    user.role === "seller" && order.sellerStoreName !== null;
  if (!isOwner && user.role !== "admin" && !isSeller) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Not authorized</h1>
          <p className="mt-4 text-muted-foreground">
            You don’t have access to this order.
          </p>
          <Link
            href="/orders"
            className="mt-6 inline-block rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90"
          >
            Back to my orders
          </Link>
        </div>
      </div>
    );
  }

  const items = order.order_items ?? [];
  const subtotal = items.reduce(
    (acc, i) => acc + Number(i.unit_price) * i.quantity,
    0
  );

  const canPay =
    order.payment_method === "mockpay" && order.payment_status === "pending";

  const statusColors: Record<string, string> = {
    pending: "bg-muted/50 text-muted-foreground",
    accepted: "bg-blue-100 text-blue-800",
    preparing: "bg-amber-100 text-amber-800",
    delivering: "bg-purple-100 text-purple-800",
    completed: "bg-success/10 text-success",
    rejected: "bg-destructive/10 text-destructive",
    cancelled: "bg-destructive/10 text-destructive",
  };

  const paymentColors: Record<string, string> = {
    pending: "bg-muted/50 text-muted-foreground",
    paid: "bg-success/10 text-success",
    failed: "bg-destructive/10 text-destructive",
    cancelled: "bg-destructive/10 text-destructive",
    refunded: "bg-blue-100 text-blue-800",
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Order #{order.id.slice(0, 8)}</h1>
          <p className="text-muted-foreground text-sm">
            Placed{" "}
            {new Date(order.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <span className={`text-xs px-2 py-1 rounded-full ${paymentColors[order.payment_status] || paymentColors.pending}`}>
            Payment: {order.payment_status}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${statusColors[order.order_status] || statusColors.pending}`}>
            {order.order_status}
          </span>
        </div>
      </div>

      {/* Seller */}
      <div className="rounded-lg border bg-card p-4">
        <h2 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
          Seller
        </h2>
        <p className="font-medium">{order.sellerStoreName}</p>
      </div>

      {/* Delivery information */}
      <div className="rounded-lg border bg-card p-4">
        <h2 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
          Delivery information
        </h2>
        <dl className="space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <dt className="text-muted-foreground">Name</dt>
            <dd className="font-medium">{order.delivery_name}</dd>
            <dt className="text-muted-foreground">Phone</dt>
            <dd className="font-medium">{order.delivery_phone}</dd>
            <dt className="text-muted-foreground">Address</dt>
            <dd className="font-medium col-span-2">{order.delivery_address}</dd>
          </div>
        </dl>
      </div>

      {/* Items */}
      <div className="rounded-lg border bg-card p-4">
        <h2 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
          Items
        </h2>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Product</th>
              <th className="text-right p-2">Qty</th>
              <th className="text-right p-2">Unit price</th>
              <th className="text-right p-2">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="p-2">
                  <div className="flex items-center gap-3">
                    {item.products?.image_url ? (
                      <img
                        src={item.products.image_url}
                        alt={item.products.name}
                        className="w-12 h-12 rounded object-cover border"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">No image</span>
                      </div>
                    )}
                    <div>
                      <div className="font-medium">{item.products?.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Stock: {item.quantity}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="text-right p-2 font-medium">{item.quantity}</td>
                <td className="text-right p-2">
                  ₱{Number(item.unit_price).toFixed(2)}
                </td>
                <td className="text-right p-2 font-medium">
                  ₱{(Number(item.unit_price) * item.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="rounded-lg border bg-card p-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>₱{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery fee</span>
            <span>₱{order.delivery_fee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold border-t pt-2">
            <span>Total</span>
            <span>₱{order.total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>Payment method</span>
            <span>
              {order.payment_method === "mockpay" ? "MockPay (simulated)" : "Cash on delivery"}
            </span>
          </div>
        </div>
      </div>

      {/* Pay now button (MockPay + pending only) */}
      {canPay && (
        <div className="rounded-lg border bg-card p-4">
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
            Payment
          </h2>
          <Link
            href={`/orders/${order.id}/pay`}
            className="inline-block rounded-md bg-primary px-6 py-3 text-center text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90"
          >
            Pay now (MockPay)
          </Link>
        </div>
      )}

      <div className="mt-4">
        <Link
          href="/orders"
          className="text-sm text-muted-foreground hover:underline"
        >
          ← Back to my orders
        </Link>
      </div>
    </div>
  );
}
