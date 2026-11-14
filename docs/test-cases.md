# Test Cases & QA Verification — (SP) Pamilihub

This document outlines the functional test cases, security checks, and verification procedures for the **(SP) Pamilihub** e-commerce platform.

---

## 1. Authentication & Role-Based Access Control (RBAC)

| Test ID | Test Scenario | Steps | Expected Result | Status |
|---|---|---|---|---|
| **AUTH-01** | Customer Registration | Register new account with email & password | User created in Supabase Auth; row auto-created in `profiles` with role `customer`. | PASS |
| **AUTH-02** | User Sign In | Sign in with valid credentials | User authenticated; redirected to `/dashboard` or home page with role links in header. | PASS |
| **AUTH-03** | Customer Route Guard | Customer attempts to access `/admin/sellers` or `/seller/orders` | Blocked server-side via `requireAdmin()` / `requireRole('seller')`; redirected to `/unauthorized`. | PASS |
| **AUTH-04** | Seller Route Guard | Non-approved seller or customer attempts to access `/seller/products` | Blocked server-side; redirected to `/unauthorized` or `/apply`. | PASS |
| **AUTH-05** | Admin Route Guard | Admin visits `/admin/dashboard`, `/admin/orders`, `/admin/sellers`, `/admin/products` | Full access granted with administration control panel. | PASS |

---

## 2. Catalog & Delicacies Browsing

| Test ID | Test Scenario | Steps | Expected Result | Status |
|---|---|---|---|---|
| **CAT-01** | Public Delicacies Listing | Navigate to `/products` without login | Catalog displays active food items from **approved sellers only**. Pending seller items hidden. | PASS |
| **CAT-02** | Category Filtering | Click category pill (e.g., *Pies & Pastries*, *Kakanin*) | Catalog filters instantly to show products matching `category_id`. | PASS |
| **CAT-03** | Keyword Search | Enter search term (e.g., "buko", "espasol") | Results dynamically filtered matching product name or seller store name. | PASS |
| **CAT-04** | Product Detail View | Click product card to open `/products/[id]` | Displays product image, description, price, stock counter, and seller store info. | PASS |
| **CAT-05** | Out of Stock Indicator | Product with `stock = 0` | UI displays "Out of Stock" badge; "Add to Cart" button disabled. | PASS |

---

## 3. Cart & Multi-Seller Checkout

| Test ID | Test Scenario | Steps | Expected Result | Status |
|---|---|---|---|---|
| **CART-01** | Add Delicacies to Cart | Click "Add to Cart" on single or multiple items | Item added to localStorage cart (`pamilihub_cart`); header cart badge increments. | PASS |
| **CART-02** | Quantity Management | Increment/decrement item quantity or remove item in `/cart` | Subtotals recalculate accurately; removing last quantity removes item. | PASS |
| **CART-03** | Multi-Seller Order Splitting | Cart contains items from 2 different sellers; proceed to `/checkout` | System groups items by seller; calculates ₱50 flat delivery fee per seller; displays separate order totals. | PASS |
| **CART-04** | Server-Side Checkout Validation | Submit checkout with blank address or invalid phone number | Zod schema rejects submission; returns inline validation errors without creating orders. | PASS |
| **CART-05** | Atomic Stock Deduction | Complete checkout for valid items | PostgreSQL atomic function `deduct_stock` decrements product stock; orders created in DB; cart clears. | PASS |
| **CART-06** | Overselling Prevention | Two sessions order the last available stock simultaneously | Atomic transaction locks rows; first order succeeds, second fails with "Stock check failed". | PASS |

---

## 4. Simulated Payments (MockPay & COD)

| Test ID | Test Scenario | Steps | Expected Result | Status |
|---|---|---|---|---|
| **PAY-01** | MockPay Payment Flow | Order placed with MockPay -> navigate to `/orders/[id]/pay` | Pay page displays order breakdown; offers "Approve Payment" and "Cancel Payment" buttons. | PASS |
| **PAY-02** | MockPay Approval | Click "Approve Payment" | Database function `process_mockpay` updates `payment_status = 'paid'`, records payment in `payments` table. | PASS |
| **PAY-03** | MockPay Cancellation & Stock Restore | Click "Cancel Payment" | Payment cancelled; order status updated to `cancelled`; `restore_stock` automatically returns items to inventory. | PASS |
| **PAY-04** | Cash on Delivery (COD) | Place order with COD method | Order created with `payment_method = 'cod'` and `payment_status = 'pending'`. Payment flips to `paid` when seller marks completed. | PASS |
| **PAY-05** | Postman API Security Suite | Run `postman/pamilihub_mockpay.postman_collection.json` (6 test cases) | Validates 401 Unauthorized (missing header), 403 Forbidden (wrong role), 404 Not Found, 400 Bad Request, 200 OK. | PASS |

---

## 5. Seller Store & Order Management

| Test ID | Test Scenario | Steps | Expected Result | Status |
|---|---|---|---|---|
| **SELLER-01**| Merchant Application | Customer submits store name, description, and location at `/apply` | Row created in `sellers` with `status = 'pending'`; user role remains `customer` until approved. | PASS |
| **SELLER-02**| Inventory Product Creation | Approved seller creates product with image upload at `/seller/products` | Image uploaded to seller-scoped Supabase Storage bucket; product row saved with seller ID. | PASS |
| **SELLER-03**| Master-Detail Orders Interface | Seller navigates to `/seller/orders` | Displays searchable list of incoming orders on left; full customer delivery and item breakdown on right. | PASS |
| **SELLER-04**| Order Lifecycle Progression | Seller clicks: Accept -> Preparing -> Delivering -> Completed | Order status transitions smoothly with optimistic UI update; customer sees updated status. | PASS |
| **SELLER-05**| Seller Order Rejection | Seller clicks "Reject Order" | Order status set to `rejected`; payment set to `refunded` (if paid); product stock restored to seller inventory. | PASS |

---

## 6. Admin Governance & Platform Moderation

| Test ID | Test Scenario | Steps | Expected Result | Status |
|---|---|---|---|---|
| **ADMIN-01**| Executive Dashboard | Admin navigates to `/admin/dashboard` | Displays real-time Gross Sales (₱), Order pipeline counters, registered merchants, and catalog stats. | PASS |
| **ADMIN-02**| Seller Application Approval | Admin clicks "Approve" for pending applicant on `/admin/sellers` | `sellers.status` updated to `approved`; applicant's `profiles.role` upgraded to `seller`. | PASS |
| **ADMIN-03**| Seller Application Rejection | Admin clicks "Reject" for pending applicant on `/admin/sellers` | `sellers.status` updated to `rejected`; profile role remains `customer`. | PASS |
| **ADMIN-04**| Order & Payment Monitoring | Admin navigates to `/admin/orders` | Full system audit trail of all orders, filterable by order status, payment status, and keyword search. | PASS |
| **ADMIN-05**| Product Catalog Moderation | Admin navigates to `/admin/products` and clicks "Remove Listing" | Admin confirms modal; product deleted server-side via `adminDeleteProductAction` respecting admin RLS. | PASS |
| **ADMIN-06**| Category Taxonomy Management | Admin adds, updates, or deletes delicacy category on `/admin/categories` | Categories table updated; public catalog filter reflects new taxonomy immediately. | PASS |
| **ADMIN-07**| User Directory Audit | Admin navigates to `/admin/users` | Lists all registered accounts with contact details, role badges, and linked seller stores. | PASS |
