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
