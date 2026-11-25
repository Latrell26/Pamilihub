# Test Results — (SP) Pamilihub

Generated: 2026-11-17 17:24:47

## Vitest Unit + Component Tests

- Command: `pnpm test:unit`
- Files: `tests/unit/**`, `tests/components/**`
- See terminal output / vitest HTML report for per-case results.

## Test Coverage Map

| Layer | Files | What it proves |
|---|---|---|
| Unit (DSA) | `tests/unit/data-structures/array-list.test.ts` | Dynamic array push, insert, remove, resize, iteration |
| Unit (DSA) | `tests/unit/data-structures/linked-list.test.ts` | Singly linked list append, prepend, insert, remove, retrieval |
| Unit (DSA) | `tests/unit/data-structures/hash-set.test.ts` | Hash set add, delete, separate chaining, rehash, set operations |
| Unit (DSA) | `tests/unit/data-structures/stack.test.ts` | Stack LIFO push, pop, peek, empty handling (Cart Undo) |
| Unit (DSA) | `tests/unit/data-structures/queue.test.ts` | Queue FIFO enqueue, dequeue, peek, empty handling (Order Queue) |
| Unit (DSA) | `tests/unit/data-structures/binary-search-tree.test.ts` | BST insert, search, delete, in-order traversal, min/max keys (Price Sort) |
| Unit (DSA) | `tests/unit/data-structures/trie.test.ts` | Trie insert, search, startsWith, word collection (Prefix Search) |
| Unit (DSA) | `tests/unit/data-structures/graph.test.ts` | Directed graph vertices, edges, BFS, DFS, path existence, shortest path |
| Unit (DSA) | `tests/unit/data-structures/algorithms.test.ts` | Merge sort stability and O(n log n) sorting; Binary search O(log n) lookups |
| Unit (DSA) | `tests/unit/data-structures/status-machine.test.ts` | Order status graph transitions, terminal state enforcement |
| Unit | `tests/unit/orders/schemas.test.ts` | Zod schemas validate checkout, MockPay, order status, and reject bad input |
| Unit | `tests/unit/accounts/schemas.test.ts` | Registration, login, profile, seller-application validation |
| Unit | `tests/unit/catalog/schemas.test.ts` | Category and product CRUD validation |
| Unit | `tests/unit/admin/schemas.test.ts` | Seller review and product-deletion validation |
| Unit | `tests/unit/address/format.test.ts` | Address composition/parsing (PSGC picker logic) |
| Component | `tests/components/address-picker.test.tsx` | Loads barangays, emits composed address, manual fallback |
| Component | `tests/components/site-header.test.tsx` | Role-specific nav links render per role |
| Component | `tests/components/cart-controls.test.tsx` | Add/update/remove cart items, subtotal recalculates |
| E2E | `e2e/guest.spec.ts` | Root redirect + public catalog for guests |
| E2E | `e2e/customer-checkout.spec.ts` | Multi-seller split, MockPay approve/cancel, COD |
| E2E | `e2e/seller-fulfillment.spec.ts` | Accept → preparing → delivering → completed |
| E2E | `e2e/admin-governance.spec.ts` | Dashboard, seller approvals, order/payment audit |
| E2E | `e2e/api-contract.spec.ts` | MockPay guards + PSGC allow-list |
| E2E | `e2e/security.spec.ts` | Cross-role redirects, /unauthorized page |
| E2E | `e2e/responsive.spec.ts` | Pages render at desktop + mobile widths |

## How to run

```bash
# Unit + component tests
pnpm test:unit

# E2E tests (requires dev server on :3000)
pnpm test:e2e

# Both suites
pnpm test:all
```

> Playwright traces and screenshots attach to failures in `playwright-report/`.
> `.env.test` (gitignored) points Playwright at the local Supabase instance.
