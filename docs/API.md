# API — MockPay

MockPay is a **simulated** payment process inside the main application. It is exposed as a REST-style API route that accepts and returns JSON, so the group can demonstrate standard data exchange and test it in Postman. No real money is processed.

> Field names are a **proposed contract**. ⚠ CONFIRM WITH GROUP

## Endpoint
`POST /api/mockpay`

Auth: requires a signed-in customer session. The route must verify that the order belongs to the caller.

### Request (JSON)
```json
{
  "order_id": "uuid",
  "amount": 450.00,
  "result": "approve"
}
```
- `result`: `"approve"` or `"cancel"`.
- Validate with Zod. Reject if `amount` does not match the order total, or if the order is not awaiting payment.

### Response (JSON)
Success:
```json
{
  "order_id": "uuid",
  "payment_status": "paid",
  "message": "Payment approved (simulated)."
}
```
Cancelled:
```json
{
  "order_id": "uuid",
  "payment_status": "cancelled",
  "message": "Payment cancelled. Stock has been restored."
}
```
Error:
```json
{ "error": "Order not found or not awaiting payment." }
```
Use HTTP 200 for success, 400 for validation errors, 401/403 for auth errors, 404 for a missing order.

## Flow
1. Checkout creates the order(s) with `payment_status = pending`.
2. Customer chooses MockPay and sees the simulated payment page.
3. The page sends the JSON request to `/api/mockpay`.
4. The route updates `payment_status`, writes a `payments` record, and restores stock if cancelled.
5. The UI shows the result; the seller sees the updated status.

## Postman tests (minimum)
- Approve with a valid order → `paid`.
- Cancel with a valid order → `cancelled`, stock restored.
- Wrong amount → 400.
- Another customer's order → 403.
- No session → 401.
- Order already paid → 400.

Future enhancements (not in scope): webhook signing, replaceable payment-adapter architecture, real gateway integration.
