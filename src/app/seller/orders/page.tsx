"use client";

import { useState, useEffect, useCallback } from "react";
import type { OrderSummary, OrderDetail } from "@/modules/orders/types";
import { getSellerOrdersListOnly, getSellerOrderById } from "@/modules/orders/queries";
import { OrderList } from "@/components/seller/orders/OrderList";
import { OrderDetailPanel } from "@/components/seller/orders/OrderDetailPanel";

export default function SellerOrdersPage() {
  // ── List state ─────────────────────────────────────────────────────────────
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  // ── Detail state ──────────────────────────────────────────────────────────
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<OrderDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // ── Mobile: show detail pane over list ───────────────────────────────────
  const [mobileShowDetail, setMobileShowDetail] = useState(false);

  // ── Load list ──────────────────────────────────────────────────────────────
  const loadList = useCallback(async () => {
    setListLoading(true);
    const data = await getSellerOrdersListOnly();
    setOrders(data ?? []);
    setListLoading(false);
  }, []);

  useEffect(() => {
    loadList();
  }, [loadList]);

  // ── Load detail lazily when a row is selected ──────────────────────────────
  const handleSelectOrder = useCallback(
    async (id: string) => {
      if (id === selectedId) return; // already selected
      setSelectedId(id);
      setDetail(null);
      setDetailLoading(true);
      setMobileShowDetail(true);
      const data = await getSellerOrderById(id);
      setDetail(data);
      setDetailLoading(false);
    },
    [selectedId]
  );

  // ── After an action (status update), reload list + re-fetch detail ─────────
  const handleStatusUpdated = useCallback(async () => {
    await loadList();
    if (selectedId) {
      setDetailLoading(true);
      const data = await getSellerOrderById(selectedId);
      setDetail(data);
      setDetailLoading(false);
    }
  }, [loadList, selectedId]);

  // ── Mobile: close detail panel ─────────────────────────────────────────────
  const handleCloseDetail = () => {
    setMobileShowDetail(false);
    setSelectedId(null);
    setDetail(null);
  };

  return (
    <div className="flex h-[calc(100vh-64px)]"> {/* subtract site-header height */}

      {/* ── List pane ─────────────────────────────────────────────────────── */}
      <aside
        aria-label="Order list"
        className={`
          flex flex-col border-r border-border bg-background
          w-full md:w-80 lg:w-96 shrink-0
          ${mobileShowDetail ? "hidden md:flex" : "flex"}
        `}
      >
        {/* Pane header */}
        <div className="flex items-center justify-between px-4 pt-5 pb-3 border-b border-border">
          <div>
            <h1 className="text-lg font-bold tracking-tight text-foreground">My Orders</h1>
            <p className="text-xs text-muted-foreground">
              {listLoading ? "Loading…" : `${orders.length} order${orders.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <button
            onClick={loadList}
            aria-label="Refresh orders"
            disabled={listLoading}
            className="rounded-md p-2 hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
          >
            <svg
              className={`h-4 w-4 text-muted-foreground ${listLoading ? "animate-spin" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 0 1-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>

        <OrderList
          orders={orders}
          loading={listLoading}
          selectedId={selectedId}
          onSelect={handleSelectOrder}
          filter={filter}
          onFilterChange={setFilter}
          search={search}
          onSearchChange={setSearch}
        />
      </aside>

      {/* ── Detail pane ───────────────────────────────────────────────────── */}
      <main
        aria-label="Order detail"
        className={`
          flex-1 bg-background overflow-hidden
          ${mobileShowDetail ? "flex flex-col" : "hidden md:flex md:flex-col"}
        `}
      >
        {/* Mobile back button */}
        <div className="md:hidden border-b border-border px-4 py-3 flex items-center gap-2">
          <button
            onClick={handleCloseDetail}
            aria-label="Back to order list"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to orders
          </button>
        </div>

        <OrderDetailPanel
          order={detail}
          loading={detailLoading}
          onStatusUpdated={handleStatusUpdated}
          onClose={selectedId ? handleCloseDetail : undefined}
        />
      </main>
    </div>
  );
}
