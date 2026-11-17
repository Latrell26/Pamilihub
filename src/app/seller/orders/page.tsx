"use client";

import { useState, useEffect, useCallback } from "react";
import type { OrderSummary, OrderDetail } from "@/modules/orders/types";
import { getSellerOrdersListOnly, getSellerOrderById } from "@/modules/orders/queries";
import { OrderList } from "@/components/seller/orders/OrderList";
import { OrderDetailPanel } from "@/components/seller/orders/OrderDetailPanel";
import { RotateCw, ArrowLeft } from "lucide-react";

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
      if (id === selectedId) return;
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
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-background">
      {/* ── List pane ─────────────────────────────────────────────────────── */}
      <aside
        aria-label="Order list"
        className={`
          flex flex-col border-r border-border/60 bg-background
          w-full md:w-84 lg:w-96 shrink-0
          ${mobileShowDetail ? "hidden md:flex" : "flex"}
        `}
      >
        {/* Pane header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-border/60 bg-background">
          <div>
            <h1 className="text-base font-black tracking-tight text-foreground">
              Store Orders
            </h1>
            <p className="text-[11px] font-semibold text-muted-foreground">
              {listLoading ? "Loading orders..." : `${orders.length} order${orders.length !== 1 ? "s" : ""} placed`}
            </p>
          </div>
          <button
            onClick={loadList}
            aria-label="Refresh orders"
            disabled={listLoading}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-card text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <RotateCw className={`h-4 w-4 ${listLoading ? "animate-spin" : ""}`} />
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
        <div className="md:hidden border-b border-border/60 px-4 py-3 flex items-center gap-2 bg-background">
          <button
            onClick={handleCloseDetail}
            aria-label="Back to order list"
            className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to orders list</span>
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
