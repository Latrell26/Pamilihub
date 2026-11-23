/**
 * Canonical TypeScript types for the Orders module.
 * Keep this file free of Supabase/server imports so it can be imported
 * from both client and server components.
 */

export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "cancelled"
  | "refunded";

export type PaymentMethod = "mockpay" | "cod";

export type OrderStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "preparing"
  | "delivering"
  | "completed"
  | "cancelled";

export interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  products: {
    name: string;
    image_url: string | null;
  } | null;
}

/** Summary row shown in the order list (no items). */
export interface OrderSummary {
  id: string;
  customer_id: string;
  seller_id: string;
  delivery_name: string;
  delivery_phone: string;
  delivery_address: string;
  delivery_fee: number;
  total: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  created_at: string;
  updated_at: string;
  /** Short item preview pulled from order_items count + first product names */
  item_preview?: string;
  item_count?: number;
  queuePosition?: number;
}

/** Full order loaded only when the seller clicks a row (lazy). */
export interface OrderDetail extends OrderSummary {
  order_items: OrderItem[];
}
