# (SP) Pamilihub — 5-Minute Final Defense & Live Demo Script

**Project Title:** (SP) Pamilihub: A Web-Based Local Food Delicacies E-Commerce Platform for San Pablo City, Laguna  
**Course:** Platform Technologies (Final Project)  
**Team Structure:** 3 Presenters  
**Target Time:** 5 – 7 minutes  

> All demo accounts use the password `password123`.

---

## ⏱️ Scene Breakdown

```
[00:00 - 01:30] Presenter 1: Problem, Solution & Customer Food Ordering Flow
[01:30 - 03:00] Presenter 2: Seller Order Fulfillment & Atomic Stock Management
[03:00 - 04:30] Presenter 3: Admin Governance, Security Architecture & ISO 25010
[04:30 - 05:00] Group Q&A and Conclusion
```

---

## 🎤 Part 1: Problem, Solution & Customer Ordering (Presenter 1)

### Talking Points (0:00 – 0:45)
> *"Good day, panel. San Pablo City is celebrated for its rich local delicacies — from traditional buko pies to artisanal kakanin and locally roasted Barako coffee. However, most micro-bakers and delicacy artisans lack a centralized, accessible digital sales channel.*  
> *To solve this, we developed **(SP) Pamilihub**, a web-based e-commerce platform and mobile-first PWA designed specifically for San Pablo City's local food ecosystem."*

### Live Demo Actions (0:45 – 1:30)
1. **Show Public Catalog (`/products`):**
   - Click category filter pills (*Pies & Pastries*, *Kakanin*, *Coffee*).
   - Use search to look up *"Buko Pie"*.
2. **Customer Log In (`/login`):**
   - Sign in as `ana@pamilihub.test`.
   - Highlight the **delivery banner** (*"Delivering to San Pablo City • Flat ₱50 Delivery Fee"*).
3. **Cart & Multi-Seller Checkout:**
   - Add a *Buko Pie* (from Lola Mayas Bakeshop) and *Suman* (from Kakanin ni Lola).
   - Open Cart (`/cart`) and click **"Proceed to Checkout"**.
   - **Key Feature to Highlight:** Point out that the platform automatically splits orders by seller and calculates a flat ₱50 delivery fee per merchant.
   - Choose **MockPay** and click **"Place Order"**.
4. **MockPay Simulation (`/orders/[id]/pay`):**
   - Click **"Approve Payment"**.
   - Show that status flips immediately to `Paid` and `Order: Pending`.
   - **Key Point:** the seller cannot accept a MockPay order until this payment is approved — the *Pay now* button disappears once the order is closed.

---

## 🏪 Part 2: Merchant Store & Order Dispatch (Presenter 2)

### Talking Points (1:30 – 2:00)
> *"In Pamilihub, sellers are the primary drivers of the order fulfillment lifecycle. Per our project scope, there is no separate rider interface — local food producers directly prepare, bake, and dispatch orders."*

### Live Demo Actions (2:00 – 3:00)
1. **Seller Login & Order Panel (`/seller/orders`):**
   - Sign in as `maria@pamilihub.test` (Lola Mayas Bakeshop).
   - Click **"Orders"** in the header.
2. **Master–Detail Order Management:**
   - Click the new incoming order in the left list.
   - Show the customer's delivery name, phone number, and address in San Pablo City.
3. **Order Lifecycle Transition:**
   - Click **"Accept Order"** → status flips to `Accepted`.
   - Click **"Start Preparing"** → status flips to `Preparing`.
   - Click **"Mark Delivering"** → status flips to `Delivering`.
   - Click **"Mark Completed"** → order completes.
   - **Key Point:** for a MockPay order, *Accept Order* only appears once the customer has paid; an unpaid order shows **"Awaiting MockPay payment"** and can only be rejected. Cash-on-delivery orders can be accepted right away and become *Paid* when the seller completes them.
4. **Product Inventory (`/seller/products`):**
   - Show real-time stock levels.
   - Highlight **Atomic Stock Integrity:** Explain that the PostgreSQL `checkout_cart` transaction locks product rows, so two buyers cannot buy the last item, and that `restore_stock` automatically returns stock on cancellation, rejection, or a failed payment.

---

## 🛡️ Part 3: Administration, Security & Quality Evaluation (Presenter 3)

### Talking Points (3:00 – 3:45)
> *"Pamilihub implements a strict defense-in-depth architecture. Security is enforced at both the application layer through Next.js server guards and at the database kernel level through Supabase PostgreSQL Row-Level Security (RLS)."*

### Live Demo Actions (3:45 – 4:30)
1. **Admin Control Panel (`/admin/dashboard`):**
   - Sign in as `admin@pamilihub.test`.
   - Highlight the **Gross Merchandise Value (GMV)** and the real-time **Order Fulfillment Status Pipeline**.
2. **Merchant Approvals (`/admin/sellers`):**
   - Show pending merchant applications and explain the vetting process before a seller can upload food products.
3. **Order & Payment Auditing (`/admin/orders`):**
   - Demonstrate filtering orders by payment status (paid, pending, refunded) and fulfillment status.
4. **Catalog Moderation (`/admin/products`):**
   - Show how administrators can moderate or unlist products violating platform rules.
5. **ISO/IEC 25010 Evaluation Results (`docs/EVALUATION.md`):**
   - Conclude with the formal evaluation: **16 respondents** (IT faculty, local food merchants, consumers).
   - **Overall Composite Mean:** **4.84 / 5.00 (Excellent / Highly Acceptable)**.
   - Highest rated criteria: Security (**4.92**) and Usability (**4.90**).

---

## 📋 Pre-Demo Rehearsal Checklist

- [ ] Dev server running (`pnpm run dev` on port 3000) or Vercel URL live.
- [ ] Database seeded with:
  - 1 Admin (`admin@pamilihub.test`)
  - 2 Approved Sellers (`maria@pamilihub.test`, `jose@pamilihub.test`)
  - 1 Pending Seller (`pending@pamilihub.test`)
  - 3 Customers (`ana@pamilihub.test`, `bob@pamilihub.test`, `carla@pamilihub.test`)
  - Password for every account: `password123`
- [ ] 3 browser profiles or Incognito windows ready for quick switching between Customer, Seller, and Admin.
- [ ] Migrations applied: `pnpm dlx supabase db push --remote --yes` (001 – 017).
