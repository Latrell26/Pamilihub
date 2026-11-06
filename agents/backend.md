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
