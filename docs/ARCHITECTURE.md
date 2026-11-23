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
| Testing | Test cases |

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
