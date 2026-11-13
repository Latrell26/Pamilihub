"use client";

import { useState, useEffect } from "react";
import { getSellerOrders } from "@/modules/orders/queries";
import { updateOrderStatusAction } from "@/modules/orders/actions";

type OrderItem = {
  id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  products: {
    name: string;
    image_url: string | null;
  } | null;
};

type OrderWithItems = {
  id: string;
  customer_id: string;
  seller_id: string;
  sellerStoreName: string | null;
  delivery_name: string;
  delivery_phone: string;
  delivery_address: string;
  delivery_fee: number;
  total: number;
  payment_method: string;
  payment_status: string;
  order_status: string;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
};

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function loadOrders() {
    setLoading(true);
    try {
      const data = await getSellerOrders();
      setOrders(data ?? []);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateStatus(formData: FormData) {
    setMessage("");
    setError("");
    const result = await updateOrderStatusAction(null, formData);
    if (result.success) {
      setMessage(result.message);
      await loadOrders();
    } else {
      setError(result.message || "Failed to update status.");
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-muted-foreground">Loading orders...</div>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    pending: "bg-muted/50 text-muted-foreground",
    accepted: "bg-blue-100 text-blue-800",
    rejected: "bg-destructive/10 text-destructive",
    preparing: "bg-amber-100 text-amber-800",
    delivering: "bg-purple-100 text-purple-800",
    completed: "bg-success/10 text-success",
    cancelled: "bg-destructive/10 text-destructive",
  };

  const paymentColors: Record<string, string> = {
    pending: "bg-muted/50 text-muted-foreground",
    paid: "bg-success/10 text-success",
    failed: "bg-destructive/10 text-destructive",
    cancelled: "bg-destructive/10 text-destructive",
    refunded: "bg-blue-100 text-blue-800",
  };

  const getAllowedNextStatuses = (status: string): string[] => {
    switch (status) {
      case "pending":
        return ["accepted", "rejected"];
      case "accepted":
        return ["preparing", "cancelled"];
      case "preparing":
        return ["delivering", "cancelled"];
      case "delivering":
        return ["completed", "cancelled"];
      default:
        return [];
    }
  };

  const statusLabel = (s: string) =>
    s.charAt(0).toUpperCase() + s.slice(1);

  const subtotal = (order: OrderWithItems) =>
    order.order_items.reduce(
      (acc, i) => acc + Number(i.unit_price) * i.quantity,
      0
    );

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">My Orders</h1>
        <p className="text-muted-foreground">
          Incoming orders for your store. Update status as you prepare and
          deliver each order.
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 border border-destructive/50 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
      {message && (
        <div className="rounded-md bg-success/10 border border-success/50 p-3 text-sm text-success">
          {message}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="rounded-lg border bg-card p-12 text-center">
          <p className="text-muted-foreground">No orders yet.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Orders from customers will appear here.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border bg-card p-4">
          <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Order</th>
              <th className="text-left p-2">Customer</th>
              <th className="text-right p-2">Total</th>
              <th className="text-right p-2">Payment</th>
              <th className="text-right p-2">Status</th>
              <th className="text-right p-2">Date</th>
              <th className="text-right p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b">
                <td className="p-2">
                  <div className="font-medium">#{order.id.slice(0, 8)}</div>
                  <div className="text-xs text-muted-foreground">
                    From {order.sellerStoreName}
                  </div>
                </td>
                <td className="p-2">
                  <div className="font-medium">{order.delivery_name}</div>
                  <div className="text-xs text-muted-foreground">
                    {order.delivery_phone}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {order.delivery_address}
                  </div>
                </td>
                <td className="p-2 text-right font-medium">
                  ₱{order.total.toFixed(2)}
                </td>
                <td className="p-2 text-right">
                  <span className={`text-xs px-2 py-1 rounded-full ${paymentColors[order.payment_status] || paymentColors.pending}`}>
                    {order.payment_method === "mockpay" ? "MockPay" : "COD"}
                    {" · "}
                    {order.payment_status}
                  </span>
                </td>
                <td className="p-2 text-right">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[order.order_status] || statusColors.pending}`}>
                    {statusLabel(order.order_status)}
                  </span>
                </td>
                <td className="p-2 text-right text-muted-foreground">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td className="p-2 text-right space-x-1">
                  {getAllowedNextStatuses(order.order_status).map((s) => (
                    <form
                      key={s}
                      action={handleUpdateStatus}
                      className="inline"
                      onSubmit={(e) => {
                        e.preventDefault();
                        setUpdatingId(order.id);
                      }}
                    >
                      <input type="hidden" name="order_id" value={order.id} />
                      <input type="hidden" name="new_status" value={s} />
                      <button
                        type="submit"
                        disabled={updatingId === order.id}
                        className={`text-xs font-medium px-2 py-1 rounded hover:bg-muted/50 ${
                          s === "rejected" || s === "cancelled"
                            ? "text-destructive hover:bg-destructive/10"
                            : "text-primary hover:bg-primary/10"
                        }`}
                      >
                        {statusLabel(s)}
                      </button>
                    </form>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
      
      {/* Order items detail (expandable per order) */}
      {orders.map((order) => (
        <div
          key={order.id}
          className="mt-4 rounded-lg border bg-card p-4"
        >
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
            Order #{order.id.slice(0, 8)} — Items
          </h2>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Product</th>
                <th className="text-right p-2">Qty</th>
                <th className="text-right p-2">Unit Price</th>
                <th className="text-right p-2">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.order_items.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="p-2 font-medium">
                    {item.products?.name}
                  </td>
                  <td className="p-2 text-right">{item.quantity}</td>
                  <td className="p-2 text-right">
                    ₱{Number(item.unit_price).toFixed(2)}
                  </td>
                  <td className="p-2 text-right font-medium">
                    ₱{(Number(item.unit_price) * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
              <tr className="border-t font-bold pt-2">
                <td className="p-2 text-right col-span-3">Order subtotal</td>
                <td className="p-2 text-right">
                  ₱{subtotal(order).toFixed(2)}
                </td>
              </tr>
              <tr className="border-t font-bold pt-2">
                <td className="p-2 text-right col-span-3">Delivery fee</td>
                <td className="p-2 text-right">
                  ₱{order.delivery_fee.toFixed(2)}
                </td>
              </tr>
              <tr className="border-t font-bold pt-2">
                <td className="p-2 text-right col-span-3">Total</td>
                <td className="p-2 text-right">
                  ₱{order.total.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
