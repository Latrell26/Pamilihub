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
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Not signed in</h1>
          <p className="mt-4 text-muted-foreground">
            Please sign in to make a payment.
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

  // Access control
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

  // Only MockPay pending orders can be paid here
  if (order.payment_method !== "mockpay") {
    return (
      <div className="max-w-md mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold">Not applicable</h1>
        <p className="mt-4 text-muted-foreground">
          This order uses Cash on Delivery — no MockPay payment needed.
        </p>
        <Link
          href={`/orders/${order.id}`}
          className="mt-6 inline-block rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90"
        >
          Back to order
        </Link>
      </div>
    );
  }

  if (order.payment_status !== "pending") {
    return (
      <div className="max-w-md mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold">Already processed</h1>
        <p className="mt-4 text-muted-foreground">
          Payment status is already {order.payment_status}.
        </p>
        <Link
          href={`/orders/${order.id}`}
          className="mt-6 inline-block rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90"
        >
          Back to order
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
    <div className="max-w-md mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Simulated Payment</h1>
        <p className="text-muted-foreground text-sm">
          MockPay — no real money is processed.
        </p>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
          Order summary
        </h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Order</span>
            <span className="font-medium">#{order.id.slice(0, 8)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Seller</span>
            <span className="font-medium">{order.sellerStoreName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>₱{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery fee</span>
            <span>₱{order.delivery_fee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold border-t pt-2">
            <span>Total to pay</span>
            <span>₱{order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <PayButton orderId={order.id} amount={order.total} />

      <div className="mt-4">
        <Link
          href={`/orders/${order.id}`}
          className="text-sm text-muted-foreground hover:underline"
        >
          ← Back to order
        </Link>
      </div>
    </div>
  );
}
