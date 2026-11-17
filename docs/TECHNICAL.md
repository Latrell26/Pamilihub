# Technical Architecture & System Design — (SP) Pamilihub

This document provides a comprehensive technical reference for the **(SP) Pamilihub** platform, detailing system architecture, data models, concurrency control, security mechanisms, and payment integration.

---

## 1. System Architecture Overview

Pamilihub is built using a modern full-stack TypeScript architecture optimized for high performance, mobile responsiveness, and strong consistency:

- **Next.js 14 (App Router):** Leverages React Server Components (RSC) for fast initial load and SEO-friendly rendering, combined with Server Actions for type-safe data mutations.
- **Supabase Backend-as-a-Service:**
  - **PostgreSQL 15:** Relational database with strict foreign keys, check constraints, and custom PL/pgSQL atomic functions.
  - **GoTrue Auth:** Session-cookie and Bearer-token authentication with automatic `profiles` provisioning via triggers.
  - **Row-Level Security (RLS):** Kernel-level authorization ensuring users only read or write permitted rows.
  - **Supabase Storage:** S3-compatible asset storage for product photography with folder-level isolation.
- **Client State:** React Context (`CartContext`) backed by `localStorage` (`pamilihub_cart`) with optimistic UI updates.

---

## 2. Database Schema & Data Models

### 2.1 Core Tables

1. **`profiles`**
   - Primary Key: `id` (references `auth.users.id` ON DELETE CASCADE)
   - Fields: `role` (`customer` | `seller` | `admin`), `full_name`, `phone`, `address`, `created_at`, `updated_at`.
2. **`sellers`**
   - Primary Key: `id` (UUID)
   - Fields: `profile_id` (unique foreign key to `profiles`), `store_name`, `description`, `location`, `status` (`pending` | `approved` | `rejected`), `created_at`, `updated_at`.
3. **`categories`**
   - Primary Key: `id` (UUID)
   - Fields: `name` (unique, e.g., "Pies and Pastries", "Kakanin", "Coffee", "Snacks").
4. **`products`**
   - Primary Key: `id` (UUID)
   - Fields: `seller_id` (FK to `sellers`), `category_id` (FK to `categories`), `name`, `description`, `price` (NUMERIC 10,2), `stock` (INTEGER >= 0), `image_url`, `created_at`.
5. **`orders`**
   - Primary Key: `id` (UUID)
   - Fields: `customer_id` (FK to `profiles`), `seller_id` (FK to `sellers`), `delivery_name`, `delivery_phone`, `delivery_address`, `delivery_fee` (NUMERIC 10,2, flat ₱50 per seller), `total` (NUMERIC 10,2), `payment_method` (`mockpay` | `cod`), `payment_status` (`pending` | `paid` | `failed` | `cancelled` | `refunded`), `order_status` (`pending` | `accepted` | `rejected` | `preparing` | `delivering` | `completed` | `cancelled`), `created_at`.
6. **`order_items`**
   - Primary Key: `id` (UUID)
   - Fields: `order_id` (FK to `orders`), `product_id` (FK to `products`), `quantity` (INTEGER > 0), `unit_price` (NUMERIC 10,2).
7. **`payments`**
   - Primary Key: `id` (UUID)
   - Fields: `order_id` (FK to `orders`), `method` (`mockpay` | `cod`), `status` (`pending` | `paid` | `failed` | `cancelled` | `refunded`), `created_at`.

---

## 3. Concurrency Control & Atomic Stock Transactions

E-commerce platforms face race conditions when multiple customers purchase the last stock unit simultaneously. Pamilihub solves this in PostgreSQL using transactional locking functions:

### 3.1 `checkout_cart(p_items jsonb, p_delivery_info jsonb, p_payment_method text)`
Executed inside checkout via `SECURITY DEFINER` RPC. Aggregates duplicate product IDs, validates quantities (> 0), locks product rows with `FOR UPDATE`, validates stock cumulatively, requires `seller.status = 'approved'`, groups items by seller, creates one `orders` record per seller with correct totals, inserts `order_items`, and deducts stock — all inside a single database transaction:

```sql
create or replace function public.checkout_cart(
  p_items jsonb,
  p_delivery_info jsonb,
  p_payment_method text
) returns setof uuid as $$
-- ... validates customer role, aggregates items, locks rows,
-- creates one order per seller, inserts order_items, deducts stock
$$ language plpgsql security definer
set search_path = public;
```

Returns the set of created `order_id`s. `deduct_stock(p_order_items jsonb)` and `restore_stock(p_order_items jsonb)` remain as lower-level helpers (SECURITY DEFINER, executable only by `service_role`) used internally for stock consistency.

### 3.2 `restore_stock(p_order_items jsonb)`
Invoked automatically when an order is cancelled before payment, or when a paid order is rejected/cancelled (simulated refund). Iterates through order items and restores quantities to the product records.

---

## 4. Multi-Seller Checkout & Order Splitting

Customers may add products from different San Pablo sellers in a single browsing session. During checkout:

1. **Client-side grouping:** The cart identifies items by `product.seller_id`.
2. **Delivery Fee Calculation:** Flat ₱50 delivery fee is applied *per distinct seller*:
   $$\text{Total Delivery Fee} = \text{Unique Sellers Count} \times ₱50$$
3. **Server Action (`checkoutAction`):** Validates cart items with Zod, then calls the `checkout_cart` SECURITY DEFINER RPC which validates stock cumulatively, creates one order per seller with correct totals, inserts `order_items`, and deducts stock — all inside a single database transaction.
4. **Order Redirection:**
   - Single seller order: Directs customer straight to `/orders/[id]/pay` (for MockPay) or `/orders/[id]` (for COD).
   - Multi-seller order: Directs customer to `/orders` displaying all placed orders.

---

## 5. Security & Access Control Matrix

Pamilihub adheres to the **defense-in-depth** security model:

```
[ Incoming Request ]
        │
        ▼
[ Next.js Server Role Guard ]  ──(Checks cookie session & role)──► 401/403 or redirect /unauthorized
        │
        ▼
[ Zod Schema Validation ]     ──(Type safety & sanitization)──► 400 Bad Request
        │
        ▼
[ Supabase PostgreSQL RLS ]    ──(Kernel-level row isolation)──► Strict table access per auth.uid()
```

| Entity | Customer Permission | Seller Permission | Admin Permission |
|---|---|---|---|
| `profiles` | Read/update own | Read/update own | Read all |
| `sellers` | Read approved stores | Read/update own store | Full control (approve/reject) |
| `categories` | Read all | Read all | Full CRUD control |
| `products` | Read approved products | CRUD own products if approved | Full control / Moderation |
| `orders` | Create, read own | Read/update status of own store orders | Read all system-wide |
| `payments` | Read own | Read own store payments | Read all system-wide |
| `Storage Bucket` | Read public images | Write under `product-images/{seller_id}/*` | Full access |

---

## 6. Simulated Payment Integration (MockPay API)

Pamilihub strictly prohibits real payment gateway integration (no PayPal, Stripe, PayMongo, or real card processors). Payments are simulated via `POST /api/mockpay`:

### 6.1 API Specification

- **Endpoint:** `POST /api/mockpay`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>` or Supabase Auth Session Cookie
- **Request Body:**
  ```json
  {
    "order_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "amount": 400.00,
    "result": "approve" // or "cancel"
  }
  ```
- **Responses:**
  - `200 OK`: `{"order_id": "...", "payment_status": "paid", "message": "Payment approved (simulated)."}`
  - `200 OK (cancel)`: `{"order_id": "...", "payment_status": "cancelled", "message": "Payment cancelled. Stock has been restored."}` — the order status is also set to `cancelled`.
  - `400 Bad Request`: Amount mismatch, non-MockPay order, terminal order, or validation error.
  - `401 Unauthorized`: Missing or invalid session/Bearer token.
  - `403 Forbidden`: Caller is not a customer or does not own the order.
  - `404 Not Found`: Order ID does not exist or is not pending payment.

> **Payment-gated acceptance:** For MockPay orders, the seller may only `accept` after `payment_status = paid`. The `update_order_status` RPC rejects `accepted` with `Customer has not paid for this MockPay order yet.` COD orders may be accepted immediately and become `paid` when the seller marks them `completed`.

---

## Security Controls Verification

Pamilihub employs **defense-in-depth** access control across two enforcement layers: Next.js server-side role guards (application kernel) and Supabase PostgreSQL Row-Level Security (database kernel). The following table maps each Postman collection test case to its corresponding security control, providing end-to-end verification that unauthorized access is blocked at every layer.

| Control / Test | Postman Request | What it verifies | Failure mode if absent |
|---|---|---|---|
| **401: Missing/Bad Session** | Request 1 — Missing Authorization Header → 401 | API rejects calls without a valid Bearer token or Supabase session cookie | Requests would succeed without authentication, exposing all endpoints to unauthenticated callers |
| **403: Wrong Role** | Request 2 — Non-Customer Role → 403 | Seller/admin token cannot process a customer's MockPay order; role check enforced | A seller could approve/cancel a customer's order, or an admin could modify customer data |
| **404: Non-existent Order** | Request 3 — Non-Existent Order ID → 404 | Invalid UUIDs are rejected at the database level; no row enumeration | Attackers could probe for valid order IDs through error messages |
| **400: Amount Mismatch** | Request 4 — Mismatched Payment Amount → 400 | Server recomputes order total and rejects amounts that don't match | A client could under- or over-pay and bypass the validation |
| **400: Non-MockPay Order** | Request 7 — COD Order → MockPay → 400 | Orders placed via COD are refused by the MockPay route | COD orders could be fake-approved as MockPay payments |
| **400: Terminal Order** | Request 8 — Cancelled/Rejected → 400 | Orders already in `cancelled`/`rejected` state cannot be re-processed | Prevents replay attacks on already-terminal orders |

### Cross-Layer Verification

| Layer | Test Artifact | Scope |
|---|---|---|
| **Application** | Playwright `security.spec.ts` | UI route guards: `/admin/*`, `/seller/*`, `/dashboard` redirect by role; `/unauthorized` renders for unauthenticated guests |
| **Database** | Supabase RLS policies | Table-level row isolation: customers read/write own rows only; sellers read/write own store's rows; admins have full control |
| **API** | Postman collection (8 requests) | HTTP-level status codes and error messages for auth, role, and input validation guards |
| **End-to-End** | Combined Postman + Playwright | Full verification that every access control point blocks the right request, at every layer |

> **Note:** The Postman collection's auto-token pre-request script (using Supabase Auth password grant) ensures these guards are tested with real customer and seller sessions, not just anonymous calls. The complete evidence package for criterion 4 combines the Postman run export, the Playwright HTML report, and this mapping table in `docs/TECHNICAL.md`.
