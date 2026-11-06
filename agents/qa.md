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
