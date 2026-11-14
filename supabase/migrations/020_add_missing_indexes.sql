-- Migration: 020_add_missing_indexes
-- Indexes for foreign keys, status filters, and timestamp sorting to prevent sequential scans

-- Foreign key on order_items -> products join
create index if not exists idx_order_items_product_id on public.order_items(product_id);

-- Seller status filter for catalog visibility (where status = 'approved')
create index if not exists idx_sellers_status on public.sellers(status);

-- Order sorting by date (customer order history, seller incoming orders, admin monitoring)
create index if not exists idx_orders_created_at on public.orders(created_at desc);

-- Order status filters (admin dashboard metrics and order state filtering)
create index if not exists idx_orders_status_composite on public.orders(order_status, payment_status);

-- Product sorting by date (new arrivals, catalog browsing)
create index if not exists idx_products_created_at on public.products(created_at desc);
