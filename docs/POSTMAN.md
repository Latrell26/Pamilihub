# Postman Integration — (SP) Pamilihub MockPay API

**Purpose:** Validate the MockPay simulated payment endpoint (`POST /api/mockpay`) and associated security guards. This collection provides automated test coverage for authentication, role enforcement, amount validation, payment approval/cancellation, and terminal-order rejection — all without manual token replacement.

---

## Quick Start

1. **Import the collection and environment**
   - In Postman: `Import` → select `postman/pamilihub_mockpay.postman_collection.json`
   - Same `Import` dialog: select `postman/pamilihub.postman_environment.json`
   - After import, the environment "Pamilihub MockPay Collection" will be selected in the environment dropdown.

2. **The pre-request script auto-fetches JWTs**
   - Before every request, the collection runs a prerequest script that:
     - Calls `POST {supabaseUrl}/auth/v1/token?grant_type=password` with `testCustomerEmail`/`testCustomerPassword` → sets `{{customerToken}}`
     - Calls the same endpoint with `testSellerEmail`/`testSellerPassword` → sets `{{sellerToken}}`
   - You no longer need to manually paste Supabase JWTs into the `customerToken` or `sellerToken` variables.

3. **(First run only) Populate order ID variables**
   - The 8 test requests reference dynamic order IDs (`{{approveOrderId}}`, `{{cancelOrderId}}`, `{{codOrderId}}`, etc.).
   - **Option A:** Create test orders via the web UI first:
     - Login as `ana@pamilihub.test`, browse products, add to cart, place a MockPay order → note the order ID.
     - Login as `maria@pamilihub.test`, view orders, note an order ID.
     - Replace the `REPLACE_WITH_...` placeholder variables with the real UUIDs.
   - **Option B:** Use the `0. Verify Customer Auth` and `0. Verify Seller Auth` requests to confirm tokens are working, then fill in the order ID variables from your demo database.

4. **Run the collection**
   - Click the **Run** button (▶️) in Postman.
   - Select the "Pamilihub MockPay Collection" environment.
   - Click **Run Pamilihub MockPay API**.
   - Review the summary at the end: pass/fail counts per request.

---

## Collection Variables

| Variable | Source | Description |
|---|---|---|
| `baseUrl` | Environment | `http://localhost:3000` (change to your Vercel URL if deployed) |
| `supabaseUrl` | Environment | Your Supabase project URL, e.g. `https://pamilihub.supabase.co` |
| `supabaseAnonKey` | Environment | Supabase anon/public key (not used by pre-request script, but included for completeness) |
| `testCustomerEmail` | Environment | `ana@pamilihub.test` |
| `testCustomerPassword` | Environment | `password123` |
| `testSellerEmail` | Environment | `maria@pamilihub.test` |
| `testSellerPassword` | Environment | `password123` |
| `customerToken` | Auto-generated | JWT fetched from Supabase Auth (customer role) |
| `sellerToken` | Auto-generated | JWT fetched from Supabase Auth (seller/admin role) |
| `validOrderId` | Placeholder | UUID for order existence tests |
| `approveOrderId` | To be filled | ID of a valid MockPay order (create via UI or set manually) |
| `cancelOrderId` | To be filled | ID of a MockPay order to cancel |
| `validOrderTotal` | Default | `290.00` — should match the order's total |
| `approveAmount` | Default | `290.00` — must match `{{approveOrderId}}` order total |
| `cancelAmount` | Default | `290.00` — must match `{{cancelOrderId}}` order total |
| `nonExistentOrderId` | Placeholder | UUID that does not exist in the database |
| `codOrderId` | To be filled | ID of a COD order |
| `cancelledOrderId` | To be filled | ID of a cancelled or rejected order |

---

## The 8 Test Requests

| # | Request Name | What it proves | Expected |
|---|---|---|---|
| **1** | **Missing Authorization Header → 401 Unauthorized** | No token = 401 | Status 401, body `{"error": "Unauthorized"}` |
| **2** | **Non-Customer Role → 403 Forbidden** | Seller/admin token on customer order = 403 | Status 403, body `{"error": "Forbidden"}` |
| **3** | **Non-Existent Order ID → 404 Not Found** | UUID not in DB = 404 | Status 404, body contains `"Order not found"` |
| **4** | **Mismatched Payment Amount → 400 Bad Request** | Amount ≠ order total = 400 | Status 400, body `{"error": "Amount does not match order total"}` |
| **5** | **Valid Payment Approval → 200 OK (Paid)** | Customer approves MockPay → `payment_status = paid` | Status 200, body `{"payment_status": "paid", "message": "Payment approved (simulated)."}` |
| **6** | **Valid Payment Cancellation → 200 OK (Stock Restored)** | Customer cancels MockPay → `payment_status = cancelled`, stock restored | Status 200, body `{"payment_status": "cancelled", "message": "Payment cancelled. Stock has been restored."}` |
| **7** | **Cash-on-Delivery Order Sent to MockPay → 400 Bad Request** | COD order refused by MockPay | Status 400, body `{"error": "This order was not placed via MockPay."}` |
| **8** | **Cancelled/Rejected Order → 400 Bad Request** | Terminal order refused by MockPay | Status 400, body `{"error": "Order is no longer awaiting payment."}` |

---

## Security Verification

The collection verifies **defense-in-depth** access controls:

- **401 Unauthorized** (Request 1): Confirms the API rejects requests without a valid Bearer token. This enforces that every call carries a Supabase session cookie or Bearer token.

- **403 Forbidden** (Request 2): Confirms that a seller or admin token cannot process a customer's order. Even with a valid JWT, the route checks `auth.uid()` against the order's `customer_id` and requires a `customer` role.

- **404 Not Found** (Request 3): Confirms that invalid order UUIDs are rejected at the database level, preventing enumeration attacks.

- **400 Bad Request** (Requests 4, 7, 8): Confirms that input validation (amount mismatch, non-MockPay order, terminal order) is enforced server-side, not just hidden in the UI.

Together with the Playwright `security.spec.ts` (which tests UI route guards), these Postman cases complete the "double-lock" security verification required by criterion 4.

---

## Updating Order ID Variables (One-Time Setup)

If you chose **Option A** (create orders via the UI first):

1. Login as `ana@pamilihub.test` and place a MockPay order. Note the order ID from the URL or DB.
2. Set `{{approveOrderId}}` = that order UUID.
3. To set `{{cancelOrderId}}`, either cancel the same order via the UI, or place another MockPay order and use its ID.
4. To set `{{codOrderId}}`, place a COD order via the UI and note its ID.
5. To set `{{cancelledOrderId}}$, either reject/cancel an order via the UI or use an existing terminal order ID.

After filling in the variables, the 8 requests can be run immediately with **no further manual token replacement**.

---

## Running Postman + Playwright Together (Criterion 4 Evidence)

For the final rubric submission, combine these artifacts:

| Artifact | Location | What it proves |
|---|---|---|
| `postman/pamilihub_mockpay.postman_collection.json` | `postman/` | 8 API security + functional tests (tokens auto-filled) |
| `postman/pamilihub.postman_environment.json` | `postman/` | Environment with test accounts, no secrets hardcoded |
| `docs/POSTMAN.md` | `docs/` | Import/run instructions, variable setup, what each request proves |
| `docs/test-cases.md` | `docs/` | PASS/PENDING status for PAY-01 through PAY-07 (update after first run) |
| `docs/TEST-RESULTS.md` | `docs/` | Auto-generated Vitest + Playwright results table |
| `docs/TECHNICAL.md` | `docs/` | Security-controls table linking Postman 401/403/404/400 to Playwright guards |

Run the Postman collection, export the results (click the **View Results Tree** → **Export** → `HAR` or `JSON`), and attach the export alongside the Playwright HTML report in `docs/TEST-RESULTS.md` for a complete testing evidence package.

---

## Credentials (in the environment file)

| Role | Email | Password |
|---|---|---|
| Customer | `ana@pamilihub.test` | `password123` |
| Seller | `maria@pamilihub.test` | `password123` |
| Admin | `admin@pamilihub.test` | `password123` |

> The environment file `pamilihub.postman_environment.json` contains no secrets that must be kept private — the emails/passwords are also available in the project proposal. The `supabaseAnonKey` field is left empty (`""`) for safety; the pre-request script uses the Supabase `supabaseUrl` + Auth endpoint directly, not the anon key.