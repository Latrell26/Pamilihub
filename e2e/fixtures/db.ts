import { expect, type APIRequestContext } from "@playwright/test";

/**
 * Database cleanup helper for e2e tests. Uses the Supabase service-role key
 * (test-only, never shipped in app code) to delete rows created during a test
 * run so the seeded demo dataset stays stable across runs.
 *
 * Only call this in afterAll() blocks, and only for rows your test created
 * (matched by a unique prefix such as "E2E-<runid>").
 */

export async function cleanupE2EOrders(
  request: APIRequestContext,
  serviceRoleKey: string,
  runId: string
) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  if (!base.includes("127.0.0.1") && !base.includes("localhost")) {
    throw new Error(
      "cleanupE2EOrders refuses to run against a non-local Supabase URL"
    );
  }

  // Delete orders/items/payments created by this run using the order_items'
  // sku prefix if present, otherwise by created_at window. Here we match any
  // order whose total or notes carry the run id marker.
  const res = await request.delete(
    `${base}/functions/v1/e2e-cleanup`,
    {
      headers: {
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
      },
      data: { runId },
    }
  );
  expect(res.ok()).toBeTruthy();
}

export function runId() {
  return `E2E-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
