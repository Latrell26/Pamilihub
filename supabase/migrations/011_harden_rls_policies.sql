-- Migration: 011_harden_rls_policies
-- Fix privilege escalation holes identified in security review:
--
-- 1. profiles: prevent non-admin from changing their own role via trigger
-- 2. sellers: split monolithic sellers_own (ALL) into granular policies;
--    no DELETE for non-admin; INSERT only pending; UPDATE blocked on status change
-- 3. orders/order_items/payments: revoke direct INSERT/UPDATE/DELETE from
--    authenticated role; all writes go through SECURITY DEFINER RPCs
-- 4. products: UPDATE/DELETE require seller.status = 'approved'

-- ============================================================
-- 1. profiles: role changes restricted to admin via trigger
-- ============================================================

-- Restrict profiles_write_own update to prevent changing role/id.
-- RLS WITH CHECK cannot compare old/new values cleanly across policies,
-- so enforce role immutability with a BEFORE UPDATE trigger instead.
create or replace function public.guard_profiles_role_change()
returns trigger as $$
begin
  -- Allow service-role calls (no auth.uid() == null) to pass through unchanged
  if auth.uid() is null then
    return new;
  end if;

  -- Admin may change any field
  if public.is_admin() then
    return new;
  end if;

  -- Non-admin: reject any change to role or id
  if new.role is distinct from old.role then
    raise exception 'Only admins can change a user role.';
  end if;
  if new.id is distinct from old.id then
    raise exception 'Profile id is immutable.';
  end if;

  return new;
end;
$$ language plpgsql security definer
set search_path = public;

drop trigger if exists guard_profiles_role_change on public.profiles;
create trigger guard_profiles_role_change
before update on public.profiles
for each row
execute function public.guard_profiles_role_change();

-- ============================================================
-- 2. sellers: granular policies replacing monolithic sellers_own (ALL)
-- ============================================================

drop policy if exists "sellers_own" on public.sellers;
drop policy if exists "sellers_own_read" on public.sellers;
drop policy if exists "sellers_own_insert" on public.sellers;
drop policy if exists "sellers_own_update" on public.sellers;
drop policy if exists "sellers_admin_all" on public.sellers;

-- Sellers can read their own store row
create policy "sellers_own_read" on public.sellers for select
using (profile_id = auth.uid());

-- Sellers can insert their own application, but only with status = 'pending'
create policy "sellers_own_insert" on public.sellers for insert
with check (profile_id = auth.uid() and status = 'pending');

-- Sellers can update their own store details; status/profile_id changes blocked by trigger below
create policy "sellers_own_update" on public.sellers for update
using (profile_id = auth.uid())
with check (profile_id = auth.uid());

-- Admin full control remains
create policy "sellers_admin_all" on public.sellers for all
using (public.is_admin()) with check (public.is_admin());

-- Trigger: block non-admin changes to sellers.status and sellers.profile_id
-- (allows pending → pending re-apply via update, but not self-approval)
create or replace function public.guard_sellers_status_change()
returns trigger as $$
begin
  if auth.uid() is null then
    return new;
  end if;

  if public.is_admin() then
    return new;
  end if;

  -- profile_id must not change
  if new.profile_id is distinct from old.profile_id then
    raise exception 'seller profile_id is immutable.';
  end if;

  -- status may not be changed by non-admin (blocks self-approval)
  if new.status is distinct from old.status then
    raise exception 'Only admins can change seller status.';
  end if;

  return new;
end;
$$ language plpgsql security definer
set search_path = public;

drop trigger if exists guard_sellers_status_change on public.sellers;
create trigger guard_sellers_status_change
before update on public.sellers
for each row
execute function public.guard_sellers_status_change();

-- ============================================================
-- 3. products: UPDATE/DELETE require seller.status = 'approved'
-- ============================================================

drop policy if exists "products_seller_update_own" on public.products;
drop policy if exists "products_seller_delete_own" on public.products;

create policy "products_seller_update_own" on public.products for update
using (
  seller_id = public.current_seller_id()
  and exists (
    select 1 from public.sellers s
    where s.id = public.current_seller_id()
      and s.status = 'approved'
  )
)
with check (
  seller_id = public.current_seller_id()
  and exists (
    select 1 from public.sellers s
    where s.id = public.current_seller_id()
      and s.status = 'approved'
  )
);

create policy "products_seller_delete_own" on public.products for delete
using (
  seller_id = public.current_seller_id()
  and exists (
    select 1 from public.sellers s
    where s.id = public.current_seller_id()
      and s.status = 'approved'
  )
);

-- ============================================================
-- 4. Revoke direct table write privileges from authenticated role.
--    All writes go through SECURITY DEFINER RPCs instead.
-- ============================================================

revoke insert, update, delete on public.orders from authenticated;
revoke insert, update, delete on public.order_items from authenticated;
revoke insert, update, delete on public.payments from authenticated;

-- Keep select privileges (RLS policies still govern row visibility)
grant select on public.orders to authenticated;
grant select on public.order_items to authenticated;
grant select on public.payments to authenticated;

-- Sellers still need to call update_order_status RPC
grant execute on function public.update_order_status(uuid, text) to authenticated;
-- Admin/service_role already has execute via service_role grants
