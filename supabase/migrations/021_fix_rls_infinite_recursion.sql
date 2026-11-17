-- Migration: 021_fix_rls_infinite_recursion
-- Fixes critical PostgreSQL error 54001: "stack depth limit exceeded" caused by infinite recursion in RLS policies.
--
-- Why this happens:
-- 1. `public.is_admin()` and `public.current_seller_id()` were created WITHOUT `SECURITY DEFINER`.
-- 2. When any RLS policy calls `(select public.is_admin())` (e.g. `profiles_admin_all`, `sellers_admin_all`, `products_admin_all`),
--    `is_admin()` executes `select p.role from public.profiles p where p.id = auth.uid()`.
-- 3. Since `is_admin()` executes with caller privileges, PostgreSQL checks RLS on `public.profiles`.
-- 4. In `public.profiles`, when evaluating rows that do not match `profiles_read_own` (e.g. any row where id != auth.uid(),
--    or when the user is anonymous, or for any user whose profile is not row 1 in the table), PostgreSQL evaluates `profiles_admin_all`.
-- 5. `profiles_admin_all` calls `public.is_admin()`, which runs the query on `public.profiles` again, triggering `profiles_admin_all`
--    again in an infinite loop until PostgreSQL exceeds `max_stack_depth`.
-- 6. This caused all queries to `sellers`, `products`, `profiles`, and `orders` to fail with error 54001 for all new accounts
--    and guests, returning empty arrays / nulls, so no products or stores appeared on any page.
--
-- Solution:
-- 1. Declare `public.is_admin()` and `public.current_seller_id()` as `SECURITY DEFINER` with `SET search_path = public`.
--    Inside the function body, queries run with the privileges of the table owner (postgres) which bypasses RLS,
--    completely eliminating recursive policy evaluations.
-- 2. Add an immediate early exit `if auth.uid() is null then return false / null; end if;` so unauthenticated/guest
--    requests don't even perform a table lookup.

-- 1. Fix public.is_admin()
create or replace function public.is_admin()
returns boolean as $$
declare
  user_role text;
begin
  if auth.uid() is null then
    return false;
  end if;

  select p.role into user_role
  from public.profiles p
  where p.id = auth.uid();

  return coalesce(user_role = 'admin', false);
end;
$$ language plpgsql stable security definer
set search_path = public;

-- 2. Fix public.current_seller_id()
create or replace function public.current_seller_id()
returns uuid as $$
declare
  seller_id uuid;
begin
  if auth.uid() is null then
    return null;
  end if;

  select s.id into seller_id
  from public.sellers s
  where s.profile_id = auth.uid();

  return seller_id;
end;
$$ language plpgsql stable security definer
set search_path = public;

-- 3. Re-apply profiles policies cleanly
drop policy if exists "profiles_admin_all" on public.profiles;
create policy "profiles_admin_all" on public.profiles
  for all using ((select public.is_admin())) with check ((select public.is_admin()));

-- 4. Re-apply sellers policies cleanly
drop policy if exists "sellers_admin_all" on public.sellers;
create policy "sellers_admin_all" on public.sellers
  for all using ((select public.is_admin())) with check ((select public.is_admin()));

-- 5. Re-apply products policies cleanly
drop policy if exists "products_admin_all" on public.products;
create policy "products_admin_all" on public.products
  for all using ((select public.is_admin())) with check ((select public.is_admin()));

-- 6. Explicitly grant execute on the helper functions
grant execute on function public.is_admin() to anon, authenticated, service_role;
grant execute on function public.current_seller_id() to anon, authenticated, service_role;
