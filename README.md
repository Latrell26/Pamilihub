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
| **Testing** | Vitest + Playwright (Unit, component, and E2E testing) |
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
7. `011_harden_rls_policies.sql`, `012_fix_checkout_cart_atomic.sql`, `013_allow_seller_reapply.sql` (Security hardening & re-apply)
8. `014_harden_update_order_status.sql`, `015_fix_checkout_cart_bugs.sql`, `016_enforce_payment_before_accept.sql`, `017_fix_process_mockpay_cancel_where.sql` (Order status transitions, checkout fixes & payment gating)

*(Optional)* Demo data: run `pnpm exec tsx scripts/seed.ts` to create seed accounts, sellers, categories, and products via the service-role key.

### 5. Start Development Server
```bash
pnpm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👥 Seed Accounts & Demo Credentials

To test each role in the application, create accounts via `/register` or Supabase Auth:

| Role | Sample User | Password | Default Capabilities |
|---|---|---|---|
| **Admin** | `admin@pamilihub.test` | `password123` | Platform dashboard, merchant approval, product moderation, order audit, categories. |
| **Seller** | `maria@pamilihub.test` | `password123` | Store profile, product listings, image uploads, master-detail order fulfillment. |
| **Customer** | `ana@pamilihub.test` | `password123` | Browse delicacies, add to cart, checkout with ₱50 flat delivery fee, MockPay / COD payment, live order tracking. |

---

## 🧪 Testing & Quality Assurance

This project uses three testing layers to verify functionality, security, and platform compliance:

### Unit + Component Tests (`pnpm test:unit`)
- **Location:** `tests/unit/` and `tests/components/`
- **Framework:** Vitest + React Testing Library + jsdom
- **Coverage:** 65+ Zod schema validations, address format logic, role-specific nav links, cart controls
- **Command:** `pnpm test:unit` — exits 0 on all passing; HTML report generated in `vitest/`

### E2E Tests (`pnpm test:e2e`)
- **Location:** `e2e/`
- **Framework:** Playwright with multi-role storage state
- **Coverage:** 134 tests across 7 journey specs:
  - `guest.spec.ts` — public catalog, guest redirects
  - `customer-checkout.spec.ts` — multi-seller split, MockPay approve/cancel, COD
  - `seller-fulfillment.spec.ts` — lifecycle transitions, reject + stock restore
  - `admin-governance.spec.ts` — dashboard, seller approvals, order/payment audit
  - `api-contract.spec.ts` — MockPay guards + PSGC allow-list
  - `security.spec.ts` — cross-role redirects, `/unauthorized` page
  - `responsive.spec.ts` — desktop + mobile width rendering
- **Command:** `pnpm test:e2e` — generates Playwright HTML report in `playwright-report/`

### Testing Evidence for Rubric Criterion 4

| Artifact | Location | What it proves |
|---|---|---|
| Unit + component test results | `vitest/` HTML report | 65+ schema and logic tests pass |
| E2E test results | `playwright-report/` HTML report | 134 end-to-end journey tests pass |
| Test case status matrix | `docs/test-cases.md` | PASS/PENDING status for test cases |
| Security-controls mapping | `docs/TECHNICAL.md` § "Security Controls Verification" | Route and RLS access control mapping |
| README Testing section | This section | Links to testing layers and evidence locations |

---

## 📚 Project Documentation

- [`docs/PROJECT.md`](docs/PROJECT.md) — Problem statement, objectives, scope, and boundaries.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — System architecture, module layout, and tech stack.
- [`docs/DATABASE.md`](docs/DATABASE.md) — Database schema, status enums, and RLS policies.
- [`docs/TECHNICAL.md`](docs/TECHNICAL.md) — In-depth technical architecture and atomic transactions.
- [`docs/USER_GUIDE.md`](docs/USER_GUIDE.md) — User manual for Customers, Merchants, and Admins.
- [`docs/EVALUATION.md`](docs/EVALUATION.md) — ISO/IEC 25010 software quality evaluation survey and results.
