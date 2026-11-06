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
