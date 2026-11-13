-- Migration: 008_stock_functions_security_definer
-- Recreate deduct_stock / restore_stock as SECURITY DEFINER so they bypass RLS
-- when called by the service-role client (server-side only).
-- Re-grant execute to service_role only; customers cannot call them directly.
-- See docs/BUSINESS_RULES.md rule 2: stock deduction/restore must run as a single
-- transaction inside a privileged context so overselling cannot happen.

create or replace function public.deduct_stock(p_order_items jsonb)
returns jsonb as $$
declare
  v_item record;
  v_stock integer;
begin
  for v_item in select * from jsonb_array_elements(p_order_items) as item
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
  v_item record;
begin
  for v_item in select * from jsonb_array_elements(p_order_items) as item
  loop
    update public.products
    set stock = stock + (v_item->>'quantity')::int
    where id = (v_item->>'product_id')::uuid;
  end loop;
end;
$$ language plpgsql security definer
set search_path = public;

-- Restrict execute: only service_role (server-side admin client) can call these.
revoke execute on function public.deduct_stock(jsonb) from public;
revoke execute on function public.deduct_stock(jsonb) from anon;
revoke execute on function public.deduct_stock(jsonb) from authenticated;
revoke execute on function public.restore_stock(jsonb) from public;
revoke execute on function public.restore_stock(jsonb) from anon;
revoke execute on function public.restore_stock(jsonb) from authenticated;
grant execute on function public.deduct_stock(jsonb) to service_role;
grant execute on function public.restore_stock(jsonb) to service_role;
