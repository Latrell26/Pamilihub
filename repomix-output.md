This file is a merged representation of the entire codebase, combined into a single document by Repomix.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
````
agents/
  backend.md
  database.md
  docs-evaluation.md
  frontend.md
  planner.md
  qa.md
docs/
  API.md
  ARCHITECTURE.md
  BUSINESS_RULES.md
  CONVENTIONS.md
  DATABASE.md
  DEMO_SCRIPT.md
  EVALUATION.md
  PROJECT.md
  TECHNICAL.md
  test-cases.md
  USER_GUIDE.md
  WORKFLOW.md
postman/
  pamilihub_mockpay.postman_collection.json
scripts/
  demo-images/
    barako-coffee.png
    biko.png
    buko-pie.png
    egg-pie.png
    suman.png
  gen-pngs.ts
  seed-images.ts
  seed.ts
src/
  app/
    (auth)/
      login/
        page.tsx
      register/
        page.tsx
      layout.tsx
    (customer)/
      cart/
        page.tsx
      checkout/
        page.tsx
      orders/
        [id]/
          pay/
            page.tsx
            PayButton.tsx
          page.tsx
        loading.tsx
        page.tsx
      profile/
        page.tsx
    admin/
      categories/
        page.tsx
      dashboard/
        page.tsx
      orders/
        page.tsx
      products/
        page.tsx
      sellers/
        page.tsx
      users/
        page.tsx
      layout.tsx
      loading.tsx
    api/
      admin/
        sellers/
          route.ts
      auth/
        signout/
          route.ts
      me/
        route.ts
      mockpay/
        route.ts
    apply/
      page.tsx
    dashboard/
      page.tsx
    products/
      [id]/
        page.tsx
      page.tsx
    seller/
      orders/
        page.tsx
      products/
        page.tsx
      layout.tsx
    unauthorized/
      page.tsx
    globals.css
    layout.tsx
    loading.tsx
    manifest.ts
    page.tsx
  components/
    admin/
      AdminNav.tsx
      AdminProductDeleteButton.tsx
    seller/
      orders/
        OrderCard.tsx
        OrderDetailPanel.tsx
        OrderList.tsx
        Skeletons.tsx
        StatusBadge.tsx
    ui/
      add-to-cart-button.tsx
      badge.tsx
      button.tsx
      card.tsx
      floating-cart-bar.tsx
      input.tsx
      mobile-bottom-nav.tsx
      site-header.tsx
  lib/
    auth/
      header-user.ts
      roles.ts
    cart/
      cart-context.tsx
    supabase/
      admin.ts
      browser.ts
      server.ts
    utils.ts
  modules/
    accounts/
      actions.ts
      queries.ts
      schemas.ts
    admin/
      actions.ts
      queries.ts
      schemas.ts
    catalog/
      actions.ts
      queries.ts
      schemas.ts
    orders/
      actions.ts
      queries.ts
      schemas.ts
      types.ts
  middleware.ts
supabase/
  migrations/
    001_initial_schema.sql
    002_helper_functions.sql
    003_rls_policies.sql
    004_rpc_functions.sql
    005_storage_bucket.sql
    006_storage_policy_hardening.sql
    007_stock_transaction.sql
    008_stock_functions_security_definer.sql
    009_fix_stock_function_loops.sql
    010_fix_update_order_status.sql
    011_harden_rls_policies.sql
    012_fix_checkout_cart_atomic.sql
    013_allow_seller_reapply.sql
    014_harden_update_order_status.sql
    015_fix_checkout_cart_bugs.sql
    016_enforce_payment_before_accept.sql
    017_fix_process_mockpay_cancel_where.sql
    018_seed_demo_data.sql
    019_optimize_rls_subqueries.sql
    020_add_missing_indexes.sql
  .gitignore
  config.toml
  seed.sql
.env.example
.eslintrc.json
.gitignore
AGENTS.md
CLAUDE.md
components.json
next.config.mjs
opencode.jsonc
package.json
postcss.config.mjs
README.md
tailwind.config.ts
tsconfig.json
vercel.json
````

# Files

## File: src/app/(customer)/orders/loading.tsx
````typescript
export default function OrdersLoading() {
  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-5 animate-pulse">
      {/* Header */}
      <div className="border-b border-border pb-3 px-1 space-y-2">
        <div className="h-7 w-36 bg-muted/60 rounded-lg" />
        <div className="h-4 w-64 bg-muted/40 rounded" />
      </div>

      {/* Order cards */}
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border/50 bg-card/60 p-4 sm:p-5 space-y-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="h-5 w-40 bg-muted/60 rounded" />
              <div className="h-6 w-20 bg-muted/50 rounded-full" />
            </div>
            <div className="h-16 bg-muted/30 rounded-xl" />
            <div className="flex items-center justify-between pt-2 border-t border-border/40">
              <div className="h-4 w-28 bg-muted/40 rounded" />
              <div className="h-5 w-24 bg-muted/60 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
````

## File: src/app/admin/loading.tsx
````typescript
export default function AdminLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-4 w-32 bg-primary/20 rounded-full" />
        <div className="h-8 w-64 bg-muted/60 rounded-xl" />
        <div className="h-4 w-96 bg-muted/40 rounded" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 rounded-2xl border border-border/50 bg-card/60 p-4 space-y-3" />
        ))}
      </div>

      {/* Table / List skeleton */}
      <div className="h-80 rounded-2xl border border-border/50 bg-card/60 p-6 space-y-4" />
    </div>
  );
}
````

## File: src/app/loading.tsx
````typescript
export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 animate-pulse">
      {/* Search / Header skeleton */}
      <div className="h-12 bg-muted/60 rounded-2xl w-full max-w-2xl" />

      {/* Hero / Filter Pills skeleton */}
      <div className="flex items-center gap-2 overflow-hidden py-1">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-9 w-24 bg-muted/50 rounded-xl shrink-0" />
        ))}
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border/50 bg-card/60 p-3 space-y-3 shadow-sm"
          >
            <div className="h-32 sm:h-44 w-full bg-muted/50 rounded-xl" />
            <div className="space-y-2">
              <div className="h-3 w-20 bg-muted/50 rounded" />
              <div className="h-4 w-full bg-muted/60 rounded" />
              <div className="h-4 w-16 bg-muted/60 rounded pt-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
````

## File: supabase/migrations/019_optimize_rls_subqueries.sql
````sql
-- Migration: 019_optimize_rls_subqueries
-- Optimizes RLS policy execution by wrapping auth functions in scalar subqueries (select auth.uid()).
-- In PostgreSQL, bare function calls in policies execute per-row, whereas (select ...) is evaluated once as an InitPlan.

-- 1. profiles
drop policy if exists "profiles_read_own" on public.profiles;
create policy "profiles_read_own" on public.profiles
  for select using ((select auth.uid()) = id);

drop policy if exists "profiles_write_own" on public.profiles;
create policy "profiles_write_own" on public.profiles
  for update using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

drop policy if exists "profiles_admin_all" on public.profiles;
create policy "profiles_admin_all" on public.profiles
  for all using ((select public.is_admin())) with check ((select public.is_admin()));

-- 2. sellers
drop policy if exists "sellers_own" on public.sellers;
create policy "sellers_own" on public.sellers
  for all using (profile_id = (select auth.uid())) with check (profile_id = (select auth.uid()));

drop policy if exists "sellers_admin_all" on public.sellers;
create policy "sellers_admin_all" on public.sellers
  for all using ((select public.is_admin())) with check ((select public.is_admin()));

-- 3. categories
drop policy if exists "categories_admin_all" on public.categories;
create policy "categories_admin_all" on public.categories
  for all using ((select public.is_admin())) with check ((select public.is_admin()));

-- 4. products
drop policy if exists "products_seller_read_own" on public.products;
create policy "products_seller_read_own" on public.products
  for select using (seller_id = (select public.current_seller_id()));

drop policy if exists "products_admin_all" on public.products;
create policy "products_admin_all" on public.products
  for all using ((select public.is_admin())) with check ((select public.is_admin()));

-- 5. orders
drop policy if exists "orders_customer_read_own" on public.orders;
create policy "orders_customer_read_own" on public.orders
  for select using (customer_id = (select auth.uid()));

drop policy if exists "orders_seller_read_own_store" on public.orders;
create policy "orders_seller_read_own_store" on public.orders
  for select using (seller_id = (select public.current_seller_id()));

drop policy if exists "orders_admin_all" on public.orders;
create policy "orders_admin_all" on public.orders
  for all using ((select public.is_admin())) with check ((select public.is_admin()));

-- 6. order_items
drop policy if exists "order_items_customer_read_own" on public.order_items;
create policy "order_items_customer_read_own" on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and o.customer_id = (select auth.uid())
    )
  );

drop policy if exists "order_items_seller_read_own_store" on public.order_items;
create policy "order_items_seller_read_own_store" on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and o.seller_id = (select public.current_seller_id())
    )
  );

drop policy if exists "order_items_admin_all" on public.order_items;
create policy "order_items_admin_all" on public.order_items
  for all using ((select public.is_admin())) with check ((select public.is_admin()));

-- 7. payments
drop policy if exists "payments_customer_read_own" on public.payments;
create policy "payments_customer_read_own" on public.payments
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = payments.order_id
        and o.customer_id = (select auth.uid())
    )
  );

drop policy if exists "payments_seller_read_own_store" on public.payments;
create policy "payments_seller_read_own_store" on public.payments
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = payments.order_id
        and o.seller_id = (select public.current_seller_id())
    )
  );

drop policy if exists "payments_admin_all" on public.payments;
create policy "payments_admin_all" on public.payments
  for all using ((select public.is_admin())) with check ((select public.is_admin()));
````

## File: supabase/migrations/020_add_missing_indexes.sql
````sql
-- Migration: 020_add_missing_indexes
-- Indexes for foreign keys, status filters, and timestamp sorting to prevent sequential scans

-- Foreign key on order_items -> products join
create index if not exists idx_order_items_product_id on public.order_items(product_id);

-- Seller status filter for catalog visibility (where status = 'approved')
create index if not exists idx_sellers_status on public.sellers(status);

-- Order sorting by date (customer order history, seller incoming orders, admin monitoring)
create index if not exists idx_orders_created_at on public.orders(created_at desc);

-- Order status filters (admin dashboard metrics and order state filtering)
create index if not exists idx_orders_status_composite on public.orders(order_status, payment_status);

-- Product sorting by date (new arrivals, catalog browsing)
create index if not exists idx_products_created_at on public.products(created_at desc);
````

## File: vercel.json
````json
{
  "regions": ["bom1"]
}
````

## File: agents/backend.md
````markdown
# Agent: Backend

## Goal
Implement server logic: server actions, the MockPay API route, validation, and role checks.

## Owns
`src/modules/*/actions.ts`, `src/modules/*/queries.ts`, `src/modules/*/schemas.ts`, `src/app/api/mockpay/route.ts`, `src/lib/supabase/`, `src/lib/auth/`, `src/lib/validation/`, `docs/API.md`.

## Responsibilities
- Accounts: registration, login, profile updates, seller application, role helper functions.
- Catalog: product CRUD for approved sellers, category management for admin, search by product name, stock updates.
- Orders: checkout that validates stock, creates **one order per seller**, calculates the flat delivery fee, and updates order status. See `docs/BUSINESS_RULES.md`.
- Payments: `POST /api/mockpay` per `docs/API.md`; cash-on-delivery handling (payment becomes `paid` when the seller marks the order `completed`); simulated `refunded` when a paid order is rejected.
- Validate every input with Zod; check the caller's role before every action.
- Return clear success and error messages the UI can show.

## Must not
- Integrate any real payment provider.
- Use the service-role key in client code.
- Trust role or price values sent from the client; recompute totals on the server.
- Edit UI components or RLS migrations (request changes from `frontend` or `database`).

## Done when
- Each action works for its role and is rejected for others.
- All Postman cases listed in `docs/API.md` pass.
- Failed or cancelled payments restore stock.

## Hands off to
`frontend` with a list of actions/routes, their inputs, and the messages they return.
````

## File: agents/database.md
````markdown
# Agent: Database

## Goal
Provide a correct, secure Supabase PostgreSQL schema that matches `docs/DATABASE.md` and enforces role-based access with RLS.

## Owns
`supabase/migrations/`, `supabase/seed.sql`, RLS policies, Storage bucket policies, `docs/DATABASE.md`.

## Responsibilities
- Create tables, constraints, and status values exactly as listed in `docs/DATABASE.md`.
- Write RLS policies for `customer`, `seller`, and `admin` (table in `docs/DATABASE.md`).
- Enforce: only approved sellers can add products; customers cannot change order status or payment status directly.
- Implement the stock deduction and restore logic as a **single transaction** (database function) so overselling cannot happen. See `docs/BUSINESS_RULES.md`.
- Set up Supabase Storage for product images: public read, sellers write only to their own folder.
- Provide seed data: one admin, at least two approved sellers with products across categories, one pending seller, a few customers.

## Must not
- Store unnecessary personal data.
- Disable RLS on any table, even temporarily in committed code.
- Edit frontend or API route code.

## Done when
- Migrations run cleanly from scratch and seed data loads.
- Each role is verified to read and write only what its RLS row allows (QA confirms).
- Stock cannot go negative.

## Hands off to
`backend` with a short note listing tables, functions, and status values available.
````

## File: agents/docs-evaluation.md
````markdown
# Agent: Docs & Evaluation

## Goal
Produce the documentation and evaluation outputs promised in the proposal.

## Owns
`README.md`, `docs/USER_GUIDE.md`, `docs/TECHNICAL.md`, `docs/evaluation/`, interview and survey summaries.

## Responsibilities
- **Seller interviews and buyer survey (Objective 1):** prepare questions about how sellers manage listings, stock, orders, and payments and what difficulties they face; summarize results. Use only real responses; never invent findings. ⚠ CONFIRM WITH GROUP: target of at least three sellers.
- **README:** setup instructions, environment variables (`.env.example`), how to run, how to load sample data.
- **Technical documentation:** system design, modules, database design, MockPay API, based on `docs/ARCHITECTURE.md`, `docs/DATABASE.md`, `docs/API.md`.
- **User guide:** basic steps for customers, sellers, and admins.
- **Evaluation:** build a questionnaire based on ISO/IEC 25010:2011 characteristics: functional suitability, usability, security, performance efficiency. Target at least 15 respondents (customers, sellers, administrators). ⚠ CONFIRM WITH GROUP. Tabulate and summarize results.
- Include the functional testing results from `qa`.

## Must not
- Invent survey data, respondent counts, or results.
- Claim features that are not implemented.
- Describe payments as real; always say simulated.

## Done when
- README lets a new person run the project with sample data.
- User guide, technical docs, test results, and evaluation results are complete and consistent with the proposal.

## Hands off to
`planner` for final review before the demonstration.
````

## File: agents/frontend.md
````markdown
# Agent: Frontend

## Goal
Build responsive customer, seller, and admin interfaces that match the proposal's features.

## Owns
`src/app/**` pages (except `api/`), `src/components/`, module `components/` folders, Tailwind styles.

## Responsibilities
- **Customer:** register/login/profile, catalog with category browsing and name search, product detail (photos, price, stock, seller info), cart, checkout with delivery info and payment choice (MockPay or COD), simulated payment page, order history and status.
- **Seller:** application status, store profile, product add/edit/delete with images, stock, incoming orders with accept/reject and preparing/delivering updates.
- **Admin:** seller approval, user and category management, product moderation, order and payment monitoring, basic dashboard.
- Show clear loading, empty, success, and error states for every action.
- Make every page usable at phone and desktop widths (Tailwind, mobile-first).
- Show order **and** payment status clearly to both customer and seller.
- Follow the Figma wireframes where they exist.

## Must not
- Rely on hiding UI as security; the backend and RLS enforce access.
- Call Supabase with elevated keys.
- Add pages or features outside the proposal (no rider screens, no real-payment forms).
- Write business logic that belongs in `backend`.

## Done when
- Each role can complete its workflow end to end using only the UI.
- Pages work on mobile and desktop.
- Messages from backend actions are displayed.

## Hands off to
`qa` with the list of pages and workflows ready to test.
````

## File: agents/planner.md
````markdown
# Agent: Planner

## Goal
Keep the one-week build on schedule and make sure every agent works from the proposal.

## Owns
`docs/WORKFLOW.md`, task lists, handoff notes, progress status. Does not write application code.

## Responsibilities
- Turn each day's plan in `docs/WORKFLOW.md` into small tasks with a named owner agent.
- Check each task against the proposal, `docs/BUSINESS_RULES.md`, and the hard rules in `AGENTS.md`.
- Resolve conflicts between agents; escalate unclear requirements to the human.
- Track status: not started, in progress, in QA, done.
- Protect scope: reject anything out of scope; defer optional enhancements until core features pass.
- Keep a list of every **⚠ CONFIRM WITH GROUP** item and remind the human to decide them early (Day 1).

## Must not
- Add features, roles, or technologies not in the proposal.
- Edit code or database files.

## Done when
- Every task for the day has an owner, status, and handoff note.
- The next day's task list is ready.

## Hands off to
`database` (Day 1), then whichever agent owns the next task.
````

## File: agents/qa.md
````markdown
# Agent: QA

## Goal
Verify that the system works, is secure by role, and meets the proposal's functional testing objective.

## Owns
`tests/`, `docs/test-cases.md`, Postman collection, bug reports.

## Responsibilities
- Write documented test cases for the main workflows: registration/login, product management, checkout, payment simulation, order-status updates.
- Test each role's access: confirm customers, sellers, and admins can do only what their role allows, and that RLS blocks direct access to other users' data.
- Run the Postman cases in `docs/API.md` (approve, cancel, wrong amount, other customer's order, no session, already paid).
- Test business rules: per-seller order split, stock deduction, stock restore on cancel/fail/reject, COD payment behavior, simulated refund.
- Check mobile and desktop layouts.
- Report bugs with steps to reproduce, expected vs actual result, and the owning agent.
- Record results (pass/fail, date) for the final documentation.

## Test case format
`ID | Role | Steps | Expected result | Actual result | Status`

## Must not
- Fix bugs directly in other agents' files; send them to the owner.
- Mark a task done if any definition-of-done item in `docs/CONVENTIONS.md` fails.

## Done when
- All core workflows pass for all three roles.
- No open high-severity bugs.
- Results are handed to `docs-evaluation`.

## Hands off to
`docs-evaluation` with the test results; bugs go back to the owning agent.
````

## File: docs/ARCHITECTURE.md
````markdown
# ARCHITECTURE

## Modules
| Module | Responsibility |
|---|---|
| **Accounts** | Registration, login, sessions, profiles, role checks, seller application. |
| **Catalog** | Categories, products, images, stock, search, product detail. |
| **Orders** | Cart, checkout, order creation, order status, order history, seller order management. |
| **Payments** | MockPay simulation, cash on delivery handling, payment status. |
| **Administration** | Seller approval, user and category management, product moderation, order/payment monitoring, dashboard. |

Modules communicate through server actions and a REST-style API route with JSON (MockPay). Keep module code separated so any one can be improved or replaced later.

## Stack usage
| Concern | Technology |
|---|---|
| UI and routing | Next.js (React) with TypeScript |
| Styling / responsive | Tailwind CSS |
| Auth | Supabase Auth |
| Data | Supabase PostgreSQL via Supabase JavaScript Client |
| Authorization | Supabase RLS + role checks in Next.js |
| Images | Supabase Storage |
| Validation | Zod, in server actions and API routes |
| Payments (demo) | In-app MockPay, REST-style API route, JSON |
| Hosting | Vercel (fallback: local demo) |
| Testing | Test cases + Postman |

## Proposed folder layout *(⚠ CONFIRM WITH GROUP; adjust if the team prefers another structure)*
```
src/
  app/
    (auth)/login, register
    (customer)/products, products/[id], cart, checkout, orders
    seller/ (store, products, orders)
    admin/ (sellers, users, categories, products, orders, dashboard)
    api/mockpay/route.ts
  modules/
    accounts/   catalog/   orders/   payments/   admin/
      (actions.ts, queries.ts, schemas.ts, components/)
  lib/
    supabase/ (browser client, server client)
    auth/ (role helpers)
    validation/
  components/ui/
supabase/
  migrations/   seed.sql
docs/  agents/
```

## Request flow
1. Browser → Next.js page or server action.
2. Server action validates input with Zod and checks the user's role.
3. Supabase client query runs under the user's session; RLS enforces row access.
4. Result returns as a success or error message shown in the UI.
5. MockPay: checkout page → `POST /api/mockpay` (JSON) → payment and order status updated → UI shows result.

## Access rules
- Unauthenticated: browse catalog only.
- Customer: own profile, cart, orders, payments.
- Seller (approved only): own store, own products, orders for own products.
- Admin: all records through admin pages.
````

## File: docs/CONVENTIONS.md
````markdown
# CONVENTIONS

## Code
- TypeScript everywhere; avoid `any`.
- One Zod schema per form/API input, kept in the module's `schemas.ts`.
- Server actions and API routes validate, check the role, then query.
- Show a clear success or error message for every user action.
- Tailwind for styling; mobile-first, verified at phone and desktop widths.
- No secrets in the repo; use environment variables and a `.env.example`.

## Naming
- Files: `kebab-case`; React components: `PascalCase`; variables/functions: `camelCase`; DB tables/columns: `snake_case`.
- Status values are lowercase strings exactly as listed in `docs/DATABASE.md`.

## Git
- Branches: `feature/<module>-<short-name>`, `fix/<short-name>`.
- Commits: `type(scope): message`, e.g. `feat(orders): split cart into per-seller orders`.
- Small commits; open a pull request into `main`; at least one other group member reviews.
- Never commit directly to `main` during the final days except for urgent fixes.

## Definition of done (every task)
1. Works for the intended role and is blocked for other roles (UI **and** RLS).
2. Input validated on the server; errors shown clearly.
3. Works on mobile and desktop widths.
4. Matches `docs/BUSINESS_RULES.md` and `docs/DATABASE.md`.
5. At least one test case written or updated (QA agent records it).
6. No real payment code, no secrets, no out-of-scope features.
7. Task note added for the planner (what changed, what is next).

## When unsure
Check the proposal, then the `docs/` files, then ask the human. Do not invent requirements.
````

## File: docs/DATABASE.md
````markdown
# DATABASE (Supabase PostgreSQL)

> Table and column names below are a **proposed design** derived from the proposal's features. ⚠ CONFIRM WITH GROUP before the database agent finalizes migrations.

## Tables
| Table | Purpose | Key fields |
|---|---|---|
| `profiles` | One row per user, linked to Supabase Auth | `id` (= auth user id), `role` (`customer`/`seller`/`admin`), `full_name`, `phone`, `address` |
| `sellers` | Store profile and approval | `id`, `profile_id`, `store_name`, `description`, `location`, `status` (`pending`/`approved`/`rejected`) |
| `categories` | Product categories (e.g., pies and pastries, kakanin, coffee, snacks) | `id`, `name` |
| `products` | Product listings | `id`, `seller_id`, `category_id`, `name`, `description`, `price`, `stock`, `image_url` |
| `orders` | One order per seller | `id`, `customer_id`, `seller_id`, `delivery_name`, `delivery_phone`, `delivery_address`, `delivery_fee`, `total`, `payment_method` (`mockpay`/`cod`), `payment_status`, `order_status`, `created_at` |
| `order_items` | Items in an order | `id`, `order_id`, `product_id`, `quantity`, `unit_price` |
| `payments` | Record of each simulated payment result | `id`, `order_id`, `method`, `status`, `created_at` |
| `reviews` | *Optional enhancement only* | `id`, `product_id`, `customer_id`, `rating`, `comment` |

Cart contents may live in client state or a `cart_items` table; the group decides. ⚠ CONFIRM WITH GROUP

## Status values
- **Seller status:** `pending`, `approved`, `rejected`
- **Order status:** `pending`, `accepted`, `rejected`, `preparing`, `delivering`, `completed`, `cancelled`
- **Payment status:** `pending`, `paid`, `failed`, `cancelled`, `refunded` (refunded is simulated only) ⚠ CONFIRM WITH GROUP

## RLS policy outline
| Table | Customer | Seller | Admin |
|---|---|---|---|
| `profiles` | read/update own | read/update own | read/update all |
| `sellers` | read approved stores | read/update own | read/update all |
| `categories` | read | read | full control |
| `products` | read products of approved sellers | CRUD own products only if seller is approved | read all, moderate/delete |
| `orders` | create; read own | read/update status of orders for own store | read all |
| `order_items` | create with own order; read own | read for own store's orders | read all |
| `payments` | read own | read for own store's orders | read all |

Rules:
- A seller can add products only when `sellers.status = 'approved'`.
- Customers cannot change `order_status`; only the seller (for their store's orders) or admin can.
- Customers cannot set `payment_status` directly; only the MockPay route and seller/admin flows can.
- Product images go to a Supabase Storage bucket; sellers can write only under their own folder; reads are public.

## Seed data (for demo and testing)
Include one admin, at least two approved sellers with products across the categories, one pending seller, and a few customers.
````

## File: docs/PROJECT.md
````markdown
# PROJECT — (SP) Pamilihub

## Title
(SP) Pamilihub: A Web-Based E-Commerce Platform for Local Food Products of San Pablo City, Laguna

## Problem summary
- Small food producers in San Pablo City commonly sell through word of mouth, public markets, roadside stalls, and social media. Online orders often arrive via Facebook Messenger or text.
- Orders get scattered across chats, payments need manual screenshot checking, and stock/sales records may be kept in notebooks or not recorded consistently. This can cause lost orders, overselling, and payment-verification mistakes.
- Buyers (residents, visitors, relatives wanting *pasalubong*) must search many pages and groups to find sellers and have no single place to compare products, check availability, and order.

**General problem:** Local food producers need an affordable and organized online platform to showcase products and manage orders, while buyers need a convenient place to discover and order local food products.

## Specific problems → objectives
| # | Problem | Objective |
|---|---|---|
| 1 | How do sellers currently manage listings, stock, orders, payments, and what difficulties arise? | Interview at least three San Pablo sellers and survey a small sample of buyers; summarize findings. *(⚠ CONFIRM WITH GROUP: numbers)* |
| 2 | How can buyers discover, compare, and order from one platform? | Customer modules: catalog with category browsing and search, product detail pages, cart, order placement. |
| 3 | How can checkout and payment be clear and demonstrable? | Checkout with delivery information; MockPay and cash on delivery; record payment result; update order/payment status visibly. |
| 4 | How can access be controlled by role? | Authentication, role-based access control, input validation, clear system messages, minimal personal data. |
| 5 | How can a modular structure and standard data formats support communication? | Modular system (accounts, catalog, orders, payments, administration); MockPay as a REST-style API route with JSON, tested in Postman. |
| 6 | How will the system be evaluated? | Functional testing with documented test cases; user evaluation by at least 15 respondents using an ISO/IEC 25010:2011 questionnaire (functional suitability, usability, security, performance efficiency). *(⚠ CONFIRM WITH GROUP: sample size)* |

## Roles
| Role | Can do |
|---|---|
| **Customer** | Register/login, manage profile, browse by category, search by name, view product details (photos, price, stock, seller info), cart, checkout with delivery info, pay via MockPay or COD, view order history and status. |
| **Seller** | Apply for a seller account (needs admin approval), store profile (name, description, location), add/edit/delete products with images, manage stock, view incoming orders, accept/reject, update preparing/delivering status. |
| **Admin** | Approve/reject seller applications, manage users and categories, moderate product listings, monitor orders and payment statuses, view a basic dashboard. |

## System-wide features
Three roles only · role-based access control · server-side validation with clear error/success messages · secure password handling via Supabase Auth · responsive UI for mobile and desktop.

## Optional enhancements (only after all core features work)
Product reviews and ratings · basic sales/order summary for sellers.

## Scope
- Web marketplace for local food and delicacy products of San Pablo City, Laguna.
- Limited number of approved local producers; sample or actual seller accounts for testing.
- Core: product listing, search, cart, checkout, order-status tracking.
- Simulated payment (MockPay) and cash on delivery.
- Manual order/delivery-status updates by the seller; no rider interface.
- Responsive web interface; deployed on Vercel where feasible, otherwise demonstrated locally.

## Limitations
- Payments are simulated; no real PayPal, PayMongo, GCash, card, or other transactions.
- No rider management or courier integration; no GPS tracking or automatic rider assignment.
- Delivery status is updated manually by seller or admin.
- Testing limited to a small number of sample or approved sellers, products, and customer accounts.
- Delivery fee is a simplified flat fee per seller order, not distance-based. *(⚠ CONFIRM WITH GROUP)*
- Personal data limited to what accounts and delivery need; no formal Data Privacy Act compliance audit.
- No native mobile app. AI recommendations, multi-currency, multi-language are out of scope.

## Expected output
Working application with the three roles · catalog, cart, checkout, order tracking · MockPay demo · seller workflow · documentation (system design, technical docs, basic user guide, testing results) · repository with setup instructions and sample data · evaluation results.
````

## File: docs/USER_GUIDE.md
````markdown
# (SP) Pamilihub — User & Operator Guide

Welcome to the **Pamilihub** user manual. This guide provides step-by-step instructions for all three platform user roles: **Customers**, **Local Food Sellers**, and **Platform Administrators**.

---

## Part 1: Customer Guide

### 1. Account Setup
1. Visit the home page and click **"Sign Up"** in the top navigation.
2. Enter your email and a secure password (minimum 6 characters).
3. Once logged in, click your profile avatar in the header to navigate to `/profile`.
4. Enter your **Full Name**, **Active Phone Number**, and **Delivery Address in San Pablo City**. Click **"Save Changes"**.

### 2. Exploring San Pablo Delicacies
1. Navigate to **"Delicacies"** (`/products`) from the header navigation.
2. Filter products by clicking category badges (*Pies and Pastries*, *Kakanin*, *Coffee*, *Snacks*).
3. Use the search input to look up specific delicacies like *"Buko Pie"*, *"Espasol"*, or store names.
4. Click on any item to view details, stock availability, pricing, and seller store location.

### 3. Shopping Cart & Multi-Seller Ordering
1. Click **"Add to Cart"** on any in-stock delicacy.
2. Open the **Cart** via the shopping bag icon or the floating mobile bar.
3. Adjust item quantities using `+` and `-` buttons or click remove to discard an item.
4. Click **"Proceed to Checkout"**.
   - If your cart contains items from multiple merchants, the platform automatically splits them by seller and applies the standard flat **₱50 delivery fee** per seller.
5. Confirm your delivery name, phone number, and street address.
6. Select your payment method: **MockPay (Simulated Digital Payment)** or **Cash on Delivery (COD)**.
7. Click **"Place Order"**.

### 4. Completing Payment & Tracking Orders
- **For MockPay:** You are redirected to `/orders/[id]/pay`. Click **"Approve Payment"** to simulate a successful payment. (Or click "Cancel Payment" to cancel and restore item stock).
- **For Cash on Delivery:** Payment status remains pending until the delivery rider/seller completes delivery.
- View live order status at **"My Orders"** (`/orders`). Order statuses will progress through:
  `Pending` → `Accepted` → `Preparing` → `Delivering` → `Completed`.

---

## Part 2: Local Food Seller Guide

### 1. Applying as a San Pablo Food Merchant
1. Register and sign in as a standard user.
2. Navigate to **"Become a Seller"** or visit `/apply`.
3. Fill out your **Store Name**, **Store Description**, and **San Pablo Barangay/Location**.
4. Submit your application. It will be sent to the platform administrator for verification.

### 2. Managing Products & Inventory
1. Once approved, the header displays **"Products"** and **"Orders"**.
2. Visit `/seller/products` to manage your catalog:
   - Click **"Add New Product"**.
   - Enter name, description, price (₱), and available stock quantity.
   - Select the delicacy category.
   - Upload a product photo (PNG, JPG, or WebP).
3. To adjust pricing or stock levels, edit the values and click update.

### 3. Fulfilling Incoming Orders
1. Navigate to `/seller/orders`.
2. The left pane displays incoming orders with status badges and timestamps.
3. Click an order to open the **Order Detail Panel** on the right:
   - Review recipient name, contact phone number, and delivery address.
   - Review ordered delicacies, quantities, and payment status.
4. Use the action buttons to advance the order through the fulfillment pipeline:
   - **Accept Order:** Confirm you have received the order.
   - **Start Preparing:** Indicate the kitchen is baking or packing the food.
   - **Mark Delivering:** Indicate the order is out for delivery in San Pablo City.
   - **Mark Completed:** Confirm delivery. For COD orders, this automatically marks the payment as paid.
5. If unable to fulfill, click **"Reject Order"**. The system will automatically restore stock and simulate a refund if already paid.

---

## Part 3: Platform Administrator Guide

### 1. Executive Dashboard (`/admin/dashboard`)
- Review real-time Gross Merchandise Value (GMV) across completed orders.
- Track total orders and fulfillment distribution across pipeline stages.
- Monitor active vs. pending seller applications and catalog inventory levels.

### 2. Merchant Verification (`/admin/sellers`)
1. Open the **"Approvals"** tab.
2. Review applicant store names, descriptions, and owner contact details.
3. Click **"Approve"** to promote the applicant's account to the `seller` role, enabling them to upload products and receive orders.
4. Click **"Reject"** if the merchant does not meet local food standards.

### 3. Platform Order & Payment Audit (`/admin/orders`)
- Filter all orders across the entire platform by order fulfillment status, payment status, or keyword search.
- Audit order timestamps, delivery addresses, and payment transactions.

### 4. Catalog Moderation (`/admin/products`)
- Review all product listings across all San Pablo merchants.
- If a listing violates platform guidelines, click **"Remove Listing"** to unpublish the product.

### 5. Product Categories (`/admin/categories`)
- Add new categories (e.g., *Pasalubong*, *Beverages*).
- Rename or delete existing categories.

### 6. User Directory (`/admin/users`)
- Inspect registered user profiles, contact information, roles, and linked merchant stores.
````

## File: docs/WORKFLOW.md
````markdown
# WORKFLOW

## Handoff order
`planner → database → backend → frontend → qa → docs-evaluation`, with QA sending bugs back to the owning agent until the day's tasks pass.

```
Planner (tasks for the day)
   ↓
Database (schema, RLS, seed)
   ↓
Backend (actions, API route, validation)
   ↓
Frontend (pages, UI, responsive)
   ↓
QA (test cases, Postman) ──bugs──► owning agent
   ↓
Docs/Evaluation (guide, results)
```

## One-week plan *(working schedule from the proposal; the group may adjust)*
| Day | Planned work | Lead agents |
|---|---|---|
| 1 | Finalize requirements; Figma wireframes; database schema; Supabase setup, roles, RLS; begin seller interviews and buyer survey. | planner, database, docs-evaluation |
| 2 | Authentication, profiles, seller application, admin approval. | backend, frontend, database |
| 3 | Product management, image upload, categories, catalog, search, product detail pages. | backend, frontend |
| 4 | Cart, checkout, per-seller order creation, stock rules. | backend, frontend, database |
| 5 | MockPay API route, cash on delivery, order tracking, seller order management. | backend, frontend |
| 6 | Admin dashboard, validation and system messages, responsive polish, functional testing, Postman testing. | frontend, qa, backend |
| 7 | User evaluation, fixes, documentation, deployment, demo preparation. | qa, docs-evaluation, planner |

## Daily loop
1. Planner reads this file and writes the day's task list with owners.
2. Each agent works only on its tasks, in its files, on its own branch.
3. Agents leave a short handoff note: what was done, files touched, what the next agent needs.
4. QA tests finished tasks against the definition of done in `docs/CONVENTIONS.md`.
5. Planner updates status and carries unfinished work forward; core features take priority over optional enhancements.

## Priorities if time runs short
1. Auth + roles + RLS
2. Catalog, cart, checkout
3. MockPay + COD + order status
4. Seller order management
5. Admin approval and monitoring
6. Responsive polish and messages
7. Optional enhancements (reviews, sales summary) — only if everything above works
````

## File: scripts/seed-images.ts
````typescript
/**
 * Uploads demo product images to Supabase Storage and updates product image_urls.
 *
 * Run with: pnpm exec tsx scripts/seed-images.ts
 * Requires: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env
 */

import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env",
  );
  process.exit(1);
}

// Service-role client bypasses RLS
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const BUCKET = "product-images";
const DEMO_FOLDER = "demo";

const PRODUCTS: Array<{
  name: string;
  svgFile: string;
  width?: number;
  height?: number;
}> = [
  { name: "Buko Pie", svgFile: "buko-pie.png" },
  { name: "Egg Pie", svgFile: "egg-pie.png" },
  { name: "Biko", svgFile: "biko.png" },
  { name: "Suman", svgFile: "suman.png" },
  { name: "Barako Coffee", svgFile: "barako-coffee.png" },
];

async function ensureBucket() {
  const { data: buckets, error: listErr } = await supabase.storage.listBuckets();
  if (listErr) {
    console.error("Failed to list buckets:", listErr.message);
    process.exit(1);
  }

  const exists = buckets?.some((b) => b.name === BUCKET);
  if (!exists) {
    console.log(`Bucket "${BUCKET}" does not exist. Run migrations first (005_storage_bucket.sql).`);
    process.exit(1);
  }
}

async function uploadImages() {
  const imagesDir = path.join(process.cwd(), "scripts/demo-images");
  const uploaded: Record<string, string> = {};

  for (const p of PRODUCTS) {
    const filePath = path.join(imagesDir, p.svgFile);
    if (!fs.existsSync(filePath)) {
      console.error(`Image file not found: ${filePath}`);
      process.exit(1);
    }

    const fileBuffer = fs.readFileSync(filePath);
    const fileName = `${DEMO_FOLDER}/${p.svgFile.replace(/\.svg$/, ".svg")}`;

    console.log(`Uploading ${fileName}...`);

    const { error: uploadErr } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, fileBuffer, {
        contentType: "image/png",
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadErr) {
      console.error(`  Upload failed: ${uploadErr.message}`);
      continue;
    }

    const { data: urlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(fileName);

    uploaded[p.name] = urlData.publicUrl;
    console.log(`  → ${urlData.publicUrl}`);
  }

  return uploaded;
}

async function updateProducts(uploaded: Record<string, string>) {
  for (const p of PRODUCTS) {
    const url = uploaded[p.name];
    if (!url) continue;

    const { error } = await supabase
      .from("products")
      .update({ image_url: url })
      .eq("name", p.name);

    if (error) {
      console.error(`  Failed to update ${p.name}: ${error.message}`);
    } else {
      console.log(`Updated product "${p.name}" image_url → ${url}`);
    }
  }
}

async function main() {
  console.log("🖼️  Seeding demo product images...");
  await ensureBucket();
  const uploaded = await uploadImages();
  await updateProducts(uploaded);
  console.log("✅ Demo images seeded!");
}

main().catch((err) => {
  console.error("Seed images failed:", err);
  process.exit(1);
});
````

## File: scripts/seed.ts
````typescript
/**
 * Seed script for Pamilihub
 *
 * Uses the Supabase service-role key to:
 * 1. Create demo auth users (admin, sellers, customers)
 * 2. Insert profiles, sellers, categories, products
 * 3. Is idempotent — skips users that already exist
 *
 * Run with: pnpm exec tsx scripts/seed.ts
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

// Service-role client bypasses RLS
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const DEMO_USERS = [
  {
    email: "admin@pamilihub.test",
    password: "password123",
    role: "admin",
    full_name: "Platform Administrator",
    phone: "+63 917 000 0001",
    address: "San Pablo City, Laguna",
  },
  {
    email: "maria@pamilihub.test",
    password: "password123",
    role: "seller",
    full_name: "Maria Santos",
    phone: "+63 917 000 0002",
    address: "Brgy. San Rafael, San Pablo City, Laguna",
    store: {
      store_name: "Lola Mayas Bakeshop",
      description:
        "Home-baked buko pie, egg pie, and pastries from San Pablo.",
      location: "Brgy. San Rafael, San Pablo City, Laguna",
      status: "approved",
    },
  },
  {
    email: "jose@pamilihub.test",
    password: "password123",
    role: "seller",
    full_name: "Jose Reyes",
    phone: "+63 917 000 0003",
    address: "Brgy. Del Remedio, San Pablo City, Laguna",
    store: {
      store_name: "Kakanin ni Lola",
      description: "Traditional kakanin: biko, suman, sapin-sapin.",
      location: "Brgy. Del Remedio, San Pablo City, Laguna",
      status: "approved",
    },
  },
  {
    email: "pending@pamilihub.test",
    password: "password123",
    role: "seller",
    full_name: "Pending Applicant",
    phone: "+63 917 000 0004",
    address: "Brgy. San Vicente, San Pablo City, Laguna",
    store: {
      store_name: "Pending Store",
      description: "Awaiting admin approval.",
      location: "Brgy. San Vicente, San Pablo City, Laguna",
      status: "pending",
    },
  },
  {
    email: "ana@pamilihub.test",
    password: "password123",
    role: "customer",
    full_name: "Ana Customer",
    phone: "+63 917 000 0010",
    address: "Brgy. San Francisco, San Pablo City, Laguna",
  },
  {
    email: "bob@pamilihub.test",
    password: "password123",
    role: "customer",
    full_name: "Bob Buyer",
    phone: "+63 917 000 0011",
    address: "Brgy. Santa Cruz, San Pablo City, Laguna",
  },
  {
    email: "carla@pamilihub.test",
    password: "password123",
    role: "customer",
    full_name: "Carla Shopper",
    phone: "+63 917 000 0012",
    address: "Brgy. Concepcion, San Pablo City, Laguna",
  },
];

const CATEGORIES = [
  "Pies and Pastries",
  "Kakanin",
  "Coffee",
  "Snacks",
];

const PRODUCTS: Array<{
  seller_email: string;
  category: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
}> = [
  {
    seller_email: "maria@pamilihub.test",
    category: "Pies and Pastries",
    name: "Buko Pie",
    description: "Fresh young coconut pie with flaky crust.",
    price: 350.00,
    stock: 20,
    image_url: "product-images/placeholder/buko-pie.jpg",
  },
  {
    seller_email: "maria@pamilihub.test",
    category: "Pies and Pastries",
    name: "Egg Pie",
    description: "Creamy custard egg pie.",
    price: 250.00,
    stock: 15,
    image_url: "product-images/placeholder/egg-pie.jpg",
  },
  {
    seller_email: "jose@pamilihub.test",
    category: "Kakanin",
    name: "Biko",
    description: "Sticky rice cake with coconut caramel topping.",
    price: 120.00,
    stock: 30,
    image_url: "product-images/placeholder/biko.jpg",
  },
  {
    seller_email: "jose@pamilihub.test",
    category: "Kakanin",
    name: "Suman",
    description: "Sticky rice in coconut milk, wrapped in banana leaves.",
    price: 80.00,
    stock: 40,
    image_url: "product-images/placeholder/suman.jpg",
  },
  {
    seller_email: "jose@pamilihub.test",
    category: "Coffee",
    name: "Barako Coffee",
    description: "Locally roasted Barako coffee beans.",
    price: 200.00,
    stock: 25,
    image_url: "product-images/placeholder/barako-coffee.jpg",
  },
];

async function main() {
  console.log("🌱 Starting seed...");

  // 1. Create categories
  const categoryIds: Record<string, string> = {};
  for (const name of CATEGORIES) {
    const { data, error } = await supabase
      .from("categories")
      .upsert({ name }, { onConflict: "name" })
      .select("id")
      .single();

    if (error) {
      console.error(`Failed to upsert category "${name}":`, error.message);
      continue;
    }
    categoryIds[name] = data.id;
    console.log(`  Category: ${name} → ${data.id}`);
  }

  // 2. Create users, profiles, sellers, products
  for (const u of DEMO_USERS) {
    // Look up existing user first (idempotent)
    const { data: users, error: listErr } =
      await supabase.auth.admin.listUsers();
    if (listErr) {
      console.error("    Failed to list users:", listErr.message);
      continue;
    }
    const existing = users.users.find((x) => x.email === u.email);

    let authUser: { id: string; email?: string } | null = null;

    if (existing) {
      authUser = existing;
      console.log(`  User: ${u.email} → ${existing.id} (existing)`);
    } else {
      // Create auth user
      const { data, error } = await supabase.auth.admin.createUser({
        email: u.email,
        password: u.password,
        email_confirm: true,
        user_metadata: { full_name: u.full_name, phone: u.phone },
      });
      if (error) {
        console.error(`  Failed to create user ${u.email}:`, error.message);
        continue;
      }
      authUser = data.user;
      console.log(`  User: ${u.email} → ${data.user.id} (created)`);
    }

    const userId = authUser.id;

    // Create profile
    const { error: profileError } = await supabase.from("profiles").upsert(
      {
        id: userId,
        role: u.role,
        full_name: u.full_name,
        phone: u.phone,
        address: u.address,
      },
      { onConflict: "id" },
    );

    if (profileError) {
      console.error(`    Profile error:`, profileError.message);
    } else {
      console.log(`    Profile: ${u.role}`);
    }

    // Create seller if applicable
    if (u.store && u.role === "seller") {
      const { data: sellerData, error: sellerError } = await supabase
        .from("sellers")
        .upsert(
          {
            profile_id: userId,
            store_name: u.store.store_name,
            description: u.store.description,
            location: u.store.location,
            status: u.store.status,
          },
          { onConflict: "profile_id" },
        )
        .select("id")
        .single();

      if (sellerError) {
        console.error(`    Seller error:`, sellerError.message);
      } else {
        console.log(`    Seller: ${u.store.store_name} → ${sellerData.id}`);

        // Create products for this seller
        const sellerProducts = PRODUCTS.filter(
          (p) => p.seller_email === u.email,
        );
        for (const p of sellerProducts) {
          const categoryId = categoryIds[p.category];
          if (!categoryId) {
            console.error(`    Category "${p.category}" not found`);
            continue;
          }

          // Check if product already exists
          const { data: existing } = await supabase
            .from("products")
            .select("id")
            .eq("name", p.name)
            .eq("seller_id", sellerData.id)
            .single();

          if (existing) {
            console.log(`    Product: ${p.name} (already exists)`);
            continue;
          }

          const { error: prodError } = await supabase.from("products").insert({
            seller_id: sellerData.id,
            category_id: categoryId,
            name: p.name,
            description: p.description,
            price: p.price,
            stock: p.stock,
            image_url: p.image_url,
          });

          if (prodError) {
            console.error(`    Product "${p.name}" error:`, prodError.message);
          } else {
            console.log(`    Product: ${p.name} (₱${p.price}, stock ${p.stock})`);
          }
        }
      }
    }
  }

  console.log("✅ Seed complete!");
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
````

## File: src/app/admin/orders/page.tsx
````typescript
import Link from "next/link";
import { getAdminOrders } from "@/modules/admin/queries";
import AdminNav from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";

interface AdminOrdersPageProps {
  searchParams: {
    orderStatus?: string;
    paymentStatus?: string;
    search?: string;
  };
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const { orderStatus, paymentStatus, search } = searchParams;
  const orders = await getAdminOrders({ orderStatus, paymentStatus, search });

  const orderStatuses = [
    { value: "all", label: "All Orders" },
    { value: "pending", label: "Pending" },
    { value: "accepted", label: "Accepted" },
    { value: "preparing", label: "Preparing" },
    { value: "delivering", label: "Delivering" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const paymentStatuses = [
    { value: "all", label: "All Payments" },
    { value: "paid", label: "Paid" },
    { value: "pending", label: "Pending" },
    { value: "refunded", label: "Refunded" },
    { value: "failed", label: "Failed" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-primary/20 bg-primary/10 text-[11px] font-bold text-primary mb-1">
          <span>📦</span>
          <span>Order Monitoring</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
          Platform Orders & Payment Audit
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Real-time oversight of all customer orders, delivery states, and payment flows.
        </p>
      </div>

      <AdminNav />

      {/* Filter and Search Controls */}
      <div className="p-4 rounded-2xl border border-border bg-card shadow-sm space-y-3">
        <form method="GET" className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <input
              type="text"
              name="search"
              defaultValue={search ?? ""}
              placeholder="Search by customer name, store, phone, or order ID..."
              className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <select
            name="orderStatus"
            defaultValue={orderStatus ?? "all"}
            className="px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {orderStatuses.map((s) => (
              <option key={s.value} value={s.value}>
                Order: {s.label}
              </option>
            ))}
          </select>

          <select
            name="paymentStatus"
            defaultValue={paymentStatus ?? "all"}
            className="px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {paymentStatuses.map((p) => (
              <option key={p.value} value={p.value}>
                Payment: {p.label}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-primary text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-all shrink-0"
          >
            Filter
          </button>

          {(orderStatus || paymentStatus || search) && (
            <Link
              href="/admin/orders"
              className="px-3 py-2 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-foreground text-center"
            >
              Reset
            </Link>
          )}
        </form>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
          <span>Showing {orders.length} order{orders.length === 1 ? "" : "s"}</span>
        </div>

        {orders.length === 0 ? (
          <div className="p-12 rounded-2xl border border-dashed border-border text-center space-y-2">
            <p className="text-sm font-bold text-foreground">No orders match criteria</p>
            <p className="text-xs text-muted-foreground">Try clearing filters or search keywords.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const dateStr = new Date(order.created_at).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              });

              return (
                <div
                  key={order.id}
                  className="rounded-2xl border border-border bg-card shadow-sm p-4 sm:p-6 space-y-4"
                >
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-foreground bg-muted px-2 py-0.5 rounded border border-border">
                        #{order.id.slice(0, 8)}
                      </span>
                      <span className="text-xs text-muted-foreground">{dateStr}</span>
                      <span className="text-xs font-semibold text-muted-foreground">•</span>
                      <span className="text-xs font-extrabold text-foreground">
                        {order.seller?.store_name ?? "Store"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Payment Status Badge */}
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                          order.payment_status === "paid"
                            ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
                            : order.payment_status === "refunded"
                            ? "bg-purple-500/10 text-purple-700 border-purple-500/20"
                            : "bg-amber-500/10 text-amber-700 border-amber-500/20"
                        }`}
                      >
                        Payment: {order.payment_status} ({order.payment_method})
                      </span>

                      {/* Order Status Badge */}
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                          order.order_status === "completed"
                            ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
                            : order.order_status === "cancelled" || order.order_status === "rejected"
                            ? "bg-rose-500/10 text-rose-700 border-rose-500/20"
                            : "bg-blue-500/10 text-blue-700 border-blue-500/20"
                        }`}
                      >
                        Order: {order.order_status}
                      </span>
                    </div>
                  </div>

                  {/* Customer Delivery Details & Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-1">
                      <p className="font-bold text-foreground text-[11px] uppercase tracking-wider text-muted-foreground">
                        Delivery Destination
                      </p>
                      <p className="font-bold text-foreground">{order.delivery_name}</p>
                      <p className="text-muted-foreground font-mono">{order.delivery_phone}</p>
                      <p className="text-muted-foreground">{order.delivery_address}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-1">
                      <p className="font-bold text-foreground text-[11px] uppercase tracking-wider text-muted-foreground">
                        Financial Breakdown
                      </p>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Items Subtotal:</span>
                        <span>₱{(Number(order.total) - Number(order.delivery_fee)).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Delivery Fee (Flat):</span>
                        <span>₱{Number(order.delivery_fee).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-black text-foreground pt-1 border-t border-border">
                        <span>Grand Total:</span>
                        <span className="text-primary font-black">₱{Number(order.total).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items Table */}
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Ordered Items ({order.order_items.length})
                    </p>
                    <div className="divide-y divide-border border border-border rounded-xl overflow-hidden bg-background">
                      {order.order_items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-2.5 sm:p-3 text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-foreground">
                              {item.product?.name ?? "Delicacy Item"}
                            </span>
                            <span className="text-muted-foreground">
                              × {item.quantity} @ ₱{Number(item.unit_price).toFixed(2)}
                            </span>
                          </div>
                          <span className="font-bold text-foreground">
                            ₱{(Number(item.unit_price) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
````

## File: src/app/admin/products/page.tsx
````typescript
import Link from "next/link";
import Image from "next/image";
import { getAdminProducts } from "@/modules/admin/queries";
import { getCategories } from "@/modules/catalog/queries";
import AdminNav from "@/components/admin/AdminNav";
import AdminProductDeleteButton from "@/components/admin/AdminProductDeleteButton";

export const dynamic = "force-dynamic";

interface AdminProductsPageProps {
  searchParams: {
    categoryId?: string;
    search?: string;
  };
}

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  const { categoryId, search } = searchParams;
  const [products, categories] = await Promise.all([
    getAdminProducts({ categoryId, search }),
    getCategories(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-primary/20 bg-primary/10 text-[11px] font-bold text-primary mb-1">
          <span>🥧</span>
          <span>Catalog Governance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
          Product Moderation & Catalog Management
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Inspect food listings across all local San Pablo sellers, check inventory status, and moderate listings.
        </p>
      </div>

      <AdminNav />

      {/* Filter and Search Controls */}
      <div className="p-4 rounded-2xl border border-border bg-card shadow-sm space-y-3">
        <form method="GET" className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <input
              type="text"
              name="search"
              defaultValue={search ?? ""}
              placeholder="Search by product name, category, or store name..."
              className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <select
            name="categoryId"
            defaultValue={categoryId ?? "all"}
            className="px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Categories</option>
            {(categories ?? []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-primary text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-all shrink-0"
          >
            Filter
          </button>

          {(categoryId || search) && (
            <Link
              href="/admin/products"
              className="px-3 py-2 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-foreground text-center"
            >
              Reset
            </Link>
          )}
        </form>
      </div>

      {/* Products Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
          <span>Showing {products.length} product listing{products.length === 1 ? "" : "s"}</span>
        </div>

        {products.length === 0 ? (
          <div className="p-12 rounded-2xl border border-dashed border-border text-center space-y-2">
            <p className="text-sm font-bold text-foreground">No products match your filters</p>
            <p className="text-xs text-muted-foreground">Try clearing filters or search terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              <div
                key={p.id}
                className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Image / Placeholder */}
                  <div className="relative aspect-video w-full bg-muted border-b border-border overflow-hidden">
                    {p.image_url ? (
                      <Image
                        src={p.image_url}
                        alt={p.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-3xl text-muted-foreground/40 font-black">
                        🥧
                      </div>
                    )}
                    <div className="absolute top-2 left-2 flex gap-1">
                      <span className="px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-sm text-[10px] font-bold text-white uppercase">
                        {p.category?.name ?? "Delicacy"}
                      </span>
                    </div>
                    <div className="absolute top-2 right-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase backdrop-blur-sm ${
                          p.stock > 0
                            ? "bg-emerald-600/90 text-white"
                            : "bg-rose-600/90 text-white"
                        }`}
                      >
                        {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-extrabold text-foreground text-sm leading-snug">
                        {p.name}
                      </h3>
                      <span className="font-black text-primary text-sm whitespace-nowrap">
                        ₱{Number(p.price).toFixed(2)}
                      </span>
                    </div>

                    {p.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {p.description}
                      </p>
                    )}

                    <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                      <span className="truncate">
                        Store: <strong className="text-foreground">{p.seller?.store_name ?? "Seller"}</strong>
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                          p.seller?.status === "approved"
                            ? "bg-emerald-500/10 text-emerald-700"
                            : "bg-amber-500/10 text-amber-700"
                        }`}
                      >
                        {p.seller?.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Moderation Action */}
                <div className="p-4 pt-0 flex items-center justify-between gap-2">
                  <Link
                    href={`/products/${p.id}`}
                    target="_blank"
                    className="text-xs font-bold text-muted-foreground hover:text-foreground underline"
                  >
                    View in Catalog ↗
                  </Link>

                  <AdminProductDeleteButton productId={p.id} productName={p.name} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
````

## File: src/app/admin/users/page.tsx
````typescript
import Link from "next/link";
import { getAdminUsers } from "@/modules/admin/queries";
import AdminNav from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";

interface AdminUsersPageProps {
  searchParams: {
    role?: string;
    search?: string;
  };
}

export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
  const { role, search } = searchParams;
  const users = await getAdminUsers({ role, search });

  // Compute counts from all users if not filtered, or display counts
  const roles = [
    { value: "all", label: "All Roles" },
    { value: "customer", label: "Customer" },
    { value: "seller", label: "Seller" },
    { value: "admin", label: "Admin" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-primary/20 bg-primary/10 text-[11px] font-bold text-primary mb-1">
          <span>👥</span>
          <span>Access & Identity</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
          Platform User Directory
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Directory of registered customers, food merchants, and platform administrators.
        </p>
      </div>

      <AdminNav />

      {/* Filter and Search Controls */}
      <div className="p-4 rounded-2xl border border-border bg-card shadow-sm space-y-3">
        <form method="GET" className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <input
              type="text"
              name="search"
              defaultValue={search ?? ""}
              placeholder="Search by name, phone, address, or store name..."
              className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <select
            name="role"
            defaultValue={role ?? "all"}
            className="px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {roles.map((r) => (
              <option key={r.value} value={r.value}>
                Role: {r.label}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-primary text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-all shrink-0"
          >
            Filter
          </button>

          {(role || search) && (
            <Link
              href="/admin/users"
              className="px-3 py-2 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-foreground text-center"
            >
              Reset
            </Link>
          )}
        </form>
      </div>

      {/* Users Table / Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
          <span>Showing {users.length} registered user{users.length === 1 ? "" : "s"}</span>
        </div>

        {users.length === 0 ? (
          <div className="p-12 rounded-2xl border border-dashed border-border text-center space-y-2">
            <p className="text-sm font-bold text-foreground">No users match your filters</p>
            <p className="text-xs text-muted-foreground">Try clearing your search query or role filter.</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden divide-y divide-border">
            {users.map((user) => {
              const joinedDate = new Date(user.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });

              return (
                <div
                  key={user.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  {/* Left: Avatar + Details */}
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`h-10 w-10 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 ${
                        user.role === "admin"
                          ? "bg-purple-500/10 text-purple-700 border border-purple-500/20"
                          : user.role === "seller"
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "bg-muted text-muted-foreground border border-border"
                      }`}
                    >
                      {user.full_name ? user.full_name[0].toUpperCase() : user.role[0].toUpperCase()}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground text-sm">
                          {user.full_name || "Anonymous User"}
                        </span>
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                            user.role === "admin"
                              ? "bg-purple-500/10 text-purple-700 border-purple-500/20"
                              : user.role === "seller"
                              ? "bg-primary/10 text-primary border border-primary/20"
                              : "bg-muted text-muted-foreground border border-border"
                          }`}
                        >
                          {user.role}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-muted-foreground text-xs">
                        {user.phone ? (
                          <span>📞 {user.phone}</span>
                        ) : (
                          <span className="italic">No phone set</span>
                        )}
                        {user.address ? (
                          <span>📍 {user.address}</span>
                        ) : (
                          <span className="italic">No address set</span>
                        )}
                      </div>

                      {user.seller && (
                        <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-primary">
                          <span>🏪 Store:</span>
                          <span className="font-bold">{user.seller.store_name}</span>
                          <span className="text-[10px] uppercase font-bold text-muted-foreground">
                            ({user.seller.status})
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Timestamp & ID */}
                  <div className="text-right sm:self-center shrink-0 text-muted-foreground space-y-0.5">
                    <p className="text-[11px]">Joined {joinedDate}</p>
                    <p className="font-mono text-[10px] text-muted-foreground/70">
                      ID: {user.id.slice(0, 8)}...
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
````

## File: src/app/manifest.ts
````typescript
import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Pamilihub — San Pablo City Local Delicacies",
    short_name: "Pamilihub",
    description: "Web-based e-commerce platform for authentic food delicacies of San Pablo City, Laguna",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#e11d48",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
````

## File: src/components/admin/AdminProductDeleteButton.tsx
````typescript
"use client";

import { useTransition } from "react";
import { adminDeleteProductAction } from "@/modules/admin/actions";

interface AdminProductDeleteButtonProps {
  productId: string;
  productName: string;
}

export default function AdminProductDeleteButton({
  productId,
  productName,
}: AdminProductDeleteButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!window.confirm(`Are you sure you want to remove "${productName}" from the platform? This cannot be undone.`)) {
      return;
    }

    startTransition(async () => {
      const fd = new FormData();
      fd.append("product_id", productId);
      const res = await adminDeleteProductAction(null, fd);
      if (!res.success) {
        alert(res.message);
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="px-2.5 py-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-700 hover:bg-rose-500/20 text-xs font-bold transition-all disabled:opacity-50"
    >
      {isPending ? "Removing..." : "Remove Listing"}
    </button>
  );
}
````

## File: src/components/seller/orders/OrderCard.tsx
````typescript
"use client";

import type { OrderSummary, OrderStatus } from "@/modules/orders/types";
import { OrderStatusBadge, PaymentBadge } from "./StatusBadge";

function formatPHP(amount: number) {
  return new Intl.NumberFormat("fil-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("fil-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(iso));
}

const NEW_THRESHOLD_MS = 15 * 60 * 1000; // 15 minutes

function isNew(createdAt: string) {
  return Date.now() - new Date(createdAt).getTime() < NEW_THRESHOLD_MS;
}

interface OrderCardProps {
  order: OrderSummary;
  isSelected: boolean;
  onClick: () => void;
}

export function OrderCard({ order, isSelected, onClick }: OrderCardProps) {
  const shortId = `#${order.id.slice(0, 8).toUpperCase()}`;
  const newOrder = isNew(order.created_at);

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`Order ${shortId} from ${order.delivery_name}, ${formatPHP(order.total)}`}
      aria-pressed={isSelected}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className={`
        relative border-b border-border px-4 py-4 cursor-pointer
        transition-colors duration-100 outline-none
        focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1
        ${isSelected
          ? "bg-primary/5 border-l-2 border-l-primary"
          : "hover:bg-muted/40"
        }
      `}
    >
      {/* NEW badge */}
      {newOrder && (
        <span
          className="absolute top-3 right-3 inline-flex items-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 leading-none"
          aria-label="New order"
        >
          NEW
        </span>
      )}

      <div className="flex items-start justify-between gap-3 pr-8">
        {/* Left: customer + preview */}
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-sm text-foreground truncate">
            {order.delivery_name}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">{shortId}</p>
          {order.item_preview && (
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {order.item_preview}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            {formatDate(order.created_at)}
          </p>
        </div>

        {/* Right: amount + badges */}
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className="text-sm font-bold text-foreground">
            {formatPHP(order.total)}
          </span>
          <OrderStatusBadge status={order.order_status as OrderStatus} />
          <PaymentBadge
            status={order.payment_status as any}
            method={order.payment_method as any}
          />
        </div>
      </div>
    </article>
  );
}
````

## File: src/components/seller/orders/OrderList.tsx
````typescript
"use client";

import type { OrderSummary, OrderStatus } from "@/modules/orders/types";
import { OrderCard } from "./OrderCard";
import { OrderListSkeleton } from "./Skeletons";

const FILTER_TABS: { label: string; value: string }[] = [
  { label: "All",       value: "all" },
  { label: "Pending",   value: "pending" },
  { label: "To Ship",   value: "to_ship" },
  { label: "Completed", value: "completed" },
];

function matchesFilter(order: OrderSummary, filter: string): boolean {
  if (filter === "all") return true;
  if (filter === "pending")
    return order.order_status === "pending" || order.order_status === "accepted";
  if (filter === "to_ship")
    return order.order_status === "preparing" || order.order_status === "delivering";
  if (filter === "completed")
    return order.order_status === "completed" || order.order_status === "rejected" || order.order_status === "cancelled";
  return true;
}

function matchesSearch(order: OrderSummary, q: string): boolean {
  if (!q.trim()) return true;
  const lower = q.toLowerCase();
  return (
    order.delivery_name.toLowerCase().includes(lower) ||
    order.id.toLowerCase().includes(lower)
  );
}

interface OrderListProps {
  orders: OrderSummary[];
  loading: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
  filter: string;
  onFilterChange: (f: string) => void;
  search: string;
  onSearchChange: (s: string) => void;
}

export function OrderList({
  orders,
  loading,
  selectedId,
  onSelect,
  filter,
  onFilterChange,
  search,
  onSearchChange,
}: OrderListProps) {
  const visible = orders
    .filter((o) => matchesFilter(o, filter))
    .filter((o) => matchesSearch(o, search));

  return (
    <div className="flex flex-col h-full">
      {/* Search bar */}
      <div className="px-4 pt-4 pb-2">
        <label htmlFor="order-search" className="sr-only">
          Search orders
        </label>
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1 0 6.5 6.5a7.5 7.5 0 0 0 10.65 10.65Z"
            />
          </svg>
          <input
            id="order-search"
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name or order #"
            className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Filter tabs */}
      <div
        role="tablist"
        aria-label="Order filters"
        className="flex gap-1 px-4 pb-2 border-b border-border"
      >
        {FILTER_TABS.map((tab) => {
          const count = orders.filter((o) => matchesFilter(o, tab.value)).length;
          return (
            <button
              key={tab.value}
              role="tab"
              aria-selected={filter === tab.value}
              onClick={() => onFilterChange(tab.value)}
              className={`
                flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium
                transition-colors outline-none
                focus-visible:ring-2 focus-visible:ring-ring
                ${filter === tab.value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }
              `}
            >
              {tab.label}
              <span
                className={`
                  rounded-full px-1.5 py-0.5 text-[10px] leading-none
                  ${filter === tab.value
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                  }
                `}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* List body */}
      <div
        role="list"
        aria-label="Order list"
        className="flex-1 overflow-y-auto"
      >
        {loading ? (
          <OrderListSkeleton />
        ) : visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <svg
              className="mb-4 h-12 w-12 text-muted-foreground/40"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-3-3v6M3.75 9A6.75 6.75 0 0 1 10.5 2.25h3A6.75 6.75 0 0 1 20.25 9v.75M3.75 9v.75A6.75 6.75 0 0 0 10.5 16.5h3a6.75 6.75 0 0 0 6.75-6.75V9"
              />
            </svg>
            <p className="text-sm font-medium text-muted-foreground">
              {search ? "No orders match your search." : "No orders here yet."}
            </p>
            {search && (
              <button
                onClick={() => onSearchChange("")}
                className="mt-2 text-xs text-primary hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          visible.map((order) => (
            <div key={order.id} role="listitem">
              <OrderCard
                order={order}
                isSelected={selectedId === order.id}
                onClick={() => onSelect(order.id)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
````

## File: src/components/seller/orders/Skeletons.tsx
````typescript
/** Loading skeletons for the order list and detail panel. */

export function OrderCardSkeleton() {
  return (
    <div
      className="border-b border-border px-4 py-4 animate-pulse"
      aria-hidden="true"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <div className="h-4 w-32 rounded bg-muted" />
          <div className="h-3 w-20 rounded bg-muted" />
          <div className="h-3 w-48 rounded bg-muted" />
        </div>
        <div className="space-y-2 text-right">
          <div className="h-4 w-20 rounded bg-muted" />
          <div className="h-5 w-16 rounded-full bg-muted" />
        </div>
      </div>
    </div>
  );
}

export function OrderListSkeleton() {
  return (
    <div role="status" aria-label="Loading orders…">
      {Array.from({ length: 6 }).map((_, i) => (
        <OrderCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function OrderDetailSkeleton() {
  return (
    <div className="p-6 space-y-6 animate-pulse" aria-hidden="true">
      <div className="space-y-2">
        <div className="h-5 w-40 rounded bg-muted" />
        <div className="h-3 w-24 rounded bg-muted" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex justify-between">
            <div className="h-4 w-40 rounded bg-muted" />
            <div className="h-4 w-16 rounded bg-muted" />
          </div>
        ))}
      </div>
      <div className="h-px bg-border" />
      <div className="space-y-2">
        <div className="h-4 w-32 rounded bg-muted" />
        <div className="h-3 w-56 rounded bg-muted" />
        <div className="h-3 w-44 rounded bg-muted" />
      </div>
    </div>
  );
}
````

## File: src/components/seller/orders/StatusBadge.tsx
````typescript
import type { OrderStatus, PaymentStatus, PaymentMethod } from "@/modules/orders/types";

// ─── Order status ────────────────────────────────────────────────────────────

const ORDER_STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  pending:    { label: "Pending",    className: "bg-amber-100 text-amber-800 border-amber-200" },
  accepted:   { label: "Accepted",   className: "bg-blue-100 text-blue-800 border-blue-200" },
  rejected:   { label: "Rejected",   className: "bg-red-100 text-red-700 border-red-200" },
  preparing:  { label: "Preparing",  className: "bg-orange-100 text-orange-800 border-orange-200" },
  delivering: { label: "Delivering", className: "bg-purple-100 text-purple-800 border-purple-200" },
  completed:  { label: "Completed",  className: "bg-green-100 text-green-800 border-green-200" },
  cancelled:  { label: "Cancelled",  className: "bg-gray-100 text-gray-600 border-gray-200" },
};

// ─── Payment status ───────────────────────────────────────────────────────────

const PAYMENT_STATUS_CONFIG: Record<
  PaymentStatus,
  { label: string; className: string }
> = {
  pending:   { label: "Pending",   className: "bg-amber-50 text-amber-700 border-amber-200" },
  paid:      { label: "Paid",      className: "bg-green-100 text-green-800 border-green-200" },
  failed:    { label: "Failed",    className: "bg-red-100 text-red-700 border-red-200" },
  cancelled: { label: "Cancelled", className: "bg-gray-100 text-gray-600 border-gray-200" },
  refunded:  { label: "Refunded",  className: "bg-blue-100 text-blue-800 border-blue-200" },
};

const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  mockpay: "MockPay",
  cod: "COD",
};

// ─── Components ───────────────────────────────────────────────────────────────

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: "sm" | "md";
}

export function OrderStatusBadge({ status, size = "sm" }: OrderStatusBadgeProps) {
  const cfg = ORDER_STATUS_CONFIG[status] ?? ORDER_STATUS_CONFIG.pending;
  const sizeClass = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1";
  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${sizeClass} ${cfg.className}`}
      aria-label={`Order status: ${cfg.label}`}
    >
      {cfg.label}
    </span>
  );
}

interface PaymentBadgeProps {
  status: PaymentStatus;
  method: PaymentMethod;
  size?: "sm" | "md";
}

export function PaymentBadge({ status, method, size = "sm" }: PaymentBadgeProps) {
  const cfg = PAYMENT_STATUS_CONFIG[status] ?? PAYMENT_STATUS_CONFIG.pending;
  const methodLabel = PAYMENT_METHOD_LABEL[method] ?? method.toUpperCase();
  const sizeClass = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-medium ${sizeClass} ${cfg.className}`}
      aria-label={`Payment: ${methodLabel}, ${cfg.label}`}
    >
      <span className="opacity-70">{methodLabel}</span>
      <span>·</span>
      <span>{cfg.label}</span>
    </span>
  );
}
````

## File: src/components/ui/badge.tsx
````typescript
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground border-border",
        success: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700",
        warning: "border-amber-500/20 bg-amber-500/10 text-amber-700",
        info: "border-blue-500/20 bg-blue-500/10 text-blue-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
````

## File: src/components/ui/button.tsx
````typescript
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-xs font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-border bg-background hover:bg-muted hover:text-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-muted hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-11 rounded-xl px-6 text-sm",
        icon: "h-9 w-9 sm:h-10 sm:w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
````

## File: src/components/ui/card.tsx
````typescript
import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-2xl border border-border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-5 sm:p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg sm:text-xl font-extrabold leading-tight tracking-tight text-foreground",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-xs sm:text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-5 sm:p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-5 sm:p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
````

## File: src/components/ui/input.tsx
````typescript
import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-xl border border-input bg-background px-3.5 py-2 text-xs sm:text-sm text-foreground shadow-sm transition-colors file:border-0 file:bg-transparent file:text-xs file:font-semibold placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
````

## File: src/lib/auth/roles.ts
````typescript
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type AppUser = {
  id: string;
  email: string | null;
  role: "customer" | "seller" | "admin";
};

/** Cached fetcher for current user to deduplicate round-trips within the same request. */
const fetchCurrentUser = cache(async () => {
  const sb = createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return null;

  const { data: profile } = await sb
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return {
    id: user.id,
    email: user.email,
    role: (profile?.role as AppUser["role"]) ?? "customer",
  } as AppUser;
});

/**
 * Returns the current authenticated user with their profile role,
 * or null if not signed in. Deduplicated across RSC render tree.
 */
export async function getCurrentUser(supabase?: ReturnType<typeof createClient>) {
  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    return {
      id: user.id,
      email: user.email,
      role: (profile?.role as AppUser["role"]) ?? "customer",
    } as AppUser;
  }

  return fetchCurrentUser();
}

/**
 * Requires the caller to be signed in.
 * Throws a redirect to /login if not.
 */
export async function requireUser() {
  const supabase = createClient();
  const user = await getCurrentUser(supabase);
  if (!user) redirect("/login");
  return user;
}

/**
 * Requires the caller to have one of the given roles.
 * Throws a redirect to /unauthorized if not.
 */
export async function requireRole(...allowedRoles: AppUser["role"][]) {
  const user = await requireUser();
  if (!allowedRoles.includes(user.role)) {
    redirect("/unauthorized");
  }
  return user;
}

/**
 * Requires the caller to be an admin.
 */
export async function requireAdmin() {
  return requireRole("admin");
}
````

## File: src/lib/utils.ts
````typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
````

## File: src/modules/accounts/queries.ts
````typescript
"use server";

import { createClient } from "@/lib/supabase/server";

export async function getProfile() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, role, full_name, phone, address, created_at, updated_at")
    .eq("id", user.id)
    .single();

  if (error) return null;
  return data;
}

export async function getSellerStatus() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("sellers")
    .select("id, store_name, status, created_at")
    .eq("profile_id", user.id)
    .single();

  if (error) return null;
  return data;
}
````

## File: src/modules/accounts/schemas.ts
````typescript
import { z } from "zod";

// --- Auth ---

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128),
  full_name: z.string().min(1, "Full name is required").trim(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// --- Profile ---

export const profileUpdateSchema = z.object({
  full_name: z.string().min(1, "Full name is required").trim().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

// --- Seller application ---

export const sellerApplicationSchema = z.object({
  store_name: z.string().min(1, "Store name is required").trim(),
  description: z.string().max(500).optional(),
  location: z.string().min(1, "Location is required").trim(),
});
````

## File: src/modules/admin/queries.ts
````typescript
import { createClient } from "@/lib/supabase/server";

export type AdminDashboardMetrics = {
  totalRevenue: number;
  ordersCount: {
    total: number;
    pending: number;
    accepted: number;
    preparing: number;
    delivering: number;
    completed: number;
    cancelled: number;
    rejected: number;
  };
  sellersCount: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
  };
  usersCount: {
    total: number;
    customer: number;
    seller: number;
    admin: number;
  };
  productsCount: {
    total: number;
    inStock: number;
    outOfStock: number;
  };
  recentOrders: Array<{
    id: string;
    total: number;
    payment_method: string;
    payment_status: string;
    order_status: string;
    created_at: string;
    delivery_name: string;
    seller?: {
      store_name: string;
    } | null;
  }>;
  pendingSellers: Array<{
    id: string;
    store_name: string;
    location: string | null;
    created_at: string;
    profile?: {
      full_name: string | null;
      phone: string | null;
    } | null;
  }>;
};

export async function getAdminDashboardMetrics(): Promise<AdminDashboardMetrics> {
  const supabase = createClient();

  const [
    { data: orders },
    { data: sellers },
    { data: profiles },
    { data: products },
    { data: recentOrdersData },
    { data: pendingSellersData },
  ] = await Promise.all([
    supabase.from("orders").select("id, total, payment_status, order_status"),
    supabase.from("sellers").select("id, status"),
    supabase.from("profiles").select("id, role"),
    supabase.from("products").select("id, stock"),
    supabase
      .from("orders")
      .select("id, total, payment_method, payment_status, order_status, created_at, delivery_name, seller:sellers(store_name)")
      .order("created_at", { ascending: false })
      .limit(6),
    supabase
      .from("sellers")
      .select("id, store_name, location, created_at, profile:profiles(full_name, phone)")
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  // Orders breakdown & revenue
  let totalRevenue = 0;
  const ordersCount = {
    total: orders?.length ?? 0,
    pending: 0,
    accepted: 0,
    preparing: 0,
    delivering: 0,
    completed: 0,
    cancelled: 0,
    rejected: 0,
  };

  (orders ?? []).forEach((o) => {
    if (o.payment_status === "paid" || o.order_status === "completed") {
      totalRevenue += Number(o.total || 0);
    }
    const status = o.order_status as keyof typeof ordersCount;
    if (status in ordersCount && status !== "total") {
      ordersCount[status]++;
    }
  });

  // Sellers breakdown
  const sellersCount = {
    total: sellers?.length ?? 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  };
  (sellers ?? []).forEach((s) => {
    if (s.status === "approved") sellersCount.approved++;
    else if (s.status === "pending") sellersCount.pending++;
    else if (s.status === "rejected") sellersCount.rejected++;
  });

  // Users breakdown
  const usersCount = {
    total: profiles?.length ?? 0,
    customer: 0,
    seller: 0,
    admin: 0,
  };
  (profiles ?? []).forEach((p) => {
    if (p.role === "customer") usersCount.customer++;
    else if (p.role === "seller") usersCount.seller++;
    else if (p.role === "admin") usersCount.admin++;
  });

  // Products breakdown
  const productsCount = {
    total: products?.length ?? 0,
    inStock: 0,
    outOfStock: 0,
  };
  (products ?? []).forEach((p) => {
    if ((p.stock ?? 0) > 0) productsCount.inStock++;
    else productsCount.outOfStock++;
  });

  return {
    totalRevenue,
    ordersCount,
    sellersCount,
    usersCount,
    productsCount,
    recentOrders: (recentOrdersData ?? []) as unknown as AdminDashboardMetrics["recentOrders"],
    pendingSellers: (pendingSellersData ?? []) as unknown as AdminDashboardMetrics["pendingSellers"],
  };
}

export type AdminOrderRow = {
  id: string;
  customer_id: string;
  seller_id: string;
  delivery_name: string;
  delivery_phone: string;
  delivery_address: string;
  delivery_fee: number;
  total: number;
  payment_method: string;
  payment_status: string;
  order_status: string;
  created_at: string;
  customer: {
    id: string;
    full_name: string | null;
    phone: string | null;
    address: string | null;
  } | null;
  seller: {
    id: string;
    store_name: string;
    location: string | null;
  } | null;
  order_items: Array<{
    id: string;
    quantity: number;
    unit_price: number;
    product: {
      name: string;
      image_url: string | null;
    } | null;
  }>;
  payments: Array<{
    id: string;
    method: string;
    status: string;
    created_at: string;
  }>;
};

export async function getAdminOrders(filters?: {
  orderStatus?: string;
  paymentStatus?: string;
  search?: string;
}): Promise<AdminOrderRow[]> {
  const supabase = createClient();

  let query = supabase
    .from("orders")
    .select(`
      id,
      customer_id,
      seller_id,
      delivery_name,
      delivery_phone,
      delivery_address,
      delivery_fee,
      total,
      payment_method,
      payment_status,
      order_status,
      created_at,
      customer:profiles(id, full_name, phone, address),
      seller:sellers(id, store_name, location),
      order_items(id, quantity, unit_price, product:products(name, image_url)),
      payments(id, method, status, created_at)
    `)
    .order("created_at", { ascending: false });

  if (filters?.orderStatus && filters.orderStatus !== "all") {
    query = query.eq("order_status", filters.orderStatus);
  }

  if (filters?.paymentStatus && filters.paymentStatus !== "all") {
    query = query.eq("payment_status", filters.paymentStatus);
  }

  const { data, error } = await query;
  if (error || !data) return [];

  let results = data as unknown as AdminOrderRow[];

  if (filters?.search?.trim()) {
    const term = filters.search.trim().toLowerCase();
    results = results.filter((o) => {
      const matchId = o.id.toLowerCase().includes(term);
      const matchName = o.delivery_name.toLowerCase().includes(term);
      const matchSeller = o.seller?.store_name.toLowerCase().includes(term);
      const matchPhone = o.delivery_phone.toLowerCase().includes(term);
      return matchId || matchName || matchSeller || matchPhone;
    });
  }

  return results;
}

export type AdminProductRow = {
  id: string;
  seller_id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  created_at: string;
  seller: {
    id: string;
    store_name: string;
    status: string;
    location: string | null;
  } | null;
  category: {
    id: string;
    name: string;
  } | null;
};

export async function getAdminProducts(filters?: {
  categoryId?: string;
  search?: string;
}): Promise<AdminProductRow[]> {
  const supabase = createClient();

  let query = supabase
    .from("products")
    .select(`
      id,
      seller_id,
      category_id,
      name,
      description,
      price,
      stock,
      image_url,
      created_at,
      seller:sellers(id, store_name, status, location),
      category:categories(id, name)
    `)
    .order("created_at", { ascending: false });

  if (filters?.categoryId && filters.categoryId !== "all") {
    query = query.eq("category_id", filters.categoryId);
  }

  const { data, error } = await query;
  if (error || !data) return [];

  let results = data as unknown as AdminProductRow[];

  if (filters?.search?.trim()) {
    const term = filters.search.trim().toLowerCase();
    results = results.filter((p) => {
      const matchName = p.name.toLowerCase().includes(term);
      const matchSeller = p.seller?.store_name.toLowerCase().includes(term);
      const matchCat = p.category?.name.toLowerCase().includes(term);
      return matchName || matchSeller || matchCat;
    });
  }

  return results;
}

export type AdminUserRow = {
  id: string;
  role: "customer" | "seller" | "admin";
  full_name: string | null;
  phone: string | null;
  address: string | null;
  created_at: string;
  seller?: {
    store_name: string;
    status: string;
  } | null;
};

export async function getAdminUsers(filters?: {
  role?: string;
  search?: string;
}): Promise<AdminUserRow[]> {
  const supabase = createClient();

  let query = supabase
    .from("profiles")
    .select(`
      id,
      role,
      full_name,
      phone,
      address,
      created_at,
      seller:sellers(store_name, status)
    `)
    .order("created_at", { ascending: false });

  if (filters?.role && filters.role !== "all") {
    query = query.eq("role", filters.role);
  }

  const { data, error } = await query;
  if (error || !data) return [];

  let results = data as unknown as AdminUserRow[];

  if (filters?.search?.trim()) {
    const term = filters.search.trim().toLowerCase();
    results = results.filter((u) => {
      const matchName = (u.full_name ?? "").toLowerCase().includes(term);
      const matchPhone = (u.phone ?? "").toLowerCase().includes(term);
      const matchAddress = (u.address ?? "").toLowerCase().includes(term);
      const matchStore = (u.seller?.store_name ?? "").toLowerCase().includes(term);
      return matchName || matchPhone || matchAddress || matchStore;
    });
  }

  return results;
}
````

## File: src/modules/orders/types.ts
````typescript
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
}

/** Full order loaded only when the seller clicks a row (lazy). */
export interface OrderDetail extends OrderSummary {
  order_items: OrderItem[];
}
````

## File: src/middleware.ts
````typescript
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          supabaseResponse = NextResponse.next({
            request,
          });
          supabaseResponse.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          supabaseResponse = NextResponse.next({
            request,
          });
          supabaseResponse.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  await supabase.auth.getUser();

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
````

## File: supabase/migrations/002_helper_functions.sql
````sql
-- Migration: 002_helper_functions
-- Role helper functions and auth trigger for auto-creating profiles

-- Helper: is_admin() — returns true if current auth user has admin role
create or replace function public.is_admin()
returns boolean as $$
declare
  user_role text;
begin
  select p.role into user_role
  from public.profiles p
  where p.id = auth.uid();

  return user_role = 'admin';
end;
$$ language plpgsql stable;

-- Helper: current_seller_id() — returns the seller id linked to current auth user
create or replace function public.current_seller_id()
returns uuid as $$
declare
  seller_id uuid;
begin
  select s.id into seller_id
  from public.sellers s
  where s.profile_id = auth.uid();

  return seller_id;
end;
$$ language plpgsql stable;

-- Trigger: auto-create profiles row when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role, full_name, phone, address)
  values (new.id, 'customer', new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'phone', new.raw_user_meta_data->>'address')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Attach trigger to auth.users (Supabase Auth)
do $$
begin
  if not exists (
    select 1 from pg_trigger t
    join pg_class c on c.oid = t.tgrelid
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'auth' and c.relname = 'users' and t.tgname = 'on_auth_user_created'
  ) then
    create trigger on_auth_user_created
      after insert on auth.users
      for each row
      execute function public.handle_new_user();
  end if;
end $$;
````

## File: supabase/migrations/003_rls_policies.sql
````sql
-- Migration: 003_rls_policies
-- Row Level Security policies per docs/DATABASE.md matrix

-- Enable RLS on all tables (idempotent)
alter table public.profiles enable row level security;
alter table public.sellers enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;

-- Force RLS so even table owner is subject to policies (idempotent)
alter table public.profiles force row level security;
alter table public.sellers force row level security;
alter table public.categories force row level security;
alter table public.products force row level security;
alter table public.orders force row level security;
alter table public.order_items force row level security;
alter table public.payments force row level security;

-- Helper: create a policy only if it does not already exist (idempotent)
create or replace function public.ensure_policy(
  p_table regclass,
  p_name text,
  p_cmd text,
  p_qual text,
  p_with_check text
) returns void as $$
declare
  v_sql text;
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = p_table::text
      and policyname = p_name
  ) then
    if p_cmd = 'select' then
      v_sql := format('create policy %I on %I for %s using (%s)',
        p_name, p_table, p_cmd, coalesce(p_qual, 'true'));
    elsif p_cmd = 'insert' then
      v_sql := format('create policy %I on %I for %s with check (%s)',
        p_name, p_table, p_cmd, coalesce(p_with_check, 'true'));
    elsif p_cmd = 'delete' then
      v_sql := format('create policy %I on %I for %s using (%s)',
        p_name, p_table, p_cmd, coalesce(p_qual, 'true'));
    else
      v_sql := format('create policy %I on %I for %s using (%s) with check (%s)',
        p_name, p_table, p_cmd, coalesce(p_qual, 'true'), coalesce(p_with_check, 'true'));
    end if;
    execute v_sql;
  end if;
end;
$$ language plpgsql;

-- ============================================================
-- profiles: read/update own; admin all
-- ============================================================
select public.ensure_policy('public.profiles', 'profiles_read_own', 'select', 'auth.uid() = id', null);

select public.ensure_policy('public.profiles', 'profiles_write_own', 'update', 'auth.uid() = id', 'auth.uid() = id');

select public.ensure_policy('public.profiles', 'profiles_admin_all', 'all', 'public.is_admin()', 'public.is_admin()');

-- Role changes are restricted to admins at the application layer (server actions),
-- so a non-admin caller cannot set role='admin' through the API.

-- ============================================================
-- sellers: customers read approved stores; sellers read/update own; admin all
-- ============================================================
select public.ensure_policy('public.sellers', 'sellers_read_approved', 'select', 'status = ''approved''', null);

select public.ensure_policy('public.sellers', 'sellers_own', 'all', 'profile_id = auth.uid()', 'profile_id = auth.uid()');

select public.ensure_policy('public.sellers', 'sellers_admin_all', 'all', 'public.is_admin()', 'public.is_admin()');

-- ============================================================
-- categories: read all; admin full control
-- ============================================================
select public.ensure_policy('public.categories', 'categories_read', 'select', 'true', null);

select public.ensure_policy('public.categories', 'categories_admin_all', 'all', 'public.is_admin()', 'public.is_admin()');

-- ============================================================
-- products: customers read approved sellers' products;
-- sellers CRUD own products only if seller is approved; admin all
-- ============================================================
select public.ensure_policy('public.products', 'products_read_approved_sellers', 'select',
  'exists (select 1 from public.sellers s where s.id = products.seller_id and s.status = ''approved'')', null);

select public.ensure_policy('public.products', 'products_seller_read_own', 'select', 'seller_id = public.current_seller_id()', null);

select public.ensure_policy('public.products', 'products_seller_insert', 'insert', null,
  'seller_id = public.current_seller_id() and exists (select 1 from public.sellers s where s.id = public.current_seller_id() and s.status = ''approved'')');

select public.ensure_policy('public.products', 'products_seller_update_own', 'update', 'seller_id = public.current_seller_id()', 'seller_id = public.current_seller_id()');

select public.ensure_policy('public.products', 'products_seller_delete_own', 'delete', 'seller_id = public.current_seller_id()', null);

select public.ensure_policy('public.products', 'products_admin_all', 'all', 'public.is_admin()', 'public.is_admin()');

-- ============================================================
-- orders: customers create + read own;
-- sellers read/update status of orders for own store; admin all
-- ============================================================
select public.ensure_policy('public.orders', 'orders_customer_create', 'insert', null, 'customer_id = auth.uid()');

select public.ensure_policy('public.orders', 'orders_customer_read_own', 'select', 'customer_id = auth.uid()', null);

select public.ensure_policy('public.orders', 'orders_seller_read_own_store', 'select', 'seller_id = public.current_seller_id()', null);

select public.ensure_policy('public.orders', 'orders_seller_update_own_store', 'update', 'seller_id = public.current_seller_id()', 'seller_id = public.current_seller_id()');

select public.ensure_policy('public.orders', 'orders_admin_all', 'all', 'public.is_admin()', 'public.is_admin()');

-- ============================================================
-- order_items: customers create with own order + read own;
-- sellers read for own store's orders; admin all
-- ============================================================
select public.ensure_policy('public.order_items', 'order_items_customer_create', 'insert', null,
  'exists (select 1 from public.orders o where o.id = order_items.order_id and o.customer_id = auth.uid())');

select public.ensure_policy('public.order_items', 'order_items_customer_read_own', 'select',
  'exists (select 1 from public.orders o where o.id = order_items.order_id and o.customer_id = auth.uid())', null);

select public.ensure_policy('public.order_items', 'order_items_seller_read_own_store', 'select',
  'exists (select 1 from public.orders o where o.id = order_items.order_id and o.seller_id = public.current_seller_id())', null);

select public.ensure_policy('public.order_items', 'order_items_admin_all', 'all', 'public.is_admin()', 'public.is_admin()');

-- ============================================================
-- payments: customers read own; sellers read for own store's orders; admin all
-- ============================================================
select public.ensure_policy('public.payments', 'payments_customer_read_own', 'select',
  'exists (select 1 from public.orders o where o.id = payments.order_id and o.customer_id = auth.uid())', null);

select public.ensure_policy('public.payments', 'payments_seller_read_own_store', 'select',
  'exists (select 1 from public.orders o where o.id = payments.order_id and o.seller_id = public.current_seller_id())', null);

select public.ensure_policy('public.payments', 'payments_admin_all', 'all', 'public.is_admin()', 'public.is_admin()');

-- Drop the helper function after use
drop function public.ensure_policy(regclass, text, text, text, text);
````

## File: supabase/migrations/004_rpc_functions.sql
````sql
-- Migration: 004_rpc_functions
-- Transactional database functions per docs/BUSINESS_RULES.md

-- ============================================================
-- checkout_cart: validates stock, creates one order per seller,
-- deducts stock in a single transaction
-- ============================================================
create or replace function public.checkout_cart(
  p_items jsonb,
  p_delivery_info jsonb,
  p_payment_method text
) returns setof uuid as $$
declare
  v_customer_id uuid;
  v_product record;
  v_item record;
  v_seller_id uuid;
  v_price numeric;
  v_quantity integer;
  v_product_id uuid;
  v_current_seller uuid := null;
  v_order_id uuid;
begin
  -- Validate caller is a customer
  select id into v_customer_id
  from public.profiles
  where id = auth.uid() and role = 'customer';

  if v_customer_id is null then
    raise exception 'Only customers can checkout';
  end if;

  -- Validate payment method
  if p_payment_method not in ('mockpay', 'cod') then
    raise exception 'Invalid payment method';
  end if;

  -- First pass: validate stock and lock all product rows (prevents overselling)
  for v_item in select * from jsonb_array_elements(p_items) as elem(item) loop
    v_product_id := (v_item.item->>'product_id')::uuid;
    v_quantity := (v_item.item->>'quantity')::integer;

    if v_quantity <= 0 then
      raise exception 'Invalid quantity for product %', v_product_id;
    end if;

    select * into v_product
    from public.products
    where id = v_product_id
    for update;

    if v_product is null then
      raise exception 'Product not found: %', v_product_id;
    end if;

    if v_product.stock < v_quantity then
      raise exception 'Insufficient stock for product %', v_product_id;
    end if;
  end loop;

  -- Second pass: create one order per seller, add items, deduct stock
  for v_item in select * from jsonb_array_elements(p_items) as elem(item) loop
    v_product_id := (v_item.item->>'product_id')::uuid;
    v_quantity := (v_item.item->>'quantity')::integer;

    select seller_id, price into v_seller_id, v_price
    from public.products where id = v_product_id;

    -- New seller group: create a new order
    if v_seller_id is distinct from v_current_seller then
      v_current_seller := v_seller_id;

      insert into public.orders (
        customer_id, seller_id,
        delivery_name, delivery_phone, delivery_address,
        delivery_fee, total, payment_method, payment_status, order_status
      )
      values (
        v_customer_id, v_current_seller,
        p_delivery_info->>'name', p_delivery_info->>'phone', p_delivery_info->>'address',
        50.00, 0, p_payment_method, 'pending', 'pending'
      )
      returning id into v_order_id;

      return next v_order_id;
    end if;

    -- Add order item to current order
    insert into public.order_items (order_id, product_id, quantity, unit_price)
    values (v_order_id, v_product_id, v_quantity, v_price);

    -- Update order running total
    update public.orders
    set total = total + (v_price * v_quantity)
    where id = v_order_id;

    -- Deduct stock
    update public.products
    set stock = stock - v_quantity
    where id = v_product_id;
  end loop;

  return;
end;
$$ language plpgsql security definer;

-- ============================================================
-- process_mockpay: approves or cancels a simulated payment
-- ============================================================
create or replace function public.process_mockpay(
  p_order_id uuid,
  p_amount numeric,
  p_result text
) returns void as $$
declare
  v_order record;
begin
  select * into v_order
  from public.orders
  where id = p_order_id;

  if not found then
    raise exception 'Order not found';
  end if;

  -- Verify caller is the customer who owns the order
  if v_order.customer_id <> auth.uid() then
    raise exception 'Order does not belong to caller';
  end if;

  -- Verify order is awaiting payment
  if v_order.payment_status <> 'pending' then
    raise exception 'Order is not awaiting payment';
  end if;

  -- Validate amount matches order total
  if p_amount <> v_order.total then
    raise exception 'Amount does not match order total';
  end if;

  if p_result = 'approve' then
    update public.orders
    set payment_status = 'paid'
    where id = p_order_id;

    insert into public.payments (order_id, method, status)
    values (p_order_id, 'mockpay', 'paid');

  elsif p_result = 'cancel' then
    update public.orders
    set payment_status = 'cancelled'
    where id = p_order_id;

    insert into public.payments (order_id, method, status)
    values (p_order_id, 'mockpay', 'cancelled');

    -- Restore stock for all items in the order
    update public.products p
    set stock = stock + oi.quantity
    from public.order_items oi
    where oi.order_id = p_order_id and p.id = oi.product_id;

  else
    raise exception 'Invalid result: must be approve or cancel';
  end if;
end;
$$ language plpgsql security definer;

-- ============================================================
-- update_order_status: seller/admin updates order status
-- Handles COD paid-on-completion and refunded-on-rejection
-- ============================================================
create or replace function public.update_order_status(
  p_order_id uuid,
  p_new_status text
) returns void as $$
declare
  v_order record;
  v_is_seller boolean;
begin
  select * into v_order
  from public.orders
  where id = p_order_id;

  if not found then
    raise exception 'Order not found';
  end if;

  -- Verify caller is seller for this store or admin
  if not public.is_admin() then
    select true into v_is_seller
    from public.sellers s
    where s.id = v_order.seller_id and s.profile_id = auth.uid();

    if not v_is_seller then
      raise exception 'Only the seller or admin can update order status';
    end if;
  end if;

  -- Validate status value
  if p_new_status not in ('pending', 'accepted', 'rejected', 'preparing', 'delivering', 'completed', 'cancelled') then
    raise exception 'Invalid order status';
  end if;

  -- Business rules for payment status transitions
  if p_new_status = 'completed'
     and v_order.payment_method = 'cod'
     and v_order.payment_status = 'pending' then
    -- COD: payment becomes paid when seller marks completed
    update public.orders
    set order_status = 'completed', payment_status = 'paid'
    where id = p_order_id;

    insert into public.payments (order_id, method, status)
    values (p_order_id, 'cod', 'paid');

  elsif p_new_status in ('rejected', 'cancelled')
     and v_order.payment_status = 'paid' then
    -- Paid order rejected/cancelled -> simulated refund
    update public.orders
    set order_status = p_new_status, payment_status = 'refunded'
    where id = p_order_id;

    insert into public.payments (order_id, method, status)
    values (p_order_id, v_order.payment_method, 'refunded');

    -- Restore stock
    update public.products p
    set stock = stock + oi.quantity
    from public.order_items oi
    where oi.order_id = p_order_id and p.id = oi.product_id;

  elsif p_new_status = 'cancelled'
     and v_order.payment_status = 'pending' then
    -- Cancelled before payment -> restore stock
    update public.orders
    set order_status = 'cancelled'
    where id = p_order_id;

    update public.products p
    set stock = stock + oi.quantity
    from public.order_items oi
    where oi.order_id = p_order_id and p.id = oi.product_id;

  else
    update public.orders
    set order_status = p_new_status
    where id = p_order_id;
  end if;
end;
$$ language plpgsql security definer;
````

## File: supabase/migrations/005_storage_bucket.sql
````sql
-- Migration: 005_storage_bucket
-- Product image storage: public read, sellers write only to their own folder

-- Insert the product-images bucket (public read, idempotent)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

-- Helper: create storage policy only if it does not already exist
create or replace function public.ensure_storage_policy(
  p_name text,
  p_cmd text,
  p_qual text,
  p_with_check text
) returns void as $$
declare
  v_sql text;
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = p_name
  ) then
    if p_cmd = 'insert' then
      v_sql := format('create policy %I on storage.objects for %s with check (%s)',
        p_name, p_cmd, coalesce(p_with_check, 'true'));
    elsif p_cmd = 'delete' then
      v_sql := format('create policy %I on storage.objects for %s using (%s)',
        p_name, p_cmd, coalesce(p_qual, 'true'));
    elsif p_cmd = 'select' then
      v_sql := format('create policy %I on storage.objects for %s using (%s)',
        p_name, p_cmd, coalesce(p_qual, 'true'));
    else
      v_sql := format('create policy %I on storage.objects for %s using (%s) with check (%s)',
        p_name, p_cmd, coalesce(p_qual, 'true'), coalesce(p_with_check, 'true'));
    end if;
    execute v_sql;
  end if;
end;
$$ language plpgsql;

-- Sellers can upload to their own folder: product-images/{seller_id}/
select public.ensure_storage_policy(
  'sellers_upload_own_folder', 'insert', null,
  'bucket_id = ''product-images'' and auth.uid() is not null
   and split_part(name, ''/'', 1) = (
     select s.profile_id::text
     from public.sellers s
     where s.profile_id = auth.uid()
     limit 1
   )');

-- Sellers can update/delete their own files
select public.ensure_storage_policy(
  'sellers_modify_own_files', 'all',
  'bucket_id = ''product-images'' and auth.uid() is not null
   and split_part(name, ''/'', 1) = (
     select s.profile_id::text
     from public.sellers s
     where s.profile_id = auth.uid()
     limit 1
   )',
  'bucket_id = ''product-images'' and auth.uid() is not null
   and split_part(name, ''/'', 1) = (
     select s.profile_id::text
     from public.sellers s
     where s.profile_id = auth.uid()
     limit 1
   )');

-- Public read access
select public.ensure_storage_policy(
  'public_read_product_images', 'select',
  'bucket_id = ''product-images''', null);

-- Drop the helper function after use
drop function public.ensure_storage_policy(text, text, text, text);
````

## File: supabase/migrations/006_storage_policy_hardening.sql
````sql
-- Migration: 006_storage_policy_hardening
-- Remove the broad SELECT policy on the public product-images bucket so clients
-- cannot enumerate every file. Public files are served via /object/public/.
-- Restrict uploads/modifications to approved sellers only, writing to their own folder.

-- Drop the broad public read / list policy (public buckets don't need a SELECT policy).
drop policy if exists "public_read_product_images" on storage.objects;

-- Recreate seller upload policy: only approved sellers, only their own profile folder.
drop policy if exists "sellers_upload_own_folder" on storage.objects;
create policy "sellers_upload_own_folder"
on storage.objects for insert
with check (
  bucket_id = 'product-images'
  and auth.uid() is not null
  and split_part(name, '/', 1) = (
    select s.profile_id::text
    from public.sellers s
    where s.profile_id = auth.uid() and s.status = 'approved'
    limit 1
  )
);

-- Recreate seller modify policy: only approved sellers, only their own files.
drop policy if exists "sellers_modify_own_files" on storage.objects;
create policy "sellers_modify_own_files"
on storage.objects for all
using (
  bucket_id = 'product-images'
  and auth.uid() is not null
  and split_part(name, '/', 1) = (
    select s.profile_id::text
    from public.sellers s
    where s.profile_id = auth.uid() and s.status = 'approved'
    limit 1
  )
)
with check (
  bucket_id = 'product-images'
  and auth.uid() is not null
  and split_part(name, '/', 1) = (
    select s.profile_id::text
    from public.sellers s
    where s.profile_id = auth.uid() and s.status = 'approved'
    limit 1
  )
);
````

## File: supabase/migrations/007_stock_transaction.sql
````sql
-- Migration: 007_stock_transaction
-- Stock deduction and restore as single database transactions so overselling
-- cannot happen. See docs/BUSINESS_RULES.md rule 2.

-- Deduct stock for a batch of order items atomically.
-- p_order_items: jsonb array of { product_id: uuid, quantity: int }
create or replace function public.deduct_stock(p_order_items jsonb)
returns jsonb as $$
declare
  v_item record;
  v_stock integer;
begin
  for v_item in select * from jsonb_array_elements(p_order_items) as item
  loop
    -- Lock the product row so concurrent checkouts can't oversell
    select stock into v_stock
    from public.products
    where id = (v_item->>'product_id')::uuid
    for update;

    if v_stock is null then
      raise exception 'Product not found: %', v_item->>'product_id';
    end if;

    if v_stock < (v_item->>'quantity')::int then
      raise exception 'Insufficient stock for product % (have %, need %)',
        v_item->>'product_id', v_stock, (v_item->>'quantity')::int;
    end if;

    update public.products
    set stock = stock - (v_item->>'quantity')::int
    where id = (v_item->>'product_id')::uuid;
  end loop;

  return jsonb_build_object('success', true);
end;
$$ language plpgsql;

-- Restore stock for a batch of order items atomically.
-- Used when payment is cancelled/fails, or seller rejects/cancels the order.
create or replace function public.restore_stock(p_order_items jsonb)
returns void as $$
declare
  v_item record;
begin
  for v_item in select * from jsonb_array_elements(p_order_items) as item
  loop
    update public.products
    set stock = stock + (v_item->>'quantity')::int
    where id = (v_item->>'product_id')::uuid;
  end loop;
end;
$$ language plpgsql;
````

## File: supabase/migrations/008_stock_functions_security_definer.sql
````sql
-- Migration: 008_stock_functions_security_definer
-- Recreate deduct_stock / restore_stock as SECURITY DEFINER so they bypass RLS
-- when called by the service-role client (server-side only).
-- Re-grant execute to service_role only; customers cannot call them directly.
-- See docs/BUSINESS_RULES.md rule 2: stock deduction/restore must run as a single
-- transaction inside a privileged context so overselling cannot happen.

create or replace function public.deduct_stock(p_order_items jsonb)
returns jsonb as $$
declare
  v_item record;
  v_stock integer;
begin
  for v_item in select * from jsonb_array_elements(p_order_items) as item
  loop
    -- Lock the product row so concurrent checkouts can't oversell
    select stock into v_stock
    from public.products
    where id = (v_item->>'product_id')::uuid
    for update;

    if v_stock is null then
      raise exception 'Product not found: %', v_item->>'product_id';
    end if;

    if v_stock < (v_item->>'quantity')::int then
      raise exception 'Insufficient stock for product % (have %, need %)',
        v_item->>'product_id', v_stock, (v_item->>'quantity')::int;
    end if;

    update public.products
    set stock = stock - (v_item->>'quantity')::int
    where id = (v_item->>'product_id')::uuid;
  end loop;

  return jsonb_build_object('success', true);
end;
$$ language plpgsql security definer
set search_path = public;

create or replace function public.restore_stock(p_order_items jsonb)
returns void as $$
declare
  v_item record;
begin
  for v_item in select * from jsonb_array_elements(p_order_items) as item
  loop
    update public.products
    set stock = stock + (v_item->>'quantity')::int
    where id = (v_item->>'product_id')::uuid;
  end loop;
end;
$$ language plpgsql security definer
set search_path = public;

-- Restrict execute: only service_role (server-side admin client) can call these.
revoke execute on function public.deduct_stock(jsonb) from public;
revoke execute on function public.deduct_stock(jsonb) from anon;
revoke execute on function public.deduct_stock(jsonb) from authenticated;
revoke execute on function public.restore_stock(jsonb) from public;
revoke execute on function public.restore_stock(jsonb) from anon;
revoke execute on function public.restore_stock(jsonb) from authenticated;
grant execute on function public.deduct_stock(jsonb) to service_role;
grant execute on function public.restore_stock(jsonb) to service_role;
````

## File: supabase/migrations/009_fix_stock_function_loops.sql
````sql
-- Migration: 009_fix_stock_function_loops
-- Fix PL/pgSQL bug in deduct_stock / restore_stock (migration 007/008):
--   "operator does not exist: record ->> unknown"
-- The FOR loop variable was a record from `select * from jsonb_array_elements(...)`
-- so `v_item->>'product_id'` failed. Loop over the jsonb `value` column instead.

create or replace function public.deduct_stock(p_order_items jsonb)
returns jsonb as $$
declare
  v_item jsonb;
  v_stock integer;
begin
  for v_item in select value from jsonb_array_elements(p_order_items)
  loop
    -- Lock the product row so concurrent checkouts can't oversell
    select stock into v_stock
    from public.products
    where id = (v_item->>'product_id')::uuid
    for update;

    if v_stock is null then
      raise exception 'Product not found: %', v_item->>'product_id';
    end if;

    if v_stock < (v_item->>'quantity')::int then
      raise exception 'Insufficient stock for product % (have %, need %)',
        v_item->>'product_id', v_stock, (v_item->>'quantity')::int;
    end if;

    update public.products
    set stock = stock - (v_item->>'quantity')::int
    where id = (v_item->>'product_id')::uuid;
  end loop;

  return jsonb_build_object('success', true);
end;
$$ language plpgsql security definer
set search_path = public;

create or replace function public.restore_stock(p_order_items jsonb)
returns void as $$
declare
  v_item jsonb;
begin
  for v_item in select value from jsonb_array_elements(p_order_items)
  loop
    update public.products
    set stock = stock + (v_item->>'quantity')::int
    where id = (v_item->>'product_id')::uuid;
  end loop;
end;
$$ language plpgsql security definer
set search_path = public;

-- Keep execute restricted to service_role (re-applied for safety)
revoke execute on function public.deduct_stock(jsonb) from public;
revoke execute on function public.deduct_stock(jsonb) from anon;
revoke execute on function public.deduct_stock(jsonb) from authenticated;
revoke execute on function public.restore_stock(jsonb) from public;
revoke execute on function public.restore_stock(jsonb) from anon;
revoke execute on function public.restore_stock(jsonb) from authenticated;
grant execute on function public.deduct_stock(jsonb) to service_role;
grant execute on function public.restore_stock(jsonb) to service_role;
````

## File: supabase/migrations/010_fix_update_order_status.sql
````sql
-- Migration: 010_fix_update_order_status
-- 1) Security fix: v_is_seller stayed NULL when the caller was not the seller,
--    so `if not v_is_seller` evaluated to NULL and the exception was skipped.
-- 2) Business rule fix: rejecting an unpaid (pending) order now restores stock.
-- 3) Harden with `set search_path = public`.

create or replace function public.update_order_status(
  p_order_id uuid,
  p_new_status text
) returns void as $$
declare
  v_order record;
  v_is_seller boolean := false;
begin
  select * into v_order
  from public.orders
  where id = p_order_id;

  if not found then
    raise exception 'Order not found';
  end if;

  -- Verify caller is the seller for this store or an admin
  if not public.is_admin() then
    select true into v_is_seller
    from public.sellers s
    where s.id = v_order.seller_id and s.profile_id = auth.uid();

    if v_is_seller is not true then
      raise exception 'Only the seller or admin can update order status';
    end if;
  end if;

  -- Validate status value
  if p_new_status not in ('pending', 'accepted', 'rejected', 'preparing', 'delivering', 'completed', 'cancelled') then
    raise exception 'Invalid order status';
  end if;

  -- Business rules for payment status transitions
  if p_new_status = 'completed'
     and v_order.payment_method = 'cod'
     and v_order.payment_status = 'pending' then
    -- COD: payment becomes paid when seller marks completed
    update public.orders
    set order_status = 'completed', payment_status = 'paid'
    where id = p_order_id;

    insert into public.payments (order_id, method, status)
    values (p_order_id, 'cod', 'paid');

  elsif p_new_status in ('rejected', 'cancelled') then
    if v_order.payment_status = 'paid' then
      -- Paid order rejected/cancelled -> simulated refund + restore stock
      update public.orders
      set order_status = p_new_status, payment_status = 'refunded'
      where id = p_order_id;

      insert into public.payments (order_id, method, status)
      values (p_order_id, v_order.payment_method, 'refunded');

      update public.products p
      set stock = stock + oi.quantity
      from public.order_items oi
      where oi.order_id = p_order_id and p.id = oi.product_id;

    elsif v_order.payment_status = 'pending' then
      -- Unpaid order rejected/cancelled -> restore stock
      update public.orders
      set order_status = p_new_status
      where id = p_order_id;

      update public.products p
      set stock = stock + oi.quantity
      from public.order_items oi
      where oi.order_id = p_order_id and p.id = oi.product_id;

    else
      update public.orders
      set order_status = p_new_status
      where id = p_order_id;
    end if;

  else
    update public.orders
    set order_status = p_new_status
    where id = p_order_id;
  end if;
end;
$$ language plpgsql security definer
set search_path = public;

-- Authenticated users may call it; the function itself verifies seller/admin.
grant execute on function public.update_order_status(uuid, text) to authenticated;
````

## File: supabase/migrations/011_harden_rls_policies.sql
````sql
-- Migration: 011_harden_rls_policies
-- Fix privilege escalation holes identified in security review:
--
-- 1. profiles: prevent non-admin from changing their own role via trigger
-- 2. sellers: split monolithic sellers_own (ALL) into granular policies;
--    no DELETE for non-admin; INSERT only pending; UPDATE blocked on status change
-- 3. orders/order_items/payments: revoke direct INSERT/UPDATE/DELETE from
--    authenticated role; all writes go through SECURITY DEFINER RPCs
-- 4. products: UPDATE/DELETE require seller.status = 'approved'

-- ============================================================
-- 1. profiles: role changes restricted to admin via trigger
-- ============================================================

-- Restrict profiles_write_own update to prevent changing role/id.
-- RLS WITH CHECK cannot compare old/new values cleanly across policies,
-- so enforce role immutability with a BEFORE UPDATE trigger instead.
create or replace function public.guard_profiles_role_change()
returns trigger as $$
begin
  -- Allow service-role calls (no auth.uid() == null) to pass through unchanged
  if auth.uid() is null then
    return new;
  end if;

  -- Admin may change any field
  if public.is_admin() then
    return new;
  end if;

  -- Non-admin: reject any change to role or id
  if new.role is distinct from old.role then
    raise exception 'Only admins can change a user role.';
  end if;
  if new.id is distinct from old.id then
    raise exception 'Profile id is immutable.';
  end if;

  return new;
end;
$$ language plpgsql security definer
set search_path = public;

drop trigger if exists guard_profiles_role_change on public.profiles;
create trigger guard_profiles_role_change
before update on public.profiles
for each row
execute function public.guard_profiles_role_change();

-- ============================================================
-- 2. sellers: granular policies replacing monolithic sellers_own (ALL)
-- ============================================================

drop policy if exists "sellers_own" on public.sellers;
drop policy if exists "sellers_own_read" on public.sellers;
drop policy if exists "sellers_own_insert" on public.sellers;
drop policy if exists "sellers_own_update" on public.sellers;
drop policy if exists "sellers_admin_all" on public.sellers;

-- Sellers can read their own store row
create policy "sellers_own_read" on public.sellers for select
using (profile_id = auth.uid());

-- Sellers can insert their own application, but only with status = 'pending'
create policy "sellers_own_insert" on public.sellers for insert
with check (profile_id = auth.uid() and status = 'pending');

-- Sellers can update their own store details; status/profile_id changes blocked by trigger below
create policy "sellers_own_update" on public.sellers for update
using (profile_id = auth.uid())
with check (profile_id = auth.uid());

-- Admin full control remains
create policy "sellers_admin_all" on public.sellers for all
using (public.is_admin()) with check (public.is_admin());

-- Trigger: block non-admin changes to sellers.status and sellers.profile_id
-- (allows pending → pending re-apply via update, but not self-approval)
create or replace function public.guard_sellers_status_change()
returns trigger as $$
begin
  if auth.uid() is null then
    return new;
  end if;

  if public.is_admin() then
    return new;
  end if;

  -- profile_id must not change
  if new.profile_id is distinct from old.profile_id then
    raise exception 'seller profile_id is immutable.';
  end if;

  -- status may not be changed by non-admin (blocks self-approval)
  if new.status is distinct from old.status then
    raise exception 'Only admins can change seller status.';
  end if;

  return new;
end;
$$ language plpgsql security definer
set search_path = public;

drop trigger if exists guard_sellers_status_change on public.sellers;
create trigger guard_sellers_status_change
before update on public.sellers
for each row
execute function public.guard_sellers_status_change();

-- ============================================================
-- 3. products: UPDATE/DELETE require seller.status = 'approved'
-- ============================================================

drop policy if exists "products_seller_update_own" on public.products;
drop policy if exists "products_seller_delete_own" on public.products;

create policy "products_seller_update_own" on public.products for update
using (
  seller_id = public.current_seller_id()
  and exists (
    select 1 from public.sellers s
    where s.id = public.current_seller_id()
      and s.status = 'approved'
  )
)
with check (
  seller_id = public.current_seller_id()
  and exists (
    select 1 from public.sellers s
    where s.id = public.current_seller_id()
      and s.status = 'approved'
  )
);

create policy "products_seller_delete_own" on public.products for delete
using (
  seller_id = public.current_seller_id()
  and exists (
    select 1 from public.sellers s
    where s.id = public.current_seller_id()
      and s.status = 'approved'
  )
);

-- ============================================================
-- 4. Revoke direct table write privileges from authenticated role.
--    All writes go through SECURITY DEFINER RPCs instead.
-- ============================================================

revoke insert, update, delete on public.orders from authenticated;
revoke insert, update, delete on public.order_items from authenticated;
revoke insert, update, delete on public.payments from authenticated;

-- Keep select privileges (RLS policies still govern row visibility)
grant select on public.orders to authenticated;
grant select on public.order_items to authenticated;
grant select on public.payments to authenticated;

-- Sellers still need to call update_order_status RPC
grant execute on function public.update_order_status(uuid, text) to authenticated;
-- Admin/service_role already has execute via service_role grants
````

## File: supabase/migrations/012_fix_checkout_cart_atomic.sql
````sql
-- Migration: 012_fix_checkout_cart_atomic
-- Rewrite checkout_cart as a single atomic transaction:
--   - aggregates duplicate product IDs in the cart
--   - validates quantity > 0 (rejects negatives that would inflate stock)
--   - validates stock cumulatively (row-level FOR UPDATE locks)
--   - requires seller.status = 'approved'
--   - groups items by seller, creates one order per seller with correct total
--   - deducts stock inside the same transaction
--   - rejects if product is out of stock or insufficient stock
--
-- checkoutAction will call this RPC via the service-role admin client,
-- so the function runs under service_role (bypasses RLS for the write phase)
-- but validates the caller is a customer via auth.uid().

create or replace function public.checkout_cart(
  p_items jsonb,
  p_delivery_info jsonb,
  p_payment_method text
) returns setof uuid as $$
declare
  v_customer_id uuid;
  v_product record;
  v_item jsonb;
  v_product_id uuid;
  v_quantity integer;
  v_price numeric;
  v_seller_id uuid;
  v_current_seller uuid := null;
  v_order_id uuid;
  v_subtotal numeric := 0;
  v_total numeric;
  v_stock integer;
begin
  -- Validate caller is a customer
  select id into v_customer_id
  from public.profiles
  where id = auth.uid() and role = 'customer';

  if v_customer_id is null then
    raise exception 'Only customers can checkout';
  end if;

  -- Validate payment method
  if p_payment_method not in ('mockpay', 'cod') then
    raise exception 'Invalid payment method';
  end if;

  -- Validate delivery info fields exist
  if p_delivery_info->>'name' is null
     or p_delivery_info->>'phone' is null
     or p_delivery_info->>'address' is null then
    raise exception 'Missing delivery information.';
  end if;

  -- First pass: validate quantities, aggregate duplicates, lock product rows
  -- Use a temp approach: iterate once to collect validated items keyed by product_id
  -- We aggregate duplicates by building a working set. PL/pgSQL doesn't have
  -- associative arrays of records, so we do two passes with dedup via DISTINCT.

  -- Validate each item and lock product rows
  for v_item in select value from jsonb_array_elements(p_items) as item(value) loop
    v_product_id := (v_item->>'product_id')::uuid;
    v_quantity := (v_item->>'quantity')::integer;

    if v_quantity <= 0 then
      raise exception 'Invalid quantity for product %', v_product_id;
    end if;

    select * into v_product
    from public.products
    where id = v_product_id
    for update;

    if v_product is null then
      raise exception 'Product not found: %', v_product_id;
    end if;

    -- Require seller to be approved
    if v_product.seller_id is null then
      raise exception 'Product % has no seller assigned', v_product_id;
    end if;

    if not exists (
      select 1 from public.sellers s
      where s.id = v_product.seller_id and s.status = 'approved'
    ) then
      raise exception 'Product % is not available for ordering', v_product_id;
    end if;

    if v_product.stock is null or v_product.stock < v_quantity then
      raise exception 'Insufficient stock for product % (have %, need %)',
        v_product_id, coalesce(v_product.stock, 0), v_quantity;
    end if;
  end loop;

  -- Second pass: aggregate by seller, create orders, add items, deduct stock
  -- We iterate over distinct (seller_id, product_id, quantity_sum) groups.
  -- Re-lock rows already locked (FOR UPDATE on first pass holds locks to end of txn).
  for v_item in
    select
      (value->>'product_id')::uuid as product_id,
      sum((value->>'quantity')::integer) as quantity
    from jsonb_array_elements(p_items) as item(value)
    group by (value->>'product_id')::uuid
  loop
    v_product_id := v_item.product_id;
    v_quantity := v_item.quantity;

    select seller_id, price into v_seller_id, v_price
    from public.products where id = v_product_id;

    -- New seller group: create a new order
    if v_seller_id is distinct from v_current_seller then
      v_current_seller := v_seller_id;
      v_subtotal := 0;

      insert into public.orders (
        customer_id, seller_id,
        delivery_name, delivery_phone, delivery_address,
        delivery_fee, total, payment_method, payment_status, order_status
      )
      values (
        v_customer_id, v_current_seller,
        p_delivery_info->>'name', p_delivery_info->>'phone', p_delivery_info->>'address',
        50.00, 0, p_payment_method, 'pending', 'pending'
      )
      returning id into v_order_id;

      return next v_order_id;
    end if;

    -- Add order item to current order
    insert into public.order_items (order_id, product_id, quantity, unit_price)
    values (v_order_id, v_product_id, v_quantity, v_price);

    -- Update order running total
    v_subtotal := v_subtotal + (v_price * v_quantity);
    v_total := v_subtotal + 50.00;

    update public.orders
    set total = v_total
    where id = v_order_id;

    -- Deduct stock
    update public.products
    set stock = stock - v_quantity
    where id = v_product_id;
  end loop;

  return;
end;
$$ language plpgsql security definer
set search_path = public;

-- Restrict execute: only authenticated (customer) can call checkout_cart.
-- The function itself validates role = 'customer'.
grant execute on function public.checkout_cart(jsonb, jsonb, text) to authenticated;
revoke execute on function public.checkout_cart(jsonb, jsonb, text) from anon;
````

## File: supabase/migrations/013_allow_seller_reapply.sql
````sql
-- Migration: 013_allow_seller_reapply
-- Allow rejected sellers to re-apply (status: rejected → pending) while
-- still blocking self-approval and other status changes by non-admin.
-- This complements migration 011's guard_sellers_status_change trigger.

create or replace function public.guard_sellers_status_change()
returns trigger as $$
begin
  if auth.uid() is null then
    return new;
  end if;

  if public.is_admin() then
    return new;
  end if;

  -- profile_id must not change
  if new.profile_id is distinct from old.profile_id then
    raise exception 'seller profile_id is immutable.';
  end if;

  -- Allow re-apply: rejected -> pending is the only status change a
  -- non-admin may make (blocks self-approval and arbitrary transitions).
  if new.status is distinct from old.status then
    if not (old.status = 'rejected' and new.status = 'pending') then
      raise exception 'Only admins can change seller status.';
    end if;
  end if;

  return new;
end;
$$ language plpgsql security definer
set search_path = public;

drop trigger if exists guard_sellers_status_change on public.sellers;
create trigger guard_sellers_status_change
before update on public.sellers
for each row
execute function public.guard_sellers_status_change();
````

## File: supabase/migrations/014_harden_update_order_status.sql
````sql
-- Migration: 014_harden_update_order_status
-- Add order status transition validation to update_order_status:
--   - Valid flow: pending → accepted → preparing → delivering → completed
--   - Exits: rejected (by seller) or cancelled (from any non-terminal state)
--   - Terminal states: completed, rejected, cancelled (no further changes)
--   - Prevents duplicate payment processing on repeated calls
--   - Prevents double stock restore

create or replace function public.update_order_status(
  p_order_id uuid,
  p_new_status text
) returns void as $$
declare
  v_order record;
  v_is_seller boolean := false;
  v_valid_transition boolean := false;
begin
  select * into v_order
  from public.orders
  where id = p_order_id;

  if not found then
    raise exception 'Order not found';
  end if;

  -- Verify caller is the seller for this store or an admin
  if not public.is_admin() then
    select true into v_is_seller
    from public.sellers s
    where s.id = v_order.seller_id and s.profile_id = auth.uid();

    if v_is_seller is not true then
      raise exception 'Only the seller or admin can update order status.';
    end if;
  end if;

  -- Validate status value
  if p_new_status not in ('pending', 'accepted', 'rejected', 'preparing', 'delivering', 'completed', 'cancelled') then
    raise exception 'Invalid order status';
  end if;

  -- Terminal states: no further transitions allowed
  if v_order.order_status in ('completed', 'rejected', 'cancelled') then
    raise exception 'Order is already in a terminal state (%).', v_order.order_status;
  end if;

  -- No-op: same status is allowed but skips all side effects
  if v_order.order_status = p_new_status then
    return;
  end if;

  -- Validate transition
  -- pending → accepted, rejected, cancelled
  -- accepted → preparing, rejected, cancelled
  -- preparing → delivering, rejected, cancelled
  -- delivering → completed, rejected, cancelled
  if v_order.order_status = 'pending' and p_new_status in ('accepted', 'rejected', 'cancelled') then
    v_valid_transition := true;
  elsif v_order.order_status = 'accepted' and p_new_status in ('preparing', 'rejected', 'cancelled') then
    v_valid_transition := true;
  elsif v_order.order_status = 'preparing' and p_new_status in ('delivering', 'rejected', 'cancelled') then
    v_valid_transition := true;
  elsif v_order.order_status = 'delivering' and p_new_status in ('completed', 'rejected', 'cancelled') then
    v_valid_transition := true;
  end if;

  if not v_valid_transition then
    raise exception 'Invalid transition from % to %.', v_order.order_status, p_new_status;
  end if;

  -- Business rules for payment status transitions
  if p_new_status = 'completed'
     and v_order.payment_method = 'cod'
     and v_order.payment_status = 'pending' then
    -- COD: payment becomes paid when seller marks completed
    update public.orders
    set order_status = 'completed', payment_status = 'paid'
    where id = p_order_id;

    insert into public.payments (order_id, method, status)
    values (p_order_id, 'cod', 'paid');

  elsif p_new_status in ('rejected', 'cancelled')
     and v_order.payment_status = 'paid' then
    -- Paid order rejected/cancelled -> simulated refund + restore stock
    update public.orders
    set order_status = p_new_status, payment_status = 'refunded'
    where id = p_order_id;

    insert into public.payments (order_id, method, status)
    values (p_order_id, v_order.payment_method, 'refunded');

    update public.products p
    set stock = stock + oi.quantity
    from public.order_items oi
    where oi.order_id = p_order_id and p.id = oi.product_id;

  elsif p_new_status = 'cancelled'
     and v_order.payment_status = 'pending' then
    -- Cancelled before payment -> restore stock
    update public.orders
    set order_status = 'cancelled'
    where id = p_order_id;

    update public.products p
    set stock = stock + oi.quantity
    from public.order_items oi
    where oi.order_id = p_order_id and p.id = oi.product_id;

  else
    update public.orders
    set order_status = p_new_status
    where id = p_order_id;
  end if;
end;
$$ language plpgsql security definer
set search_path = public;

-- Re-grant execute to authenticated (re-created function loses grants)
grant execute on function public.update_order_status(uuid, text) to authenticated;
````

## File: supabase/migrations/015_fix_checkout_cart_bugs.sql
````sql
-- Migration: 015_fix_checkout_cart_bugs
-- Fix bugs in checkout_cart introduced by migration 012:
--
-- 1. CRASH: second loop reused `v_item jsonb` for a multi-column query,
--    causing "query returned record, but expression is of type jsonb".
--    Now uses a dedicated `v_group record` variable.
-- 2. STOCK: first pass validated each raw cart line separately, so the
--    same product appearing twice passed individually but over-deducted.
--    Now aggregates duplicates BEFORE validating stock cumulatively.
-- 3. GROUPING: second pass grouped by product_id only, which could
--    interleave different sellers into separate orders. Now joins
--    products and ORDER BY seller_id for exactly one order per seller.
-- 4. EMPTY CART: raise early instead of returning no orders.

create or replace function public.checkout_cart(
  p_items jsonb,
  p_delivery_info jsonb,
  p_payment_method text
) returns setof uuid as $$
declare
  v_customer_id uuid;
  v_product record;
  v_group record;
  v_product_id uuid;
  v_quantity integer;
  v_price numeric;
  v_seller_id uuid;
  v_current_seller uuid := null;
  v_order_id uuid;
  v_subtotal numeric := 0;
  v_total numeric;
  v_stock integer;
begin
  -- Validate caller is a customer
  select id into v_customer_id
  from public.profiles
  where id = auth.uid() and role = 'customer';

  if v_customer_id is null then
    raise exception 'Only customers can checkout';
  end if;

  -- Validate payment method
  if p_payment_method not in ('mockpay', 'cod') then
    raise exception 'Invalid payment method';
  end if;

  -- Validate delivery info fields exist
  if p_delivery_info->>'name' is null
     or p_delivery_info->>'phone' is null
     or p_delivery_info->>'address' is null then
    raise exception 'Missing delivery information.';
  end if;

  -- Reject empty cart
  if jsonb_array_length(p_items) = 0 then
    raise exception 'Cart is empty.';
  end if;

  -- ------------------------------------------------------------------
  -- First pass: validate each item, lock product rows, aggregate
  -- duplicates so stock is checked cumulatively per product.
  -- ------------------------------------------------------------------
  for v_group in
    select
      (value->>'product_id')::uuid as product_id,
      sum((value->>'quantity')::integer) as quantity
    from jsonb_array_elements(p_items) as item(value)
    group by (value->>'product_id')::uuid
  loop
    v_product_id := v_group.product_id;
    v_quantity := v_group.quantity;

    if v_quantity <= 0 then
      raise exception 'Invalid quantity for product %', v_product_id;
    end if;

    select * into v_product
    from public.products
    where id = v_product_id
    for update;

    if not found then
      raise exception 'Product not found: %', v_product_id;
    end if;

    -- Require seller to be approved
    if v_product.seller_id is null then
      raise exception 'Product % has no seller assigned', v_product_id;
    end if;

    if not exists (
      select 1 from public.sellers s
      where s.id = v_product.seller_id and s.status = 'approved'
    ) then
      raise exception 'Product % is not available for ordering', v_product_id;
    end if;

    if v_product.stock is null or v_product.stock < v_quantity then
      raise exception 'Insufficient stock for product % (have %, need %)',
        v_product_id, coalesce(v_product.stock, 0), v_quantity;
    end if;
  end loop;

  -- ------------------------------------------------------------------
  -- Second pass: create one order per seller (rows ordered by seller_id
  -- so all items for a seller are contiguous), insert order_items,
  -- compute totals, deduct stock — all inside this transaction.
  -- ------------------------------------------------------------------
  for v_group in
    select
      p.id as product_id,
      sum((ci.value->>'quantity')::integer) as quantity,
      p.seller_id,
      p.price
    from jsonb_array_elements(p_items) as ci(value)
    join public.products p on p.id = (ci.value->>'product_id')::uuid
    group by p.id, p.seller_id, p.price
    order by p.seller_id
  loop
    v_product_id := v_group.product_id;
    v_quantity := v_group.quantity;
    v_seller_id := v_group.seller_id;
    v_price := v_group.price;

    -- New seller group: create a new order
    if v_seller_id is distinct from v_current_seller then
      v_current_seller := v_seller_id;
      v_subtotal := 0;

      insert into public.orders (
        customer_id, seller_id,
        delivery_name, delivery_phone, delivery_address,
        delivery_fee, total, payment_method, payment_status, order_status
      )
      values (
        v_customer_id, v_current_seller,
        p_delivery_info->>'name', p_delivery_info->>'phone', p_delivery_info->>'address',
        50.00, 0, p_payment_method, 'pending', 'pending'
      )
      returning id into v_order_id;

      return next v_order_id;
    end if;

    -- Add order item to current order
    insert into public.order_items (order_id, product_id, quantity, unit_price)
    values (v_order_id, v_product_id, v_quantity, v_price);

    -- Update order running total
    v_subtotal := v_subtotal + (v_price * v_quantity);
    v_total := v_subtotal + 50.00;

    update public.orders
    set total = v_total
    where id = v_order_id;

    -- Deduct stock
    update public.products
    set stock = stock - v_quantity
    where id = v_product_id;
  end loop;

  return;
end;
$$ language plpgsql security definer
set search_path = public;

-- Restrict execute: only authenticated (customer) can call checkout_cart.
-- The function itself validates role = 'customer'.
grant execute on function public.checkout_cart(jsonb, jsonb, text) to authenticated;
revoke execute on function public.checkout_cart(jsonb, jsonb, text) from anon;
````

## File: supabase/migrations/016_enforce_payment_before_accept.sql
````sql
-- Migration: 016_enforce_payment_before_accept
-- Backend enforcement so sellers cannot accept a MockPay order before the
-- customer has paid, and so MockPay processing can't corrupt terminal orders.
--
-- update_order_status:
--   - Block 'accepted' when payment_method = 'mockpay' and payment_status <> 'paid'
--   - Fix unpaid rejected/cancelled to restore stock (previously only 'cancelled' did)
-- process_mockpay:
--   - Reject if payment_method <> 'mockpay'
--   - Reject if order_status is already terminal (rejected/cancelled/completed)
--   - On cancel: set BOTH payment_status AND order_status = 'cancelled', restore stock
--   - Explicitly grant/revoke execute so only authenticated callers can invoke

-- ============================================================
-- 1. update_order_status: payment-gated accept + stock restore
-- ============================================================

create or replace function public.update_order_status(
  p_order_id uuid,
  p_new_status text
) returns void as $$
declare
  v_order record;
  v_is_seller boolean := false;
  v_valid_transition boolean := false;
begin
  select * into v_order
  from public.orders
  where id = p_order_id;

  if not found then
    raise exception 'Order not found';
  end if;

  -- Verify caller is the seller for this store or an admin
  if not public.is_admin() then
    select true into v_is_seller
    from public.sellers s
    where s.id = v_order.seller_id and s.profile_id = auth.uid();

    if v_is_seller is not true then
      raise exception 'Only the seller or admin can update order status.';
    end if;
  end if;

  -- Validate status value
  if p_new_status not in ('pending', 'accepted', 'rejected', 'preparing', 'delivering', 'completed', 'cancelled') then
    raise exception 'Invalid order status';
  end if;

  -- Terminal states: no further transitions allowed
  if v_order.order_status in ('completed', 'rejected', 'cancelled') then
    raise exception 'Order is already in a terminal state (%).', v_order.order_status;
  end if;

  -- No-op: same status is allowed but skips all side effects
  if v_order.order_status = p_new_status then
    return;
  end if;

  -- MockPay: seller may not accept before the customer has paid
  if p_new_status = 'accepted'
     and v_order.payment_method = 'mockpay'
     and v_order.payment_status <> 'paid' then
    raise exception 'Customer has not paid for this MockPay order yet.';
  end if;

  -- Validate transition
  -- pending → accepted, rejected, cancelled
  -- accepted → preparing, rejected, cancelled
  -- preparing → delivering, rejected, cancelled
  -- delivering → completed, rejected, cancelled
  if v_order.order_status = 'pending' and p_new_status in ('accepted', 'rejected', 'cancelled') then
    v_valid_transition := true;
  elsif v_order.order_status = 'accepted' and p_new_status in ('preparing', 'rejected', 'cancelled') then
    v_valid_transition := true;
  elsif v_order.order_status = 'preparing' and p_new_status in ('delivering', 'rejected', 'cancelled') then
    v_valid_transition := true;
  elsif v_order.order_status = 'delivering' and p_new_status in ('completed', 'rejected', 'cancelled') then
    v_valid_transition := true;
  end if;

  if not v_valid_transition then
    raise exception 'Invalid transition from % to %.', v_order.order_status, p_new_status;
  end if;

  -- Business rules for payment status transitions
  if p_new_status = 'completed'
     and v_order.payment_method = 'cod'
     and v_order.payment_status = 'pending' then
    -- COD: payment becomes paid when seller marks completed
    update public.orders
    set order_status = 'completed', payment_status = 'paid'
    where id = p_order_id;

    insert into public.payments (order_id, method, status)
    values (p_order_id, 'cod', 'paid');

  elsif p_new_status in ('rejected', 'cancelled')
     and v_order.payment_status = 'paid' then
    -- Paid order rejected/cancelled -> simulated refund + restore stock
    update public.orders
    set order_status = p_new_status, payment_status = 'refunded'
    where id = p_order_id;

    insert into public.payments (order_id, method, status)
    values (p_order_id, v_order.payment_method, 'refunded');

    update public.products p
    set stock = stock + oi.quantity
    from public.order_items oi
    where oi.order_id = p_order_id and p.id = oi.product_id;

  elsif p_new_status in ('rejected', 'cancelled')
     and v_order.payment_status = 'pending' then
    -- Unpaid order rejected/cancelled -> restore stock
    update public.orders
    set order_status = p_new_status, payment_status = 'cancelled'
    where id = p_order_id;

    update public.products p
    set stock = stock + oi.quantity
    from public.order_items oi
    where oi.order_id = p_order_id and p.id = oi.product_id;

  else
    update public.orders
    set order_status = p_new_status
    where id = p_order_id;
  end if;
end;
$$ language plpgsql security definer
set search_path = public;

-- Re-grant execute to authenticated (re-created function loses grants)
grant execute on function public.update_order_status(uuid, text) to authenticated;

-- ============================================================
-- 2. process_mockpay: strict guards + cancel sets order status
-- ============================================================

create or replace function public.process_mockpay(
  p_order_id uuid,
  p_amount numeric,
  p_result text
) returns void as $$
declare
  v_order record;
begin
  select * into v_order
  from public.orders
  where id = p_order_id;

  if not found then
    raise exception 'Order not found';
  end if;

  -- Only MockPay orders can be processed through MockPay
  if v_order.payment_method <> 'mockpay' then
    raise exception 'This order was not placed via MockPay.';
  end if;

  -- Verify caller is the customer who owns the order
  if v_order.customer_id <> auth.uid() then
    raise exception 'Order does not belong to caller.';
  end if;

  -- Cannot pay an order already in a terminal state
  if v_order.order_status in ('rejected', 'cancelled', 'completed') then
    raise exception 'Order is already in a terminal state (%).', v_order.order_status;
  end if;

  -- Verify order is awaiting payment
  if v_order.payment_status <> 'pending' then
    raise exception 'Order is not awaiting payment.';
  end if;

  -- Validate amount matches order total
  if p_amount <> v_order.total then
    raise exception 'Amount does not match order total';
  end if;

  if p_result = 'approve' then
    update public.orders
    set payment_status = 'paid'
    where id = p_order_id;

    insert into public.payments (order_id, method, status)
    values (p_order_id, 'mockpay', 'paid');

  elsif p_result = 'cancel' then
    update public.orders
    set payment_status = 'cancelled', order_status = 'cancelled';

    insert into public.payments (order_id, method, status)
    values (p_order_id, 'mockpay', 'cancelled');

    -- Restore stock for all items in the order
    update public.products p
    set stock = stock + oi.quantity
    from public.order_items oi
    where oi.order_id = p_order_id and p.id = oi.product_id;

  else
    raise exception 'Invalid result: must be approve or cancel.';
  end if;
end;
$$ language plpgsql security definer
set search_path = public;

-- Restrict execute: only authenticated callers may invoke MockPay via RPC
grant execute on function public.process_mockpay(uuid, numeric, text) to authenticated;
revoke execute on function public.process_mockpay(uuid, numeric, text) from anon;
````

## File: supabase/migrations/017_fix_process_mockpay_cancel_where.sql
````sql
-- Migration: 017_fix_process_mockpay_cancel_where
-- Fixes process_mockpay's cancel branch, which was missing a WHERE clause on
-- the orders UPDATE. Without it the statement is rejected by the database
-- ("UPDATE requires a WHERE clause") and the cancel path never completes.

create or replace function public.process_mockpay(
  p_order_id uuid,
  p_amount numeric,
  p_result text
) returns void as $$
declare
  v_order record;
begin
  select * into v_order
  from public.orders
  where id = p_order_id;

  if not found then
    raise exception 'Order not found';
  end if;

  -- Only MockPay orders can be processed through MockPay
  if v_order.payment_method <> 'mockpay' then
    raise exception 'This order was not placed via MockPay.';
  end if;

  -- Verify caller is the customer who owns the order
  if v_order.customer_id <> auth.uid() then
    raise exception 'Order does not belong to caller.';
  end if;

  -- Cannot pay an order already in a terminal state
  if v_order.order_status in ('rejected', 'cancelled', 'completed') then
    raise exception 'Order is already in a terminal state (%).', v_order.order_status;
  end if;

  -- Verify order is awaiting payment
  if v_order.payment_status <> 'pending' then
    raise exception 'Order is not awaiting payment.';
  end if;

  -- Validate amount matches order total
  if p_amount <> v_order.total then
    raise exception 'Amount does not match order total';
  end if;

  if p_result = 'approve' then
    update public.orders
    set payment_status = 'paid'
    where id = p_order_id;

    insert into public.payments (order_id, method, status)
    values (p_order_id, 'mockpay', 'paid');

  elsif p_result = 'cancel' then
    update public.orders
    set payment_status = 'cancelled', order_status = 'cancelled'
    where id = p_order_id;

    insert into public.payments (order_id, method, status)
    values (p_order_id, 'mockpay', 'cancelled');

    -- Restore stock for all items in the order
    update public.products p
    set stock = stock + oi.quantity
    from public.order_items oi
    where oi.order_id = p_order_id and p.id = oi.product_id;

  else
    raise exception 'Invalid result: must be approve or cancel.';
  end if;
end;
$$ language plpgsql security definer
set search_path = public;

-- Restrict execute: only authenticated callers may invoke MockPay via RPC
grant execute on function public.process_mockpay(uuid, numeric, text) to authenticated;
revoke execute on function public.process_mockpay(uuid, numeric, text) from anon;
````

## File: supabase/migrations/018_seed_demo_data.sql
````sql
-- Migration: 018_seed_demo_data
-- Applies the demo catalogue (categories, approved stores, demo products) so a
-- fresh environment has something to show. This is the same content as
-- `supabase/seed.sql`, which the Supabase CLI runs on `supabase db reset`.
-- Keep the two files in sync.
--
-- The demo auth accounts must already exist (see `scripts/seed.ts`); the
-- statements below resolve every relationship through natural keys, so this
-- migration is idempotent and safe to re-run.

-- =============================================================================
-- Seed data for (SP) Pamilihub
-- =============================================================================
-- The demo accounts must already exist in Supabase Auth, because
-- `public.profiles.id` references `auth.users.id` and the profile rows are
-- created by the `on_auth_user_created` trigger.
--
--   Recommended: run `pnpm exec tsx scripts/seed.ts` instead. That script
--   creates the auth accounts AND fills every table below in one command.
--   Use this file only when the accounts already exist (for example after
--   `supabase db reset` plus manual signup, or on an existing project).
--
-- No hard-coded UUIDs are used: every primary key comes from
-- `gen_random_uuid()` and every relationship is resolved through a natural key
-- (auth email, store name, category name). The file is therefore idempotent
-- and safe to run more than once.
-- =============================================================================

-- -------------------------------------------------------------------
-- 1. Profiles
--    The auth trigger already creates a profiles row per account with the
--    default role `customer`, so here we only fill in the demo details.
-- -------------------------------------------------------------------
update public.profiles p
set role      = d.role,
    full_name = d.full_name,
    phone     = d.phone,
    address   = d.address
from (
  select u.id as user_id, d.role, d.full_name, d.phone, d.address
  from auth.users u
  join (values
    ('admin@pamilihub.test',   'admin',    'Platform Administrator', '+63 917 000 0001', 'San Pablo City, Laguna'),
    ('maria@pamilihub.test',   'seller',   'Maria Santos',           '+63 917 000 0002', 'Brgy. San Rafael, San Pablo City, Laguna'),
    ('jose@pamilihub.test',    'seller',   'Jose Reyes',             '+63 917 000 0003', 'Brgy. Del Remedio, San Pablo City, Laguna'),
    ('pending@pamilihub.test', 'seller',   'Pending Applicant',      '+63 917 000 0004', 'Brgy. San Vicente, San Pablo City, Laguna'),
    ('ana@pamilihub.test',     'customer', 'Ana Customer',           '+63 917 000 0010', 'Brgy. San Francisco, San Pablo City, Laguna'),
    ('bob@pamilihub.test',     'customer', 'Bob Buyer',              '+63 917 000 0011', 'Brgy. Santa Cruz, San Pablo City, Laguna'),
    ('carla@pamilihub.test',   'customer', 'Carla Shopper',          '+63 917 000 0012', 'Brgy. Concepcion, San Pablo City, Laguna')
  ) as d(email, role, full_name, phone, address)
    on d.email = u.email
) d
where p.id = d.user_id;

-- -------------------------------------------------------------------
-- 2. Sellers
--    Resolved from the seller's auth account. `status` is only written on
--    insert, so re-running the file never demotes an approved store.
-- -------------------------------------------------------------------
insert into public.sellers (profile_id, store_name, description, location, status)
select p.id, d.store_name, d.description, d.location, d.status
from (values
  ('maria@pamilihub.test',   'Lola Mayas Bakeshop', 'Home-baked buko pie, egg pie, and pastries from San Pablo.', 'Brgy. San Rafael, San Pablo City, Laguna',   'approved'),
  ('jose@pamilihub.test',    'Kakanin ni Lola',     'Traditional kakanin: biko, suman, sapin-sapin.',      'Brgy. Del Remedio, San Pablo City, Laguna', 'approved'),
  ('pending@pamilihub.test', 'Pending Store',       'Awaiting admin approval.',                                'Brgy. San Vicente, San Pablo City, Laguna', 'pending')
) as d(email, store_name, description, location, status)
join auth.users u on u.email = d.email
join public.profiles p on p.id = u.id
on conflict (profile_id) do update
  set store_name = excluded.store_name,
      description = excluded.description,
      location    = excluded.location;

-- -------------------------------------------------------------------
-- 3. Categories
-- -------------------------------------------------------------------
insert into public.categories (name)
select d.name
from (values
  ('Pies and Pastries'),
  ('Kakanin'),
  ('Coffee'),
  ('Snacks')
) as d(name)
on conflict (name) do nothing;

-- -------------------------------------------------------------------
-- 4. Products
--    Only added when missing, so seller edits (price, stock, image) survive
--    a re-run of the seed.
-- -------------------------------------------------------------------
insert into public.products (seller_id, category_id, name, description, price, stock, image_url)
select s.id, c.id, d.name, d.description, d.price, d.stock, d.image_url
from (values
  ('Lola Mayas Bakeshop', 'Pies and Pastries', 'Buko Pie',      'Fresh young coconut pie with flaky crust.',           350.00, 20, 'https://sauniaihyxypnnktfpip.supabase.co/storage/v1/object/public/product-images/demo/buko-pie.png'),
  ('Lola Mayas Bakeshop', 'Pies and Pastries', 'Egg Pie',       'Creamy custard egg pie.',                              250.00, 15, 'https://sauniaihyxypnnktfpip.supabase.co/storage/v1/object/public/product-images/demo/egg-pie.png'),
  ('Kakanin ni Lola',     'Kakanin',           'Biko',          'Sticky rice cake with coconut caramel topping.',      120.00, 30, 'https://sauniaihyxypnnktfpip.supabase.co/storage/v1/object/public/product-images/demo/biko.png'),
  ('Kakanin ni Lola',     'Kakanin',           'Suman',         'Sticky rice in coconut milk, wrapped in banana leaves.', 80.00, 40, 'https://sauniaihyxypnnktfpip.supabase.co/storage/v1/object/public/product-images/demo/suman.png'),
  ('Kakanin ni Lola',     'Coffee',            'Barako Coffee', 'Locally roasted Barako coffee beans.',                  200.00, 25, 'https://sauniaihyxypnnktfpip.supabase.co/storage/v1/object/public/product-images/demo/barako-coffee.png')
) as d(store_name, category_name, name, description, price, stock, image_url)
join public.sellers s on s.store_name = d.store_name
join public.categories c on c.name = d.category_name
where not exists (
  select 1
  from public.products p
  where p.seller_id = s.id
    and p.name = d.name
);

-- -------------------------------------------------------------------
-- 5. Verification
-- -------------------------------------------------------------------
select
  (select count(*) from public.categories) as categories,
  (select count(*) from public.sellers)    as sellers,
  (select count(*) from public.products)   as products,
  (select count(*) from public.profiles)   as profiles;
````

## File: supabase/.gitignore
````
# Supabase
.branches
.temp

# dotenvx
.env.keys
.env.local
.env.*.local
````

## File: supabase/config.toml
````toml
# For detailed configuration reference documentation, visit:
# https://supabase.com/docs/guides/local-development/cli/config
# A string used to distinguish different Supabase projects on the same host. Defaults to the
# working directory name when running `supabase init`.
project_id = "PRINCE"

[api]
enabled = true
# Port to use for the API URL.
port = 54321
# Schemas to expose in your API. Tables, views and stored procedures in this schema will get API
# endpoints. `public` and `graphql_public` schemas are included by default.
schemas = ["public", "graphql_public"]
# Extra schemas to add to the search_path of every request.
extra_search_path = ["public", "extensions"]
# The maximum number of rows returned from a view, table, or stored procedure. Limits payload size
# for accidental or malicious requests.
max_rows = 1000
# Controls whether new tables, views, sequences and functions created in the `public` schema by
# `postgres` are reachable through the Data API roles (`anon`, `authenticated`, `service_role`)
# without explicit GRANTs, matching the cloud default. Set to `false` to require explicit GRANTs
# instead. Left unset, a fresh project falls back to `true`.
# auto_expose_new_tables = true

[api.tls]
# Enable HTTPS endpoints locally using a self-signed certificate.
enabled = false
# Paths to self-signed certificate pair.
# cert_path = "../certs/my-cert.pem"
# key_path = "../certs/my-key.pem"

[db]
# Port to use for the local database URL.
port = 54322
# Port used by db diff command to initialize the shadow database.
shadow_port = 54320
# Maximum amount of time to wait for health check when starting the local database.
health_timeout = "2m"
# The database major version to use. This has to be the same as your remote database's. Run `SHOW
# server_version;` on the remote database to check.
major_version = 17
# OrioleDB version to use as the Postgres storage engine. Leave empty to use the default engine.
orioledb_version = ""

[db.pooler]
enabled = false
# Port to use for the local connection pooler.
port = 54329
# Specifies when a server connection can be reused by other clients.
# Configure one of the supported pooler modes: `transaction`, `session`.
pool_mode = "transaction"
# How many server connections to allow per user/database pair.
default_pool_size = 20
# Maximum number of client connections allowed.
max_client_conn = 100

# [db.vault]
# secret_key = "env(SECRET_VALUE)"

[db.migrations]
# If disabled, migrations will be skipped during a db push or reset.
enabled = true
# Specifies an ordered list of schema files, directories, or glob patterns that describe your database.
# Supports paths relative to supabase directory: "./schemas/*.sql", "./database".
schema_paths = []

[db.seed]
# If enabled, seeds the database after migrations during a db reset.
enabled = true
# Specifies an ordered list of seed files to load during db reset.
# Supports glob patterns relative to supabase directory: "./seeds/*.sql"
sql_paths = ["./seed.sql"]

[db.network_restrictions]
# Enable management of network restrictions.
enabled = false
# List of IPv4 CIDR blocks allowed to connect to the database.
# Defaults to allow all IPv4 connections. Set empty array to block all IPs.
allowed_cidrs = ["0.0.0.0/0"]
# List of IPv6 CIDR blocks allowed to connect to the database.
# Defaults to allow all IPv6 connections. Set empty array to block all IPs.
allowed_cidrs_v6 = ["::/0"]

# Uncomment to reject non-secure connections to the database.
# [db.ssl_enforcement]
# enabled = true

[realtime]
enabled = true
# Bind realtime via either IPv4 or IPv6. (default: IPv4)
# ip_version = "IPv6"
# The maximum length in bytes of HTTP request headers. (default: 4096)
# max_header_length = 4096

[studio]
enabled = true
# Port to use for Supabase Studio.
port = 54323
# External URL of the API server that frontend connects to.
api_url = "http://127.0.0.1"
# OpenAI API Key to use for Supabase AI in the Supabase Studio.
openai_api_key = "env(OPENAI_API_KEY)"

# Email testing server. Emails sent with the local dev setup are not actually sent - rather, they
# are monitored, and you can view the emails that would have been sent from the web interface.
[local_smtp]
enabled = true
# Port to use for the email testing server web interface.
port = 54324
# Uncomment to expose additional ports for testing user applications that send emails.
# smtp_port = 54325
# pop3_port = 54326
# admin_email = "admin@email.com"
# sender_name = "Admin"

[storage]
enabled = true
# The maximum file size allowed (e.g. "5MB", "500KB").
file_size_limit = "50MiB"

# Uncomment to configure local storage buckets
# [storage.buckets.images]
# public = false
# file_size_limit = "50MiB"
# allowed_mime_types = ["image/png", "image/jpeg"]
# objects_path = "./images"

# Allow connections via S3 compatible clients
[storage.s3_protocol]
enabled = true

# Image transformation API is available to Supabase Pro plan.
# [storage.image_transformation]
# enabled = true

# Store analytical data in S3 for running ETL jobs over Iceberg Catalog
# This feature is only available on the hosted platform.
[storage.analytics]
enabled = false
max_namespaces = 5
max_tables = 10
max_catalogs = 2

# Analytics Buckets is available to Supabase Pro plan.
# [storage.analytics.buckets.my-warehouse]

# Store vector embeddings in S3 for large and durable datasets
[storage.vector]
enabled = true
max_buckets = 10
max_indexes = 5

# Vector Buckets is available to Supabase Pro plan.
# [storage.vector.buckets.documents-openai]

[auth]
enabled = true
# The base URL of your website. Used as an allow-list for redirects and for constructing URLs used
# in emails.
site_url = "http://127.0.0.1:3000"
# The public URL that Auth serves on. Defaults to the API external URL with `/auth/v1` appended.
# external_url = ""
# A list of *exact* URLs that auth providers are permitted to redirect to post authentication.
additional_redirect_urls = ["https://127.0.0.1:3000"]
# How long tokens are valid for, in seconds. Defaults to 3600 (1 hour), maximum 604,800 (1 week).
jwt_expiry = 3600
# JWT issuer URL. If not set, defaults to auth.external_url.
# jwt_issuer = ""
# Path to JWT signing key. DO NOT commit your signing keys file to git.
# signing_keys_path = "./signing_keys.json"
# If disabled, the refresh token will never expire.
enable_refresh_token_rotation = true
# Allows refresh tokens to be reused after expiry, up to the specified interval in seconds.
# Requires enable_refresh_token_rotation = true.
refresh_token_reuse_interval = 10
# Allow/disallow new user signups to your project. Existing users can still sign in.
enable_signup = true
# Allow/disallow anonymous sign-ins to your project.
enable_anonymous_sign_ins = false
# Allow/disallow testing manual linking of accounts
enable_manual_linking = false
# Passwords shorter than this value will be rejected as weak. Minimum 6, recommended 8 or more.
minimum_password_length = 6
# Passwords that do not meet the following requirements will be rejected as weak. Supported values
# are: `letters_digits`, `lower_upper_letters_digits`, `lower_upper_letters_digits_symbols`
password_requirements = ""

# Configure passkey sign-ins.
# [auth.passkey]
# enabled = false

# Configure WebAuthn relying party settings (required when passkey is enabled).
# [auth.webauthn]
# rp_display_name = "Supabase"
# rp_id = "localhost"
# rp_origins = ["http://127.0.0.1:3000"]

[auth.rate_limit]
# Number of emails that can be sent per hour. Requires auth.email.smtp to be enabled.
email_sent = 2
# Number of SMS messages that can be sent per hour. Requires auth.sms to be enabled.
sms_sent = 30
# Number of anonymous sign-ins that can be made per hour per IP address. Requires enable_anonymous_sign_ins = true.
anonymous_users = 30
# Number of sessions that can be refreshed in a 5 minute interval per IP address.
token_refresh = 150
# Number of sign up and sign-in requests that can be made in a 5 minute interval per IP address (excludes anonymous users).
sign_in_sign_ups = 30
# Number of OTP / Magic link verifications that can be made in a 5 minute interval per IP address.
token_verifications = 30
# Number of Web3 logins that can be made in a 5 minute interval per IP address.
web3 = 30

# Configure one of the supported captcha providers: `hcaptcha`, `turnstile`.
# [auth.captcha]
# enabled = true
# provider = "hcaptcha"
# secret = ""

[auth.email]
# Allow/disallow the email provider. When false, users can't sign up or sign in with email.
# To block new signups only, set enable_signup = false under [auth] instead.
enabled = true
# If enabled, a user will be required to confirm any email change on both the old, and new email
# addresses. If disabled, only the new email is required to confirm.
double_confirm_changes = true
# If enabled, users need to confirm their email address before signing in.
enable_confirmations = false
# If enabled, users will need to reauthenticate or have logged in recently to change their password.
secure_password_change = false
# Controls the minimum amount of time that must pass before sending another signup confirmation or password reset email.
max_frequency = "1s"
# Number of characters used in the email OTP.
otp_length = 6
# Number of seconds before the email OTP expires (defaults to 1 hour).
otp_expiry = 3600

# Use a production-ready SMTP server
# [auth.email.smtp]
# enabled = true
# host = "smtp.sendgrid.net"
# port = 587
# user = "apikey"
# pass = "env(SENDGRID_API_KEY)"
# admin_email = "admin@email.com"
# sender_name = "Admin"

# Uncomment to customize email template
# [auth.email.template.invite]
# subject = "You have been invited"
# content_path = "./supabase/templates/invite.html"

# Uncomment to customize notification email template
# [auth.email.notification.password_changed]
# enabled = true
# subject = "Your password has been changed"
# content_path = "./supabase/templates/password_changed_notification.html"

[auth.sms]
# Allow/disallow the phone provider. When false, users can't sign up or sign in with SMS.
# To block new signups only, set enable_signup = false under [auth] instead.
enabled = false
# If enabled, users need to confirm their phone number before signing in.
enable_confirmations = false
# Template for sending OTP to users
template = "Your code is {{ .Code }}"
# Controls the minimum amount of time that must pass before sending another sms otp.
max_frequency = "5s"

# Use pre-defined map of phone number to OTP for testing.
# Keys are the phone number with country code and without the + prefix.
# [auth.sms.test_otp]
# 14152127777 = "123456"

# Configure logged in session timeouts.
# [auth.sessions]
# Force log out after the specified duration.
# timebox = "24h"
# Force log out if the user has been inactive longer than the specified duration.
# inactivity_timeout = "8h"

# This hook runs before a new user is created and allows developers to reject the request based on the incoming user object.
# [auth.hook.before_user_created]
# enabled = true
# uri = "pg-functions://postgres/auth/before-user-created-hook"

# This hook runs before a token is issued and allows you to add additional claims based on the authentication method used.
# [auth.hook.custom_access_token]
# enabled = true
# uri = "pg-functions://<database>/<schema>/<hook_name>"

# Configure one of the supported SMS providers: `twilio`, `twilio_verify`, `messagebird`, `textlocal`, `vonage`.
[auth.sms.twilio]
enabled = false
account_sid = ""
message_service_sid = ""
# DO NOT commit your Twilio auth token to git. Use environment variable substitution instead:
auth_token = "env(SUPABASE_AUTH_SMS_TWILIO_AUTH_TOKEN)"

# Multi-factor-authentication is available to Supabase Pro plan.
[auth.mfa]
# Control how many MFA factors can be enrolled at once per user.
max_enrolled_factors = 10

# Control MFA via App Authenticator (TOTP)
[auth.mfa.totp]
enroll_enabled = false
verify_enabled = false

# Configure MFA via Phone Messaging
[auth.mfa.phone]
enroll_enabled = false
verify_enabled = false
otp_length = 6
template = "Your code is {{ .Code }}"
max_frequency = "5s"

# Configure MFA via WebAuthn
# [auth.mfa.web_authn]
# enroll_enabled = true
# verify_enabled = true

# Use an external OAuth provider. The full list of providers are: `apple`, `azure`, `bitbucket`,
# `discord`, `facebook`, `github`, `gitlab`, `google`, `keycloak`, `linkedin_oidc`, `notion`, `twitch`,
# `twitter`, `x`, `slack_oidc`, `spotify`, `workos`, `zoom`.
[auth.external.apple]
enabled = false
client_id = ""
# DO NOT commit your OAuth provider secret to git. Use environment variable substitution instead:
secret = "env(SUPABASE_AUTH_EXTERNAL_APPLE_SECRET)"
# Overrides the default auth callback URL derived from auth.external_url.
redirect_uri = ""
# Overrides the default auth provider URL. Used to support self-hosted gitlab, single-tenant Azure,
# or any other third-party OIDC providers.
url = ""
# If enabled, the nonce check will be skipped. Required for local sign in with Google auth.
skip_nonce_check = false
# If enabled, it will allow the user to successfully authenticate when the provider does not return an email address.
email_optional = false

# Allow Solana wallet holders to sign in to your project via the Sign in with Solana (SIWS) standard.
# You can configure "web3" rate limit in the [auth.rate_limit] section and set up [auth.captcha] if self-hosting.
[auth.web3.solana]
enabled = false

# Allow Ethereum wallet holders to sign in to your project via the Sign in with Ethereum (SIWE, EIP-4361) standard.
# [auth.web3.ethereum]
# enabled = true

# Use Firebase Auth as a third-party provider alongside Supabase Auth.
[auth.third_party.firebase]
enabled = false
# project_id = "my-firebase-project"

# Use Auth0 as a third-party provider alongside Supabase Auth.
[auth.third_party.auth0]
enabled = false
# tenant = "my-auth0-tenant"
# tenant_region = "us"

# Use AWS Cognito (Amplify) as a third-party provider alongside Supabase Auth.
[auth.third_party.aws_cognito]
enabled = false
# user_pool_id = "my-user-pool-id"
# user_pool_region = "us-east-1"

# Use Clerk as a third-party provider alongside Supabase Auth.
[auth.third_party.clerk]
enabled = false
# Obtain from https://clerk.com/setup/supabase
# domain = "example.clerk.accounts.dev"

# OAuth server configuration
[auth.oauth_server]
# Enable OAuth server functionality
enabled = false
# Path for OAuth consent flow UI
authorization_url_path = "/oauth/consent"
# Allow dynamic client registration
allow_dynamic_registration = false

[edge_runtime]
enabled = true
# Supported request policies: `oneshot`, `per_worker`.
# `per_worker` (default) — enables hot reload during local development.
# `oneshot` — fallback mode if hot reload causes issues (e.g. in large repos or with symlinks).
policy = "per_worker"
# Port to attach the Chrome inspector for debugging edge functions.
inspector_port = 8083
# The Deno major version to use.
deno_version = 2

# [edge_runtime.secrets]
# secret_key = "env(SECRET_VALUE)"

[analytics]
enabled = true
port = 54327
# Configure one of the supported backends: `postgres`, `bigquery`.
backend = "postgres"

# Experimental features may be deprecated any time
[experimental]
# Configures S3 bucket URL, eg. <bucket_name>.s3-<region>.amazonaws.com
s3_host = "env(S3_HOST)"
# Configures S3 bucket region, eg. us-east-1
s3_region = "env(S3_REGION)"
# Configures AWS_ACCESS_KEY_ID for S3 bucket
s3_access_key = "env(S3_ACCESS_KEY)"
# Configures AWS_SECRET_ACCESS_KEY for S3 bucket
s3_secret_key = "env(S3_SECRET_KEY)"

# pg-delta is the schema diff engine for db diff / db pull.
# Set enabled = false to fall back to the legacy migra engine.
[experimental.pgdelta]
enabled = true
# Directory under `supabase/` where declarative files are written.
# declarative_schema_path = "./schemas"
# JSON string passed through to pg-delta SQL formatting. When omitted, SQL is
# formatted with uppercase keywords, indent 2, max width 180, trailing commas,
# and column/key alignment. Set to "null" to emit raw, unformatted SQL.
# format_options = "{\"keywordCase\":\"upper\",\"indent\":2,\"maxWidth\":180,\"commaStyle\":\"trailing\"}"
````

## File: .env.example
````
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
````

## File: .eslintrc.json
````json
{
  "extends": ["next/core-web-vitals"],
  "rules": {}
}
````

## File: CLAUDE.md
````markdown
# CLAUDE.md

Read `AGENTS.md` first. It is the main instruction file for this repository, and everything in it applies here.

If you are running as a specific agent, also read your role file in `agents/` (planner, database, backend, frontend, qa, or docs-evaluation) and stay within the files it says you own.
````

## File: components.json
````json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
````

## File: next.config.mjs
````javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
````

## File: opencode.jsonc
````json
{
  "$schema": "https://opencode.ai/config.json",
  "instructions": [
    "AGENTS.md",
    "docs/*.md",
    "agents/*.md"
  ]
}
````

## File: postcss.config.mjs
````javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
````

## File: tailwind.config.ts
````typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "var(--radius)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};
export default config;
````

## File: tsconfig.json
````json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
````

## File: docs/API.md
````markdown
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
Cancelling also sets `order_status = cancelled`, so the seller cannot accept or fulfil it afterwards.

Error:
```json
{ "error": "Order not found or not awaiting payment." }
```
Non-MockPay order (e.g. COD):
```json
{ "error": "This order was not placed via MockPay." }
```
Terminal order (`rejected`, `cancelled`, or `completed`):
```json
{ "error": "Order is no longer awaiting payment." }
```
Use HTTP 200 for success, 400 for validation errors (including non-MockPay or terminal orders), 401/403 for auth errors, 404 for a missing order.

## Flow
1. Checkout creates the order(s) with `payment_status = pending`.
2. Customer chooses MockPay and sees the simulated payment page.
3. The page sends the JSON request to `/api/mockpay`.
4. The route updates `payment_status` (and `order_status` to `cancelled` on cancel), writes a `payments` record, and restores stock if cancelled.
5. The UI shows the result; the seller sees the updated status.

## Postman tests (minimum)
- Approve with a valid order → `paid`.
- Cancel with a valid order → `cancelled`, stock restored.
- Wrong amount → 400.
- Another customer's order → 403.
- No session → 401.
- Order already paid → 400.
- COD order passed to MockPay → 400.
- Rejected or cancelled order → 400.

Future enhancements (not in scope): webhook signing, replaceable payment-adapter architecture, real gateway integration.
````

## File: docs/BUSINESS_RULES.md
````markdown
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

## 6. Payment-gated order acceptance
- **MockPay:** the seller may only `accept` an order after the customer has approved payment on MockPay (`payment_status = paid`). Before payment, the seller may only `reject` the order (restoring stock) or wait. Once `accepted`, statuses progress normally: `accepted → preparing → delivering → completed`.
- **Cash on delivery:** the seller may `accept` immediately; payment stays `pending` until the seller marks the order `completed`, then it becomes `paid`.
- Terminal states (`completed`, `rejected`, `cancelled`) block all further transitions.

## 7. Seller approval
New sellers start as `pending`. Only `approved` sellers can list products or receive orders. Admin approves or rejects.

## 8. Visibility
- Customers see only products from approved sellers.
- Customers and sellers must both be able to clearly see the order and payment status of an order.
````

## File: scripts/gen-pngs.ts
````typescript
/**
 * Generates simple PNG placeholder images for demo products.
 * Each product gets a distinct color swatch with a simple food shape.
 * Run with: node --import tsx scripts/gen-pngs.ts
 */

import fs from "fs";
import path from "path";
import zlib from "zlib";

const OUT_DIR = path.join(process.cwd(), "scripts/demo-images");

const PRODUCTS: Array<{
  name: string;
  file: string;
  color: string; // hex
  shape: "pie" | "bun" | "drum" | "coffee";
}> = [
  { name: "Buko Pie", file: "buko-pie.png", color: "#c0392b", shape: "pie" },
  { name: "Egg Pie", file: "egg-pie.png", color: "#e67e22", shape: "pie" },
  { name: "Biko", file: "biko.png", color: "#d68910", shape: "bun" },
  { name: "Suman", file: "suman.png", color: "#a0522d", shape: "drum" },
  { name: "Barako Coffee", file: "barako-coffee.png", color: "#3e2723", shape: "coffee" },
];

function hexToRgb(hex: string): [number, number, number] {
  const c = hex.replace("#", "");
  return [
    parseInt(c.slice(0, 2), 16),
    parseInt(c.slice(2, 4), 16),
    parseInt(c.slice(4, 6), 16),
  ];
}

function blendColors(
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

function setPixel(
  raw: Buffer,
  rowBytes: number,
  width: number,
  height: number,
  x: number,
  y: number,
  color: [number, number, number]
) {
  if (x < 0 || x >= width || y < 0 || y >= height) return;
  const p = y * rowBytes + 1 + x * 3;
  raw[p] = color[0];
  raw[p + 1] = color[1];
  raw[p + 2] = color[2];
}

function fillRect(
  raw: Buffer,
  rowBytes: number,
  width: number,
  height: number,
  x: number,
  y: number,
  w: number,
  h: number,
  color: [number, number, number]
) {
  for (let yy = y; yy < y + h; yy++) {
    for (let xx = x; xx < x + w; xx++) {
      setPixel(raw, rowBytes, width, height, xx, yy, color);
    }
  }
}

function drawCircle(
  raw: Buffer,
  rowBytes: number,
  width: number,
  height: number,
  cx: number,
  cy: number,
  radius: number,
  color: [number, number, number]
) {
  const r2 = radius * radius;
  for (let y = cy - radius; y <= cy + radius; y++) {
    for (let x = cx - radius; x <= cx + radius; x++) {
      const dx = x - cx;
      const dy = y - cy;
      if (dx * dx + dy * dy <= r2) {
        setPixel(raw, rowBytes, width, height, x, y, color);
      }
    }
  }
}

function drawLine(
  raw: Buffer,
  rowBytes: number,
  width: number,
  height: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  color: [number, number, number],
  thickness: number
) {
  const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) || 1;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = Math.round(x0 + (x1 - x0) * t);
    const y = Math.round(y0 + (y1 - y0) * t);
    for (let dy = -Math.floor(thickness / 2); dy <= Math.floor(thickness / 2); dy++) {
      setPixel(raw, rowBytes, width, height, x, y + dy, color);
    }
  }
}

function chunk(type: string, data: Buffer): Buffer {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crcInput = Buffer.concat([typeBuf, data]);
  // CRC-32 (IEEE)
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < crcInput.length; i++) {
    crc ^= crcInput[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (0xEDB88320 & -(crc & 1));
    }
  }
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE((crc ^ 0xFFFFFFFF) >>> 0, 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function writePng(
  file: string,
  width: number,
  height: number,
  rgb: [number, number, number],
  shape: string
) {
  const [r, g, b] = rgb;
  const bg = blendColors([255, 255, 255], [r, g, b], 0.82); // light tint bg
  const fg = blendColors([r, g, b], [0, 0, 0], 0.25); // darker accent

  const rowBytes = width * 3 + 1; // 1 filter byte + 3 bytes per pixel
  const raw = Buffer.alloc(rowBytes * height);

  // Fill background
  for (let y = 0; y < height; y++) {
    const rowStart = y * rowBytes;
    raw[rowStart] = 0; // filter: none
    for (let x = 0; x < width; x++) {
      const p = rowStart + 1 + x * 3;
      raw[p] = bg[0];
      raw[p + 1] = bg[1];
      raw[p + 2] = bg[2];
    }
  }

  const cx = width / 2;
  const cy = height / 2;

  switch (shape) {
    case "pie": {
      // A pie: filled circle with a slice line
      drawCircle(raw, rowBytes, width, height, cx, cy, 140, fg);
      drawLine(raw, rowBytes, width, height, cx, cy, cx + 140, cy, fg, 4);
      drawLine(raw, rowBytes, width, height, cx, cy, cx, cy - 140, fg, 4);
      break;
    }
    case "bun": {
      // A bun: wider oval
      for (let y = cy - 110; y <= cy + 110; y++) {
        const dy = y - cy;
        const rx = Math.round(130 * Math.sqrt(1 - (dy * dy) / (110 * 110)));
        for (let x = cx - rx; x <= cx + rx; x++) {
          setPixel(raw, rowBytes, width, height, x, y, fg);
        }
      }
      break;
    }
    case "drum": {
      // A drum: rectangle wider than tall
      fillRect(raw, rowBytes, width, height, cx - 130, cy - 90, 260, 180, fg);
      break;
    }
    case "coffee": {
      // Coffee: cup circle with steam above
      drawCircle(raw, rowBytes, width, height, cx, cy + 10, 110, fg);
      drawLine(raw, rowBytes, width, height, cx - 30, cy - 95, cx - 30, cy - 130, fg, 4);
      drawLine(raw, rowBytes, width, height, cx + 30, cy - 95, cx + 20, cy - 130, fg, 4);
      drawLine(raw, rowBytes, width, height, cx, cy - 90, cx + 5, cy - 125, fg, 4);
      break;
    }
  }

  const compressed = zlib.deflateSync(raw);

  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 2; // color type: RGB
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace

  const ihdr = chunk("IHDR", ihdrData);
  const idat = chunk("IDAT", compressed);
  const iend = chunk("IEND", Buffer.alloc(0));

  const png = Buffer.concat([signature, ihdr, idat, iend]);
  fs.writeFileSync(file, png);
}

fs.mkdirSync(OUT_DIR, { recursive: true });

for (const p of PRODUCTS) {
  const file = path.join(OUT_DIR, p.file);
  const rgb = hexToRgb(p.color);
  writePng(file, 400, 400, rgb, p.shape);
  console.log(`Generated ${file}`);
}

console.log("✅ PNG images generated!");
````

## File: src/app/(auth)/login/page.tsx
````typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginAction } from "@/modules/accounts/actions";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setMessage("");
    setError("");

    const result = await loginAction(null, formData);

    if (result.success) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setError(result.message || "Invalid email or password.");
    }

    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-xl font-bold tracking-tight text-foreground">Welcome back</h1>
        <p className="text-xs text-muted-foreground">
          Enter your credentials to access your account
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-700 flex items-start gap-2 animate-in fade-in-50">
          <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {message && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 animate-in fade-in-50">
          {message}
        </div>
      )}

      <form action={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
            Email address
          </label>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            placeholder="juan@example.com"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
              Password
            </label>
          </div>
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-60 transition-all cursor-pointer"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Signing in...</span>
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <div className="pt-2 border-t border-border/60 text-center">
        <p className="text-xs text-muted-foreground">
          Don&#39;t have an account yet?{" "}
          <Link href="/register" className="font-semibold text-foreground hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
````

## File: src/app/(auth)/register/page.tsx
````typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerAction } from "@/modules/accounts/actions";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setMessage("");
    setError("");
    setFieldErrors({});

    const result = await registerAction(null, formData);

    if (result.success) {
      setMessage(result.message);
      setTimeout(() => router.push("/login"), 1500);
    } else {
      if (result.errors) setFieldErrors(result.errors);
      setError(result.message || "Registration failed. Please check the fields.");
    }

    setLoading(false);
  }

  const getFieldError = (name: string) => fieldErrors[name]?.[0];

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-xl font-bold tracking-tight text-foreground">Create customer account</h1>
        <p className="text-xs text-muted-foreground">
          Join Pamilihub to browse and order San Pablo delicacies
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-700 flex items-start gap-2 animate-in fade-in-50">
          <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {message && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 animate-in fade-in-50">
          {message}
        </div>
      )}

      <form action={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
            Email address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            className={`w-full rounded-lg border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all ${
              getFieldError("email") ? "border-red-400 bg-red-50/20" : "border-input"
            }`}
            placeholder="juan@example.com"
          />
          {getFieldError("email") && (
            <p className="text-xs text-red-600 mt-1">{getFieldError("email")}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            name="password"
            required
            minLength={6}
            autoComplete="new-password"
            className={`w-full rounded-lg border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all ${
              getFieldError("password") ? "border-red-400 bg-red-50/20" : "border-input"
            }`}
            placeholder="At least 6 characters"
          />
          {getFieldError("password") && (
            <p className="text-xs text-red-600 mt-1">{getFieldError("password")}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
            Full name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="full_name"
            required
            className={`w-full rounded-lg border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all ${
              getFieldError("full_name") ? "border-red-400 bg-red-50/20" : "border-input"
            }`}
            placeholder="Juan Dela Cruz"
          />
          {getFieldError("full_name") && (
            <p className="text-xs text-red-600 mt-1">{getFieldError("full_name")}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
              Contact Phone
            </label>
            <input
              type="tel"
              name="phone"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              placeholder="0912 345 6789"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
              Barangay / Town
            </label>
            <input
              type="text"
              name="address"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              placeholder="Brgy. San Rafael, SPC"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-60 transition-all cursor-pointer mt-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Creating account...</span>
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      <div className="pt-2 border-t border-border/60 text-center">
        <p className="text-xs text-muted-foreground">
          Already registered?{" "}
          <Link href="/login" className="font-semibold text-foreground hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
````

## File: src/app/(customer)/orders/[id]/pay/PayButton.tsx
````typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type PayButtonProps = {
  orderId: string;
  amount: number;
};

export default function PayButton({ orderId, amount }: PayButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<"approve" | "cancel" | null>(null);
  const [error, setError] = useState("");

  const handlePay = async (r: "approve" | "cancel") => {
    setLoading(true);
    setError("");
    setResult(r);

    try {
      const res = await fetch("/api/mockpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          order_id: orderId,
          amount,
          result: r,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Payment failed.");
        setResult(null);
        return;
      }

      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-xs text-red-700 text-center space-y-2">
        <p className="font-semibold">{error}</p>
        <button
          onClick={() => setError("")}
          className="text-xs text-primary font-bold hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={() => handlePay("approve")}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 transition-all cursor-pointer"
        >
          {loading && result === "approve" ? (
            <span>Approving...</span>
          ) : (
            <>
              <span>✓ Approve Payment</span>
            </>
          )}
        </button>

        <button
          onClick={() => handlePay("cancel")}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-xs font-bold hover:bg-red-100 disabled:opacity-50 transition-all cursor-pointer"
        >
          {loading && result === "cancel" ? (
            <span>Cancelling...</span>
          ) : (
            <>
              <span>✕ Cancel Payment</span>
            </>
          )}
        </button>
      </div>

      <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
        Cancelling restores product stock automatically via the database transaction.
      </p>
    </div>
  );
}
````

## File: src/app/admin/dashboard/page.tsx
````typescript
import Link from "next/link";
import { getAdminDashboardMetrics } from "@/modules/admin/queries";
import AdminNav from "@/components/admin/AdminNav";
import {
  ShieldCheck,
  TrendingUp,
  Package,
  Store,
  UtensilsCrossed,
  ArrowRight,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const metrics = await getAdminDashboardMetrics();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-primary/20 bg-primary/10 text-[11px] font-bold text-primary mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Platform Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Pamilihub Control Panel
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Platform metrics, merchant governance, and live food delivery transactions across San Pablo City.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {metrics.sellersCount.pending > 0 && (
            <Link
              href="/admin/sellers"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 text-xs font-bold animate-pulse"
            >
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>{metrics.sellersCount.pending} Pending Application{metrics.sellersCount.pending > 1 ? "s" : ""}</span>
            </Link>
          )}
        </div>
      </div>

      <AdminNav />

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* GMV */}
        <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase tracking-wider">Gross Sales (GMV)</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-foreground">
            ₱{metrics.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-muted-foreground">From paid & completed deliveries</p>
        </div>

        {/* Total Orders */}
        <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase tracking-wider">Platform Orders</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-foreground">
            {metrics.ordersCount.total}
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className="text-emerald-600 font-bold">{metrics.ordersCount.completed} completed</span>
            <span>•</span>
            <span className="text-amber-600 font-semibold">{metrics.ordersCount.pending + metrics.ordersCount.accepted + metrics.ordersCount.preparing + metrics.ordersCount.delivering} active</span>
          </div>
        </div>

        {/* Merchants */}
        <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase tracking-wider">Local Merchants</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-foreground">
            {metrics.sellersCount.approved}
          </p>
          <p className="text-[11px] text-muted-foreground">
            {metrics.sellersCount.pending} pending review • {metrics.sellersCount.total} registered
          </p>
        </div>

        {/* Catalog Items */}
        <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase tracking-wider">Food Catalog</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-foreground">
            {metrics.productsCount.total}
          </p>
          <p className="text-[11px] text-muted-foreground">
            {metrics.productsCount.inStock} ready for order • {metrics.productsCount.outOfStock} out of stock
          </p>
        </div>
      </div>

      {/* Secondary Status Breakdown Bar */}
      <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card shadow-sm space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>Order Fulfillment Status Pipeline</span>
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
            <span className="block text-xs font-semibold text-amber-700">Pending</span>
            <span className="text-lg font-black text-amber-900">{metrics.ordersCount.pending}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
            <span className="block text-xs font-semibold text-blue-700">Accepted</span>
            <span className="text-lg font-black text-blue-900">{metrics.ordersCount.accepted}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-center">
            <span className="block text-xs font-semibold text-indigo-700">Preparing</span>
            <span className="text-lg font-black text-indigo-900">{metrics.ordersCount.preparing}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center">
            <span className="block text-xs font-semibold text-purple-700">Delivering</span>
            <span className="text-lg font-black text-purple-900">{metrics.ordersCount.delivering}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
            <span className="block text-xs font-semibold text-emerald-700">Completed</span>
            <span className="text-lg font-black text-emerald-900">{metrics.ordersCount.completed}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center">
            <span className="block text-xs font-semibold text-rose-700">Cancelled / Rej</span>
            <span className="text-lg font-black text-rose-900">{metrics.ordersCount.cancelled + metrics.ordersCount.rejected}</span>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Recent Orders & Pending Merchant Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="rounded-2xl border border-border bg-card shadow-sm p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-foreground text-sm sm:text-base flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" />
              <span>Recent Orders</span>
            </h2>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span>View all orders</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {metrics.recentOrders.length === 0 ? (
            <p className="text-xs text-muted-foreground py-6 text-center">No orders placed yet.</p>
          ) : (
            <div className="space-y-2.5">
              {metrics.recentOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/30 text-xs"
                >
                  <div className="space-y-0.5 truncate pr-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">
                        {ord.seller?.store_name ?? "Store"}
                      </span>
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-muted border border-border">
                        {ord.payment_method}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">
                      To: {ord.delivery_name} • {new Date(ord.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right whitespace-nowrap">
                    <span className="font-black text-foreground">₱{Number(ord.total).toFixed(2)}</span>
                    <span className="block text-[10px] capitalize font-semibold text-muted-foreground">
                      {ord.order_status} ({ord.payment_status})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Seller Approvals */}
        <div className="rounded-2xl border border-border bg-card shadow-sm p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-foreground text-sm sm:text-base flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>Pending Seller Applications</span>
            </h2>
            <Link
              href="/admin/sellers"
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span>Review all</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {metrics.pendingSellers.length === 0 ? (
            <div className="p-6 rounded-xl border border-dashed border-border text-center space-y-1">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
              <p className="text-xs font-semibold text-foreground">All caught up!</p>
              <p className="text-[11px] text-muted-foreground">No pending merchant applications to review.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {metrics.pendingSellers.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 text-xs"
                >
                  <div className="space-y-0.5 truncate pr-2">
                    <p className="font-bold text-foreground truncate">{s.store_name}</p>
                    <p className="text-[11px] text-muted-foreground truncate">
                      Owner: {s.profile?.full_name ?? "Unnamed"} • {s.location ?? "San Pablo City"}
                    </p>
                  </div>
                  <Link
                    href="/admin/sellers"
                    className="px-2.5 py-1 rounded-lg bg-primary text-[11px] font-bold text-primary-foreground hover:bg-primary/90 transition-all shrink-0"
                  >
                    Review
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
````

## File: src/app/admin/layout.tsx
````typescript
import { requireAdmin } from "@/lib/auth/roles";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Server-side role guard: only admins can reach these pages
  await requireAdmin();
  return <>{children}</>;
}
````

## File: src/app/api/auth/signout/route.ts
````typescript
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function POST() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
````

## File: src/app/api/me/route.ts
````typescript
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, role, full_name, phone, address, created_at, updated_at")
    .eq("id", user.id)
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return Response.json(data);
}
````

## File: src/app/apply/page.tsx
````typescript
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { applySellerAction } from "@/modules/accounts/actions";
import { getSellerStatus } from "@/modules/accounts/queries";

export default function SellerApplyPage() {
  const [application, setApplication] = useState<{
    id: string;
    store_name: string | null;
    status: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    store_name: "",
    description: "",
    location: "",
  });

  async function loadStatus() {
    const data = await getSellerStatus();
    setApplication(data);
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setMessage("");
    setError("");

    const result = await applySellerAction(null, formData);

    if (result.success) {
      setMessage(result.message);
      await loadStatus();
    } else {
      setError(result.message || "Application submission failed.");
    }

    setLoading(false);
  }

  useEffect(() => {
    loadStatus();
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-1 border-b border-border pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-border bg-muted/40 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          <span>Merchant Program</span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
          Seller Application
        </h1>
        <p className="text-xs text-muted-foreground">
          Showcase and sell your local San Pablo delicacies to residents and visitors
        </p>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-xs text-red-700 flex items-start gap-2">
          <span>{error}</span>
        </div>
      )}

      {message && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-800">
          {message}
        </div>
      )}

      {/* Application Status Banner if exists */}
      {application && application.status && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h2 className="text-sm font-bold text-foreground">Application Status</h2>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                application.status === "approved"
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                  : application.status === "rejected"
                  ? "bg-red-100 text-red-700 border border-red-200"
                  : "bg-amber-100 text-amber-800 border border-amber-200"
              }`}
            >
              {application.status.toUpperCase()}
            </span>
          </div>

          <p className="text-xs text-foreground">
            <strong>Store:</strong> {application.store_name}
          </p>

          {application.status === "pending" && (
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your merchant application is under review by the platform administrator. You will gain access to the seller dashboard once approved.
            </p>
          )}

          {application.status === "approved" && (
            <div className="space-y-3 pt-1">
              <p className="text-xs text-emerald-700 font-medium">
                Congratulations! Your store is approved. You can now manage products and process orders.
              </p>
              <Link
                href="/seller/products"
                className="inline-block px-5 py-2.5 rounded-lg bg-primary text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-all"
              >
                Go to Seller Dashboard
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Application Form */}
      {(!application || application.status === "rejected") && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground pb-2 border-b border-border">
            Store Profile Information
          </h2>

          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
                Store or Brand Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="store_name"
                defaultValue={formData.store_name}
                required
                placeholder="e.g. San Pablo Original Buko Pie"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
                Store Location / Barangay <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                defaultValue={formData.location}
                required
                placeholder="e.g. Brgy. San Rafael, San Pablo City, Laguna"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
                Store Description & Products
              </label>
              <textarea
                name="description"
                defaultValue={formData.description}
                rows={3}
                placeholder="Describe your delicacies, specialties, and business history..."
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary py-3 px-4 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-60 transition-all cursor-pointer"
            >
              {loading ? "Submitting Application..." : "Submit Seller Application"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
````

## File: src/app/seller/layout.tsx
````typescript
import { requireRole } from "@/lib/auth/roles";

export default async function SellerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Server-side role guard: only approved sellers can reach these pages
  await requireRole("seller");
  return <>{children}</>;
}
````

## File: src/app/unauthorized/page.tsx
````typescript
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card p-8 rounded-2xl shadow-sm border border-border text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-full bg-red-50 text-red-600 flex items-center justify-center text-2xl font-bold">
          🛡️
        </div>
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight text-foreground">Access Restricted</h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            You don&apos;t have the necessary account role or merchant permissions to access this specific workspace.
          </p>
        </div>
        <div className="pt-2 flex flex-col gap-2">
          <Link
            href="/dashboard"
            className="w-full py-2.5 rounded-lg bg-primary text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-all"
          >
            Go to My Dashboard
          </Link>
          <Link
            href="/products"
            className="w-full py-2.5 rounded-lg border border-border bg-background text-xs font-medium text-foreground hover:bg-muted transition-colors"
          >
            Browse Food Catalog
          </Link>
        </div>
      </div>
    </div>
  );
}
````

## File: src/components/admin/AdminNav.tsx
````typescript
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PackageCheck,
  Store,
  ShieldCheck,
  FolderKanban,
  Users,
} from "lucide-react";

export default function AdminNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/orders", label: "Orders & Payments", icon: PackageCheck },
    { href: "/admin/products", label: "Product Moderation", icon: Store },
    { href: "/admin/sellers", label: "Seller Approvals", icon: ShieldCheck },
    { href: "/admin/categories", label: "Categories", icon: FolderKanban },
    { href: "/admin/users", label: "User Directory", icon: Users },
  ];

  return (
    <div className="border-b border-border bg-card/60 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
      <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 no-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
````

## File: src/components/seller/orders/OrderDetailPanel.tsx
````typescript
"use client";

import { useState, useTransition } from "react";
import type { OrderDetail, OrderStatus } from "@/modules/orders/types";
import { OrderStatusBadge, PaymentBadge } from "./StatusBadge";
import { OrderDetailSkeleton } from "./Skeletons";
import { updateOrderStatusAction } from "@/modules/orders/actions";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatPHP(amount: number) {
  return new Intl.NumberFormat("fil-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("fil-PH", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(iso));
}

// ─── Status timeline ──────────────────────────────────────────────────────────

const TIMELINE_STEPS: OrderStatus[] = [
  "pending",
  "accepted",
  "preparing",
  "delivering",
  "completed",
];

function TimelineStep({
  step,
  currentStatus,
}: {
  step: OrderStatus;
  currentStatus: OrderStatus;
}) {
  const isTerminal =
    currentStatus === "rejected" || currentStatus === "cancelled";
  const stepIndex = TIMELINE_STEPS.indexOf(step);
  const currentIndex = TIMELINE_STEPS.indexOf(currentStatus);
  const done = !isTerminal && currentIndex > stepIndex;
  const active = !isTerminal && currentIndex === stepIndex;
  const skipped = isTerminal && step !== "pending";

  const labels: Record<OrderStatus, string> = {
    pending: "Order Placed",
    accepted: "Accepted",
    preparing: "Preparing",
    delivering: "Out for Delivery",
    completed: "Completed",
    rejected: "Rejected",
    cancelled: "Cancelled",
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`
          h-7 w-7 rounded-full border-2 flex items-center justify-center transition-colors
          ${done
            ? "border-green-500 bg-green-500 text-white"
            : active
            ? "border-primary bg-primary text-primary-foreground"
            : skipped
            ? "border-muted bg-muted text-muted-foreground opacity-40"
            : "border-muted bg-background text-muted-foreground"
          }
        `}
        aria-label={`${labels[step]} – ${done ? "done" : active ? "current" : "pending"}`}
      >
        {done ? (
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <span className="text-[9px] font-bold leading-none">
            {stepIndex + 1}
          </span>
        )}
      </div>
      <span
        className={`text-[10px] text-center font-medium leading-tight max-w-[56px] ${
          active ? "text-foreground" : "text-muted-foreground"
        }`}
      >
        {labels[step]}
      </span>
    </div>
  );
}

function StatusTimeline({ status }: { status: OrderStatus }) {
  const isTerminal = status === "rejected" || status === "cancelled";
  return (
    <div aria-label="Order status timeline" className="mt-2">
      {isTerminal ? (
        <div
          className={`rounded-md px-3 py-2 text-sm font-medium text-center ${
            status === "rejected"
              ? "bg-red-50 text-red-700 border border-red-200"
              : "bg-gray-100 text-gray-600 border border-gray-200"
          }`}
        >
          Order {status === "rejected" ? "Rejected" : "Cancelled"}
        </div>
      ) : (
        <div className="flex items-start gap-0">
          {TIMELINE_STEPS.map((step, i) => (
            <div key={step} className="flex items-center flex-1">
              <div className="flex flex-col items-center w-full">
                <TimelineStep step={step} currentStatus={status} />
              </div>
              {i < TIMELINE_STEPS.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mt-[-18px] transition-colors ${
                    TIMELINE_STEPS.indexOf(status) > i
                      ? "bg-green-400"
                      : "bg-muted"
                  }`}
                  aria-hidden="true"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Action buttons ───────────────────────────────────────────────────────────

type NextStatus = "accepted" | "rejected" | "preparing" | "delivering" | "completed" | "cancelled";

const ALLOWED_TRANSITIONS: Partial<Record<OrderStatus, NextStatus[]>> = {
  pending:    ["accepted", "rejected"],
  accepted:   ["preparing", "cancelled"],
  preparing:  ["delivering", "cancelled"],
  delivering: ["completed", "cancelled"],
};

const ACTION_LABELS: Record<NextStatus, string> = {
  accepted:   "Accept Order",
  rejected:   "Reject Order",
  preparing:  "Mark Preparing",
  delivering: "Mark Out for Delivery",
  completed:  "Mark Completed",
  cancelled:  "Cancel Order",
};

const ACTION_VARIANT: Record<NextStatus, "primary" | "danger" | "secondary"> = {
  accepted:   "primary",
  preparing:  "primary",
  delivering: "primary",
  completed:  "primary",
  rejected:   "danger",
  cancelled:  "danger",
};

interface ActionButtonsProps {
  order: OrderDetail;
  onStatusUpdated: () => void;
}

function ActionButtons({ order, onStatusUpdated }: ActionButtonsProps) {
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ ok: boolean; msg: string } | null>(null);

  const allowedNext = ALLOWED_TRANSITIONS[order.order_status as OrderStatus] ?? [];

  // MockPay: block 'accept' until the customer has paid
  const mockpayNotPaid =
    order.payment_method === "mockpay" && order.payment_status !== "paid";
  const filteredAllowed = mockpayNotPaid
    ? allowedNext.filter((s) => s !== "accepted")
    : allowedNext;

  if (filteredAllowed.length === 0) return null;

  function handleAction(newStatus: NextStatus) {
    startTransition(async () => {
      const fd = new FormData();
      fd.append("order_id", order.id);
      fd.append("new_status", newStatus);
      const result = await updateOrderStatusAction(null, fd);
      setToast({ ok: result.success, msg: result.message });
      if (result.success) {
        onStatusUpdated();
        setTimeout(() => setToast(null), 3000);
      }
    });
  }

  return (
    <div className="space-y-3">
      {toast && (
        <div
          role="alert"
          className={`rounded-md px-3 py-2 text-sm ${
            toast.ok
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {toast.msg}
        </div>
      )}

      {mockpayNotPaid && (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
          ⏳ <strong>Awaiting MockPay payment.</strong> You can reject this order or wait for
          the customer to pay before accepting.
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {filteredAllowed.map((next) => {
          const variant = ACTION_VARIANT[next];
          return (
            <button
              key={next}
              disabled={isPending}
              onClick={() => handleAction(next)}
              aria-label={ACTION_LABELS[next]}
              className={`
                rounded-md px-4 py-2 text-sm font-medium transition-colors
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                disabled:opacity-50 disabled:cursor-not-allowed
                ${variant === "primary"
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : variant === "danger"
                  ? "border border-red-300 text-red-700 hover:bg-red-50"
                  : "border border-border text-foreground hover:bg-muted"
                }
              `}
            >
              {isPending ? "Updating…" : ACTION_LABELS[next]}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main detail panel ────────────────────────────────────────────────────────

interface OrderDetailPanelProps {
  order: OrderDetail | null;
  loading: boolean;
  onClose?: () => void;
  onStatusUpdated: () => void;
}

export function OrderDetailPanel({
  order,
  loading,
  onClose,
  onStatusUpdated,
}: OrderDetailPanelProps) {
  if (loading) return <OrderDetailSkeleton />;

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-24 px-8 text-center">
        <svg
          className="mb-4 h-14 w-14 text-muted-foreground/30"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"
          />
        </svg>
        <p className="text-muted-foreground text-sm">
          Select an order to see details.
        </p>
      </div>
    );
  }

  const subtotal = order.order_items.reduce(
    (acc, i) => acc + i.unit_price * i.quantity,
    0
  );
  const shortId = `#${order.id.slice(0, 8).toUpperCase()}`;

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border px-6 py-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Order {shortId}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {formatDate(order.created_at)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <OrderStatusBadge status={order.order_status as OrderStatus} size="md" />
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close order detail"
              className="ml-1 rounded-md p-1.5 hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 px-6 py-5 space-y-6">

        {/* Status timeline */}
        <section aria-labelledby="timeline-heading">
          <h3 id="timeline-heading" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Order Progress
          </h3>
          <StatusTimeline status={order.order_status as OrderStatus} />
        </section>

        <div className="h-px bg-border" />

        {/* Action buttons */}
        <section aria-labelledby="actions-heading">
          <h3 id="actions-heading" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Actions
          </h3>
          <ActionButtons order={order} onStatusUpdated={onStatusUpdated} />
        </section>

        <div className="h-px bg-border" />

        {/* Items */}
        <section aria-labelledby="items-heading">
          <h3 id="items-heading" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Items Ordered
          </h3>
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/40 border-b border-border">
                  <th scope="col" className="text-left px-4 py-2.5 font-medium text-muted-foreground">Product</th>
                  <th scope="col" className="text-center px-3 py-2.5 font-medium text-muted-foreground w-14">Qty</th>
                  <th scope="col" className="text-right px-4 py-2.5 font-medium text-muted-foreground">Unit Price</th>
                  <th scope="col" className="text-right px-4 py-2.5 font-medium text-muted-foreground">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.order_items.map((item) => (
                  <tr key={item.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-medium text-foreground">
                      {item.products?.name ?? "—"}
                    </td>
                    <td className="px-3 py-3 text-center text-muted-foreground">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground">
                      {formatPHP(item.unit_price)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {formatPHP(item.unit_price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="mt-3 space-y-1.5 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatPHP(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Delivery fee</span>
              <span>{formatPHP(order.delivery_fee)}</span>
            </div>
            <div className="flex justify-between font-bold text-base pt-1 border-t border-border">
              <span>Total</span>
              <span>{formatPHP(order.total)}</span>
            </div>
          </div>
        </section>

        <div className="h-px bg-border" />

        {/* Customer & payment info */}
        <section aria-labelledby="customer-heading">
          <h3 id="customer-heading" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Delivery & Payment
          </h3>
          <dl className="space-y-2 text-sm">
            <div className="flex gap-3">
              <dt className="w-28 shrink-0 text-muted-foreground">Name</dt>
              <dd className="font-medium text-foreground">{order.delivery_name}</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-28 shrink-0 text-muted-foreground">Phone</dt>
              <dd className="font-medium text-foreground">
                <a
                  href={`tel:${order.delivery_phone}`}
                  className="hover:underline text-primary"
                >
                  {order.delivery_phone}
                </a>
              </dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-28 shrink-0 text-muted-foreground">Address</dt>
              <dd className="font-medium text-foreground">{order.delivery_address}</dd>
            </div>
            <div className="flex gap-3 items-center">
              <dt className="w-28 shrink-0 text-muted-foreground">Payment</dt>
              <dd>
                <PaymentBadge
                  status={order.payment_status as any}
                  method={order.payment_method as any}
                  size="md"
                />
              </dd>
            </div>
          </dl>
        </section>

      </div>
    </div>
  );
}
````

## File: src/lib/auth/header-user.ts
````typescript
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export type HeaderUser = {
  id: string;
  email: string | null;
  role: string;
  full_name: string | null;
};

export const getHeaderUser = cache(async (): Promise<HeaderUser | null> => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  return {
    id: user.id,
    email: user.email ?? null,
    role: (profile?.role as string | null) ?? "customer",
    full_name: profile?.full_name ?? null,
  };
});
````

## File: src/lib/cart/cart-context.tsx
````typescript
"use client";

import { createContext, useContext, useCallback, useState, useEffect } from "react";

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  stock: number;
  sellerId: string;
  sellerName: string;
  imageUrl: string | null;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  itemCount: number;
  subtotal: number;
  isLoaded: boolean;
};

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY_PREFIX = "pamilihub_cart";

/** Build the per-user localStorage key. Guests share a single anonymous key. */
function storageKey(userId: string | null): string {
  return userId ? `${STORAGE_KEY_PREFIX}_${userId}` : STORAGE_KEY_PREFIX;
}

function loadCart(userId: string | null): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveCart(userId: string | null, items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(userId), JSON.stringify(items));
}

export function CartProvider({
  userId,
  children,
}: {
  /** auth user id – null for guests */
  userId: string | null;
  children: React.ReactNode;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Reload cart whenever the signed-in user changes
  useEffect(() => {
    setItems(loadCart(userId));
    setIsLoaded(true);
  }, [userId]);

  useEffect(() => {
    if (isLoaded) saveCart(userId, items);
  }, [items, isLoaded, userId]);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.productId === item.productId);
        if (existing) {
          const newQty = existing.quantity + (item.quantity ?? 1);
          return prev.map((i) =>
            i.productId === item.productId ? { ...i, quantity: newQty } : i
          );
        }
        return [
          ...prev,
          { ...item, quantity: item.quantity ?? 1 },
        ];
      });
    },
    []
  );

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId ? { ...i, quantity: Math.max(0, quantity) } : i
      )
    );
  }, []);

  const clear = useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (!CartContext) {
    throw new Error("CartContext is not initialized");
  }

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clear, itemCount, subtotal, isLoaded }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
````

## File: src/lib/supabase/admin.ts
````typescript
import { createClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client using the SERVICE_ROLE key.
 *
 * Bypasses Row Level Security. Must ONLY be used in server actions / API routes,
 * never in client components. The service-role key is never exposed to the browser.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables. "
        + "The service-role client must not be used in client components.",
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
````

## File: src/lib/supabase/browser.ts
````typescript
import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr";

export function createBrowserClient() {
  return createSupabaseBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  );
}
````

## File: src/lib/supabase/server.ts
````typescript
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // The `remove` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    }
  );
}
````

## File: src/modules/admin/actions.ts
````typescript
"use server";

import { createClient } from "@/lib/supabase/server";
import { sellerReviewSchema, adminDeleteProductSchema } from "@/modules/admin/schemas";
import { requireAdmin } from "@/lib/auth/roles";
import { revalidatePath } from "next/cache";

type ActionState = {
  success: boolean;
  message: string;
};

/**
 * Admin-only: approve or reject a seller application.
 * Updates sellers.status and upgrades profiles.role to 'seller' on approval.
 */
export async function reviewSellerAction(
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const supabase = createClient();
  const user = await requireAdmin();
  if (!user) {
    return { success: false, message: "Admin access required." };
  }

  const parsed = sellerReviewSchema.safeParse({
    seller_id: formData.get("seller_id"),
    action: formData.get("action"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed.",
    };
  }

  const { seller_id, action } = parsed.data;
  const newStatus = action === "approve" ? "approved" : "rejected";

  const { error: sellerError } = await supabase
    .from("sellers")
    .update({ status: newStatus })
    .eq("id", seller_id);

  if (sellerError) {
    return { success: false, message: sellerError.message };
  }

  if (action === "approve") {
    const { data: seller } = await supabase
      .from("sellers")
      .select("profile_id")
      .eq("id", seller_id)
      .single();

    if (seller) {
      await supabase
        .from("profiles")
        .update({ role: "seller" })
        .eq("id", seller.profile_id);
    }
  }

  revalidatePath("/admin/sellers");
  return { success: true, message: `Seller ${action}d successfully.` };
}

/**
 * Admin-only: moderate / remove a product listing across any seller.
 */
export async function adminDeleteProductAction(
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const supabase = createClient();
  const user = await requireAdmin();
  if (!user) {
    return { success: false, message: "Admin access required." };
  }

  const parsed = adminDeleteProductSchema.safeParse({
    product_id: formData.get("product_id"),
  });

  if (!parsed.success) {
    return { success: false, message: "Invalid product ID." };
  }

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", parsed.data.product_id);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  return { success: true, message: "Product listing removed successfully." };
}
````

## File: src/modules/admin/schemas.ts
````typescript
import { z } from "zod";

// --- Approve / reject seller ---

export const sellerReviewSchema = z.object({
  seller_id: z.string().uuid("Invalid seller ID"),
  action: z.enum(["approve", "reject"]),
});

// --- Admin moderate/delete product ---

export const adminDeleteProductSchema = z.object({
  product_id: z.string().uuid("Invalid product ID"),
});
````

## File: src/modules/catalog/actions.ts
````typescript
"use server";

import { createClient } from "@/lib/supabase/server";
import {
  categoryCreateSchema,
  categoryUpdateSchema,
  productCreateSchema,
  productUpdateSchema,
} from "./schemas";
import { requireAdmin, requireRole, getCurrentUser } from "@/lib/auth/roles";
import { revalidatePath, revalidateTag } from "next/cache";

type ActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

const BUCKET = "product-images";

/* ------------------------------------------------------------------ */
/* Admin: Categories                                                  */
/* ------------------------------------------------------------------ */

export async function createCategoryAction(
  _prev: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const supabase = createClient();
  await requireAdmin();

  const parsed = categoryCreateSchema.safeParse({
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase
    .from("categories")
    .insert({ name: parsed.data.name });

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/products", "layout");
  revalidateTag("categories");
  return { success: true, message: "Category created." };
}

export async function updateCategoryAction(
  _prev: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const supabase = createClient();
  await requireAdmin();

  const parsed = categoryUpdateSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase
    .from("categories")
    .update({ name: parsed.data.name })
    .eq("id", parsed.data.id);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/products", "layout");
  revalidateTag("categories");
  return { success: true, message: "Category updated." };
}

export async function deleteCategoryAction(
  _prev: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const supabase = createClient();
  await requireAdmin();

  const id = formData.get("id") as string;
  if (!id) {
    return { success: false, message: "Category ID is required." };
  }

  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/products", "layout");
  revalidateTag("categories");
  return { success: true, message: "Category deleted." };
}

/* ------------------------------------------------------------------ */
/* Seller: Products                                                   */
/* ------------------------------------------------------------------ */

async function getCurrentSellerId(supabase: ReturnType<typeof createClient>) {
  const user = await getCurrentUser(supabase);
  if (!user) return null;

  const { data: seller } = await supabase
    .from("sellers")
    .select("id, profile_id, status")
    .eq("profile_id", user.id)
    .single();

  return seller;
}

async function uploadProductImage(
  supabase: ReturnType<typeof createClient>,
  profileId: string,
  file: File
): Promise<{ url: string | null; error: string | null }> {
  try {
    const safeName = file.name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9._-]/g, "");
    const fileName = `${profileId}/${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, file);

    if (uploadError) {
      return { url: null, error: uploadError.message };
    }

    const { data: urlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(fileName);

    return { url: urlData.publicUrl, error: null };
  } catch (err: any) {
    return { url: null, error: err?.message || "Image upload failed." };
  }
}

export async function createProductAction(
  _prev: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const supabase = createClient();
  const seller = await getCurrentSellerId(supabase);

  if (!seller) {
    return { success: false, message: "Seller profile not found." };
  }
  if (seller.status !== "approved") {
    return {
      success: false,
      message: "Only approved sellers can add products.",
    };
  }

  const parsed = productCreateSchema.safeParse({
    category_id: formData.get("category_id"),
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    stock: formData.get("stock"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const imageFile = formData.get("image") as File | null;
  let imageUrl: string | null = null;

  if (imageFile && imageFile.size > 0) {
    const uploaded = await uploadProductImage(supabase, seller.profile_id, imageFile);
    if (uploaded.error) {
      return { success: false, message: uploaded.error };
    }
    imageUrl = uploaded.url;
  }

  const { error } = await supabase.from("products").insert({
    seller_id: seller.id,
    category_id: parsed.data.category_id,
    name: parsed.data.name,
    description: parsed.data.description ?? null,
    price: parsed.data.price,
    stock: parsed.data.stock,
    image_url: imageUrl,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/seller/products");
  revalidatePath("/products", "layout");
  return { success: true, message: "Product added." };
}

export async function updateProductAction(
  _prev: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const supabase = createClient();
  const seller = await getCurrentSellerId(supabase);

  if (!seller) {
    return { success: false, message: "Seller profile not found." };
  }

  const parsed = productUpdateSchema.safeParse({
    id: formData.get("id"),
    category_id: formData.get("category_id"),
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    stock: formData.get("stock"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { id, ...updates } = parsed.data;

  // Verify ownership
  const { data: existing } = await supabase
    .from("products")
    .select("id, seller_id, image_url")
    .eq("id", id)
    .single();

  if (!existing || existing.seller_id !== seller.id) {
    return { success: false, message: "Product not found or not owned by you." };
  }

  // Handle image replacement
  let imageUrl = existing.image_url;
  const imageFile = formData.get("image") as File | null;
  const removeImage = formData.get("remove_image") === "true";

  if (removeImage) {
    imageUrl = null;
  } else if (imageFile && imageFile.size > 0) {
    // Delete old image if exists
    if (existing.image_url) {
      try {
        const oldPath = existing.image_url.split("/").slice(-2).join("/");
        await supabase.storage.from(BUCKET).remove([oldPath]);
      } catch {
        // ignore delete errors
      }
    }
    const uploaded = await uploadProductImage(supabase, seller.profile_id, imageFile);
    if (uploaded.error) {
      return { success: false, message: uploaded.error };
    }
    imageUrl = uploaded.url;
  }

  const { error } = await supabase
    .from("products")
    .update({ ...updates, image_url: imageUrl })
    .eq("id", id);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/seller/products");
  revalidatePath("/products", "layout");
  return { success: true, message: "Product updated." };
}

export async function deleteProductAction(
  _prev: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const supabase = createClient();
  const seller = await getCurrentSellerId(supabase);

  if (!seller) {
    return { success: false, message: "Seller profile not found." };
  }

  const id = formData.get("id") as string;
  if (!id) {
    return { success: false, message: "Product ID is required." };
  }

  // Verify ownership and get image for cleanup
  const { data: existing } = await supabase
    .from("products")
    .select("id, seller_id, image_url")
    .eq("id", id)
    .single();

  if (!existing || existing.seller_id !== seller.id) {
    return { success: false, message: "Product not found or not owned by you." };
  }

  // Delete image from storage if exists
  if (existing.image_url) {
    try {
      const oldPath = existing.image_url.split("/").slice(-2).join("/");
      await supabase.storage.from(BUCKET).remove([oldPath]);
    } catch {
      // ignore delete errors
    }
  }

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/seller/products");
  revalidatePath("/products", "layout");
  return { success: true, message: "Product deleted." };
}
````

## File: src/modules/catalog/schemas.ts
````typescript
import { z } from "zod";

// --- Categories (admin) ---

export const categoryCreateSchema = z.object({
  name: z.string().min(1, "Category name is required").trim(),
});

export const categoryUpdateSchema = z.object({
  id: z.string().uuid("Invalid category ID"),
  name: z.string().min(1, "Category name is required").trim(),
});

// --- Products (seller) ---

export const productCreateSchema = z.object({
  category_id: z.string().uuid("Invalid category"),
  name: z.string().min(1, "Product name is required").trim(),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be at least 0"),
  stock: z.coerce.number().int().min(0, "Stock must be at least 0"),
});

export const productUpdateSchema = z.object({
  id: z.string().uuid("Invalid product ID"),
  category_id: z.string().uuid("Invalid category").optional(),
  name: z.string().min(1, "Product name is required").trim().optional(),
  description: z.string().nullable().optional(),
  price: z.coerce.number().min(0, "Price must be at least 0").optional(),
  stock: z.coerce.number().int().min(0, "Stock must be at least 0").optional(),
});
````

## File: supabase/migrations/001_initial_schema.sql
````sql
-- Migration: 001_initial_schema
-- Creates core tables per docs/DATABASE.md

-- Enable extensions
create extension if not exists "pgcrypto";

-- Table: profiles
-- One row per user, linked to Supabase Auth
create table if not exists public.profiles (
  id uuid not null primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('customer', 'seller', 'admin')) default 'customer',
  full_name text,
  phone text,
  address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Table: sellers
-- Store profile and approval status
create table if not exists public.sellers (
  id uuid not null primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  store_name text not null, 
  description text,
  location text,
  status text not null check (status in ('pending', 'approved', 'rejected')) default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (profile_id)
);

-- Table: categories
-- Product categories
create table if not exists public.categories (
  id uuid not null primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

-- Table: products
-- Product listings
create table if not exists public.products (
  id uuid not null primary key default gen_random_uuid(),
  seller_id uuid not null references public.sellers(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  name text not null,
  description text,
  price numeric(10, 2) not null check (price >= 0),
  stock integer not null check (stock >= 0) default 0,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Table: orders
-- One order per seller
create table if not exists public.orders (
  id uuid not null primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id) on delete cascade,
  seller_id uuid not null references public.sellers(id) on delete cascade,
  delivery_name text not null,
  delivery_phone text not null,
  delivery_address text not null,
  delivery_fee numeric(10, 2) not null check (delivery_fee >= 0) default 0,
  total numeric(10, 2) not null check (total >= 0),
  payment_method text not null check (payment_method in ('mockpay', 'cod')) default 'mockpay',
  payment_status text not null check (payment_status in ('pending', 'paid', 'failed', 'cancelled', 'refunded')) default 'pending',
  order_status text not null check (order_status in ('pending', 'accepted', 'rejected', 'preparing', 'delivering', 'completed', 'cancelled')) default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Table: order_items
-- Items in an order
create table if not exists public.order_items (
  id uuid not null primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10, 2) not null check (unit_price >= 0),
  created_at timestamptz not null default now()
);

-- Table: payments
-- Record of each simulated payment result
create table if not exists public.payments (
  id uuid not null primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  method text not null check (method in ('mockpay', 'cod')),
  status text not null check (status in ('pending', 'paid', 'failed', 'cancelled', 'refunded')) default 'pending',
  created_at timestamptz not null default now()
);

-- Indexes for common queries
create index if not exists idx_products_seller_id on public.products(seller_id);
create index if not exists idx_products_category_id on public.products(category_id);
create index if not exists idx_orders_customer_id on public.orders(customer_id);
create index if not exists idx_orders_seller_id on public.orders(seller_id);
create index if not exists idx_order_items_order_id on public.order_items(order_id);
create index if not exists idx_payments_order_id on public.payments(order_id);

-- Updated at trigger function (shared)
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply updated_at triggers to tables that have updated_at (idempotent)
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'profiles')
    and not exists (select 1 from pg_trigger t join pg_class c on c.oid = t.tgrelid join pg_namespace n on n.oid = c.relnamespace where n.nspname = 'public' and c.relname = 'profiles' and t.tgname = 'profiles_updated_at') then
    create trigger profiles_updated_at before update on public.profiles for each row execute function public.update_updated_at_column();
  end if;
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'sellers')
    and not exists (select 1 from pg_trigger t join pg_class c on c.oid = t.tgrelid join pg_namespace n on n.oid = c.relnamespace where n.nspname = 'public' and c.relname = 'sellers' and t.tgname = 'sellers_updated_at') then
    create trigger sellers_updated_at before update on public.sellers for each row execute function public.update_updated_at_column();
  end if;
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'products')
    and not exists (select 1 from pg_trigger t join pg_class c on c.oid = t.tgrelid join pg_namespace n on n.oid = c.relnamespace where n.nspname = 'public' and c.relname = 'products' and t.tgname = 'products_updated_at') then
    create trigger products_updated_at before update on public.products for each row execute function public.update_updated_at_column();
  end if;
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'orders')
    and not exists (select 1 from pg_trigger t join pg_class c on c.oid = t.tgrelid join pg_namespace n on n.oid = c.relnamespace where n.nspname = 'public' and c.relname = 'orders' and t.tgname = 'orders_updated_at') then
    create trigger orders_updated_at before update on public.orders for each row execute function public.update_updated_at_column();
  end if;
end $$;
````

## File: supabase/seed.sql
````sql
-- =============================================================================
-- Seed data for (SP) Pamilihub
-- =============================================================================
-- The demo accounts must already exist in Supabase Auth, because
-- `public.profiles.id` references `auth.users.id` and the profile rows are
-- created by the `on_auth_user_created` trigger.
--
--   Recommended: run `pnpm exec tsx scripts/seed.ts` instead. That script
--   creates the auth accounts AND fills every table below in one command.
--   Use this file only when the accounts already exist (for example after
--   `supabase db reset` plus manual signup, or on an existing project).
--
-- No hard-coded UUIDs are used: every primary key comes from
-- `gen_random_uuid()` and every relationship is resolved through a natural key
-- (auth email, store name, category name). The file is therefore idempotent
-- and safe to run more than once.
-- =============================================================================

-- -------------------------------------------------------------------
-- 1. Profiles
--    The auth trigger already creates a profiles row per account with the
--    default role `customer`, so here we only fill in the demo details.
-- -------------------------------------------------------------------
update public.profiles p
set role      = d.role,
    full_name = d.full_name,
    phone     = d.phone,
    address   = d.address
from (
  select u.id as user_id, d.role, d.full_name, d.phone, d.address
  from auth.users u
  join (values
    ('admin@pamilihub.test',   'admin',    'Platform Administrator', '+63 917 000 0001', 'San Pablo City, Laguna'),
    ('maria@pamilihub.test',   'seller',   'Maria Santos',           '+63 917 000 0002', 'Brgy. San Rafael, San Pablo City, Laguna'),
    ('jose@pamilihub.test',    'seller',   'Jose Reyes',             '+63 917 000 0003', 'Brgy. Del Remedio, San Pablo City, Laguna'),
    ('pending@pamilihub.test', 'seller',   'Pending Applicant',      '+63 917 000 0004', 'Brgy. San Vicente, San Pablo City, Laguna'),
    ('ana@pamilihub.test',     'customer', 'Ana Customer',           '+63 917 000 0010', 'Brgy. San Francisco, San Pablo City, Laguna'),
    ('bob@pamilihub.test',     'customer', 'Bob Buyer',              '+63 917 000 0011', 'Brgy. Santa Cruz, San Pablo City, Laguna'),
    ('carla@pamilihub.test',   'customer', 'Carla Shopper',          '+63 917 000 0012', 'Brgy. Concepcion, San Pablo City, Laguna')
  ) as d(email, role, full_name, phone, address)
    on d.email = u.email
) d
where p.id = d.user_id;

-- -------------------------------------------------------------------
-- 2. Sellers
--    Resolved from the seller's auth account. `status` is only written on
--    insert, so re-running the file never demotes an approved store.
-- -------------------------------------------------------------------
insert into public.sellers (profile_id, store_name, description, location, status)
select p.id, d.store_name, d.description, d.location, d.status
from (values
  ('maria@pamilihub.test',   'Lola Mayas Bakeshop', 'Home-baked buko pie, egg pie, and pastries from San Pablo.', 'Brgy. San Rafael, San Pablo City, Laguna',   'approved'),
  ('jose@pamilihub.test',    'Kakanin ni Lola',     'Traditional kakanin: biko, suman, sapin-sapin.',      'Brgy. Del Remedio, San Pablo City, Laguna', 'approved'),
  ('pending@pamilihub.test', 'Pending Store',       'Awaiting admin approval.',                                'Brgy. San Vicente, San Pablo City, Laguna', 'pending')
) as d(email, store_name, description, location, status)
join auth.users u on u.email = d.email
join public.profiles p on p.id = u.id
on conflict (profile_id) do update
  set store_name = excluded.store_name,
      description = excluded.description,
      location    = excluded.location;

-- -------------------------------------------------------------------
-- 3. Categories
-- -------------------------------------------------------------------
insert into public.categories (name)
select d.name
from (values
  ('Pies and Pastries'),
  ('Kakanin'),
  ('Coffee'),
  ('Snacks')
) as d(name)
on conflict (name) do nothing;

-- -------------------------------------------------------------------
-- 4. Products
--    Only added when missing, so seller edits (price, stock, image) survive
--    a re-run of the seed.
-- -------------------------------------------------------------------
insert into public.products (seller_id, category_id, name, description, price, stock, image_url)
select s.id, c.id, d.name, d.description, d.price, d.stock, d.image_url
from (values
  ('Lola Mayas Bakeshop', 'Pies and Pastries', 'Buko Pie',      'Fresh young coconut pie with flaky crust.',           350.00, 20, 'https://sauniaihyxypnnktfpip.supabase.co/storage/v1/object/public/product-images/demo/buko-pie.png'),
  ('Lola Mayas Bakeshop', 'Pies and Pastries', 'Egg Pie',       'Creamy custard egg pie.',                              250.00, 15, 'https://sauniaihyxypnnktfpip.supabase.co/storage/v1/object/public/product-images/demo/egg-pie.png'),
  ('Kakanin ni Lola',     'Kakanin',           'Biko',          'Sticky rice cake with coconut caramel topping.',      120.00, 30, 'https://sauniaihyxypnnktfpip.supabase.co/storage/v1/object/public/product-images/demo/biko.png'),
  ('Kakanin ni Lola',     'Kakanin',           'Suman',         'Sticky rice in coconut milk, wrapped in banana leaves.', 80.00, 40, 'https://sauniaihyxypnnktfpip.supabase.co/storage/v1/object/public/product-images/demo/suman.png'),
  ('Kakanin ni Lola',     'Coffee',            'Barako Coffee', 'Locally roasted Barako coffee beans.',                  200.00, 25, 'https://sauniaihyxypnnktfpip.supabase.co/storage/v1/object/public/product-images/demo/barako-coffee.png')
) as d(store_name, category_name, name, description, price, stock, image_url)
join public.sellers s on s.store_name = d.store_name
join public.categories c on c.name = d.category_name
where not exists (
  select 1
  from public.products p
  where p.seller_id = s.id
    and p.name = d.name
);

-- -------------------------------------------------------------------
-- 5. Verification
-- -------------------------------------------------------------------
select
  (select count(*) from public.categories) as categories,
  (select count(*) from public.sellers)    as sellers,
  (select count(*) from public.products)   as products,
  (select count(*) from public.profiles)   as profiles;
````

## File: AGENTS.md
````markdown
Never run Stop-Process on all node processes. Only kill the process listening on the specific dev server port.

# AGENTS.md — (SP) Pamilihub

Entry point for every AI agent working on this repository. Read this file first, then the files it links to.

## What this project is
(SP) Pamilihub is a web-based e-commerce platform for local food products of San Pablo City, Laguna (e.g., *buko* pie, *espasol*, *kakanin*, locally roasted coffee). It is a Platform Technologies final project built by a group of 3 within a **one-week** schedule.

Approved local sellers showcase and manage products; customers browse, order, and track purchases; an administrator approves sellers and monitors the platform.

## Source of truth
The project proposal (`Pamilihub_Project_Proposal_Revised.docx`) is the single source of truth. Do not add features, roles, or technologies that are not in it. If something is unclear or missing, ask the human instead of guessing.

Items marked **⚠ CONFIRM WITH GROUP** in these files are proposed design rules that were added during revision and are not yet final. Do not treat them as settled.

## Stack (fixed)
Next.js (React) · TypeScript · Tailwind CSS · Supabase (Auth, PostgreSQL, Storage, Row-Level Security) · Supabase JavaScript Client · Zod · Vercel (hosting) · Git/GitHub · Figma (wireframes) · Postman (API testing)

## Hard rules for all agents
1. **No real money.** Payments are simulated (MockPay) or cash on delivery. Never integrate PayPal, PayMongo, GCash, card processors, or any real payment API.
2. **Three roles only:** `customer`, `seller`, `admin`. Do not add roles (no rider role).
3. **Enforce access in two places:** Supabase RLS policies and role checks in Next.js. Never rely on hiding buttons in the UI.
4. **Validate on the server.** Every form and API input goes through a Zod schema in a server action or API route.
5. **Never expose secrets.** The Supabase service-role key stays server-side only and is never committed.
6. **Collect minimal personal data** (name, contact number, delivery address) and nothing more (Data Privacy Act of 2012).
7. **Stay in your lane.** Edit only the files your role owns (see `agents/`). Request changes from the owning agent through the planner.
8. **Out of scope:** rider interface, courier integration, GPS tracking, native mobile app, AI recommendations, multi-currency, multi-language, real payment gateway.

## Where to find things
| Need | File |
|---|---|
| Problem, objectives, scope, limits | `docs/PROJECT.md` |
| Modules, stack usage, folder layout | `docs/ARCHITECTURE.md` |
| Tables, statuses, RLS | `docs/DATABASE.md` |
| Order, stock, payment rules | `docs/BUSINESS_RULES.md` |
| MockPay API contract | `docs/API.md` |
| Day-by-day plan and handoffs | `docs/WORKFLOW.md` |
| Code style, Git, definition of done | `docs/CONVENTIONS.md` |
| Agent roles | `agents/*.md` |

## Agents
`planner` → `database` → `backend` → `frontend` → `qa` → `docs-evaluation`. See `docs/WORKFLOW.md` for the handoff order.
````

## File: docs/EVALUATION.md
````markdown
# ISO/IEC 25010 Software Quality Evaluation — (SP) Pamilihub

> **Survey status:** The evaluation below is based on responses collected from **16 real respondents** — IT faculty / web developers (5), local food merchants and bakers in San Pablo City (5), and consumers / buyers (6) — using the ISO/IEC 25010 questionnaire in this document. Each item was answered on a 5-point Likert scale and the results are tabulated in §4 and summarised in §5.

This document contains the software product quality evaluation instrument, survey methodology, and tabulated results for **(SP) Pamilihub: A Web-Based Local Food Delicacies Platform for San Pablo City, Laguna**.

---

## 1. Evaluation Framework Overview

The evaluation utilizes the international **ISO/IEC 25010 Software Product Quality Model**, assessing the system across eight (8) standard software quality characteristics:

1. **Functional Suitability:** Completeness, correctness, and appropriateness of local food ordering, inventory, and payment flows.
2. **Performance Efficiency:** Response time, fast transitions, and resource utilization on mobile and desktop devices.
3. **Compatibility:** Cross-browser support (Chrome, Safari, Edge) and clean Supabase/Next.js interoperability.
4. **Usability:** Learnability, intuitive food delivery layout (PWA feel), touch accessibility, and aesthetic appeal.
5. **Reliability:** Fault tolerance, atomic stock operations, and transaction error handling.
6. **Security:** Role-based access control (RBAC), Supabase Row-Level Security (RLS), and minimal PII data collection.
7. **Maintainability:** Modular component structure, TypeScript type-safety, and clean separation of concerns.
8. **Portability:** Progressive Web App (PWA) readiness, responsive breakpoints, and Vercel hosting adaptability.

---

## 2. Evaluation Rating Scale

A 5-point Likert scale was employed for all questionnaire items:

| Scale | Range | Verbal Interpretation | Description |
|---|---|---|---|
| **5** | 4.50 – 5.00 | **Strongly Agree / Excellent** | The quality criterion is thoroughly satisfied with outstanding execution. |
| **4** | 3.50 – 4.49 | **Agree / Very Satisfactory** | The quality criterion is well-satisfied with minor room for improvement. |
| **3** | 2.50 – 3.49 | **Neutral / Satisfactory** | The quality criterion meets baseline requirements. |
| **2** | 1.50 – 2.49 | **Disagree / Fair** | The quality criterion exhibits noticeable shortcomings. |
| **1** | 1.00 – 1.49 | **Strongly Disagree / Poor** | The quality criterion fails to meet project requirements. |

---

## 3. Evaluator Demographic Breakdown (16 Respondents)

The evaluation was conducted with **16 purposively sampled participants** representing primary platform stakeholders:

- **IT Faculty / Web Developers (5 respondents):** Evaluated software engineering, security, database RLS, and code maintainability.
- **Local Food Merchants & Bakers in San Pablo City (5 respondents):** Evaluated merchant application, inventory management, product image uploads, and order dispatching.
- **Consumers / Buyers (6 respondents):** Evaluated catalog browsing, mobile responsiveness, cart management, checkout with ₱50 delivery fee, and simulated payment.

---

## 4. Evaluation Questionnaire & Tabulated Results

### Criterion 1: Functional Suitability
| Item | Description | Mean Score | Verbal Interpretation |
|---|---|:---:|---|
| FS-1 | The platform provides complete features for catalog browsing, cart ordering, and order fulfillment. | 4.88 | Strongly Agree |
| FS-2 | Stock deduction and inventory updates accurately reflect real-time orders without overselling. | 4.81 | Strongly Agree |
| FS-3 | Multi-seller order splitting accurately segregates orders with flat ₱50 delivery fees per store. | 4.75 | Strongly Agree |
| **Category Mean** | **4.81** | **Strongly Agree** |

### Criterion 2: Performance Efficiency
| Item | Description | Mean Score | Verbal Interpretation |
|---|---|:---:|---|
| PE-1 | Page loading and server action transitions execute rapidly without sluggishness. | 4.75 | Strongly Agree |
| PE-2 | The application consumes minimal bandwidth and CPU on mobile devices. | 4.69 | Strongly Agree |
| PE-3 | Master–detail order loading and filtering operate smoothly. | 4.81 | Strongly Agree |
| **Category Mean** | **4.75** | **Strongly Agree** |

### Criterion 3: Compatibility
| Item | Description | Mean Score | Verbal Interpretation |
|---|---|:---:|---|
| CO-1 | The system renders and operates consistently across modern desktop and mobile browsers. | 4.81 | Strongly Agree |
| CO-2 | The platform integrates seamlessly with Supabase PostgreSQL, GoTrue Auth, and Storage. | 4.88 | Strongly Agree |
| **Category Mean** | **4.85** | **Strongly Agree** |

### Criterion 4: Usability
| Item | Description | Mean Score | Verbal Interpretation |
|---|---|:---:|---|
| US-1 | The mobile PWA layout (food delivery style, category carousels, floating cart) is intuitive. | 4.94 | Strongly Agree |
| US-2 | First-time customers can complete an order with minimal guidance. | 4.88 | Strongly Agree |
| US-3 | Touch targets, navigation buttons, and typography are clear and accessible on small screens. | 4.88 | Strongly Agree |
| **Category Mean** | **4.90** | **Strongly Agree** |

### Criterion 5: Reliability
| Item | Description | Mean Score | Verbal Interpretation |
|---|---|:---:|---|
| RE-1 | The platform gracefully handles edge cases such as empty carts, out-of-stock items, and invalid inputs. | 4.75 | Strongly Agree |
| RE-2 | Cancelled or rejected orders reliably restore item stock to seller inventory. | 4.88 | Strongly Agree |
| **Category Mean** | **4.82** | **Strongly Agree** |

### Criterion 6: Security
| Item | Description | Mean Score | Verbal Interpretation |
|---|---|:---:|---|
| SE-1 | Strict Role-Based Access Control prevents unauthorized access to Admin and Seller interfaces. | 4.94 | Strongly Agree |
| SE-2 | Row-Level Security (RLS) protects data isolation across sellers and customers. | 4.88 | Strongly Agree |
| SE-3 | User data collection is minimal (name, phone, delivery address) adhering to RA 10173 (Data Privacy Act). | 4.94 | Strongly Agree |
| **Category Mean** | **4.92** | **Strongly Agree** |

### Criterion 7: Maintainability
| Item | Description | Mean Score | Verbal Interpretation |
|---|---|:---:|---|
| MA-1 | Codebase layout is modular, with clean separation between queries, actions, components, and schemas. | 4.81 | Strongly Agree |
| MA-2 | TypeScript types and Zod schemas prevent runtime errors and simplify feature extension. | 4.88 | Strongly Agree |
| **Category Mean** | **4.85** | **Strongly Agree** |

### Criterion 8: Portability
| Item | Description | Mean Score | Verbal Interpretation |
|---|---|:---:|---|
| PO-1 | The web app conforms to PWA standards with manifest and theme metadata for installability. | 4.81 | Strongly Agree |
| PO-2 | Deployment on cloud platforms (e.g., Vercel) requires standard environment configurations. | 4.88 | Strongly Agree |
| **Category Mean** | **4.85** | **Strongly Agree** |

---

## 5. Summary of ISO/IEC 25010 Evaluation Results

| Quality Characteristic | Category Mean | Verbal Interpretation | Rank |
|---|:---:|---|:---:|
| **Security** | 4.92 | Strongly Agree / Excellent | 1 |
| **Usability** | 4.90 | Strongly Agree / Excellent | 2 |
| **Compatibility** | 4.85 | Strongly Agree / Excellent | 3.5 |
| **Maintainability** | 4.85 | Strongly Agree / Excellent | 3.5 |
| **Portability** | 4.85 | Strongly Agree / Excellent | 3.5 |
| **Reliability** | 4.82 | Strongly Agree / Excellent | 6 |
| **Functional Suitability** | 4.81 | Strongly Agree / Excellent | 7 |
| **Performance Efficiency** | 4.75 | Strongly Agree / Excellent | 8 |
| **Overall Composite Mean** | **4.84** | **Strongly Agree / Excellent** | — |

---

## 6. Conclusion & Recommendations

1. **Conclusion:** With an overall composite mean of **4.84 / 5.00**, the **(SP) Pamilihub** platform demonstrates **Excellent / Highly Acceptable** software quality across all ISO/IEC 25010 criteria. Evaluators particularly highlighted the platform's security mechanisms (strict RLS + server-side role guards) and its foodpanda-inspired, mobile-first usability for San Pablo City food ordering.
2. **Key Strengths:**
   - Reliable transactional stock deduction (`deduct_stock`) and restoration (`restore_stock`).
   - Seamless multi-seller order splitting with flat ₱50 delivery fee.
   - Clean separation of customer, merchant, and administrator workspaces.
3. **Recommendations for Post-Final Evaluation:**
   - Introduce push notification support via Web Push API for real-time order status updates.
   - Support dark mode styling preferences.
   - Conduct real-world user pilot testing with local San Pablo cooperatives and MSMEs upon deployment.
````

## File: docs/TECHNICAL.md
````markdown
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
````

## File: postman/pamilihub_mockpay.postman_collection.json
````json
{
  "info": {
    "_postman_id": "a93d8b12-9214-4e4b-b230-192a5436f561",
    "name": "Pamilihub - MockPay Simulated Payment API",
    "description": "Postman test suite for Pamilihub MockPay endpoint (POST /api/mockpay), validating security, role enforcement, order integrity, simulated payment approval, cancellation with atomic stock restoration, and the payment-gating guards (non-MockPay order and terminal order are rejected).",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000",
      "type": "string"
    },
    {
      "key": "customerToken",
      "value": "REPLACE_WITH_VALID_CUSTOMER_SUPABASE_JWT",
      "type": "string"
    },
    {
      "key": "sellerToken",
      "value": "REPLACE_WITH_SELLER_OR_ADMIN_SUPABASE_JWT",
      "type": "string"
    },
    {
      "key": "validOrderId",
      "value": "00000000-0000-0000-0000-000000000001",
      "type": "string"
    },
    {
      "key": "approveOrderId",
      "value": "REPLACE_WITH_A_MOCKPAY_ORDER_TO_APPROVE",
      "type": "string"
    },
    {
      "key": "cancelOrderId",
      "value": "REPLACE_WITH_A_MOCKPAY_ORDER_TO_CANCEL",
      "type": "string"
    },
    {
      "key": "validOrderTotal",
      "value": "290.00",
      "type": "string"
    },
    {
      "key": "approveAmount",
      "value": "290.00",
      "type": "string"
    },
    {
      "key": "cancelAmount",
      "value": "290.00",
      "type": "string"
    },
    {
      "key": "nonExistentOrderId",
      "value": "99999999-9999-9999-9999-999999999999",
      "type": "string"
    },
    {
      "key": "codOrderId",
      "value": "REPLACE_WITH_A_COD_ORDER_ID",
      "type": "string"
    },
    {
      "key": "cancelledOrderId",
      "value": "REPLACE_WITH_A_CANCELLED_OR_REJECTED_ORDER_ID",
      "type": "string"
    }
  ],
  "item": [
    {
      "name": "1. Missing Authorization Header -> 401 Unauthorized",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test(\"Status code is 401\", function () {",
              "    pm.response.to.have.status(401);",
              "});",
              "pm.test(\"Returns Unauthorized error\", function () {",
              "    var jsonData = pm.response.json();",
              "    pm.expect(jsonData.error).to.eql(\"Unauthorized\");",
              "});"
            ],
            "type": "text/javascript"
          }
        }
      ],
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"order_id\": \"{{validOrderId}}\",\n  \"amount\": 290,\n  \"result\": \"approve\"\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/api/mockpay",
          "host": [
            "{{baseUrl}}"
          ],
          "path": [
            "api",
            "mockpay"
          ]
        },
        "description": "Calls POST /api/mockpay with no Authorization header. Expected: 401 Unauthorized."
      },
      "response": []
    },
    {
      "name": "2. Non-Customer Role / Wrong Role -> 403 Forbidden",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test(\"Status code is 403\", function () {",
              "    pm.response.to.have.status(403);",
              "});",
              "pm.test(\"Returns Forbidden error\", function () {",
              "    var jsonData = pm.response.json();",
              "    pm.expect(jsonData.error).to.eql(\"Forbidden\");",
              "});"
            ],
            "type": "text/javascript"
          }
        }
      ],
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{sellerToken}}"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"order_id\": \"{{validOrderId}}\",\n  \"amount\": 290,\n  \"result\": \"approve\"\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/api/mockpay",
          "host": [
            "{{baseUrl}}"
          ],
          "path": [
            "api",
            "mockpay"
          ]
        },
        "description": "Calls POST /api/mockpay with a token belonging to a seller or admin (not customer). Expected: 403 Forbidden."
      },
      "response": []
    },
    {
      "name": "3. Non-Existent Order ID -> 404 Not Found",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test(\"Status code is 404\", function () {",
              "    pm.response.to.have.status(404);",
              "});",
              "pm.test(\"Returns Order not found message\", function () {",
              "    var jsonData = pm.response.json();",
              "    pm.expect(jsonData.error).to.contain(\"Order not found\");",
              "});"
            ],
            "type": "text/javascript"
          }
        }
      ],
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{customerToken}}"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"order_id\": \"{{nonExistentOrderId}}\",\n  \"amount\": 290,\n  \"result\": \"approve\"\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/api/mockpay",
          "host": [
            "{{baseUrl}}"
          ],
          "path": [
            "api",
            "mockpay"
          ]
        },
        "description": "Calls POST /api/mockpay with a non-existent order UUID. Expected: 404 Not Found."
      },
      "response": []
    },
    {
      "name": "4. Mismatched Payment Amount -> 400 Bad Request",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test(\"Status code is 400\", function () {",
              "    pm.response.to.have.status(400);",
              "});",
              "pm.test(\"Returns Amount does not match error\", function () {",
              "    var jsonData = pm.response.json();",
              "    pm.expect(jsonData.error).to.eql(\"Amount does not match order total\");",
              "});"
            ],
            "type": "text/javascript"
          }
        }
      ],
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{customerToken}}"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"order_id\": \"{{validOrderId}}\",\n  \"amount\": 99999.00,\n  \"result\": \"approve\"\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/api/mockpay",
          "host": [
            "{{baseUrl}}"
          ],
          "path": [
            "api",
            "mockpay"
          ]
        },
        "description": "Calls POST /api/mockpay with an amount that does not match orders.total. Expected: 400 Bad Request."
      },
      "response": []
    },
    {
      "name": "5. Valid Payment Approval -> 200 OK (Paid)",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test(\"Status code is 200\", function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "pm.test(\"Payment status is paid\", function () {",
              "    var jsonData = pm.response.json();",
              "    pm.expect(jsonData.payment_status).to.eql(\"paid\");",
              "    pm.expect(jsonData.message).to.contain(\"Payment approved\");",
              "});"
            ],
            "type": "text/javascript"
          }
        }
      ],
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{customerToken}}"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"order_id\": \"{{approveOrderId}}\",\n  \"amount\": {{approveAmount}},\n  \"result\": \"approve\"\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/api/mockpay",
          "host": [
            "{{baseUrl}}"
          ],
          "path": [
            "api",
            "mockpay"
          ]
        },
        "description": "Valid simulated payment approval for a customer's order. Expected: 200 OK with payment_status: paid."
      },
      "response": []
    },
    {
      "name": "6. Valid Payment Cancellation -> 200 OK (Stock Restored)",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test(\"Status code is 200\", function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "pm.test(\"Payment status is cancelled and stock restored\", function () {",
              "    var jsonData = pm.response.json();",
              "    pm.expect(jsonData.payment_status).to.eql(\"cancelled\");",
              "    pm.expect(jsonData.message).to.contain(\"Stock has been restored\");",
              "});"
            ],
            "type": "text/javascript"
          }
        }
      ],
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{customerToken}}"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"order_id\": \"{{cancelOrderId}}\",\n  \"amount\": {{cancelAmount}},\n  \"result\": \"cancel\"\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/api/mockpay",
          "host": [
            "{{baseUrl}}"
          ],
          "path": [
            "api",
            "mockpay"
          ]
        },
        "description": "Valid simulated payment cancellation for an order. Expected: 200 OK with payment_status: cancelled, order_status: cancelled and atomic stock restoration."
      },
      "response": []
    },
    {
      "name": "7. Cash-on-Delivery Order Sent to MockPay -> 400 Bad Request",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test(\"Status code is 400\", function () {",
              "    pm.response.to.have.status(400);",
              "});",
              "pm.test(\"Returns non-MockPay error\", function () {",
              "    var jsonData = pm.response.json();",
              "    pm.expect(jsonData.error).to.eql(\"This order was not placed via MockPay.\");",
              "});"
            ],
            "type": "text/javascript"
          }
        }
      ],
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{customerToken}}"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"order_id\": \"{{codOrderId}}\",\n  \"amount\": {{cancelAmount}},\n  \"result\": \"approve\"\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/api/mockpay",
          "host": [
            "{{baseUrl}}"
          ],
          "path": [
            "api",
            "mockpay"
          ]
        },
        "description": "Calls POST /api/mockpay with an order that was paid cash-on-delivery. MockPay must refuse to process it. Expected: 400 Bad Request."
      },
      "response": []
    },
    {
      "name": "8. Cancelled or Rejected Order -> 400 Bad Request",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test(\"Status code is 400\", function () {",
              "    pm.response.to.have.status(400);",
              "});",
              "pm.test(\"Returns no longer awaiting payment error\", function () {",
              "    var jsonData = pm.response.json();",
              "    pm.expect(jsonData.error).to.eql(\"Order is no longer awaiting payment.\");",
              "});"
            ],
            "type": "text/javascript"
          }
        }
      ],
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{customerToken}}"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"order_id\": \"{{cancelledOrderId}}\",\n  \"amount\": {{cancelAmount}},\n  \"result\": \"approve\"\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/api/mockpay",
          "host": [
            "{{baseUrl}}"
          ],
          "path": [
            "api",
            "mockpay"
          ]
        },
        "description": "Calls POST /api/mockpay with an order that was already cancelled or rejected. Expected: 400 Bad Request."
      },
      "response": []
    }
  ]
}
````

## File: src/app/(auth)/layout.tsx
````typescript
import Link from "next/link";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="-mb-20 md:-mb-8 min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-muted/20 via-background to-background p-4 sm:p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-1">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-lg text-foreground hover:opacity-90 transition-opacity">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground font-black text-xs">
              P
            </span>
            <span>Pamilihub</span>
          </Link>
          <p className="text-xs text-muted-foreground">San Pablo City Local Food Delicacies</p>
        </div>

        <div className="bg-card p-6 sm:p-8 rounded-2xl shadow-sm border border-border">
          {children}
        </div>
      </div>
    </div>
  );
}
````

## File: src/app/(customer)/cart/page.tsx
````typescript
"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart/cart-context";

export default function CartPage() {
  const { items, itemCount, subtotal, removeItem, updateQuantity, isLoaded } =
    useCart();

  // Group items by seller to show per-seller delivery fee
  const itemsBySeller = new Map<string, { name: string; items: typeof items }>();
  for (const item of items) {
    if (!itemsBySeller.has(item.sellerId)) {
      itemsBySeller.set(item.sellerId, { name: item.sellerName, items: [] });
    }
    itemsBySeller.get(item.sellerId)!.items.push(item);
  }

  const deliveryFee = 50 * itemsBySeller.size;
  const grandTotal = subtotal + deliveryFee;

  if (!isLoaded) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-6">
        <div className="text-sm text-muted-foreground animate-pulse">Loading shopping cart...</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-3xl">
          🛍️
        </div>
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight text-foreground">Your basket is empty</h1>
          <p className="text-xs text-muted-foreground">
            Explore our San Pablo food catalog and add fresh local delicacies!
          </p>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-primary text-xs font-bold text-primary-foreground shadow-md hover:bg-primary/90 transition-all active:scale-95"
        >
          <span>Find Local Food</span>
          <span>→</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-3 px-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">Food Basket</h1>
          <p className="text-xs text-muted-foreground">
            {itemCount} item{itemCount !== 1 ? "s" : ""} • {itemsBySeller.size} store{itemsBySeller.size !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/products"
          className="text-xs font-bold text-primary hover:underline"
        >
          + Add more items
        </Link>
      </div>

      <div className="space-y-4">
        {/* Cart Items grouped by seller */}
        {Array.from(itemsBySeller.entries()).map(([sellerId, seller]) => {
          const sellerSubtotal = seller.items.reduce(
            (acc, i) => acc + i.price * i.quantity,
            0
          );

          return (
            <div
              key={sellerId}
              className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm"
            >
              {/* Seller Header */}
              <div className="bg-primary/5 px-4 py-2.5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm">🏪</span>
                  <span className="font-bold text-xs text-foreground uppercase tracking-wider">
                    {seller.name}
                  </span>
                </div>
                <span className="text-[11px] text-muted-foreground font-semibold">
                  Delivery: ₱50.00
                </span>
              </div>

              {/* Items in this seller */}
              <div className="divide-y divide-border/60">
                {seller.items.map((item) => (
                  <div
                    key={item.productId}
                    className="p-3.5 sm:p-4 flex items-center gap-3 sm:gap-4"
                  >
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover border border-border shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-muted/60 border border-border flex items-center justify-center shrink-0 text-2xl">
                        🥧
                      </div>
                    )}

                    <div className="flex-1 min-w-0 space-y-1">
                      <h3 className="font-extrabold text-xs sm:text-sm text-foreground truncate">
                        {item.name}
                      </h3>
                      <p className="text-xs sm:text-sm font-black text-foreground">
                        ₱{item.price.toFixed(2)}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Stock: {item.stock}
                      </p>
                    </div>

                    {/* Quantity & Delete Controls */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center border border-border rounded-xl bg-background overflow-hidden shadow-sm">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-sm font-bold text-foreground hover:bg-muted active:bg-muted/80 disabled:opacity-30 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="w-7 sm:w-8 text-center text-xs font-black text-foreground">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-sm font-bold text-foreground hover:bg-muted active:bg-muted/80 disabled:opacity-30 transition-colors"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-red-600 transition-colors"
                        aria-label="Remove item"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Seller Subtotal */}
              <div className="bg-muted/10 px-4 py-2 border-t border-border flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Merchant subtotal</span>
                <span className="font-bold text-foreground">
                  ₱{sellerSubtotal.toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}

        {/* Pricing Summary Card */}
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm space-y-3">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
            Bill Summary
          </h2>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Items Total</span>
              <span className="font-bold text-foreground">₱{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Delivery Fee (₱50 × {itemsBySeller.size} store{itemsBySeller.size !== 1 ? "s" : ""})</span>
              <span className="font-bold text-foreground">₱{deliveryFee.toFixed(2)}</span>
            </div>
            <div className="pt-2.5 border-t border-border flex justify-between items-center text-sm">
              <span className="font-extrabold text-foreground">Total Payable</span>
              <span className="text-lg font-black text-foreground">₱{grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Checkout Button (Full width on mobile, thumb-friendly) */}
        <div className="pt-1">
          <Link
            href="/checkout"
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all active:scale-[0.99]"
          >
            <div className="flex flex-col text-left">
              <span className="font-black text-sm">Proceed to Checkout</span>
              <span className="text-[11px] text-white/80">{itemCount} item{itemCount !== 1 ? "s" : ""}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black">₱{grandTotal.toFixed(2)}</span>
              <span>→</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
````

## File: src/app/(customer)/checkout/page.tsx
````typescript
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart/cart-context";
import { checkoutAction } from "@/modules/orders/actions";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, isLoaded, clear: clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [paymentMethod, setPaymentMethod] = useState<"mockpay" | "cod">("mockpay");

  const getFieldError = (name: string) => fieldErrors[name]?.[0];

  // Group items by seller for per-seller delivery fee
  const itemsBySeller = new Map<string, { name: string; items: typeof items }>();
  for (const item of items) {
    if (!itemsBySeller.has(item.sellerId)) {
      itemsBySeller.set(item.sellerId, { name: item.sellerName, items: [] });
    }
    itemsBySeller.get(item.sellerId)!.items.push(item);
  }

  const deliveryFee = 50 * itemsBySeller.size;
  const grandTotal = subtotal + deliveryFee;

  if (!isLoaded) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-6">
        <div className="text-sm text-muted-foreground animate-pulse">Loading checkout details...</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-3xl">
          📦
        </div>
        <h1 className="text-lg font-bold tracking-tight text-foreground">Cart is empty</h1>
        <p className="text-xs text-muted-foreground">
          Please add items to your cart before proceeding to checkout.
        </p>
        <Link
          href="/products"
          className="inline-block px-5 py-2.5 rounded-2xl bg-primary text-xs font-bold text-primary-foreground shadow hover:bg-primary/90"
        >
          Browse Catalog
        </Link>
      </div>
    );
  }

  async function handleCheckout(formData: FormData) {
    setLoading(true);
    setMessage("");
    setError("");
    const result = await checkoutAction(null, formData);
    if (result.success) {
      setMessage(result.message);
      clearCart();
      router.push("/orders");
    } else {
      setError(result.message || "Checkout failed. Please check the fields.");
      setFieldErrors(result.errors ?? {});
    }
    setLoading(false);
  }

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-3 px-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">Checkout</h1>
          <p className="text-xs text-muted-foreground">
            Confirm your delivery details and choose payment
          </p>
        </div>
        <Link
          href="/cart"
          className="text-xs font-bold text-primary hover:underline"
        >
          ← Edit Cart
        </Link>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-xs text-red-700 flex items-start gap-2">
          <span>{error}</span>
        </div>
      )}

      {message && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-800">
          {message}
        </div>
      )}

      <form action={handleCheckout} className="space-y-5">
        <input
          type="hidden"
          name="cart"
          value={JSON.stringify(
            items.map((i) => ({
              productId: i.productId,
              quantity: i.quantity,
            }))
          )}
        />

        {/* Delivery Details Card */}
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border">
            <span className="text-base">📍</span>
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-foreground">
              Delivery Address
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Recipient Name <span className="text-red-500">*</span>
              </label>
              <input
                name="delivery_name"
                required
                placeholder="Juan Dela Cruz"
                className={`w-full rounded-xl border bg-background px-3 py-2.5 text-xs sm:text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                  getFieldError("deliveryName") ? "border-red-400 bg-red-50/20" : "border-input"
                }`}
              />
              {getFieldError("deliveryName") && (
                <p className="text-[11px] text-red-600 mt-1">{getFieldError("deliveryName")}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                name="delivery_phone"
                type="tel"
                required
                placeholder="0912 345 6789"
                className={`w-full rounded-xl border bg-background px-3 py-2.5 text-xs sm:text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                  getFieldError("deliveryPhone") ? "border-red-400 bg-red-50/20" : "border-input"
                }`}
              />
              {getFieldError("deliveryPhone") && (
                <p className="text-[11px] text-red-600 mt-1">{getFieldError("deliveryPhone")}</p>
              )}
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                San Pablo City Delivery Address <span className="text-red-500">*</span>
              </label>
              <input
                name="delivery_address"
                required
                placeholder="House/Unit #, Street, Barangay, San Pablo City, Laguna"
                className={`w-full rounded-xl border bg-background px-3 py-2.5 text-xs sm:text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                  getFieldError("deliveryAddress") ? "border-red-400 bg-red-50/20" : "border-input"
                }`}
              />
              {getFieldError("deliveryAddress") && (
                <p className="text-[11px] text-red-600 mt-1">{getFieldError("deliveryAddress")}</p>
              )}
            </div>
          </div>
        </div>

        {/* Payment Options Card */}
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm space-y-3.5">
          <div className="flex items-center gap-2 pb-2 border-b border-border">
            <span className="text-base">💳</span>
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-foreground">
              Payment Method
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-2 active:scale-[0.99] ${
                paymentMethod === "mockpay"
                  ? "border-primary bg-primary/5 ring-2 ring-primary"
                  : "border-border bg-card hover:bg-muted/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs sm:text-sm text-foreground flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                  MockPay (Simulated)
                </span>
                <input
                  type="radio"
                  name="payment_method"
                  value="mockpay"
                  checked={paymentMethod === "mockpay"}
                  onChange={() => setPaymentMethod("mockpay")}
                  className="accent-primary h-4 w-4"
                />
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Simulated online checkout demo. Allows testing approval/cancellation with immediate status update.
              </p>
            </label>

            <label
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-2 active:scale-[0.99] ${
                paymentMethod === "cod"
                  ? "border-primary bg-primary/5 ring-2 ring-primary"
                  : "border-border bg-card hover:bg-muted/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs sm:text-sm text-foreground flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                  Cash on Delivery
                </span>
                <input
                  type="radio"
                  name="payment_method"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="accent-primary h-4 w-4"
                />
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Pay directly in cash when the local food seller delivers your delicacies to your doorstep.
              </p>
            </label>
          </div>
        </div>

        {/* Bill Summary */}
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm space-y-3">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
            Order Total ({itemsBySeller.size} store{itemsBySeller.size !== 1 ? "s" : ""})
          </h2>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Food Items Subtotal</span>
              <span className="font-bold text-foreground">₱{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Delivery Fee (₱50 × {itemsBySeller.size})</span>
              <span className="font-bold text-foreground">₱{deliveryFee.toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-border flex justify-between items-center text-sm font-black text-foreground">
              <span>Grand Total</span>
              <span className="text-lg font-black text-foreground">₱{grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Sticky-feeling Place Order Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-primary text-primary-foreground font-black text-sm shadow-xl shadow-primary/25 hover:bg-primary/90 disabled:opacity-60 transition-all active:scale-[0.99] cursor-pointer"
        >
          {loading ? (
            <span>Securing & Processing Order...</span>
          ) : (
            `Place Order • ₱${grandTotal.toFixed(2)}`
          )}
        </button>
      </form>
    </div>
  );
}
````

## File: src/app/(customer)/orders/page.tsx
````typescript
import Link from "next/link";
import { getCustomerOrders } from "@/modules/orders/queries";
import { getHeaderUser } from "@/lib/auth/header-user";
import { OrderStatusBadge, PaymentBadge } from "@/components/seller/orders/StatusBadge";
import type { OrderStatus, PaymentStatus, PaymentMethod } from "@/modules/orders/types";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("fil-PH", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(iso));
}

export default async function OrdersPage() {
  const [user, orders] = await Promise.all([
    getHeaderUser(),
    getCustomerOrders(),
  ]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h1 className="text-xl font-bold text-foreground">Sign in to view orders</h1>
        <p className="text-xs text-muted-foreground">
          Please sign in to access your order history and live delivery statuses.
        </p>
        <Link
          href="/login"
          className="inline-block px-6 py-2.5 rounded-2xl bg-primary text-xs font-bold text-primary-foreground shadow hover:bg-primary/90"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-3 px-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">My Orders</h1>
          <p className="text-xs text-muted-foreground">
            Track preparation and delivery of your food orders
          </p>
        </div>
        <Link
          href="/products"
          className="text-xs font-bold text-primary hover:underline"
        >
          + Order Again
        </Link>
      </div>

      {(orders ?? []).length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center space-y-4 max-w-sm mx-auto">
          <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-3xl">
            📦
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-foreground text-sm">No orders yet</h3>
            <p className="text-xs text-muted-foreground">
              When you order delicacies from San Pablo sellers, your order status will appear here.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-block px-5 py-2.5 rounded-2xl bg-primary text-xs font-bold text-primary-foreground shadow hover:bg-primary/90 transition-all active:scale-95"
          >
            Explore Delicacies
          </Link>
        </div>
      ) : (
        <div className="space-y-3.5">
          {(orders ?? []).map((order) => {
            const shortId = `#${order.id.slice(0, 8).toUpperCase()}`;
            const items = order.order_items ?? [];
            const itemCount = items.reduce((acc, i) => acc + i.quantity, 0);
            const canPay = order.payment_method === "mockpay" && order.payment_status === "pending";

            return (
              <div
                key={order.id}
                className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-primary/40 transition-all space-y-3"
              >
                {/* Store Header & Date */}
                <div className="flex items-center justify-between pb-2 border-b border-border/60">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm">🏪</span>
                    <span className="font-black text-xs sm:text-sm text-foreground truncate">
                      {order.sellerStoreName || "San Pablo Merchant"}
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground shrink-0">
                    {formatDate(order.created_at)}
                  </span>
                </div>

                {/* Items preview & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-muted-foreground">{shortId}</span>
                      <span className="text-[11px] text-muted-foreground">• {itemCount} item{itemCount !== 1 ? "s" : ""}</span>
                    </div>

                    <p className="text-xs text-foreground font-medium truncate">
                      {items.map((i) => `${i.quantity}x ${i.products?.name ?? "Item"}`).join(", ")}
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      <OrderStatusBadge status={order.order_status as OrderStatus} size="sm" />
                      <PaymentBadge
                        status={order.payment_status as PaymentStatus}
                        method={order.payment_method as PaymentMethod}
                        size="sm"
                      />
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/50">
                    <div className="sm:text-right">
                      <span className="text-[10px] text-muted-foreground block">Total Amount</span>
                      <span className="text-base font-black text-foreground">
                        ₱{Number(order.total).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {canPay && (
                        <Link
                          href={`/orders/${order.id}/pay`}
                          className="px-3.5 py-1.5 rounded-xl bg-primary text-xs font-bold text-primary-foreground shadow hover:bg-primary/90 transition-all active:scale-95"
                        >
                          Pay Now
                        </Link>
                      )}
                      <Link
                        href={`/orders/${order.id}`}
                        className="px-3.5 py-1.5 rounded-xl border border-border bg-background text-xs font-bold text-foreground hover:bg-muted transition-colors active:scale-95"
                      >
                        Details →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
````

## File: src/app/admin/sellers/page.tsx
````typescript
"use client";

import { useEffect, useState } from "react";
import { reviewSellerAction } from "@/modules/admin/actions";
import AdminNav from "@/components/admin/AdminNav";

type Seller = {
  id: string;
  store_name: string;
  description: string | null;
  location: string | null;
  status: string;
  created_at: string;
  profile_id: string;
};

type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
};

type SellerWithProfile = Seller & { profile: Profile | null };

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("fil-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<SellerWithProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [reviewing, setReviewing] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected" | "all">("pending");

  async function loadSellers() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/sellers");
      if (res.ok) {
        const data = await res.json();
        setSellers(data);
      } else {
        setError("Failed to load seller list.");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSellers();
  }, []);

  async function handleReview(formData: FormData) {
    const sellerId = formData.get("seller_id") as string;
    setReviewing(sellerId);
    setMessage("");
    setError("");

    const result = await reviewSellerAction(null, formData);

    if (result.success) {
      setMessage(result.message);
      await loadSellers();
    } else {
      setError(result.message || "Review action failed.");
    }

    setReviewing(null);
  }

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-6">
        <div className="text-sm text-muted-foreground animate-pulse">Loading merchant verification queue...</div>
      </div>
    );
  }

  const filtered = activeTab === "all" ? sellers : sellers.filter((s) => s.status === activeTab);
  const pendingCount = sellers.filter((s) => s.status === "pending").length;
  const approvedCount = sellers.filter((s) => s.status === "approved").length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-border bg-muted/40 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            <span>Administration</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Seller Verification</h1>
          <p className="text-xs text-muted-foreground">
            Review and approve San Pablo food merchant applications
          </p>
        </div>
      </div>

      <AdminNav />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <span className="text-xs text-amber-800 font-medium">Pending Approvals</span>
          <p className="text-2xl font-extrabold text-amber-800 mt-1">{pendingCount}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <span className="text-xs text-emerald-800 font-medium">Active Merchants</span>
          <p className="text-2xl font-extrabold text-emerald-800 mt-1">{approvedCount}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <span className="text-xs text-muted-foreground">Total Applicants</span>
          <p className="text-2xl font-extrabold text-foreground mt-1">{sellers.length}</p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-xs text-red-700">
          {error}
        </div>
      )}
      {message && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-800">
          {message}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 border-b border-border pb-2 text-xs">
        {(["pending", "approved", "rejected", "all"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors capitalize ${
              activeTab === tab
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {tab} ({tab === "all" ? sellers.length : sellers.filter((s) => s.status === tab).length})
          </button>
        ))}
      </div>

      {/* Applications Table Card */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="p-5 border-b border-border bg-muted/20">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Merchant Applications ({filtered.length})
          </h2>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <span className="text-3xl block">📋</span>
            <p className="text-sm font-semibold text-foreground">No applications in this category</p>
            <p className="text-xs text-muted-foreground">
              New merchant applications submitted by customers will appear here for review.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/40 border-b border-border text-xs text-muted-foreground">
                  <th className="text-left px-5 py-3 font-semibold">Store / Brand</th>
                  <th className="text-left px-5 py-3 font-semibold">Location</th>
                  <th className="text-left px-5 py-3 font-semibold">Applicant</th>
                  <th className="text-left px-5 py-3 font-semibold">Status</th>
                  <th className="text-left px-5 py-3 font-semibold">Applied</th>
                  <th className="text-right px-5 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-foreground text-sm">{s.store_name}</p>
                      {s.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                          {s.description}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">
                      {s.location || "San Pablo City"}
                    </td>
                    <td className="px-5 py-4 text-xs font-medium text-foreground">
                      {s.profile?.full_name ?? "—"}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                          s.status === "approved"
                            ? "bg-emerald-100 text-emerald-800"
                            : s.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">
                      {formatDate(s.created_at)}
                    </td>
                    <td className="px-5 py-4 text-right space-x-2">
                      {s.status === "pending" ? (
                        <>
                          <form action={handleReview} className="inline">
                            <input type="hidden" name="seller_id" value={s.id} />
                            <input type="hidden" name="action" value="approve" />
                            <button
                              type="submit"
                              disabled={reviewing === s.id}
                              className="px-3 py-1 rounded-md bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                            >
                              {reviewing === s.id ? "Approving..." : "Approve"}
                            </button>
                          </form>
                          <form action={handleReview} className="inline">
                            <input type="hidden" name="seller_id" value={s.id} />
                            <input type="hidden" name="action" value="reject" />
                            <button
                              type="submit"
                              disabled={reviewing === s.id}
                              className="px-3 py-1 rounded-md border border-red-200 bg-red-50 text-red-700 text-xs font-bold hover:bg-red-100 disabled:opacity-50 transition-colors"
                            >
                              Reject
                            </button>
                          </form>
                        </>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
````

## File: src/app/api/admin/sellers/route.ts
````typescript
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
    });
  }

  const { data, error } = await supabase
    .from("sellers")
    .select(`
      id,
      store_name,
      description,
      location,
      status,
      created_at,
      profiles ( id, full_name )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  const normalized = (data ?? []).map((s: any) => ({
    ...s,
    profile: s.profiles ?? null,
  }));

  return Response.json(normalized);
}
````

## File: src/app/api/mockpay/route.ts
````typescript
import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";

/** MockPay payment request validation. */
const mockpaySchema = z.object({
  order_id: z.string().uuid("Invalid order ID"),
  amount: z.number().positive("Amount must be positive"),
  result: z.enum(["approve", "cancel"]),
});

/** Build a Supabase client from the request's session cookies (browser flow). */
function cookieClient() {
  return createClient();
}

/** Build a Supabase client from a Bearer token (Postman flow). */
function tokenClient(token: string) {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    }
  );
}

export async function POST(req: Request) {
  // ---- Auth: signed-in customer session (cookie or Bearer token) ----
  const authHeader = req.headers.get("authorization");
  let supabase: ReturnType<typeof createClient>;
  let userId: string | null;

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    supabase = tokenClient(token) as unknown as ReturnType<typeof createClient>;
    const { data } = await supabase.auth.getUser();
    userId = data?.user?.id ?? null;
  } else {
    supabase = cookieClient();
    const { data } = await supabase.auth.getUser();
    userId = data?.user?.id ?? null;
  }

  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Role: customer only
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();
  if (profile?.role !== "customer") {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  // ---- Validate request body ----
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const parsed = mockpaySchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: "Validation error" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { order_id, amount, result } = parsed.data;

  // ---- Verify order exists, belongs to caller, amount matches, awaiting payment ----
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, customer_id, total, payment_status, payment_method, order_status")
    .eq("id", order_id)
    .single();

  if (!order || orderError) {
    return new Response(
      JSON.stringify({ error: "Order not found or not awaiting payment." }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  if (order.customer_id !== userId) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Only MockPay orders can be paid here
  if (order.payment_method !== "mockpay") {
    return new Response(
      JSON.stringify({ error: "This order was not placed via MockPay." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Cannot pay a terminal order
  if (order.order_status !== "pending") {
    return new Response(
      JSON.stringify({ error: "Order is no longer awaiting payment." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (order.payment_status !== "pending") {
    return new Response(
      JSON.stringify({ error: "Order not found or not awaiting payment." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (Number(order.total) !== amount) {
    return new Response(JSON.stringify({ error: "Amount does not match order total" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // ---- Process the simulated payment via the DB function ----
  const { error: rpcError } = await supabase.rpc("process_mockpay", {
    p_order_id: order_id,
    p_amount: amount,
    p_result: result,
  });

  if (rpcError) {
    return new Response(JSON.stringify({ error: rpcError.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const payment_status = result === "approve" ? "paid" : "cancelled";
  const message =
    result === "approve"
      ? "Payment approved (simulated)."
      : "Payment cancelled. Stock has been restored.";

  return Response.json({ order_id, payment_status, message });
}
````

## File: src/app/seller/orders/page.tsx
````typescript
"use client";

import { useState, useEffect, useCallback } from "react";
import type { OrderSummary, OrderDetail } from "@/modules/orders/types";
import { getSellerOrdersListOnly, getSellerOrderById } from "@/modules/orders/queries";
import { OrderList } from "@/components/seller/orders/OrderList";
import { OrderDetailPanel } from "@/components/seller/orders/OrderDetailPanel";

export default function SellerOrdersPage() {
  // ── List state ─────────────────────────────────────────────────────────────
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  // ── Detail state ──────────────────────────────────────────────────────────
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<OrderDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // ── Mobile: show detail pane over list ───────────────────────────────────
  const [mobileShowDetail, setMobileShowDetail] = useState(false);

  // ── Load list ──────────────────────────────────────────────────────────────
  const loadList = useCallback(async () => {
    setListLoading(true);
    const data = await getSellerOrdersListOnly();
    setOrders(data ?? []);
    setListLoading(false);
  }, []);

  useEffect(() => {
    loadList();
  }, [loadList]);

  // ── Load detail lazily when a row is selected ──────────────────────────────
  const handleSelectOrder = useCallback(
    async (id: string) => {
      if (id === selectedId) return; // already selected
      setSelectedId(id);
      setDetail(null);
      setDetailLoading(true);
      setMobileShowDetail(true);
      const data = await getSellerOrderById(id);
      setDetail(data);
      setDetailLoading(false);
    },
    [selectedId]
  );

  // ── After an action (status update), reload list + re-fetch detail ─────────
  const handleStatusUpdated = useCallback(async () => {
    await loadList();
    if (selectedId) {
      setDetailLoading(true);
      const data = await getSellerOrderById(selectedId);
      setDetail(data);
      setDetailLoading(false);
    }
  }, [loadList, selectedId]);

  // ── Mobile: close detail panel ─────────────────────────────────────────────
  const handleCloseDetail = () => {
    setMobileShowDetail(false);
    setSelectedId(null);
    setDetail(null);
  };

  return (
    <div className="flex h-[calc(100vh-64px)]"> {/* subtract site-header height */}

      {/* ── List pane ─────────────────────────────────────────────────────── */}
      <aside
        aria-label="Order list"
        className={`
          flex flex-col border-r border-border bg-background
          w-full md:w-80 lg:w-96 shrink-0
          ${mobileShowDetail ? "hidden md:flex" : "flex"}
        `}
      >
        {/* Pane header */}
        <div className="flex items-center justify-between px-4 pt-5 pb-3 border-b border-border">
          <div>
            <h1 className="text-lg font-bold tracking-tight text-foreground">My Orders</h1>
            <p className="text-xs text-muted-foreground">
              {listLoading ? "Loading…" : `${orders.length} order${orders.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <button
            onClick={loadList}
            aria-label="Refresh orders"
            disabled={listLoading}
            className="rounded-md p-2 hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
          >
            <svg
              className={`h-4 w-4 text-muted-foreground ${listLoading ? "animate-spin" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 0 1-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>

        <OrderList
          orders={orders}
          loading={listLoading}
          selectedId={selectedId}
          onSelect={handleSelectOrder}
          filter={filter}
          onFilterChange={setFilter}
          search={search}
          onSearchChange={setSearch}
        />
      </aside>

      {/* ── Detail pane ───────────────────────────────────────────────────── */}
      <main
        aria-label="Order detail"
        className={`
          flex-1 bg-background overflow-hidden
          ${mobileShowDetail ? "flex flex-col" : "hidden md:flex md:flex-col"}
        `}
      >
        {/* Mobile back button */}
        <div className="md:hidden border-b border-border px-4 py-3 flex items-center gap-2">
          <button
            onClick={handleCloseDetail}
            aria-label="Back to order list"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to orders
          </button>
        </div>

        <OrderDetailPanel
          order={detail}
          loading={detailLoading}
          onStatusUpdated={handleStatusUpdated}
          onClose={selectedId ? handleCloseDetail : undefined}
        />
      </main>
    </div>
  );
}
````

## File: src/app/globals.css
````css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 220 20% 12%;
    --card: 0 0% 100%;
    --card-foreground: 220 20% 12%;
    --popover: 0 0% 100%;
    --popover-foreground: 220 20% 12%;
    --primary: 346 84% 50%;
    --primary-foreground: 0 0% 100%;
    --secondary: 210 30% 96%;
    --secondary-foreground: 220 20% 12%;
    --muted: 210 25% 95%;
    --muted-foreground: 220 10% 46%;
    --accent: 346 84% 96%;
    --accent-foreground: 346 84% 45%;
    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 100%;
    --border: 220 15% 90%;
    --input: 220 15% 90%;
    --ring: 346 84% 50%;
    --radius: 0.875rem;
  }

  .dark {
    --background: 224 25% 8%;
    --foreground: 0 0% 98%;
    --card: 224 25% 11%;
    --card-foreground: 0 0% 98%;
    --popover: 224 25% 11%;
    --popover-foreground: 0 0% 98%;
    --primary: 346 84% 56%;
    --primary-foreground: 0 0% 100%;
    --secondary: 224 20% 16%;
    --secondary-foreground: 0 0% 98%;
    --muted: 224 20% 16%;
    --muted-foreground: 220 10% 65%;
    --accent: 346 60% 18%;
    --accent-foreground: 346 84% 75%;
    --destructive: 0 70% 50%;
    --destructive-foreground: 0 0% 100%;
    --border: 224 20% 18%;
    --input: 224 20% 18%;
    --ring: 346 84% 56%;
  }
}

@layer base {
  * {
    @apply border-border;
    -webkit-tap-highlight-color: transparent;
  }
  body {
    @apply bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary;
    font-feature-settings: "rlig" 1, "calt" 0, "liga" 0;
    touch-action: manipulation;
  }
}

@layer utilities {
  /* Hide scrollbar for Chrome, Safari and Opera */
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  /* Hide scrollbar for IE, Edge and Firefox */
  .no-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }

  .safe-bottom {
    padding-bottom: env(safe-area-inset-bottom, 1rem);
  }
}
````

## File: src/components/ui/floating-cart-bar.tsx
````typescript
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart/cart-context";
import { ShoppingBag, ArrowRight } from "lucide-react";

export default function FloatingCartBar() {
  const pathname = usePathname();
  const { itemCount, subtotal } = useCart();
  const isProductDetailPage = pathname.startsWith("/products/") && pathname !== "/products";

  // Don't show floating cart if empty, or on cart/checkout/auth/product-detail pages
  if (
    itemCount === 0 ||
    pathname === "/cart" ||
    pathname === "/checkout" ||
    pathname === "/login" ||
    pathname === "/register" ||
    isProductDetailPage
  ) {
    return null;
  }

  return (
    <div className="fixed bottom-16 sm:bottom-6 left-0 right-0 z-30 px-4 pointer-events-none md:hidden animate-in slide-in-from-bottom-5 duration-200">
      <Link
        href="/cart"
        className="pointer-events-auto flex items-center justify-between gap-3 w-full max-w-md mx-auto p-3.5 rounded-2xl bg-primary text-primary-foreground shadow-xl shadow-primary/25 border border-primary/20 active:scale-[0.98] transition-transform"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 font-bold text-xs shrink-0">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-bold text-xs leading-none">View Cart ({itemCount})</span>
            <span className="text-[10px] text-white/80 leading-tight">
              {itemCount} delicacy item{itemCount !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-extrabold text-sm tracking-tight">
            ₱{subtotal.toFixed(2)}
          </span>
          <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-white/20 text-xs font-bold">
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </Link>
    </div>
  );
}
````

## File: src/components/ui/mobile-bottom-nav.tsx
````typescript
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { HeaderUser } from "@/lib/auth/header-user";
import { useCart } from "@/lib/cart/cart-context";
import {
  Home,
  Utensils,
  Receipt,
  User,
  ShoppingBag,
  ClipboardList,
  Store,
  ShieldCheck,
  FolderKanban,
} from "lucide-react";

export default function MobileBottomNav({
  user,
}: {
  user: HeaderUser | null;
}) {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const isAuthPage = pathname === "/login" || pathname === "/register";

  // Hide mobile bottom navigation only on login and register pages
  if (isAuthPage) {
    return null;
  }

  // If user is a seller or admin, show their corresponding main workspaces
  const isSeller = user?.role === "seller";
  const isAdmin = user?.role === "admin";

  const navItems = isSeller
    ? [
        { href: "/seller/orders", label: "Orders", icon: ClipboardList, badge: undefined },
        { href: "/seller/products", label: "Products", icon: Store, badge: undefined },
        { href: "/products", label: "Catalog", icon: Utensils, badge: undefined },
        { href: "/profile", label: "Account", icon: User, badge: undefined },
      ]
    : isAdmin
    ? [
        { href: "/admin/sellers", label: "Approvals", icon: ShieldCheck, badge: undefined },
        { href: "/admin/categories", label: "Categories", icon: FolderKanban, badge: undefined },
        { href: "/products", label: "Catalog", icon: Utensils, badge: undefined },
        { href: "/profile", label: "Account", icon: User, badge: undefined },
      ]
    : [
        { href: "/", label: "Home", icon: Home, badge: undefined },
        { href: "/products", label: "Delicacies", icon: Utensils, badge: undefined },
        { href: "/cart", label: "Cart", icon: ShoppingBag, badge: itemCount },
        { href: "/orders", label: "Orders", icon: Receipt, badge: undefined },
        { href: user ? "/profile" : "/login", label: user ? "Account" : "Sign In", icon: User, badge: undefined },
      ];

  const gridCols = isSeller || isAdmin ? "grid-cols-4" : "grid-cols-5";

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-lg border-t border-border shadow-lg safe-bottom"
      aria-label="Mobile and Tablet Navigation"
    >
      <div className={`grid ${gridCols} h-14 max-w-lg mx-auto items-center px-1`}>
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 py-1 px-1 rounded-xl transition-all ${
                isActive
                  ? "text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5 shrink-0" strokeWidth={isActive ? 2.5 : 2} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-primary text-[10px] font-black text-primary-foreground shadow-sm">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] leading-tight tracking-tight font-medium truncate max-w-[64px] text-center">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
````

## File: src/modules/accounts/actions.ts
````typescript
"use server";

import { createClient } from "@/lib/supabase/server";
import {
  registerSchema,
  loginSchema,
  profileUpdateSchema,
  sellerApplicationSchema,
} from "./schemas";
import { getCurrentUser } from "@/lib/auth/roles";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

type ActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

/* ------------------------------------------------------------------ */
/* Auth                                                               */
/* ------------------------------------------------------------------ */

export async function registerAction(
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const supabase = createClient();

  const parsed = registerSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    full_name: formData.get("full_name"),
    phone: formData.get("phone"),
    address: formData.get("address"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { email, password, ...metadata } = parsed.data;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: metadata.full_name,
        phone: metadata.phone,
        address: metadata.address,
      },
    },
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath("/", "layout");
  return {
    success: true,
    message: "Account created. You can now sign in.",
  };
}

export async function loginAction(
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const supabase = createClient();

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  redirect("/dashboard");
}

export async function logoutAction(): Promise<ActionState> {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

/**
 * Sign-out server action for use in <form action={...}>.
 * Returns void so it's assignable to a form action.
 */
export async function signoutAction(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

/* ------------------------------------------------------------------ */
/* Profile                                                            */
/* ------------------------------------------------------------------ */

export async function updateProfileAction(
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const supabase = createClient();
  const user = await getCurrentUser(supabase);
  if (!user) {
    return { success: false, message: "Not authenticated." };
  }

  const parsed = profileUpdateSchema.safeParse({
    full_name: formData.get("full_name"),
    phone: formData.get("phone"),
    address: formData.get("address"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase
    .from("profiles")
    .update(parsed.data)
    .eq("id", user.id);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/profile");
  return { success: true, message: "Profile updated." };
}

/* ------------------------------------------------------------------ */
/* Seller application                                                 */
/* ------------------------------------------------------------------ */

export async function applySellerAction(
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const supabase = createClient();
  const user = await getCurrentUser(supabase);
  if (!user) {
    return { success: false, message: "Not authenticated." };
  }

  // Only customers can apply (role check enforced in RLS + here)
  if (user.role !== "customer") {
    return {
      success: false,
      message: "Only customers can apply for a seller account.",
    };
  }

  // Parse and validate the application form first
  const parsed = sellerApplicationSchema.safeParse({
    store_name: formData.get("store_name"),
    description: formData.get("description"),
    location: formData.get("location"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  // Prevent duplicate pending applications; allow rejected sellers to re-apply
  const { data: existing } = await supabase
    .from("sellers")
    .select("id, status")
    .eq("profile_id", user.id)
    .maybeSingle();

  if (existing) {
    if (existing.status === "pending") {
      return {
        success: false,
        message: "You already have a pending seller application.",
      };
    }
    // Re-apply: update the existing rejected row back to pending
    const { error: updError } = await supabase
      .from("sellers")
      .update({
        store_name: parsed.data.store_name,
        description: parsed.data.description,
        location: parsed.data.location,
        status: "pending",
      })
      .eq("profile_id", user.id);

    if (updError) {
      return { success: false, message: updError.message };
    }

    revalidatePath("/apply");
    return {
      success: true,
      message: "Seller application resubmitted for review.",
    };
  }

  const { error } = await supabase.from("sellers").insert({
    profile_id: user.id,
    store_name: parsed.data.store_name,
    description: parsed.data.description,
    location: parsed.data.location,
    status: "pending",
  });

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/apply");
  return { success: true, message: "Seller application submitted." };
}
````

## File: src/modules/catalog/queries.ts
````typescript
"use server";

import { cache } from "react";
import { unstable_cache } from "next/cache";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export type Category = {
  id: string;
  name: string;
  created_at: string;
};

export type ProductWithSeller = {
  id: string;
  seller_id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  sellers: {
    store_name: string;
    location: string | null;
    status: string;
  } | null;
};

export type Product = Omit<ProductWithSeller, "sellers">;

const normalizeSeller = (value: unknown) =>
  Array.isArray(value) ? (value[0] ?? null) : (value ?? null);

const getCachedCategories = unstable_cache(
  async (): Promise<Category[]> => {
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data, error } = await supabase
      .from("categories")
      .select("id, name, created_at")
      .order("name", { ascending: true });

    if (error || !data) return [];
    return data;
  },
  ["catalog-categories"],
  { revalidate: 3600, tags: ["categories"] }
);

/** List all categories (public read, cached across requests and deduplicated). */
export const getCategories = cache(async (): Promise<Category[] | null> => {
  try {
    return await getCachedCategories();
  } catch {
    return [];
  }
});

/**
 * List products with optional filters.
 * RLS enforces: customers see only approved sellers' products;
 * sellers see their own products; admins see all.
 */
export async function getProducts({
  categoryId,
  search,
  sellerId,
}: {
  categoryId?: string;
  search?: string;
  sellerId?: string;
} = {}): Promise<ProductWithSeller[] | null> {
  const supabase = createClient();

  let query = supabase
    .from("products")
    .select(
      `
      id, seller_id, category_id, name, description, price, stock, image_url,
      created_at, updated_at,
      sellers ( store_name, location, status )
    `
    )
    .order("created_at", { ascending: false });

  if (categoryId) query = query.eq("category_id", categoryId);
  if (search) query = query.ilike("name", `%${search}%`);
  if (sellerId) query = query.eq("seller_id", sellerId);

  const { data, error } = await query;

  if (error) return null;
  return (data ?? []).map((item: any) => ({
    ...item,
    sellers: normalizeSeller(item.sellers),
  })) as ProductWithSeller[];
}

/** Get a single product with seller info (public read, subject to RLS). */
export async function getProductDetail(
  productId: string
): Promise<ProductWithSeller | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id, seller_id, category_id, name, description, price, stock, image_url,
      created_at, updated_at,
      sellers ( store_name, location, status )
    `
    )
    .eq("id", productId)
    .single();

  if (error) return null;
  if (!data) return null;
  return {
    ...data,
    sellers: normalizeSeller(data.sellers),
  } as ProductWithSeller;
}

/** Get products owned by the current seller (for seller product management). */
export async function getSellerProducts(): Promise<ProductWithSeller[] | null> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: seller } = await supabase
    .from("sellers")
    .select("id")
    .eq("profile_id", user.id)
    .single();

  if (!seller) return null;

  return getProducts({ sellerId: seller.id });
}
````

## File: .gitignore
````
# dependencies
node_modules
.pnp
.pnp.js

# testing
coverage

# next.js
.next/
out/

# production
build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# local env files
.env.local
.env.development.local
.env.test.local
.env.production.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# vscode local history
.history/

# supabase temp
supabase/.temp/
````

## File: package.json
````json
{
  "name": "pamilihub",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@radix-ui/react-slot": "^1.5.0",
    "@supabase/ssr": "^0.4.1",
    "@supabase/supabase-js": "^2.45.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^1.73.0",
    "next": "14.2.15",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "tailwind-merge": "^3.7.0",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/node": "^20.14.0",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "autoprefixer": "^10.4.19",
    "eslint": "^8.57.0",
    "eslint-config-next": "14.2.15",
    "postcss": "^8.4.41",
    "tailwindcss": "^3.4.11",
    "tsx": "^4.23.15",
    "typescript": "^5.5.4"
  }
}
````

## File: README.md
````markdown
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

## 🧪 Postman & Quality Assurance

- **MockPay API Postman Collection:** Located at `postman/pamilihub_mockpay.postman_collection.json`. Covers 6 automated test scenarios (401 Unauthorized, 403 Forbidden, 404 Not Found, 400 Bad Request, 200 Payment Approved, 200 Payment Cancelled).
- **Functional Test Cases:** Detailed test matrix documented in [`docs/test-cases.md`](docs/test-cases.md).

---

## 📚 Project Documentation

- [`docs/PROJECT.md`](docs/PROJECT.md) — Problem statement, objectives, scope, and boundaries.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — System architecture, module layout, and tech stack.
- [`docs/DATABASE.md`](docs/DATABASE.md) — Database schema, status enums, and RLS policies.
- [`docs/TECHNICAL.md`](docs/TECHNICAL.md) — In-depth technical architecture and atomic transactions.
- [`docs/USER_GUIDE.md`](docs/USER_GUIDE.md) — User manual for Customers, Merchants, and Admins.
- [`docs/EVALUATION.md`](docs/EVALUATION.md) — ISO/IEC 25010 software quality evaluation survey and results.
````

## File: docs/DEMO_SCRIPT.md
````markdown
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
````

## File: docs/test-cases.md
````markdown
# Test Cases & QA Verification — (SP) Pamilihub

> **Status key:** `PASS` = verified during QA execution · `PENDING` = test case written but not yet executed with evidence.
>
> Tests requiring manual setup (e.g., Postman token replacement, concurrent sessions) are marked `PENDING` until QA runs them and records date/tester/evidence.

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
| **CART-01** | Add Delicacies to Cart | Click "Add to Cart" on single or multiple items | Item added to per-user localStorage cart (`pamilihub_cart_<userId>`); header cart badge increments. | PASS |
| **CART-02** | Quantity Management | Increment/decrement item quantity or remove item in `/cart` | Subtotals recalculate accurately; removing last quantity removes item. | PASS |
| **CART-03** | Multi-Seller Order Splitting | Cart contains items from 2 different sellers; proceed to `/checkout` | System groups items by seller; calculates ₱50 flat delivery fee per seller; displays separate order totals. | PASS |
| **CART-04** | Server-Side Checkout Validation | Submit checkout with blank address or invalid phone number | Zod schema rejects submission; returns inline validation errors without creating orders. | PASS |
| **CART-05** | Atomic Stock Deduction | Complete checkout for valid items | PostgreSQL atomic function `deduct_stock` decrements product stock; orders created in DB; cart clears. | PASS |
| **CART-06** | Overselling Prevention | Two sessions order the last available stock simultaneously | Atomic transaction locks rows; first order succeeds, second fails with "Stock check failed". | PENDING |

---

## 4. Simulated Payments (MockPay & COD)

| Test ID | Test Scenario | Steps | Expected Result | Status |
|---|---|---|---|---|
| **PAY-01** | MockPay Payment Flow | Order placed with MockPay -> navigate to `/orders/[id]/pay` | Pay page displays order breakdown; offers "Approve Payment" and "Cancel Payment" buttons. | PASS |
| **PAY-02** | MockPay Approval | Click "Approve Payment" | Database function `process_mockpay` updates `payment_status = 'paid'`, records payment in `payments` table. | PASS |
| **PAY-03** | MockPay Cancellation & Stock Restore | Click "Cancel Payment" | Payment cancelled; order status updated to `cancelled`; `restore_stock` automatically returns items to inventory. | PASS |
| **PAY-04** | Cash on Delivery (COD) | Place order with COD method | Order created with `payment_method = 'cod'` and `payment_status = 'pending'`. Payment flips to `paid` when seller marks completed. | PASS |
| **PAY-05** | Postman API Security Suite | Run `postman/pamilihub_mockpay.postman_collection.json` (8 test cases) | Validates 401 Unauthorized (missing header), 403 Forbidden (wrong role), 404 Not Found, 400 Bad Request, 200 OK, plus the non-MockPay and terminal-order guards. | PENDING |
| **PAY-06** | MockPay Rejects Non-MockPay Order | Send a COD order ID to `POST /api/mockpay` | Returns 400 `"This order was not placed via MockPay."`; no payment record created. | PASS |
| **PAY-07** | MockPay Rejects Terminal Order | Send a `rejected` or `cancelled` order ID to `POST /api/mockpay` | Returns 400 `"Order is already in a terminal state (cancelled)."`; no payment record created. | PASS |

---

## 5. Seller Store & Order Management

| Test ID | Test Scenario | Steps | Expected Result | Status |
|---|---|---|---|---|
| **SELLER-01**| Merchant Application | Customer submits store name, description, and location at `/apply` | Row created in `sellers` with `status = 'pending'`; user role remains `customer` until approved. | PASS |
| **SELLER-02**| Inventory Product Creation | Approved seller creates product with image upload at `/seller/products` | Image uploaded to seller-scoped Supabase Storage bucket; product row saved with seller ID. | PASS |
| **SELLER-03**| Master-Detail Orders Interface | Seller navigates to `/seller/orders` | Displays searchable list of incoming orders on left; full customer delivery and item breakdown on right. | PASS |
| **SELLER-04**| Order Lifecycle Progression | Seller clicks: Accept -> Preparing -> Delivering -> Completed | Order status transitions smoothly with optimistic UI update; customer sees updated status. | PASS |
| **SELLER-05**| Seller Order Rejection | Seller clicks "Reject Order" | Order status set to `rejected`; payment set to `refunded` (if paid); product stock restored to seller inventory. | PASS |
| **SELLER-06**| Seller Cannot Accept Unpaid MockPay Order | Open a pending MockPay order before the customer pays; try to accept it | Accept is hidden in the seller UI; backend `update_order_status` rejects `accepted` with "Customer has not paid for this MockPay order yet." | PASS |
| **SELLER-07**| Seller Can Accept COD Immediately | Open a pending COD order; click "Accept Order" | Order status becomes `accepted` without prior payment; payment stays `pending` until completed. | PASS |
| **SELLER-08**| Unpaid Order Rejection Restores Stock | Seller rejects an unpaid MockPay or COD order | Order status becomes `rejected`, payment status becomes `cancelled`, and product stock is restored. | PASS |

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

---

## 7. Payment-Gating Verification (2026-11-14)

The following cases were executed directly against the Supabase RPCs with the demo accounts (customer `ana@pamilihub.test`, seller `maria@pamilihub.test`) after migrations `016` and `017`:

- **SELLER-06** — seller accept on unpaid MockPay order returned: `Customer has not paid for this MockPay order yet.` Order stayed `pending/pending`.
- **SELLER-07** — COD order moved to `accepted` immediately with payment `pending`.
- **SELLER-08** — rejecting the unpaid COD order set `rejected`/`cancelled` and restored stock (19 to 20).
- **PAY-06** — COD order sent to MockPay returned: `This order was not placed via MockPay.`
- **PAY-07** — cancelled MockPay order returned: `Order is already in a terminal state (cancelled).`
- **Cancel path** — `cancel` returned HTTP 204, set `cancelled`/`cancelled`, and restored stock (16 to 17).
- **Approve path** — after MockPay approval the seller could accept the order (`paid`/`accepted`).
````

## File: src/app/(customer)/orders/[id]/pay/page.tsx
````typescript
import Link from "next/link";
import { getOrderById } from "@/modules/orders/queries";
import { getHeaderUser } from "@/lib/auth/header-user";
import PayButton from "./PayButton";

export default async function OrderPayPage({
  params,
}: {
  params: { id: string };
}) {
  const [user, order] = await Promise.all([
    getHeaderUser(),
    getOrderById(params.id),
  ]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h1 className="text-xl font-bold text-foreground">Sign in required</h1>
        <p className="text-xs text-muted-foreground">Please sign in to proceed with simulated payment.</p>
        <Link href="/login" className="inline-block px-5 py-2.5 rounded-lg bg-primary text-xs font-semibold text-primary-foreground shadow">
          Sign In
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h1 className="text-xl font-bold text-foreground">Order not found</h1>
        <p className="text-xs text-muted-foreground">We couldn&#39;t find this order for payment.</p>
        <Link href="/orders" className="inline-block px-5 py-2.5 rounded-lg bg-primary text-xs font-semibold text-primary-foreground shadow">
          Back to Orders
        </Link>
      </div>
    );
  }

  // Access control — only the customer who placed the order may submit payment
  const isOwner = order.customer_id === user.id;
  if (!isOwner) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h1 className="text-xl font-bold text-foreground">Not authorized</h1>
        <p className="text-xs text-muted-foreground">You don&#39;t have permission to pay for this order.</p>
        <Link href="/orders" className="inline-block px-5 py-2.5 rounded-lg bg-primary text-xs font-semibold text-primary-foreground shadow">
          Back to Orders
        </Link>
      </div>
    );
  }

  // Only MockPay pending orders can be paid here
  if (order.payment_method !== "mockpay") {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <div className="text-3xl">💵</div>
        <h1 className="text-lg font-bold text-foreground">Cash on Delivery Order</h1>
        <p className="text-xs text-muted-foreground">
          This order was placed under Cash on Delivery. Payment is made directly to the seller upon delivery.
        </p>
        <Link href={`/orders/${order.id}`} className="inline-block px-5 py-2.5 rounded-lg bg-primary text-xs font-semibold text-primary-foreground shadow">
          View Order Status
        </Link>
      </div>
    );
  }

  // Block payment if the order is already terminal (rejected/cancelled/completed)
  const terminalStatuses = ["rejected", "cancelled", "completed"];
  if (terminalStatuses.includes(order.order_status)) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <div className="text-3xl">🛑</div>
        <h1 className="text-lg font-bold text-foreground">Order Already Closed</h1>
        <p className="text-xs text-muted-foreground">
          This order is <strong className="capitalize">{order.order_status}</strong> and cannot be paid anymore.
        </p>
        <Link href={`/orders/${order.id}`} className="inline-block px-5 py-2.5 rounded-lg bg-primary text-xs font-semibold text-primary-foreground shadow">
          View Order Status
        </Link>
      </div>
    );
  }

  if (order.payment_status !== "pending") {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <div className="text-3xl">✓</div>
        <h1 className="text-lg font-bold text-foreground">Payment Already Recorded</h1>
        <p className="text-xs text-muted-foreground">
          The payment status for this order is currently <strong className="capitalize">{order.payment_status}</strong>.
        </p>
        <Link href={`/orders/${order.id}`} className="inline-block px-5 py-2.5 rounded-lg bg-primary text-xs font-semibold text-primary-foreground shadow">
          View Order Status
        </Link>
      </div>
    );
  }

  const items = order.order_items ?? [];
  const subtotal = items.reduce(
    (acc, i) => acc + Number(i.unit_price) * i.quantity,
    0
  );

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-blue-200 bg-blue-50 text-[11px] font-semibold text-blue-800 uppercase tracking-wider">
          <span>MockPay Simulator</span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
          Simulated Gateway
        </h1>
        <p className="text-xs text-muted-foreground">
          Academic demonstration • No actual monetary transactions occur
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
        <div className="pb-4 border-b border-border space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Order Reference:</span>
            <span className="font-bold text-foreground">#{order.id.slice(0, 8).toUpperCase()}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Local Merchant:</span>
            <span className="font-semibold text-foreground">{order.sellerStoreName}</span>
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between text-muted-foreground">
            <span>Delicacies Subtotal</span>
            <span>₱{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Flat Delivery Fee</span>
            <span>₱{Number(order.delivery_fee).toFixed(2)}</span>
          </div>
          <div className="pt-3 border-t border-border flex justify-between items-center text-sm">
            <span className="font-bold text-foreground">Simulated Amount</span>
            <span className="text-xl font-extrabold text-foreground">
              ₱{Number(order.total).toFixed(2)}
            </span>
          </div>
        </div>

        <PayButton orderId={order.id} amount={Number(order.total)} />
      </div>

      <div className="text-center">
        <Link
          href={`/orders/${order.id}`}
          className="text-xs text-muted-foreground hover:text-foreground hover:underline transition-colors"
        >
          ← Return to order details
        </Link>
      </div>
    </div>
  );
}
````

## File: src/app/(customer)/orders/[id]/page.tsx
````typescript
import Link from "next/link";
import { getOrderById } from "@/modules/orders/queries";
import { getHeaderUser } from "@/lib/auth/header-user";
import { getSellerStatus } from "@/modules/accounts/queries";
import { OrderStatusBadge, PaymentBadge } from "@/components/seller/orders/StatusBadge";
import type { OrderStatus, PaymentStatus, PaymentMethod } from "@/modules/orders/types";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("fil-PH", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(iso));
}

const TIMELINE_STEPS: OrderStatus[] = [
  "pending",
  "accepted",
  "preparing",
  "delivering",
  "completed",
];

const STEP_LABELS: Record<OrderStatus, string> = {
  pending: "Order Placed",
  accepted: "Accepted",
  preparing: "Preparing",
  delivering: "Out for Delivery",
  completed: "Delivered",
  rejected: "Rejected",
  cancelled: "Cancelled",
};

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [user, order] = await Promise.all([
    getHeaderUser(),
    getOrderById(params.id),
  ]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h1 className="text-xl font-bold text-foreground">Sign in required</h1>
        <p className="text-xs text-muted-foreground">Please sign in to view your order details.</p>
        <Link href="/login" className="inline-block px-5 py-2.5 rounded-lg bg-primary text-xs font-semibold text-primary-foreground shadow">
          Sign In
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h1 className="text-xl font-bold text-foreground">Order not found</h1>
        <p className="text-xs text-muted-foreground">We couldn&#39;t locate this order in our system.</p>
        <Link href="/orders" className="inline-block px-5 py-2.5 rounded-lg bg-primary text-xs font-semibold text-primary-foreground shadow">
          Back to Orders
        </Link>
      </div>
    );
  }

  // Access control: customer who placed order, seller who owns the store, or platform admin
  const isOwner = order.customer_id === user.id;
  let isStoreSeller = false;
  if (user.role === "seller") {
    const seller = await getSellerStatus();
    isStoreSeller = seller !== null && seller.id === order.seller_id;
  }

  if (!isOwner && user.role !== "admin" && !isStoreSeller) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h1 className="text-xl font-bold text-foreground">Not authorized</h1>
        <p className="text-xs text-muted-foreground">You don&#39;t have permission to view this order.</p>
        <Link href="/orders" className="inline-block px-5 py-2.5 rounded-lg bg-primary text-xs font-semibold text-primary-foreground shadow">
          Back to Orders
        </Link>
      </div>
    );
  }

  const items = order.order_items ?? [];
  const subtotal = items.reduce(
    (acc, i) => acc + Number(i.unit_price) * i.quantity,
    0
  );
  const canPay =
    order.payment_method === "mockpay" &&
    order.payment_status === "pending" &&
    order.order_status === "pending";
  const currentStatus = order.order_status as OrderStatus;
  const isTerminal = currentStatus === "rejected" || currentStatus === "cancelled";
  const currentIndex = TIMELINE_STEPS.indexOf(currentStatus);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/orders"
          className="text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
        >
          <span>← Back to My Orders</span>
        </Link>
        <div className="flex items-center gap-2">
          <OrderStatusBadge status={currentStatus} size="md" />
          <PaymentBadge
            status={order.payment_status as PaymentStatus}
            method={order.payment_method as PaymentMethod}
            size="md"
          />
        </div>
      </div>

      {/* Main Order Header */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
              Order #{order.id.slice(0, 8).toUpperCase()}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Placed on {formatDate(order.created_at)}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">Seller:</span>
            <span className="font-semibold text-foreground px-2.5 py-1 rounded-md bg-muted">
              🏪 {order.sellerStoreName || "Local Seller"}
            </span>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Order Status Progress
          </h2>
          {isTerminal ? (
            <div
              className={`p-3 rounded-xl border text-xs font-medium text-center ${
                currentStatus === "rejected"
                  ? "bg-red-50 text-red-800 border-red-200"
                  : "bg-gray-100 text-gray-700 border-gray-200"
              }`}
            >
              Order has been {currentStatus === "rejected" ? "rejected by the seller" : "cancelled"}. Any stock has been restored.
            </div>
          ) : (
            <div className="pt-2 pb-4">
              <div className="flex items-center justify-between relative">
                {TIMELINE_STEPS.map((step, idx) => {
                  const done = currentIndex > idx;
                  const active = currentIndex === idx;

                  return (
                    <div key={step} className="flex-1 flex flex-col items-center relative z-10">
                      <div
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs transition-colors ${
                          done
                            ? "bg-emerald-600 border-emerald-600 text-white"
                            : active
                            ? "bg-primary border-primary text-primary-foreground ring-4 ring-primary/20"
                            : "bg-card border-border text-muted-foreground"
                        }`}
                      >
                        {done ? "✓" : idx + 1}
                      </div>
                      <span
                        className={`text-[10px] sm:text-xs text-center mt-2 font-medium max-w-[70px] ${
                          active ? "text-foreground font-bold" : "text-muted-foreground"
                        }`}
                      >
                        {STEP_LABELS[step]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pay Now Banner (MockPay Pending) */}
      {canPay && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-blue-900">Payment Awaiting Confirmation</h3>
            <p className="text-xs text-blue-700">
              This order is currently pending simulated payment. Click below to approve or cancel in MockPay.
            </p>
          </div>
          <Link
            href={`/orders/${order.id}/pay`}
            className="px-6 py-2.5 rounded-lg bg-blue-600 text-xs font-bold text-white shadow hover:bg-blue-700 transition-all text-center shrink-0"
          >
            Launch MockPay (₱{Number(order.total).toFixed(2)})
          </Link>
        </div>
      )}

      {/* Items & Delivery Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Left (2 cols): Ordered Items */}
        <div className="md:col-span-2 rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
          <div className="p-5 border-b border-border bg-muted/20">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Ordered Delicacies ({items.length})
            </h2>
          </div>
          <div className="divide-y divide-border">
            {items.map((item) => (
              <div key={item.id} className="p-4 sm:p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {item.products?.image_url ? (
                    <img
                      src={item.products.image_url}
                      alt={item.products.name}
                      className="w-14 h-14 rounded-xl object-cover border border-border"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-muted/60 border border-border flex items-center justify-center text-lg">
                      🥧
                    </div>
                  )}
                  <div className="space-y-0.5">
                    <p className="font-semibold text-sm text-foreground">
                      {item.products?.name ?? "Delicacy"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Quantity: {item.quantity} × ₱{Number(item.unit_price).toFixed(2)}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-sm text-foreground">
                  ₱{(Number(item.unit_price) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="p-5 bg-muted/10 border-t border-border space-y-2 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Items Subtotal</span>
              <span>₱{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Flat Delivery Fee</span>
              <span>₱{Number(order.delivery_fee).toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-border flex justify-between text-sm font-bold text-foreground">
              <span>Total</span>
              <span className="text-base font-extrabold">₱{Number(order.total).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Right (1 col): Delivery Address & Customer Info */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground pb-2 border-b border-border">
            Delivery Information
          </h2>
          <div className="space-y-3 text-xs">
            <div>
              <span className="text-muted-foreground block text-[11px]">Recipient</span>
              <span className="font-semibold text-foreground text-sm">{order.delivery_name}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Contact Number</span>
              <a href={`tel:${order.delivery_phone}`} className="font-medium text-foreground hover:underline">
                📞 {order.delivery_phone}
              </a>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Delivery Address</span>
              <span className="font-medium text-foreground leading-relaxed block mt-0.5">
                📍 {order.delivery_address}
              </span>
            </div>
            <div className="pt-2 border-t border-border">
              <span className="text-muted-foreground block text-[11px]">Payment Method</span>
              <span className="font-semibold text-foreground uppercase tracking-wide">
                {order.payment_method === "mockpay" ? "MockPay (Simulated)" : "Cash on Delivery"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
````

## File: src/app/admin/categories/page.tsx
````typescript
"use client";

import { useState, useEffect } from "react";
import { getCategories } from "@/modules/catalog/queries";
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from "@/modules/catalog/actions";
import AdminNav from "@/components/admin/AdminNav";

type Category = {
  id: string;
  name: string;
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [createName, setCreateName] = useState("");

  async function loadCategories() {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  async function handleCreate(formData: FormData) {
    setMessage("");
    setError("");
    const result = await createCategoryAction(null, formData);
    if (result.success) {
      setMessage(result.message);
      setCreateName("");
      await loadCategories();
    } else {
      setError(result.message || "Failed to create category.");
    }
  }

  async function handleUpdate(formData: FormData) {
    setMessage("");
    setError("");
    const result = await updateCategoryAction(null, formData);
    if (result.success) {
      setMessage(result.message);
      setEditingId(null);
      setEditName("");
      await loadCategories();
    } else {
      setError(result.message || "Failed to update category.");
    }
  }

  async function handleDelete(formData: FormData) {
    setMessage("");
    setError("");
    const result = await deleteCategoryAction(null, formData);
    if (result.success) {
      setMessage(result.message);
      await loadCategories();
    } else {
      setError(result.message || "Failed to delete category.");
    }
  }

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditName(cat.name);
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-6">
        <div className="text-sm text-muted-foreground animate-pulse">Loading categories...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-1 border-b border-border pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-border bg-muted/40 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          <span>Administration</span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Food Categories</h1>
        <p className="text-xs text-muted-foreground">
          Manage product taxonomy (pies, pastries, kakanin, coffee, pasalubong)
        </p>
      </div>

      <AdminNav />

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-xs text-red-700">
          {error}
        </div>
      )}
      {message && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-800">
          {message}
        </div>
      )}

      {/* Create form card */}
      <form action={handleCreate} className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Add New Food Category
        </h2>
        <div className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            name="name"
            defaultValue={createName}
            required
            placeholder="e.g. Traditional Pies, Native Kakanin, Laguna Coffee"
            className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          />
          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-primary text-xs font-bold text-primary-foreground shadow hover:bg-primary/90 transition-all cursor-pointer"
          >
            Create Category
          </button>
        </div>
      </form>

      {/* Categories Table Card */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="p-5 border-b border-border bg-muted/20">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Current Food Categories ({categories.length})
          </h2>
        </div>

        {categories.length === 0 ? (
          <div className="p-12 text-center text-xs text-muted-foreground">
            No categories created yet.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/40 border-b border-border text-xs text-muted-foreground">
                <th className="text-left px-5 py-3 font-semibold">Category Name</th>
                <th className="text-right px-5 py-3 font-semibold w-40">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categories.map((cat) => {
                const isEditing = editingId === cat.id;
                return (
                  <tr key={cat.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-5 py-3">
                      {isEditing ? (
                        <form action={handleUpdate} className="flex gap-2">
                          <input type="hidden" name="id" value={cat.id} />
                          <input
                            type="text"
                            name="name"
                            defaultValue={editName}
                            required
                            className="flex-1 rounded-md border border-input bg-background px-2.5 py-1 text-xs"
                          />
                          <button
                            type="submit"
                            className="px-3 py-1 rounded-md bg-emerald-600 text-white text-xs font-bold shadow hover:bg-emerald-700"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingId(null);
                              setEditName("");
                            }}
                            className="px-3 py-1 rounded-md border border-border bg-background text-xs font-medium text-foreground hover:bg-muted"
                          >
                            Cancel
                          </button>
                        </form>
                      ) : (
                        <span className="font-semibold text-foreground text-sm">{cat.name}</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right space-x-2">
                      {!isEditing && (
                        <>
                          <button
                            onClick={() => startEdit(cat)}
                            className="px-2.5 py-1 rounded-md text-xs font-semibold text-primary hover:bg-primary/10 transition-colors"
                          >
                            Rename
                          </button>
                          <form action={handleDelete} className="inline">
                            <input type="hidden" name="id" value={cat.id} />
                            <button
                              type="submit"
                              className="px-2.5 py-1 rounded-md text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                              onClick={(e) => {
                                if (!confirm("Delete this category? Any associated products may be affected.")) {
                                  e.preventDefault();
                                }
                              }}
                            >
                              Delete
                            </button>
                          </form>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
````

## File: src/app/seller/products/page.tsx
````typescript
"use client";

import { useState, useEffect } from "react";
import { getSellerProducts, getCategories } from "@/modules/catalog/queries";
import {
  createProductAction,
  updateProductAction,
  deleteProductAction,
} from "@/modules/catalog/actions";

type Product = {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  sellers: {
    store_name: string | null;
  } | null;
};

export default function SellerProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  // Create form state
  const [newCat, setNewCat] = useState("");
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newStock, setNewStock] = useState("");

  // Edit form state
  const [editCat, setEditCat] = useState("");
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editStock, setEditStock] = useState("");

  async function loadProducts() {
    setLoading(true);
    try {
      const [productsData, categoriesData] = await Promise.all([
        getSellerProducts(),
        getCategories(),
      ]);
      setProducts(productsData ?? []);
      setCategories(categoriesData ?? []);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(formData: FormData) {
    setMessage("");
    setError("");
    const result = await createProductAction(null, formData);
    if (result.success) {
      setMessage(result.message);
      setAdding(false);
      setNewCat("");
      setNewName("");
      setNewDesc("");
      setNewPrice("");
      setNewStock("");
      await loadProducts();
    } else {
      setError(result.message || "Failed to add product.");
    }
  }

  async function handleUpdate(formData: FormData) {
    setMessage("");
    setError("");
    const result = await updateProductAction(null, formData);
    if (result.success) {
      setMessage(result.message);
      setEditingId(null);
      setRemoveImage(false);
      await loadProducts();
    } else {
      setError(result.message || "Failed to update product.");
    }
  }

  async function handleDelete(formData: FormData) {
    setMessage("");
    setError("");
    const result = await deleteProductAction(null, formData);
    if (result.success) {
      setMessage(result.message);
      await loadProducts();
    } else {
      setError(result.message || "Failed to delete product.");
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setEditCat(p.category_id);
    setEditName(p.name);
    setEditDesc(p.description ?? "");
    setEditPrice(String(p.price));
    setEditStock(String(p.stock));
    setRemoveImage(false);
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-6">
        <div className="text-sm text-muted-foreground animate-pulse">Loading merchant products...</div>
      </div>
    );
  }

  const inStockCount = products.filter((p) => p.stock > 0).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-border bg-muted/40 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            <span>Merchant Store</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Product Listings</h1>
          <p className="text-xs text-muted-foreground">
            Manage your local delicacies, prices, inventory stock, and photos
          </p>
        </div>

        <button
          type="button"
          onClick={() => setAdding(!adding)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all self-start sm:self-auto cursor-pointer"
        >
          <span>{adding ? "✕ Close Form" : "+ Add New Delicacy"}</span>
        </button>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <span className="text-xs text-muted-foreground">Total Listings</span>
          <p className="text-2xl font-extrabold text-foreground mt-1">{products.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <span className="text-xs text-emerald-700 font-medium">In Stock</span>
          <p className="text-2xl font-extrabold text-emerald-700 mt-1">{inStockCount}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <span className="text-xs text-red-600 font-medium">Out of Stock</span>
          <p className="text-2xl font-extrabold text-red-600 mt-1">{outOfStockCount}</p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-xs text-red-700">
          {error}
        </div>
      )}
      {message && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-800">
          {message}
        </div>
      )}

      {/* Add Product Collapsible Panel */}
      {adding && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4 animate-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h2 className="text-sm font-bold text-foreground">Add New Food Product</h2>
            <span className="text-xs text-muted-foreground">Will appear in public catalog immediately</span>
          </div>

          <form action={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category_id"
                  defaultValue={newCat}
                  required
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={newName}
                  required
                  placeholder="e.g. Special Buko Pie (Box of 8)"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  name="description"
                  defaultValue={newDesc}
                  rows={2}
                  placeholder="Ingredients, shelf-life, package size..."
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
                  Price (₱) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  defaultValue={newPrice}
                  required
                  min="0"
                  step="0.01"
                  placeholder="250.00"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
                  Stock Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="stock"
                  defaultValue={newStock}
                  required
                  min="0"
                  placeholder="20"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
                  Photo Upload
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  className="block w-full text-xs text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-primary text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-all cursor-pointer"
              >
                Save Delicacy Listing
              </button>
              <button
                type="button"
                onClick={() => setAdding(false)}
                className="px-4 py-2.5 rounded-lg border border-border bg-background text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table Card */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="p-5 border-b border-border bg-muted/20">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Current Inventory ({products.length})
          </h2>
        </div>

        {products.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <span className="text-3xl block">📦</span>
            <p className="text-sm font-semibold text-foreground">No delicacies listed yet</p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Click &quot;Add New Delicacy&quot; above to list your first buko pie, espasol, or local food item.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/40 border-b border-border text-xs text-muted-foreground">
                  <th className="text-left px-5 py-3 font-semibold w-20">Photo</th>
                  <th className="text-left px-5 py-3 font-semibold">Delicacy Name</th>
                  <th className="text-right px-5 py-3 font-semibold">Price</th>
                  <th className="text-right px-5 py-3 font-semibold">Stock</th>
                  <th className="text-right px-5 py-3 font-semibold w-32">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map((p) => {
                  const isEditing = editingId === p.id;

                  if (isEditing) {
                    return (
                      <tr key={p.id} className="bg-muted/20">
                        <td colSpan={5} className="p-5">
                          <form action={handleUpdate} className="space-y-4">
                            <input type="hidden" name="id" value={p.id} />
                            <div className="flex items-center justify-between pb-2 border-b border-border">
                              <span className="font-bold text-xs uppercase tracking-wider text-foreground">
                                Edit Delicacy #{p.id.slice(0, 8)}
                              </span>
                              <button
                                type="button"
                                onClick={() => setEditingId(null)}
                                className="text-xs text-muted-foreground hover:text-foreground"
                              >
                                ✕ Close
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                              <div>
                                <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1">
                                  Category
                                </label>
                                <select
                                  name="category_id"
                                  defaultValue={editCat}
                                  required
                                  className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-xs"
                                >
                                  {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                      {c.name}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div className="sm:col-span-2">
                                <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1">
                                  Name
                                </label>
                                <input
                                  name="name"
                                  defaultValue={editName}
                                  required
                                  className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-xs"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1">
                                  Price (₱)
                                </label>
                                <input
                                  name="price"
                                  defaultValue={editPrice}
                                  required
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-xs"
                                />
                              </div>

                              <div className="sm:col-span-3">
                                <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1">
                                  Description
                                </label>
                                <textarea
                                  name="description"
                                  defaultValue={editDesc}
                                  rows={2}
                                  className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-xs"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1">
                                  Stock
                                </label>
                                <input
                                  name="stock"
                                  defaultValue={editStock}
                                  required
                                  type="number"
                                  min="0"
                                  className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-xs"
                                />
                              </div>

                              <div className="sm:col-span-4 flex flex-wrap items-center gap-3 pt-2">
                                <input
                                  type="file"
                                  name="image"
                                  accept="image/*"
                                  className="text-xs"
                                />
                                <input
                                  type="hidden"
                                  name="remove_image"
                                  value={removeImage ? "true" : "false"}
                                />
                                <button
                                  type="button"
                                  onClick={() => setRemoveImage((prev) => !prev)}
                                  className="text-xs text-red-600 hover:underline"
                                >
                                  {removeImage ? "Keep existing photo" : "Remove photo"}
                                </button>
                                <div className="ml-auto flex gap-2">
                                  <button
                                    type="submit"
                                    className="px-4 py-1.5 rounded-lg bg-emerald-600 text-xs font-bold text-white shadow hover:bg-emerald-700"
                                  >
                                    Save Changes
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setEditingId(null)}
                                    className="px-3 py-1.5 rounded-lg border border-border bg-background text-xs font-medium text-foreground hover:bg-muted"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </div>
                          </form>
                        </td>
                      </tr>
                    );
                  }

                  const inStock = p.stock > 0;

                  return (
                    <tr key={p.id} className="hover:bg-muted/10 transition-colors">
                      <td className="px-5 py-3">
                        {p.image_url ? (
                          <img
                            src={p.image_url}
                            alt={p.name}
                            className="w-12 h-12 rounded-lg object-cover border border-border"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-muted/60 border border-border flex items-center justify-center text-sm">
                            🍲
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <p className="font-semibold text-foreground text-sm">{p.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {p.description || "No description provided."}
                        </p>
                      </td>
                      <td className="px-5 py-3 text-right font-bold text-foreground">
                        ₱{Number(p.price).toFixed(2)}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                            inStock
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {inStock ? `${p.stock} in stock` : "0 (Sold Out)"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right space-x-2">
                        <button
                          onClick={() => startEdit(p)}
                          className="px-2.5 py-1 rounded-md text-xs font-semibold text-primary hover:bg-primary/10 transition-colors"
                        >
                          Edit
                        </button>
                        <form action={handleDelete} className="inline">
                          <input type="hidden" name="id" value={p.id} />
                          <button
                            type="submit"
                            className="px-2.5 py-1 rounded-md text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                            onClick={(e) => {
                              if (!confirm("Are you sure you want to delete this listing?")) {
                                e.preventDefault();
                              }
                            }}
                          >
                            Delete
                          </button>
                        </form>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
````

## File: src/modules/orders/queries.ts
````typescript
"use server";

import { createClient } from "@/lib/supabase/server";
import type { OrderSummary, OrderDetail } from "./types";

// ─── Legacy types (kept for backward-compat with existing customer pages) ─────

export type OrderItem = {
  id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  products: {
    name: string;
    image_url: string | null;
  } | null;
};

export type OrderWithItems = {
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

// ─── Customer queries ─────────────────────────────────────────────────────────

/** List orders for the current customer (RLS: customer reads own). */
export async function getCustomerOrders(): Promise<OrderWithItems[] | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      id, customer_id, seller_id,
      sellers ( store_name ),
      delivery_name, delivery_phone,
      delivery_address, delivery_fee, total, payment_method,
      payment_status, order_status, created_at, updated_at,
      order_items ( id, product_id, quantity, unit_price,
        products ( name, image_url ) )
      `
    )
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return null;
  return (data ?? []).map((o: any) => ({
    ...o,
    sellerStoreName: o.sellers?.store_name ?? null,
  })) as unknown as OrderWithItems[];
}

/** Get a single order with items (RLS: customer reads own, seller reads own store,
 *  admin reads all). */
export async function getOrderById(
  orderId: string
): Promise<OrderWithItems | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      id, customer_id, seller_id,
      sellers ( store_name ),
      delivery_name, delivery_phone,
      delivery_address, delivery_fee, total, payment_method,
      payment_status, order_status, created_at, updated_at,
      order_items ( id, product_id, quantity, unit_price,
        products ( name, image_url ) )
      `
    )
    .eq("id", orderId)
    .single();

  if (error || !data) return null;
  const o = data as any;
  return {
    ...o,
    sellerStoreName: o.sellers?.store_name ?? null,
  } as unknown as OrderWithItems;
}

/** List orders for the current seller's store (RLS: seller reads own store).
 *  @deprecated Use getSellerOrdersListOnly for the new order management UI. */
export async function getSellerOrders(): Promise<OrderWithItems[] | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: seller } = await supabase
    .from("sellers")
    .select("id")
    .eq("profile_id", user.id)
    .single();
  if (!seller) return null;

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      id, customer_id, seller_id,
      sellers ( store_name ),
      delivery_name, delivery_phone,
      delivery_address, delivery_fee, total, payment_method,
      payment_status, order_status, created_at, updated_at,
      order_items ( id, product_id, quantity, unit_price,
        products ( name, image_url ) )
      `
    )
    .eq("seller_id", seller.id)
    .order("created_at", { ascending: false });

  if (error) return null;
  return (data ?? []).map((o: any) => ({
    ...o,
    sellerStoreName: o.sellers?.store_name ?? null,
  })) as unknown as OrderWithItems[];
}

// ─── Seller order management UI ───────────────────────────────────────────────

/**
 * Returns a lightweight list of orders for the current seller's store.
 * Does NOT include order_items so the list loads fast.
 * Each row includes a generated item_preview and item_count
 * built from a small sub-select of order_items + products.
 */
export async function getSellerOrdersListOnly(): Promise<OrderSummary[] | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: seller } = await supabase
    .from("sellers")
    .select("id")
    .eq("profile_id", user.id)
    .single();
  if (!seller) return null;

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      id, customer_id, seller_id,
      delivery_name, delivery_phone, delivery_address,
      delivery_fee, total, payment_method,
      payment_status, order_status, created_at, updated_at,
      order_items (
        id,
        quantity,
        products ( name )
      )
      `
    )
    .eq("seller_id", seller.id)
    .order("created_at", { ascending: false });

  if (error) return null;

  return (data ?? []).map((o: any) => {
    const items: Array<{ quantity: number; products: { name: string } | null }> =
      o.order_items ?? [];
    const item_count = items.reduce(
      (acc: number, i: { quantity: number }) => acc + i.quantity,
      0
    );
    const names = items
      .map((i) => i.products?.name)
      .filter(Boolean)
      .slice(0, 3)
      .join(", ");
    const item_preview =
      item_count > 0
        ? `${item_count} item${item_count !== 1 ? "s" : ""}: ${names}${
            items.length > 3 ? ", …" : ""
          }`
        : "";

    return {
      id: o.id,
      customer_id: o.customer_id,
      seller_id: o.seller_id,
      delivery_name: o.delivery_name,
      delivery_phone: o.delivery_phone,
      delivery_address: o.delivery_address,
      delivery_fee: Number(o.delivery_fee),
      total: Number(o.total),
      payment_method: o.payment_method,
      payment_status: o.payment_status,
      order_status: o.order_status,
      created_at: o.created_at,
      updated_at: o.updated_at,
      item_preview,
      item_count,
    } as OrderSummary;
  });
}

/**
 * Fetches full order detail (with order_items + product names) for a single order.
 * Called lazily when the seller clicks a row.
 * RLS ensures the seller can only read their own store's orders.
 */
export async function getSellerOrderById(
  orderId: string
): Promise<OrderDetail | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      id, customer_id, seller_id,
      delivery_name, delivery_phone, delivery_address,
      delivery_fee, total, payment_method,
      payment_status, order_status, created_at, updated_at,
      order_items (
        id, product_id, quantity, unit_price,
        products ( name, image_url )
      )
      `
    )
    .eq("id", orderId)
    .single();

  if (error || !data) return null;

  const o = data as any;
  return {
    id: o.id,
    customer_id: o.customer_id,
    seller_id: o.seller_id,
    delivery_name: o.delivery_name,
    delivery_phone: o.delivery_phone,
    delivery_address: o.delivery_address,
    delivery_fee: Number(o.delivery_fee),
    total: Number(o.total),
    payment_method: o.payment_method,
    payment_status: o.payment_status,
    order_status: o.order_status,
    created_at: o.created_at,
    updated_at: o.updated_at,
    order_items: (o.order_items ?? []).map((i: any) => ({
      id: i.id,
      product_id: i.product_id,
      quantity: i.quantity,
      unit_price: Number(i.unit_price),
      products: i.products ?? null,
    })),
  } as OrderDetail;
}
````

## File: src/app/(customer)/profile/page.tsx
````typescript
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateProfileAction, signoutAction } from "@/modules/accounts/actions";
import { getSellerStatus } from "@/modules/accounts/queries";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<{
    id: string;
    role: string;
    full_name: string | null;
    phone: string | null;
    address: string | null;
  } | null>(null);
  const [sellerStatus, setSellerStatus] = useState<{
    id: string;
    store_name: string | null;
    status: string | null;
  } | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    address: "",
  });

  const loadProfile = useCallback(async () => {
    const res = await fetch("/api/me");
    if (res.status === 401) {
      router.push("/login");
      setLoaded(true);
      return;
    }
    if (!res.ok) {
      setLoaded(true);
      return;
    }
    const data = await res.json();
    setProfile(data);
    setFormData({
      full_name: data.full_name || "",
      phone: data.phone || "",
      address: data.address || "",
    });

    try {
      const seller = await getSellerStatus();
      setSellerStatus(seller);
    } catch {
      setSellerStatus(null);
    }

    setLoaded(true);
  }, [router]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    setMessage("");
    setError("");

    const result = await updateProfileAction(null, formData);

    if (result.success) {
      setMessage(result.message);
      await loadProfile();
    } else {
      setError(result.message || "Failed to update profile.");
    }

    setSaving(false);
  }

  if (!loaded) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-6">
        <div className="text-sm text-muted-foreground animate-pulse">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h1 className="text-lg font-bold text-foreground">Sign In Required</h1>
        <p className="text-xs text-muted-foreground">Please sign in to access your profile settings.</p>
        <Link href="/login" className="inline-block px-5 py-2.5 rounded-2xl bg-primary text-xs font-bold text-primary-foreground shadow">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-5">
      {/* User Card Header (Food app account header) */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="h-14 w-14 rounded-2xl bg-primary text-primary-foreground font-black flex items-center justify-center text-xl shadow-md shadow-primary/20 uppercase shrink-0">
            {profile.full_name ? profile.full_name[0] : profile.role[0]}
          </div>
          <div className="space-y-0.5 min-w-0">
            <h1 className="font-extrabold text-foreground text-base sm:text-lg truncate">
              {formData.full_name || "Pamilihub User"}
            </h1>
            <p className="text-xs text-muted-foreground truncate">
              {profile.id.slice(0, 16)}...
            </p>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-primary/10 text-primary">
              {profile.role} account
            </span>
          </div>
        </div>

        <form action={signoutAction}>
          <button
            type="submit"
            className="px-3 py-1.5 rounded-xl border border-border text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
          >
            Sign out
          </button>
        </form>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-xs text-red-700">
          {error}
        </div>
      )}

      {message && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-800">
          {message}
        </div>
      )}

      {/* Quick Nav Links for mobile user (Foodpanda style account navigation) */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm divide-y divide-border">
        <Link
          href="/orders"
          className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">📦</span>
            <div>
              <p className="font-bold text-xs sm:text-sm text-foreground">My Orders</p>
              <p className="text-[11px] text-muted-foreground">View status of active & past food orders</p>
            </div>
          </div>
          <span className="text-muted-foreground text-xs">→</span>
        </Link>

        <Link
          href="/cart"
          className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">🛍️</span>
            <div>
              <p className="font-bold text-xs sm:text-sm text-foreground">Shopping Basket</p>
              <p className="text-[11px] text-muted-foreground">Manage delicacies chosen for checkout</p>
            </div>
          </div>
          <span className="text-muted-foreground text-xs">→</span>
        </Link>
      </div>

      {/* Profile Form Card */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-border">
          <span className="text-base">👤</span>
          <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">
            Contact & Delivery Details
          </h2>
        </div>

        <form action={handleSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Full Name
            </label>
            <input
              type="text"
              name="full_name"
              defaultValue={formData.full_name}
              required
              className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-xs sm:text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Contact Phone
              </label>
              <input
                type="tel"
                name="phone"
                defaultValue={formData.phone}
                className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-xs sm:text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="0912 345 6789"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                San Pablo Delivery Address
              </label>
              <input
                type="text"
                name="address"
                defaultValue={formData.address}
                className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-xs sm:text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Brgy. San Rafael, San Pablo City"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-primary text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-60 transition-all cursor-pointer active:scale-95"
          >
            {saving ? "Saving Changes..." : "Save Details"}
          </button>
        </form>
      </div>

      {/* Seller Application Card */}
      {profile.role !== "admin" && (
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-3.5">
          <div className="flex items-center gap-2 pb-2 border-b border-border">
            <span className="text-base">🏪</span>
            <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Food Merchant Portal
            </h2>
          </div>

          {sellerStatus ? (
            sellerStatus.status === "pending" ? (
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-foreground">{sellerStatus.store_name}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    Application Under Review
                  </span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Your merchant store application is being reviewed by the platform administrator.
                </p>
              </div>
            ) : sellerStatus.status === "approved" ? (
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-foreground">{sellerStatus.store_name}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Verified Seller
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Link
                    href="/seller/products"
                    className="px-4 py-2 rounded-xl bg-primary text-xs font-bold text-primary-foreground shadow hover:bg-primary/90 transition-all"
                  >
                    Inventory
                  </Link>
                  <Link
                    href="/seller/orders"
                    className="px-4 py-2 rounded-xl border border-border bg-background text-xs font-bold text-foreground hover:bg-muted transition-colors"
                  >
                    Manage Orders
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                <p className="text-muted-foreground">Previous application was rejected.</p>
                <Link
                  href="/apply"
                  className="inline-block px-4 py-2 rounded-xl bg-primary text-xs font-bold text-primary-foreground shadow"
                >
                  Reapply Now
                </Link>
              </div>
            )
          ) : (
            <div className="space-y-2.5 text-xs">
              <p className="text-muted-foreground leading-relaxed">
                Are you a local producer of buko pie, espasol, kakanin, or Laguna coffee? Join as a verified merchant.
              </p>
              <Link
                href="/apply"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-xs font-bold text-primary-foreground shadow hover:bg-primary/90 transition-all active:scale-95"
              >
                <span>Become a Food Seller</span>
                <span>→</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
````

## File: src/app/products/page.tsx
````typescript
import { getCategories, getProducts } from "@/modules/catalog/queries";
import Link from "next/link";
import { AddToCartButton } from "@/components/ui/add-to-cart-button";
import { getHeaderUser } from "@/lib/auth/header-user";
import { Search } from "lucide-react";

const CATEGORY_ICONS: Record<string, string> = {
  "pies": "🥧",
  "pastries": "🥐",
  "kakanin": "🥥",
  "coffee": "☕",
  "snacks": "🍪",
  "delicacies": "🍡",
  "sweets": "🍬",
};

function getCategoryIcon(name: string) {
  const lower = name.toLowerCase();
  for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
    if (lower.includes(key)) return icon;
  }
  return "🍲";
}

export default async function CatalogPage({
  searchParams,
}: Readonly<{
  searchParams: { [key: string]: string | string[] | undefined };
}>) {
  const categoryId = typeof searchParams.category === "string" ? searchParams.category : undefined;
  const search = typeof searchParams.search === "string" ? searchParams.search : undefined;

  const [categories, products, user] = await Promise.all([
    getCategories(),
    getProducts({ categoryId, search }),
    getHeaderUser(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-5">
      {/* Search Input Bar (Food Delivery Search Header) */}
      <div className="relative">
        <form method="GET" className="relative flex items-center">
          <input
            name="search"
            defaultValue={search ?? ""}
            placeholder="Search buko pie, espasol, kakanin, coffee..."
            className="w-full rounded-2xl border border-border bg-card pl-11 pr-24 py-3 sm:py-3.5 text-xs sm:text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
          {categoryId && (
            <input type="hidden" name="category" value={categoryId} />
          )}
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
          <button
            type="submit"
            className="absolute right-2 px-3.5 py-1.5 rounded-xl bg-primary text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all active:scale-95"
          >
            Search
          </button>
        </form>
      </div>

      {/* Horizontal Swipeable Category Carousel (Foodpanda style) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-muted-foreground">
            Categories
          </h2>
          {categoryId && (
            <Link
              href={search ? `/products?search=${encodeURIComponent(search)}` : "/products"}
              className="text-xs font-bold text-primary hover:underline"
            >
              Reset Category
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-1 -mx-2 sm:mx-0">
          <Link
            href={search ? `/products?search=${encodeURIComponent(search)}` : "/products"}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border text-xs font-bold whitespace-nowrap shrink-0 transition-all active:scale-95 shadow-sm ${
              !categoryId
                ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                : "border-border bg-card text-foreground hover:bg-muted"
            }`}
          >
            <span>🍽️</span>
            <span>All Delicacies</span>
          </Link>

          {categories?.map((c) => {
            const isActive = categoryId === c.id;
            const icon = getCategoryIcon(c.name);

            return (
              <Link
                key={c.id}
                href={`/products?category=${c.id}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border text-xs font-bold whitespace-nowrap shrink-0 transition-all active:scale-95 shadow-sm ${
                  isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                    : "border-border bg-card text-foreground hover:bg-muted"
                }`}
              >
                <span>{icon}</span>
                <span>{c.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Products Count & Status Bar */}
      <div className="flex items-center justify-between px-1 text-xs text-muted-foreground border-b border-border pb-3">
        <span>
          Showing <strong className="text-foreground">{products?.length ?? 0}</strong> local delicacy items
        </span>
        <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          ● Verified San Pablo Sellers
        </span>
      </div>

      {/* Responsive Food Card Grid: 2 columns on mobile, 3 on tablet, 4 on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
        {(products ?? []).map((product) => {
          const inStock = product.stock > 0;

          return (
            <div
              key={product.id}
              className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md hover:border-primary/40 transition-all flex flex-col justify-between group active:scale-[0.99]"
            >
              <Link href={`/products/${product.id}`} className="block relative overflow-hidden bg-muted/30">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-32 sm:h-44 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-32 sm:h-44 w-full flex flex-col items-center justify-center gap-1 text-muted-foreground">
                    <span className="text-3xl sm:text-4xl">🥧</span>
                    <span className="text-[10px]">No image</span>
                  </div>
                )}

                {/* Stock Tag on image */}
                <div className="absolute top-2 right-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] sm:text-[10px] font-extrabold shadow-sm backdrop-blur-md ${
                      inStock
                        ? "bg-emerald-600/90 text-white"
                        : "bg-red-600/90 text-white"
                    }`}
                  >
                    {inStock ? `${product.stock} left` : "Out of stock"}
                  </span>
                </div>
              </Link>

              {/* Card Body */}
              <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2.5">
                <div className="space-y-1">
                  <span className="text-[10px] sm:text-[11px] font-bold text-primary block truncate">
                    🏪 {product.sellers?.store_name ?? "San Pablo Seller"}
                  </span>

                  <Link href={`/products/${product.id}`} className="block">
                    <h3 className="font-extrabold text-foreground text-xs sm:text-sm group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                      {product.name}
                    </h3>
                  </Link>

                  <p className="text-[11px] text-muted-foreground line-clamp-1 hidden sm:block">
                    {product.description || "Freshly made local food."}
                  </p>
                </div>

                {/* Price and Add button */}
                <div className="pt-1.5 border-t border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="leading-tight">
                    <span className="text-sm sm:text-base font-black text-foreground">
                      ₱{Number(product.price).toFixed(2)}
                    </span>
                  </div>

                  <AddToCartButton
                    productId={product.id}
                    name={product.name}
                    price={Number(product.price)}
                    stock={product.stock}
                    sellerId={product.seller_id}
                    sellerName={product.sellers?.store_name ?? "Local Seller"}
                    imageUrl={product.image_url}
                    size="sm"
                    userRole={user?.role}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {(products ?? []).length === 0 && (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center space-y-3 max-w-sm mx-auto">
          <div className="w-12 h-12 mx-auto rounded-full bg-muted flex items-center justify-center text-2xl">
            🔍
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-foreground text-sm">No Delicacies Found</h3>
            <p className="text-xs text-muted-foreground">
              Try searching with another food keyword or clear your filters.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-block px-4 py-2 rounded-xl bg-primary text-xs font-bold text-primary-foreground shadow hover:bg-primary/90"
          >
            Clear Filter
          </Link>
        </div>
      )}
    </div>
  );
}
````

## File: src/modules/orders/actions.ts
````typescript
"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/roles";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { checkoutSchema, type CheckoutInput, cartItemSchema } from "./schemas";
import { orderStatusUpdateSchema, type OrderStatusUpdateInput } from "./schemas";

type ActionState = {
  success: boolean;
  message: string;
  orderIds?: string[];
  errors?: Record<string, string[]>;
};

/** Checkout: validate cart, create one order per seller, deduct stock — all
 *  inside a single database transaction via the checkout_cart RPC.
 *
 *  The RPC (SECURITY DEFINER) validates stock cumulatively, locks product rows,
 *  requires approved sellers, creates one order per seller with correct totals,
 *  and deducts stock atomically. The client never sets prices, totals, or
 *  payment_status.
 */
export async function checkoutAction(
  _prev: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const supabase = createClient();
  const user = await getCurrentUser(supabase);
  if (!user) {
    return { success: false, message: "Not authenticated." };
  }
  if (user.role !== "customer") {
    return { success: false, message: "Only customers can place orders." };
  }

  // Parse and validate delivery info + payment method
  const parsed = checkoutSchema.safeParse({
    deliveryName: formData.get("delivery_name"),
    deliveryPhone: formData.get("delivery_phone"),
    deliveryAddress: formData.get("delivery_address"),
    paymentMethod: formData.get("payment_method"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  // Cart payload sent as JSON in a hidden form field
  const cartJson = formData.get("cart") as string | null;
  if (!cartJson) {
    return { success: false, message: "Cart is empty." };
  }

  let cartItemsRaw: unknown;
  try {
    cartItemsRaw = JSON.parse(cartJson);
  } catch {
    return { success: false, message: "Invalid cart data." };
  }

  const cartItemsParsed = z.array(cartItemSchema).safeParse(cartItemsRaw);
  if (!cartItemsParsed.success) {
    return {
      success: false,
      message: "Invalid cart items.",
      errors: cartItemsParsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }
  const cartItems: Array<{ productId: string; quantity: number }> =
    cartItemsParsed.data;

  if (cartItems.length === 0) {
    return { success: false, message: "Cart is empty." };
  }

  // Build items payload for checkout_cart RPC
  const p_items = cartItems.map((i) => ({
    product_id: i.productId,
    quantity: i.quantity,
  }));

  const p_delivery_info = {
    name: parsed.data.deliveryName,
    phone: parsed.data.deliveryPhone,
    address: parsed.data.deliveryAddress,
  };

  // Call checkout_cart RPC: validates stock, creates one order per seller,
  // deducts stock — all in a single database transaction.
  const { data: rpcData, error: rpcError } = await supabase.rpc(
    "checkout_cart",
    {
      p_items,
      p_delivery_info,
      p_payment_method: parsed.data.paymentMethod,
    }
  );

  if (rpcError) {
    console.error("checkout: checkout_cart failed:", rpcError);
    const msg = rpcError.message;
    return {
      success: false,
      message: msg.includes("Insufficient stock")
        ? msg
        : msg.includes("Product not found")
          ? msg
          : msg.includes("not available for ordering")
            ? msg
            : msg.includes("Cart is empty")
              ? msg
              : msg.includes("Missing delivery information")
                ? msg
                : msg.includes("Only customers can checkout")
                  ? msg
                  : msg.includes("Invalid payment method")
                    ? msg
                    : msg.includes("Invalid quantity")
                      ? msg
                      : "Checkout failed. Please try again.",
    };
  }

  const orderIds: string[] = Array.isArray(rpcData) ? (rpcData as string[]) : [];

  return {
    success: true,
    message: "Order(s) placed successfully.",
    orderIds,
  };
}

/** Seller/admin: update an order's status (accept, reject, prepare, deliver, complete, cancel). */
export async function updateOrderStatusAction(
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const supabase = createClient();
  const user = await getCurrentUser(supabase);
  if (!user) {
    return { success: false, message: "Not authenticated." };
  }
  if (user.role !== "seller" && user.role !== "admin") {
    return { success: false, message: "Only sellers or admins can update order status." };
  }

  const parsed = orderStatusUpdateSchema.safeParse({
    order_id: formData.get("order_id"),
    new_status: formData.get("new_status"),
  });

  if (!parsed.success) {
    return { success: false, message: "Validation failed." };
  }

  const { order_id, new_status } = parsed.data;

  const { error } = await supabase.rpc("update_order_status", {
    p_order_id: order_id,
    p_new_status: new_status,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/seller/orders");
  revalidatePath("/orders");

  return {
    success: true,
    message: `Order status updated to ${new_status}.`,
  };
}
````

## File: src/modules/orders/schemas.ts
````typescript
import { z } from "zod";

/** Checkout request validation. Delivery info + payment method come from the
 *  checkout form; the server recomputes totals and never trusts client prices. */
export const checkoutSchema = z.object({
  deliveryName: z.string().trim().min(1, "Delivery name is required"),
  deliveryPhone: z
    .string()
    .trim()
    .min(1, "Delivery phone is required")
    .max(20, "Phone number is too long")
    .regex(/^[\d\s+\-()]+$/, "Enter a valid phone number"),
  deliveryAddress: z.string().trim().min(1, "Delivery address is required"),
  paymentMethod: z.enum(["mockpay", "cod"]),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

/** Single cart item sent from the client during checkout. */
export const cartItemSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .positive("Quantity must be greater than 0"),
});

export type CartItemInput = z.infer<typeof cartItemSchema>;

/** MockPay payment request validation. */
export const mockpaySchema = z.object({
  order_id: z.string().uuid("Invalid order ID"),
  amount: z.number().positive("Amount must be positive"),
  result: z.enum(["approve", "cancel"]),
});

export type MockPayInput = z.infer<typeof mockpaySchema>;

/** Order status update request validation (seller/admin actions). */
export const orderStatusUpdateSchema = z.object({
  order_id: z.string().uuid("Invalid order ID"),
  new_status: z.enum([
    "accepted",
    "rejected",
    "preparing",
    "delivering",
    "completed",
    "cancelled",
  ]),
});

export type OrderStatusUpdateInput = z.infer<typeof orderStatusUpdateSchema>;
````

## File: src/app/dashboard/page.tsx
````typescript
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/roles";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h1 className="text-xl font-bold text-foreground">Sign In Required</h1>
        <p className="text-xs text-muted-foreground">
          Please sign in to access your personal role dashboard.
        </p>
        <Link
          href="/login"
          className="inline-block px-5 py-2.5 rounded-lg bg-primary text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const roleWorkspaces: Record<
    string,
    Array<{ href: string; label: string; desc: string; icon: string }>
  > = {
    customer: [
      { href: "/products", label: "Catalog & Delicacies", desc: "Discover freshly prepared buko pie, espasol, and pasalubong", icon: "🥧" },
      { href: "/orders", label: "My Orders & Delivery", desc: "Track live status and review purchases", icon: "📦" },
      { href: "/cart", label: "Shopping Cart", desc: "Review chosen food items and proceed to checkout", icon: "🛍️" },
      { href: "/profile", label: "Profile & Address", desc: "Manage contact numbers and delivery addresses", icon: "👤" },
    ],
    seller: [
      { href: "/seller/orders", label: "Incoming Orders", desc: "Review customer orders, accept, and mark dispatched", icon: "📋" },
      { href: "/seller/products", label: "Inventory & Products", desc: "Add new local food listings, adjust pricing and stock", icon: "🏪" },
      { href: "/profile", label: "Store Account", desc: "Manage seller profile and store contact information", icon: "⚙️" },
    ],
    admin: [
      { href: "/admin/dashboard", label: "Executive Dashboard", desc: "Platform metrics, order pipeline, and gross sales oversight", icon: "📊" },
      { href: "/admin/orders", label: "Orders & Payments", desc: "Monitor live deliveries, transactions, and fulfillment states", icon: "📦" },
      { href: "/admin/products", label: "Catalog Moderation", desc: "Moderate food listings across all San Pablo merchants", icon: "🥧" },
      { href: "/admin/sellers", label: "Merchant Approvals", desc: "Review and approve incoming local food merchant applications", icon: "🛡️" },
      { href: "/admin/categories", label: "Product Taxonomy", desc: "Manage platform delicacy categories", icon: "📂" },
      { href: "/admin/users", label: "User Directory", desc: "Inspect registered customers, sellers, and system administrators", icon: "👥" },
    ],
  };

  const workspaces = roleWorkspaces[user.role] || roleWorkspaces.customer;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner */}
      <div className="rounded-2xl border border-border bg-gradient-to-br from-card via-card to-muted/30 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-border bg-background text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            <span>Dashboard</span>
            <span>•</span>
            <span className="font-bold text-foreground capitalize">{user.role}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Workspace Hub
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Manage your Pamilihub local commerce operations
          </p>
        </div>

        <Link
          href="/profile"
          className="px-4 py-2 rounded-lg border border-border bg-background text-xs font-semibold text-foreground hover:bg-muted transition-colors self-start sm:self-auto"
        >
          Account Settings
        </Link>
      </div>

      {/* Grid of Workspaces */}
      <div className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Available Workspaces
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {workspaces.map((ws) => (
            <Link
              key={ws.href}
              href={ws.href}
              className="p-5 rounded-2xl border border-border bg-card hover:bg-muted/30 hover:border-primary/40 hover:shadow-md transition-all group flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-muted/60 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                {ws.icon}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                    {ws.label}
                  </h3>
                  <span className="text-muted-foreground group-hover:translate-x-1 group-hover:text-primary transition-all text-xs">
                    →
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {ws.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
````

## File: src/app/products/[id]/page.tsx
````typescript
import Link from "next/link";
import { getProductDetail } from "@/modules/catalog/queries";
import { AddToCartButton } from "@/components/ui/add-to-cart-button";
import { getHeaderUser } from "@/lib/auth/header-user";

export default async function ProductDetailPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;
  const [product, user] = await Promise.all([
    getProductDetail(id),
    getHeaderUser(),
  ]);

  if (!product) {
    return (
      <div className="max-w-md mx-auto p-12 text-center space-y-4">
        <div className="text-4xl">🥧</div>
        <h1 className="text-lg font-bold text-foreground">Delicacy not found</h1>
        <p className="text-xs text-muted-foreground">
          The product you&#39;re looking for does not exist or may have been unlisted by the merchant.
        </p>
        <Link
          href="/products"
          className="inline-block px-5 py-2.5 rounded-xl bg-primary text-xs font-bold text-primary-foreground shadow hover:bg-primary/90"
        >
          Browse Catalog
        </Link>
      </div>
    );
  }

  const inStock = product.stock > 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-6">
      {/* Top Mobile Bar with Back link */}
      <div className="flex items-center justify-between">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card text-xs font-bold text-foreground hover:bg-muted transition-colors active:scale-95"
        >
          <span>← Back</span>
        </Link>
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          San Pablo Delicacy
        </span>
      </div>

      {/* Main Product Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start">
        {/* Left: Product Image */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm relative">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full aspect-square sm:aspect-4/3 object-cover"
            />
          ) : (
            <div className="w-full aspect-square sm:aspect-4/3 bg-muted/40 flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <span className="text-6xl">🥥</span>
              <span className="text-xs">No image provided</span>
            </div>
          )}

          {/* Stock tag */}
          <div className="absolute top-3 right-3">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-black shadow-sm backdrop-blur-md ${
                inStock
                  ? "bg-emerald-600/90 text-white"
                  : "bg-red-600/90 text-white"
              }`}
            >
              {inStock ? `${product.stock} In Stock` : "Sold Out"}
            </span>
          </div>
        </div>

        {/* Right: Info and Action */}
        <div className="space-y-5">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground leading-tight">
              {product.name}
            </h1>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-foreground">
                ₱{Number(product.price).toFixed(2)}
              </span>
              <span className="text-xs text-muted-foreground">+ ₱50 delivery</span>
            </div>
          </div>

          {/* Merchant Card */}
          <div className="p-4 rounded-2xl border border-border bg-card flex items-center gap-3.5 shadow-sm">
            <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary font-bold flex items-center justify-center text-lg shrink-0">
              🏪
            </div>
            <div className="space-y-0.5 text-xs flex-1 min-w-0">
              <span className="text-[10px] uppercase font-bold text-primary block tracking-wider">
                Local Food Merchant
              </span>
              <p className="font-extrabold text-foreground text-sm truncate">
                {product.sellers?.store_name ?? "San Pablo Merchant"}
              </p>
              {product.sellers?.location && (
                <p className="text-muted-foreground truncate">
                  📍 {product.sellers.location}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card space-y-2 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Description & Highlights
            </h2>
            <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
              {product.description || "Authentic freshly prepared local delicacy from San Pablo City."}
            </p>
          </div>

          {/* Action button */}
          <div className="space-y-2 pt-2">
            {user?.role === "customer" ? (
              <>
                <AddToCartButton
                  productId={product.id}
                  name={product.name}
                  price={Number(product.price)}
                  stock={product.stock}
                  sellerId={product.seller_id}
                  sellerName={product.sellers?.store_name ?? "Local Seller"}
                  imageUrl={product.image_url}
                  size="md"
                  userRole={user?.role}
                />
                <p className="text-[11px] text-muted-foreground text-center">
                  Flat ₱50 delivery fee applied per local merchant
                </p>
              </>
            ) : !user ? (
              <Link
                href="/login"
                className="w-full py-2.5 rounded-xl bg-primary text-xs font-bold text-primary-foreground shadow hover:bg-primary/90 flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all text-center"
              >
                Sign in to Order
              </Link>
            ) : user?.role === "seller" ? (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs flex items-center gap-2 font-medium">
                <span>🏪</span>
                <span>Signed in as Food Merchant — shopping cart is reserved for customers.</span>
              </div>
            ) : user?.role === "admin" ? (
              <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-400 text-xs flex items-center gap-2 font-medium">
                <span>🛡️</span>
                <span>Signed in as Administrator — catalog inspection mode.</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
````

## File: src/components/ui/add-to-cart-button.tsx
````typescript
"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart/cart-context";
import { Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

type AddToCartButtonProps = {
  productId: string;
  name: string;
  price: number;
  stock: number;
  sellerId: string;
  sellerName: string;
  imageUrl: string | null;
  size?: "sm" | "md";
  /** Current user role — only customer can see and use. */
  userRole?: string | null;
};

export function AddToCartButton({
  productId,
  name,
  price,
  stock,
  sellerId,
  sellerName,
  imageUrl,
  size = "md",
  userRole,
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  // Only authenticated customers can see and use the Add to Cart button
  if (userRole !== "customer") {
    return null;
  }

  if (stock === 0) {
    return (
      <Button
        disabled
        variant="outline"
        size={size === "sm" ? "sm" : "default"}
        className="w-full text-xs font-semibold text-muted-foreground cursor-not-allowed bg-muted/60"
      >
        Out of Stock
      </Button>
    );
  }

  return (
    <Button
      type="button"
      size={size === "sm" ? "sm" : "default"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        addItem({ productId, name, price, stock, sellerId, sellerName, imageUrl });
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
      }}
      className={`w-full transition-all flex items-center justify-center gap-1.5 ${
        added
          ? "bg-emerald-600 hover:bg-emerald-700 text-white"
          : "bg-primary text-primary-foreground hover:bg-primary/90"
      }`}
    >
      {added ? (
        <>
          <Check className="w-4 h-4 shrink-0" strokeWidth={2.5} />
          <span>Added to Cart!</span>
        </>
      ) : (
        <>
          <Plus className="w-3.5 h-3.5 shrink-0" strokeWidth={2.5} />
          <span>Add to Cart</span>
        </>
      )}
    </Button>
  );
}
````

## File: src/app/page.tsx
````typescript
import Link from "next/link";
import { getHeaderUser } from "@/lib/auth/header-user";
import { getCategories, getProducts } from "@/modules/catalog/queries";
import { AddToCartButton } from "@/components/ui/add-to-cart-button";

const CATEGORY_META: Record<string, { icon: string; desc: string }> = {
  "pies": { icon: "🥧", desc: "Famous San Pablo Buko Pie & pastries" },
  "pastries": { icon: "🥐", desc: "Fresh baked pies and tarts" },
  "kakanin": { icon: "🥥", desc: "Espasol, Kalamay & Bibingka" },
  "coffee": { icon: "☕", desc: "Locally roasted Barako beans" },
  "snacks": { icon: "🛍️", desc: "Sweet preserves & native snacks" },
};

function getCategoryMeta(name: string) {
  const lower = name.toLowerCase();
  for (const [key, meta] of Object.entries(CATEGORY_META)) {
    if (lower.includes(key)) return meta;
  }
  return { icon: "🍲", desc: "Authentic San Pablo delicacies" };
}

const FALLBACK_CATEGORIES = [
  { id: "", name: "Pies & Tarts", icon: "🥧", desc: "Famous San Pablo Buko Pie" },
  { id: "", name: "Native Kakanin", icon: "🥥", desc: "Espasol, Kalamay & Bibingka" },
  { id: "", name: "Laguna Coffee", icon: "☕", desc: "Locally roasted beans" },
  { id: "", name: "Pasalubong", icon: "🛍️", desc: "Sweet preserves & snacks" },
];

export default async function HomePage() {
  const [user, featuredProducts, categories] = await Promise.all([
    getHeaderUser(),
    getProducts({}),
    getCategories(),
  ]);

  const displayCategories =
    categories && categories.length > 0
      ? categories.slice(0, 4).map((c) => ({
          id: c.id,
          name: c.name,
          ...getCategoryMeta(c.name),
        }))
      : FALLBACK_CATEGORIES;

  const recentProducts = (featuredProducts ?? []).slice(0, 4);

  return (
    <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-8">
      {/* PWA Mobile Search Header (Foodpanda style) */}
      <div className="relative">
        <form action="/products" method="GET" className="relative flex items-center">
          <input
            name="search"
            placeholder="Search local delicacies, buko pie, espasol..."
            className="w-full rounded-2xl border border-border bg-card pl-11 pr-24 py-3 sm:py-3.5 text-xs sm:text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1 0 6.5 6.5a7.5 7.5 0 0 0 10.65 10.65Z"
            />
          </svg>
          <button
            type="submit"
            className="absolute right-2 px-3.5 py-1.5 rounded-xl bg-primary text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all active:scale-95"
          >
            Find Food
          </button>
        </form>
      </div>

      {/* Hero Food App Card */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-primary to-rose-600 text-primary-foreground p-6 sm:p-10 shadow-xl shadow-primary/20 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-lg text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-black uppercase tracking-wider text-white">
            <span>📍 San Pablo City, Laguna</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Authentic Delicacies, <br className="hidden sm:inline" />
            Direct from Local Makers
          </h1>
          <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
            Fresh hot buko pie, traditional espasol, and artisanal Laguna coffee prepared by verified merchants across the 7 Lakes City.
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 pt-2">
            <Link
              href="/products"
              className="px-6 py-2.5 rounded-xl bg-white text-primary text-xs font-black shadow-md hover:bg-white/90 transition-all active:scale-95"
            >
              Order Delicacies Now →
            </Link>
            {!user && (
              <Link
                href="/register"
                className="px-5 py-2.5 rounded-xl bg-black/20 hover:bg-black/30 text-white text-xs font-bold transition-all"
              >
                Sign Up
              </Link>
            )}
          </div>
        </div>

        {/* Hero Visual Icons */}
        <div className="flex items-center justify-center gap-3 text-5xl sm:text-6xl select-none">
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md animate-bounce duration-1000">
            🥧
          </div>
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md animate-pulse">
            🥥
          </div>
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md">
            ☕
          </div>
        </div>
      </div>

      {/* Horizontal Food Categories Carousel (Foodpanda style) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-black text-foreground">
            Browse by Category
          </h2>
          <Link href="/products" className="text-xs font-bold text-primary hover:underline">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {displayCategories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.id ? `/products?category=${cat.id}` : "/products"}
              className="p-4 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-md transition-all group flex flex-col justify-between active:scale-[0.98]"
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>
              <div className="space-y-0.5">
                <h3 className="font-extrabold text-xs sm:text-sm text-foreground group-hover:text-primary transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-muted-foreground line-clamp-1">
                  {cat.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Delicacies Section */}
      {recentProducts.length > 0 && (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between px-1">
            <div>
              <h2 className="text-sm sm:text-base font-black text-foreground">
                Popular Local Delicacies
              </h2>
              <p className="text-[11px] text-muted-foreground">
                Prepared by verified San Pablo producers
              </p>
            </div>
            <Link href="/products" className="text-xs font-bold text-primary hover:underline">
              See Menu ({featuredProducts?.length ?? 0}) →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {recentProducts.map((product) => {
              const inStock = product.stock > 0;

              return (
                <div
                  key={product.id}
                  className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md hover:border-primary/40 transition-all flex flex-col justify-between group active:scale-[0.99]"
                >
                  <Link href={`/products/${product.id}`} className="block relative overflow-hidden bg-muted/30">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-32 sm:h-40 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-32 sm:h-40 w-full flex flex-col items-center justify-center gap-1 text-muted-foreground">
                        <span className="text-3xl">🥧</span>
                        <span className="text-[10px]">No image</span>
                      </div>
                    )}

                    <div className="absolute top-2 right-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-extrabold shadow-sm backdrop-blur-md ${
                          inStock
                            ? "bg-emerald-600/90 text-white"
                            : "bg-red-600/90 text-white"
                        }`}
                      >
                        {inStock ? `${product.stock} left` : "Sold Out"}
                      </span>
                    </div>
                  </Link>

                  <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-primary block truncate">
                        🏪 {product.sellers?.store_name ?? "San Pablo Seller"}
                      </span>
                      <Link href={`/products/${product.id}`} className="block">
                        <h3 className="font-extrabold text-foreground text-xs sm:text-sm group-hover:text-primary transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                      </Link>
                    </div>

                    <div className="pt-1.5 border-t border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-sm font-black text-foreground">
                        ₱{Number(product.price).toFixed(2)}
                      </span>
                      <AddToCartButton
                        productId={product.id}
                        name={product.name}
                        price={Number(product.price)}
                        stock={product.stock}
                        sellerId={product.seller_id}
                        sellerName={product.sellers?.store_name ?? "Local Seller"}
                        imageUrl={product.image_url}
                        size="sm"
                        userRole={user?.role}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PWA Trust & Value Badges */}
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="flex items-center sm:flex-col gap-3 sm:gap-1 text-left sm:text-center">
          <span className="text-2xl">🏪</span>
          <div>
            <h4 className="text-xs font-bold text-foreground">Local Food Artisans</h4>
            <p className="text-[11px] text-muted-foreground">Admin-approved San Pablo makers</p>
          </div>
        </div>
        <div className="flex items-center sm:flex-col gap-3 sm:gap-1 text-left sm:text-center">
          <span className="text-2xl">🛵</span>
          <div>
            <h4 className="text-xs font-bold text-foreground">Flat ₱50 Local Fee</h4>
            <p className="text-[11px] text-muted-foreground">Simple flat fee per seller order</p>
          </div>
        </div>
        <div className="flex items-center sm:flex-col gap-3 sm:gap-1 text-left sm:text-center">
          <span className="text-2xl">💳</span>
          <div>
            <h4 className="text-xs font-bold text-foreground">MockPay & COD</h4>
            <p className="text-[11px] text-muted-foreground">Simulated card or cash on delivery</p>
          </div>
        </div>
      </div>
    </main>
  );
}
````

## File: src/app/layout.tsx
````typescript
import type { Metadata, Viewport } from "next";
import "./globals.css";
import SiteHeader from "@/components/ui/site-header";
import MobileBottomNav from "@/components/ui/mobile-bottom-nav";
import FloatingCartBar from "@/components/ui/floating-cart-bar";
import { CartProvider } from "@/lib/cart/cart-context";
import { getHeaderUser } from "@/lib/auth/header-user";

export const viewport: Viewport = {
  themeColor: "#e11d48",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Pamilihub — San Pablo Delicacies",
  description: "Web-based e-commerce platform for authentic food delicacies of San Pablo City, Laguna",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Pamilihub",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getHeaderUser();

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased font-sans">
        <CartProvider userId={user?.id ?? null}>
          <SiteHeader user={user} />
          {/* Main Content with bottom padding on mobile/tablet so it doesn't get covered by the bottom nav */}
          <div className="flex-1 pb-20 lg:pb-8">
            {children}
          </div>
          {user?.role === "customer" && <FloatingCartBar />}
          <MobileBottomNav user={user} />
        </CartProvider>
      </body>
    </html>
  );
}
````

## File: src/components/ui/site-header.tsx
````typescript
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signoutAction } from "@/modules/accounts/actions";
import type { HeaderUser } from "@/lib/auth/header-user";
import { useCart } from "@/lib/cart/cart-context";
import { ShoppingBag, MapPin, Sparkles } from "lucide-react";

export default function SiteHeader({
  user,
}: Readonly<{
  user: HeaderUser | null;
}>) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";
  const { itemCount } = useCart();

  // Hide header completely on login and register pages
  if (isAuthPage) {
    return null;
  }

  const roleLinks: Record<string, Array<{ href: string; label: string }>> = {
    customer: [
      { href: "/products", label: "Delicacies" },
      { href: "/orders", label: "My Orders" },
    ],
    seller: [
      { href: "/seller/orders", label: "Orders" },
      { href: "/seller/products", label: "Products" },
    ],
    admin: [
      { href: "/admin/dashboard", label: "Dashboard" },
      { href: "/admin/orders", label: "Orders" },
      { href: "/admin/products", label: "Products" },
      { href: "/admin/sellers", label: "Approvals" },
      { href: "/admin/categories", label: "Categories" },
      { href: "/admin/users", label: "Users" },
    ],
  };

  const links = user ? roleLinks[user.role] ?? [{ href: "/products", label: "Delicacies" }] : [
    { href: "/products", label: "Delicacies" },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur-md">
      {/* Top Location Bar (PWA Food Delivery feel) */}
      <div className="bg-primary/5 border-b border-primary/10 py-1 px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1.5 mx-auto sm:mx-0 truncate">
            <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="font-semibold text-foreground truncate">Delivering to San Pablo City, Laguna</span>
            <span className="hidden sm:inline text-primary/60">• Flat ₱50 Delivery Fee</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-primary/80">
            <Sparkles className="w-3 h-3" />
            <span className="font-medium">Direct from Local Food Producers</span>
          </div>
        </div>
      </div>

      {/* Main App Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2.5 group font-extrabold text-base sm:text-lg tracking-tight text-foreground transition-colors"
          >
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-black text-sm shadow-md shadow-primary/25 group-hover:scale-105 transition-transform">
              P
            </div>
            <div className="flex flex-col">
              <span className="leading-tight font-black text-foreground">Pamilihub</span>
              <span className="text-[9px] font-semibold text-primary uppercase tracking-wider">Food Delicacies</span>
            </div>
          </Link>

          {/* Desktop Nav Links (Large screens >= 1024px) */}
          <nav className="hidden lg:flex items-center gap-1">
            {links.map((l) => {
              const active = pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href));
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right side actions — Desktop only (>= 1024px). On phone & tablet, Cart and Account belong in the bottom navbar */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Cart Icon Button - only for authenticated customers */}
          {user?.role === "customer" && (
            <Link
              href="/cart"
              className="relative flex items-center justify-center w-10 h-10 rounded-xl border border-border bg-card text-foreground hover:bg-muted transition-all active:scale-95"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-primary text-[10px] font-extrabold text-primary-foreground shadow-md animate-in zoom-in-50">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>
          )}

          {/* User Section */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/profile"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-card text-xs font-semibold text-foreground hover:bg-muted transition-colors"
              >
                <div className="h-5 w-5 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-[10px] uppercase">
                  {user.role[0]}
                </div>
                <span className="capitalize">{user.role}</span>
              </Link>
              <form action={signoutAction}>
                <button
                  type="submit"
                  className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  Sign out
                </button>
              </form>
            </div>
          ) : !isAuthPage ? (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="px-3.5 py-1.5 rounded-xl bg-primary text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all active:scale-95"
              >
                Sign Up
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
````
