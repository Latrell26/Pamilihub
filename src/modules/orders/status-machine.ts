/**
 * Order status state machine backed by a directed Graph.
 *
 * Mirrors the business rules in docs/BUSINESS_RULES.md §5:
 *   pending → accepted → preparing → delivering → completed
 *   rejected / cancelled are terminal exits.
 *
 * For MockPay orders, 'accepted' is blocked until payment_status = 'paid'
 * (enforced separately by the payment-gating layer in updateOrderStatusAction
 * and the update_order_status RPC).
 *
 * This module is used by the seller order-management UI to determine which
 * status transitions are allowed for a given order. The server-side RPC
 * remains the final authority.
 */
import { Graph } from "@/lib/data-structures/graph";

export type OrderStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "preparing"
  | "delivering"
  | "completed"
  | "cancelled";

const STATUS_GRAPH = new Graph<OrderStatus>(true);

STATUS_GRAPH.addEdge("pending", "accepted");
STATUS_GRAPH.addEdge("pending", "rejected");
STATUS_GRAPH.addEdge("accepted", "preparing");
STATUS_GRAPH.addEdge("accepted", "cancelled");
STATUS_GRAPH.addEdge("preparing", "delivering");
STATUS_GRAPH.addEdge("preparing", "cancelled");
STATUS_GRAPH.addEdge("delivering", "completed");
STATUS_GRAPH.addEdge("delivering", "cancelled");

const TERMINAL_STATUSES = new Set<OrderStatus>([
  "rejected",
  "cancelled",
  "completed",
]);

/** All statuses this status can transition to. */
export function getAllowedTransitions(
  status: OrderStatus
): OrderStatus[] {
  return STATUS_GRAPH.neighbors(status);
}

/** True if `to` is a direct neighbor of `from` in the status graph. */
export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  const neighbors = STATUS_GRAPH.neighbors(from);
  return neighbors.includes(to);
}

/** True if the status is terminal (no further transitions allowed). */
export function isTerminal(status: OrderStatus): boolean {
  return TERMINAL_STATUSES.has(status);
}

/** All known statuses in the graph. */
export function allStatuses(): OrderStatus[] {
  return STATUS_GRAPH.vertices();
}
