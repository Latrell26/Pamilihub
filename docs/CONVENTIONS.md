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
