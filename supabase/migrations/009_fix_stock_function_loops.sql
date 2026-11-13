-- Migration: 009_fix_stock_function_loops
-- Fix PL/pgSQL bug in deduct_stock / restore_stock (migration 007/008):
--   "operator does not exist: record ->> unknown"
-- The FOR loop variable was a record from `select * from jsonb_array_elements(...)`
-- so `v_item->>'product_id'` failed. Loop over the jsonb `value` column instead.

create or replace function public.deduct_stock(p_order_items jsonb)
returns jsonb as $$
declare
  v_item jsonb;
  v_stock integer;
begin
  for v_item in select value from jsonb_array_elements(p_order_items)
  loop
    -- Lock the product row so concurrent checkouts can't oversell
    select stock into v_stock
    from public.products
    where id = (v_item->>'product_id')::uuid
    for update;

    if v_stock is null then
      raise exception 'Product not found: %', v_item->>'product_id';
    end if;

    if v_stock < (v_item->>'quantity')::int then
      raise exception 'Insufficient stock for product % (have %, need %)',
        v_item->>'product_id', v_stock, (v_item->>'quantity')::int;
    end if;

    update public.products
    set stock = stock - (v_item->>'quantity')::int
    where id = (v_item->>'product_id')::uuid;
  end loop;

  return jsonb_build_object('success', true);
end;
$$ language plpgsql security definer
set search_path = public;

create or replace function public.restore_stock(p_order_items jsonb)
returns void as $$
declare
  v_item jsonb;
begin
  for v_item in select value from jsonb_array_elements(p_order_items)
  loop
    update public.products
    set stock = stock + (v_item->>'quantity')::int
    where id = (v_item->>'product_id')::uuid;
  end loop;
end;
$$ language plpgsql security definer
set search_path = public;

-- Keep execute restricted to service_role (re-applied for safety)
revoke execute on function public.deduct_stock(jsonb) from public;
revoke execute on function public.deduct_stock(jsonb) from anon;
revoke execute on function public.deduct_stock(jsonb) from authenticated;
revoke execute on function public.restore_stock(jsonb) from public;
revoke execute on function public.restore_stock(jsonb) from anon;
revoke execute on function public.restore_stock(jsonb) from authenticated;
grant execute on function public.deduct_stock(jsonb) to service_role;
grant execute on function public.restore_stock(jsonb) to service_role;
