-- Migration: 019_optimize_rls_subqueries
-- Optimizes RLS policy execution by wrapping auth functions in scalar subqueries (select auth.uid()).
-- In PostgreSQL, bare function calls in policies execute per-row, whereas (select ...) is evaluated once as an InitPlan.

-- 1. profiles
drop policy if exists "profiles_read_own" on public.profiles;
create policy "profiles_read_own" on public.profiles
  for select using ((select auth.uid()) = id);

drop policy if exists "profiles_write_own" on public.profiles;
create policy "profiles_write_own" on public.profiles
  for update using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

drop policy if exists "profiles_admin_all" on public.profiles;
create policy "profiles_admin_all" on public.profiles
  for all using ((select public.is_admin())) with check ((select public.is_admin()));

-- 2. sellers
drop policy if exists "sellers_own" on public.sellers;
create policy "sellers_own" on public.sellers
  for select, update using (profile_id = (select auth.uid())) with check (profile_id = (select auth.uid()));

drop policy if exists "sellers_admin_all" on public.sellers;
create policy "sellers_admin_all" on public.sellers
  for all using ((select public.is_admin())) with check ((select public.is_admin()));

-- 3. categories
drop policy if exists "categories_admin_all" on public.categories;
create policy "categories_admin_all" on public.categories
  for all using ((select public.is_admin())) with check ((select public.is_admin()));

-- 4. products
drop policy if exists "products_seller_read_own" on public.products;
create policy "products_seller_read_own" on public.products
  for select using (seller_id = (select public.current_seller_id()));

drop policy if exists "products_admin_all" on public.products;
create policy "products_admin_all" on public.products
  for all using ((select public.is_admin())) with check ((select public.is_admin()));

-- 5. orders
drop policy if exists "orders_customer_read_own" on public.orders;
create policy "orders_customer_read_own" on public.orders
  for select using (customer_id = (select auth.uid()));

drop policy if exists "orders_seller_read_own_store" on public.orders;
create policy "orders_seller_read_own_store" on public.orders
  for select using (seller_id = (select public.current_seller_id()));

drop policy if exists "orders_admin_all" on public.orders;
create policy "orders_admin_all" on public.orders
  for all using ((select public.is_admin())) with check ((select public.is_admin()));

-- 6. order_items
drop policy if exists "order_items_customer_read_own" on public.order_items;
create policy "order_items_customer_read_own" on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and o.customer_id = (select auth.uid())
    )
  );

drop policy if exists "order_items_seller_read_own_store" on public.order_items;
create policy "order_items_seller_read_own_store" on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and o.seller_id = (select public.current_seller_id())
    )
  );

drop policy if exists "order_items_admin_all" on public.order_items;
create policy "order_items_admin_all" on public.order_items
  for all using ((select public.is_admin())) with check ((select public.is_admin()));

-- 7. payments
drop policy if exists "payments_customer_read_own" on public.payments;
create policy "payments_customer_read_own" on public.payments
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = payments.order_id
        and o.customer_id = (select auth.uid())
    )
  );

drop policy if exists "payments_seller_read_own_store" on public.payments;
create policy "payments_seller_read_own_store" on public.payments
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = payments.order_id
        and o.seller_id = (select public.current_seller_id())
    )
  );

drop policy if exists "payments_admin_all" on public.payments;
create policy "payments_admin_all" on public.payments
  for all using ((select public.is_admin())) with check ((select public.is_admin()));
