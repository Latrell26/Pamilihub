-- Migration: 007_stock_transaction
-- Stock deduction and restore as single database transactions so overselling
-- cannot happen. See docs/BUSINESS_RULES.md rule 2.

-- Deduct stock for a batch of order items atomically.
-- p_order_items: jsonb array of { product_id: uuid, quantity: int }
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
$$ language plpgsql;

-- Restore stock for a batch of order items atomically.
-- Used when payment is cancelled/fails, or seller rejects/cancels the order.
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
$$ language plpgsql;
