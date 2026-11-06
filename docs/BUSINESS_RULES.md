# BUSINESS RULES

These rules exist to prevent the lost orders, overselling, and payment confusion described in the problem statement.

> The rules below were **added during the proposal revision**. ⚠ CONFIRM WITH GROUP before treating them as final.

## 1. Orders per seller
If a cart contains items from more than one seller, checkout creates **one order per seller**. Each order has its own status. A simplified **flat delivery fee** applies to each seller's order (no distance calculation).

## 2. Stock handling
- Check stock at checkout (server-side).
- Deduct stock when the order is created, inside **a single database transaction**, so two buyers cannot buy the last item.
- Restore stock if payment is cancelled or fails, or if the seller rejects or cancels the order.

## 3. Payment status
`pending` → `paid` | `failed` | `cancelled`; `refunded` (simulated) after a paid order is rejected.
- **MockPay:** the customer approves or cancels on a simulated payment page; the result is recorded.
- **Cash on delivery:** payment stays `pending` until the seller marks the order `completed`, then becomes `paid`.

## 4. Rejected paid orders
If a seller rejects an order already paid through MockPay, set payment status to `refunded` (simulated). No real money is involved.

## 5. Order status
`pending`, `accepted`, `rejected`, `preparing`, `delivering`, `completed`, `cancelled`. Updated **manually** by the seller or admin. Suggested flow:
`pending → accepted → preparing → delivering → completed`, with `rejected` (by seller) or `cancelled` as exits.

## 6. Seller approval
New sellers start as `pending`. Only `approved` sellers can list products or receive orders. Admin approves or rejects.

## 7. Visibility
- Customers see only products from approved sellers.
- Customers and sellers must both be able to clearly see the order and payment status of an order.
