-- Migration: 003_rls_policies
-- Row Level Security policies per docs/DATABASE.md matrix

-- Enable RLS on all tables (idempotent)
alter table public.profiles enable row level security;
alter table public.sellers enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;

-- Force RLS so even table owner is subject to policies (idempotent)
alter table public.profiles force row level security;
alter table public.sellers force row level security;
alter table public.categories force row level security;
alter table public.products force row level security;
alter table public.orders force row level security;
alter table public.order_items force row level security;
alter table public.payments force row level security;

-- Helper: create a policy only if it does not already exist (idempotent)
create or replace function public.ensure_policy(
  p_table regclass,
  p_name text,
  p_cmd text,
  p_qual text,
  p_with_check text
) returns void as $$
declare
  v_sql text;
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = p_table::text
      and policyname = p_name
  ) then
    if p_cmd = 'select' then
      v_sql := format('create policy %I on %I for %s using (%s)',
        p_name, p_table, p_cmd, coalesce(p_qual, 'true'));
    elsif p_cmd = 'insert' then
      v_sql := format('create policy %I on %I for %s with check (%s)',
        p_name, p_table, p_cmd, coalesce(p_with_check, 'true'));
    elsif p_cmd = 'delete' then
      v_sql := format('create policy %I on %I for %s using (%s)',
        p_name, p_table, p_cmd, coalesce(p_qual, 'true'));
    else
      v_sql := format('create policy %I on %I for %s using (%s) with check (%s)',
        p_name, p_table, p_cmd, coalesce(p_qual, 'true'), coalesce(p_with_check, 'true'));
    end if;
    execute v_sql;
  end if;
end;
$$ language plpgsql;

-- ============================================================
-- profiles: read/update own; admin all
-- ============================================================
select public.ensure_policy('public.profiles', 'profiles_read_own', 'select', 'auth.uid() = id', null);

select public.ensure_policy('public.profiles', 'profiles_write_own', 'update', 'auth.uid() = id', 'auth.uid() = id');

select public.ensure_policy('public.profiles', 'profiles_admin_all', 'all', 'public.is_admin()', 'public.is_admin()');

-- Role changes are restricted to admins at the application layer (server actions),
-- so a non-admin caller cannot set role='admin' through the API.

-- ============================================================
-- sellers: customers read approved stores; sellers read/update own; admin all
-- ============================================================
select public.ensure_policy('public.sellers', 'sellers_read_approved', 'select', 'status = ''approved''', null);

select public.ensure_policy('public.sellers', 'sellers_own', 'all', 'profile_id = auth.uid()', 'profile_id = auth.uid()');

select public.ensure_policy('public.sellers', 'sellers_admin_all', 'all', 'public.is_admin()', 'public.is_admin()');

-- ============================================================
-- categories: read all; admin full control
-- ============================================================
select public.ensure_policy('public.categories', 'categories_read', 'select', 'true', null);

select public.ensure_policy('public.categories', 'categories_admin_all', 'all', 'public.is_admin()', 'public.is_admin()');

-- ============================================================
-- products: customers read approved sellers' products;
-- sellers CRUD own products only if seller is approved; admin all
-- ============================================================
select public.ensure_policy('public.products', 'products_read_approved_sellers', 'select',
  'exists (select 1 from public.sellers s where s.id = products.seller_id and s.status = ''approved'')', null);

select public.ensure_policy('public.products', 'products_seller_read_own', 'select', 'seller_id = public.current_seller_id()', null);

select public.ensure_policy('public.products', 'products_seller_insert', 'insert', null,
  'seller_id = public.current_seller_id() and exists (select 1 from public.sellers s where s.id = public.current_seller_id() and s.status = ''approved'')');

select public.ensure_policy('public.products', 'products_seller_update_own', 'update', 'seller_id = public.current_seller_id()', 'seller_id = public.current_seller_id()');

select public.ensure_policy('public.products', 'products_seller_delete_own', 'delete', 'seller_id = public.current_seller_id()', null);

select public.ensure_policy('public.products', 'products_admin_all', 'all', 'public.is_admin()', 'public.is_admin()');

-- ============================================================
-- orders: customers create + read own;
-- sellers read/update status of orders for own store; admin all
-- ============================================================
select public.ensure_policy('public.orders', 'orders_customer_create', 'insert', null, 'customer_id = auth.uid()');

select public.ensure_policy('public.orders', 'orders_customer_read_own', 'select', 'customer_id = auth.uid()', null);

select public.ensure_policy('public.orders', 'orders_seller_read_own_store', 'select', 'seller_id = public.current_seller_id()', null);

select public.ensure_policy('public.orders', 'orders_seller_update_own_store', 'update', 'seller_id = public.current_seller_id()', 'seller_id = public.current_seller_id()');

select public.ensure_policy('public.orders', 'orders_admin_all', 'all', 'public.is_admin()', 'public.is_admin()');

-- ============================================================
-- order_items: customers create with own order + read own;
-- sellers read for own store's orders; admin all
-- ============================================================
select public.ensure_policy('public.order_items', 'order_items_customer_create', 'insert', null,
  'exists (select 1 from public.orders o where o.id = order_items.order_id and o.customer_id = auth.uid())');

select public.ensure_policy('public.order_items', 'order_items_customer_read_own', 'select',
  'exists (select 1 from public.orders o where o.id = order_items.order_id and o.customer_id = auth.uid())', null);

select public.ensure_policy('public.order_items', 'order_items_seller_read_own_store', 'select',
  'exists (select 1 from public.orders o where o.id = order_items.order_id and o.seller_id = public.current_seller_id())', null);

select public.ensure_policy('public.order_items', 'order_items_admin_all', 'all', 'public.is_admin()', 'public.is_admin()');

-- ============================================================
-- payments: customers read own; sellers read for own store's orders; admin all
-- ============================================================
select public.ensure_policy('public.payments', 'payments_customer_read_own', 'select',
  'exists (select 1 from public.orders o where o.id = payments.order_id and o.customer_id = auth.uid())', null);

select public.ensure_policy('public.payments', 'payments_seller_read_own_store', 'select',
  'exists (select 1 from public.orders o where o.id = payments.order_id and o.seller_id = public.current_seller_id())', null);

select public.ensure_policy('public.payments', 'payments_admin_all', 'all', 'public.is_admin()', 'public.is_admin()');

-- Drop the helper function after use
drop function public.ensure_policy(regclass, text, text, text, text);
