import fs from "node:fs";
import path from "node:path";

const REPORT_DIR = path.join(process.cwd(), "playwright-report");
const OUT = path.join(process.cwd(), "docs", "TEST-RESULTS.md");

function main() {
  const lines = [];
  lines.push("# Test Results — (SP) Pamilihub");
  lines.push("");
  lines.push(
    `Generated: ${new Date().toISOString().replace("T", " ").slice(0, 19)}`
  );
  lines.push("");

  const summary = path.join(REPORT_DIR, "summary.json");
  if (fs.existsSync(summary)) {
    const data = JSON.parse(fs.readFileSync(summary, "utf8"));
    lines.push("## Playwright E2E Summary");
    lines.push("");
    lines.push(`- Status: ${data.status ?? "unknown"}`);
    lines.push(`- Passed: ${data.passed ?? 0}`);
    lines.push(`- Failed: ${data.failed ?? 0}`);
    lines.push(`- Flaky: ${data.flaky ?? 0}`);
    lines.push(`- Total: ${data.total ?? 0}`);
    lines.push("");
  }

  lines.push("## Vitest Unit + Component Tests");
  lines.push("");
  lines.push("- Command: `pnpm test:unit`");
  lines.push("- Files: `tests/unit/**`, `tests/components/**`");
  lines.push("- See terminal output / vitest HTML report for per-case results.");
  lines.push("");

  lines.push("## Test Coverage Map");
  lines.push("");
  lines.push("| Layer | Files | What it proves |");
  lines.push("|---|---|---|");
  lines.push(
    "| Unit | `tests/unit/orders/schemas.test.ts` | Zod schemas validate checkout, MockPay, order status, and reject bad input |"
  );
  lines.push(
    "| Unit | `tests/unit/accounts/schemas.test.ts` | Registration, login, profile, seller-application validation |"
  );
  lines.push(
    "| Unit | `tests/unit/catalog/schemas.test.ts` | Category and product CRUD validation |"
  );
  lines.push(
    "| Unit | `tests/unit/admin/schemas.test.ts` | Seller review and product-deletion validation |"
  );
  lines.push(
    "| Unit | `tests/unit/address/format.test.ts` | Address composition/parsing (PSGC picker logic) |"
  );
  lines.push(
    "| Component | `tests/components/address-picker.test.tsx` | Loads barangays, emits composed address, manual fallback |"
  );
  lines.push(
    "| Component | `tests/components/site-header.test.tsx` | Role-specific nav links render per role |"
  );
  lines.push(
    "| Component | `tests/components/cart-controls.test.tsx` | Add/update/remove cart items, subtotal recalculates |"
  );
  lines.push(
    "| E2E | `e2e/guest.spec.ts` | Root redirect + public catalog for guests |"
  );
  lines.push(
    "| E2E | `e2e/customer-checkout.spec.ts` | Multi-seller split, MockPay approve/cancel, COD |"
  );
  lines.push(
    "| E2E | `e2e/seller-fulfillment.spec.ts` | Accept → preparing → delivering → completed |"
  );
  lines.push(
    "| E2E | `e2e/admin-governance.spec.ts` | Dashboard, seller approvals, order/payment audit |"
  );
  lines.push(
    "| E2E | `e2e/api-contract.spec.ts` | MockPay guards + PSGC allow-list |"
  );
  lines.push(
    "| E2E | `e2e/security.spec.ts` | Cross-role redirects, /unauthorized page |"
  );
  lines.push(
    "| E2E | `e2e/responsive.spec.ts` | Pages render at desktop + mobile widths |"
  );
  lines.push("");

  lines.push("## How to run");
  lines.push("");
  lines.push("```bash");
  lines.push("# Unit + component tests");
  lines.push("pnpm test:unit");
  lines.push("");
  lines.push("# E2E tests (requires dev server on :3000)");
  lines.push("pnpm test:e2e");
  lines.push("");
  lines.push("# Both suites");
  lines.push("pnpm test:all");
  lines.push("```");
  lines.push("");
  lines.push("> Playwright traces and screenshots attach to failures in `playwright-report/`.");
  lines.push(
    "> `.env.test` (gitignored) points Playwright at the local Supabase instance."
  );

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, lines.join("\n") + "\n");
  console.log(`Wrote ${OUT}`);
}

main();
