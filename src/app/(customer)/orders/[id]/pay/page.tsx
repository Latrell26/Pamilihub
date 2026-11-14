import Link from "next/link";
import { getOrderById } from "@/modules/orders/queries";
import { getHeaderUser } from "@/lib/auth/header-user";
import PayButton from "./PayButton";

export default async function OrderPayPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getHeaderUser();
  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h1 className="text-xl font-bold text-foreground">Sign in required</h1>
        <p className="text-xs text-muted-foreground">Please sign in to proceed with simulated payment.</p>
        <Link href="/login" className="inline-block px-5 py-2.5 rounded-lg bg-primary text-xs font-semibold text-primary-foreground shadow">
          Sign In
        </Link>
      </div>
    );
  }

  const order = await getOrderById(params.id);

  if (!order) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h1 className="text-xl font-bold text-foreground">Order not found</h1>
        <p className="text-xs text-muted-foreground">We couldn&#39;t find this order for payment.</p>
        <Link href="/orders" className="inline-block px-5 py-2.5 rounded-lg bg-primary text-xs font-semibold text-primary-foreground shadow">
          Back to Orders
        </Link>
      </div>
    );
  }

  // Access control
  const isOwner = order.customer_id === user.id;
  const isSeller = user.role === "seller" && order.sellerStoreName !== null;
  if (!isOwner && user.role !== "admin" && !isSeller) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h1 className="text-xl font-bold text-foreground">Not authorized</h1>
        <p className="text-xs text-muted-foreground">You don&#39;t have permission to pay for this order.</p>
        <Link href="/orders" className="inline-block px-5 py-2.5 rounded-lg bg-primary text-xs font-semibold text-primary-foreground shadow">
          Back to Orders
        </Link>
      </div>
    );
  }

  // Only MockPay pending orders can be paid here
  if (order.payment_method !== "mockpay") {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <div className="text-3xl">💵</div>
        <h1 className="text-lg font-bold text-foreground">Cash on Delivery Order</h1>
        <p className="text-xs text-muted-foreground">
          This order was placed under Cash on Delivery. Payment is made directly to the seller upon delivery.
        </p>
        <Link href={`/orders/${order.id}`} className="inline-block px-5 py-2.5 rounded-lg bg-primary text-xs font-semibold text-primary-foreground shadow">
          View Order Status
        </Link>
      </div>
    );
  }

  // Block payment if the order is already terminal (rejected/cancelled/completed)
  const terminalStatuses = ["rejected", "cancelled", "completed"];
  if (terminalStatuses.includes(order.order_status)) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <div className="text-3xl">🛑</div>
        <h1 className="text-lg font-bold text-foreground">Order Already Closed</h1>
        <p className="text-xs text-muted-foreground">
          This order is <strong className="capitalize">{order.order_status}</strong> and cannot be paid anymore.
        </p>
        <Link href={`/orders/${order.id}`} className="inline-block px-5 py-2.5 rounded-lg bg-primary text-xs font-semibold text-primary-foreground shadow">
          View Order Status
        </Link>
      </div>
    );
  }

  if (order.payment_status !== "pending") {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <div className="text-3xl">✓</div>
        <h1 className="text-lg font-bold text-foreground">Payment Already Recorded</h1>
        <p className="text-xs text-muted-foreground">
          The payment status for this order is currently <strong className="capitalize">{order.payment_status}</strong>.
        </p>
        <Link href={`/orders/${order.id}`} className="inline-block px-5 py-2.5 rounded-lg bg-primary text-xs font-semibold text-primary-foreground shadow">
          View Order Status
        </Link>
      </div>
    );
  }

  const items = order.order_items ?? [];
  const subtotal = items.reduce(
    (acc, i) => acc + Number(i.unit_price) * i.quantity,
    0
  );

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-blue-200 bg-blue-50 text-[11px] font-semibold text-blue-800 uppercase tracking-wider">
          <span>MockPay Simulator</span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
          Simulated Gateway
        </h1>
        <p className="text-xs text-muted-foreground">
          Academic demonstration • No actual monetary transactions occur
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
        <div className="pb-4 border-b border-border space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Order Reference:</span>
            <span className="font-bold text-foreground">#{order.id.slice(0, 8).toUpperCase()}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Local Merchant:</span>
            <span className="font-semibold text-foreground">{order.sellerStoreName}</span>
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between text-muted-foreground">
            <span>Delicacies Subtotal</span>
            <span>₱{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Flat Delivery Fee</span>
            <span>₱{Number(order.delivery_fee).toFixed(2)}</span>
          </div>
          <div className="pt-3 border-t border-border flex justify-between items-center text-sm">
            <span className="font-bold text-foreground">Simulated Amount</span>
            <span className="text-xl font-extrabold text-foreground">
              ₱{Number(order.total).toFixed(2)}
            </span>
          </div>
        </div>

        <PayButton orderId={order.id} amount={Number(order.total)} />
      </div>

      <div className="text-center">
        <Link
          href={`/orders/${order.id}`}
          className="text-xs text-muted-foreground hover:text-foreground hover:underline transition-colors"
        >
          ← Return to order details
        </Link>
      </div>
    </div>
  );
}
