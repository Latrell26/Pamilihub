# (SP) Pamilihub — San Pablo City Delicacies Platform

> **(SP) Pamilihub** is a web-based e-commerce and local food ordering platform designed for San Pablo City, Laguna. It connects approved local home-bakers and delicacy artisans (*buko pie, espasol, kakanin, barako coffee*) directly with consumers through a mobile-first, PWA-ready delivery experience.

Developed as a Platform Technologies final project by a 3-person team.

---

## 🌟 Key Features

- **Mobile-First Food Ordering UI (PWA-Inspired):** Responsive food delivery experience with category carousels, floating cart bars, and mobile bottom navigation.
- **Three Strict Roles (RBAC):** `customer`, `seller`, and `admin` with enforcement at both Supabase PostgreSQL Row-Level Security (RLS) and Next.js server actions.
- **Multi-Seller Order Splitting:** A single checkout session automatically splits orders by local seller, calculating a transparent flat ₱50 delivery fee per merchant.
- **Atomic Stock Consistency:** PostgreSQL transactional functions (`deduct_stock`, `restore_stock`) prevent overselling under high concurrency.
- **Simulated Payment Gateway (MockPay) & COD:** Simulated digital payment with automated instant approval or cancellation with stock restoration, plus Cash on Delivery.
- **Seller Order Dispatch Hub:** Master–detail order management panel with live status progression: `pending` → `accepted` → `preparing` → `delivering` → `completed`.
- **Admin Control Panel:** Platform gross sales (GMV) metrics, system-wide order monitoring, merchant verification, catalog moderation, and user management.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router, Server Actions, React Server Components) |
| **Language** | TypeScript (Strict Mode) |
| **Styling** | Tailwind CSS (Food delivery theme with custom PWA tokens) |
| **Database & Auth** | Supabase (PostgreSQL, Row-Level Security, GoTrue Auth) |
| **File Storage** | Supabase Storage (Seller-scoped product image uploads) |
| **Schema Validation** | Zod (End-to-end form and API validation) |
| **API Testing** | Postman (Simulated payment integration collection) |
| **Deployment** | Vercel |

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18.17+ or 20.x
- [pnpm](https://pnpm.io/) package manager (`npm install -g pnpm`)
- A [Supabase](https://supabase.com/) project

### 2. Clone and Install
```bash
git clone https://github.com/your-username/pamilihub.git
cd pamilihub
pnpm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory (refer to `.env.example`):
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### 4. Database Setup
Run the SQL migrations located in `supabase/migrations/` in sequential order via the Supabase Dashboard SQL Editor or Supabase CLI:
1. `001_initial_schema.sql` (Tables & constraints)
2. `002_helper_functions.sql` (Security helper functions)
3. `003_rls_policies.sql` (Row-Level Security rules)
4. `004_rpc_functions.sql` (Payment processing & order status)
5. `005_storage_bucket.sql` & `006_storage_policy_hardening.sql` (Product images storage bucket)
6. `007_stock_transaction.sql`, `008_stock_functions_security_definer.sql`, `009_fix_stock_function_loops.sql`, `010_fix_update_order_status.sql` (Atomic stock & order updates)

*(Optional)* Seed demo records from `supabase/seed.sql`.

### 5. Start Development Server
```bash
pnpm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👥 Seed Accounts & Demo Credentials

To test each role in the application, create accounts via `/register` or Supabase Auth:

| Role | Sample User | Default Capabilities |
|---|---|---|
| **Admin** | `admin@pamilihub.local` | Platform dashboard, merchant approval, product moderation, order audit, categories. |
| **Seller** | `maria@sanpablo.local` | Store profile, product listings, image uploads, master-detail order fulfillment. |
| **Customer** | `customer@gmail.com` | Browse delicacies, add to cart, checkout with ₱50 flat delivery fee, MockPay / COD payment, live order tracking. |

---

## 🧪 Postman & Quality Assurance

- **MockPay API Postman Collection:** Located at `postman/pamilihub_mockpay.postman_collection.json`. Covers 6 automated test scenarios (401 Unauthorized, 403 Forbidden, 404 Not Found, 400 Bad Request, 200 Payment Approved, 200 Payment Cancelled).
- **Functional Test Cases:** Detailed test matrix documented in [`docs/test-cases.md`](file:///docs/test-cases.md).

---

## 📚 Project Documentation

- [`docs/PROJECT.md`](file:///docs/PROJECT.md) — Problem statement, objectives, scope, and boundaries.
- [`docs/ARCHITECTURE.md`](file:///docs/ARCHITECTURE.md) — System architecture, module layout, and tech stack.
- [`docs/DATABASE.md`](file:///docs/DATABASE.md) — Database schema, status enums, and RLS policies.
- [`docs/TECHNICAL.md`](file:///docs/TECHNICAL.md) — In-depth technical architecture and atomic transactions.
- [`docs/USER_GUIDE.md`](file:///docs/USER_GUIDE.md) — User manual for Customers, Merchants, and Admins.
- [`docs/EVALUATION.md`](file:///docs/EVALUATION.md) — ISO/IEC 25010 software quality evaluation survey and results.
