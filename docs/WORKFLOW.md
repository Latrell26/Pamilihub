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
