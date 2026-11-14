-- Migration: 015_fix_checkout_cart_bugs
-- Fix bugs in checkout_cart introduced by migration 012:
--
-- 1. CRASH: second loop reused `v_item jsonb` for a multi-column query,
--    causing "query returned record, but expression is of type jsonb".
--    Now uses a dedicated `v_group record` variable.
-- 2. STOCK: first pass validated each raw cart line separately, so the
--    same product appearing twice passed individually but over-deducted.
--    Now aggregates duplicates BEFORE validating stock cumulatively.
-- 3. GROUPING: second pass grouped by product_id only, which could
--    interleave different sellers into separate orders. Now joins
--    products and ORDER BY seller_id for exactly one order per seller.
-- 4. EMPTY CART: raise early instead of returning no orders.

create or replace function public.checkout_cart(
  p_items jsonb,
  p_delivery_info jsonb,
  p_payment_method text
) returns setof uuid as $$
declare
  v_customer_id uuid;
  v_product record;
  v_group record;
  v_product_id uuid;
  v_quantity integer;
  v_price numeric;
  v_seller_id uuid;
  v_current_seller uuid := null;
  v_order_id uuid;
  v_subtotal numeric := 0;
  v_total numeric;
  v_stock integer;
begin
  -- Validate caller is a customer
  select id into v_customer_id
  from public.profiles
  where id = auth.uid() and role = 'customer';

  if v_customer_id is null then
    raise exception 'Only customers can checkout';
  end if;

  -- Validate payment method
  if p_payment_method not in ('mockpay', 'cod') then
    raise exception 'Invalid payment method';
  end if;

  -- Validate delivery info fields exist
  if p_delivery_info->>'name' is null
     or p_delivery_info->>'phone' is null
     or p_delivery_info->>'address' is null then
    raise exception 'Missing delivery information.';
  end if;

  -- Reject empty cart
  if jsonb_array_length(p_items) = 0 then
    raise exception 'Cart is empty.';
  end if;

  -- ------------------------------------------------------------------
  -- First pass: validate each item, lock product rows, aggregate
  -- duplicates so stock is checked cumulatively per product.
  -- ------------------------------------------------------------------
  for v_group in
    select
      (value->>'product_id')::uuid as product_id,
      sum((value->>'quantity')::integer) as quantity
    from jsonb_array_elements(p_items) as item(value)
    group by (value->>'product_id')::uuid
  loop
    v_product_id := v_group.product_id;
    v_quantity := v_group.quantity;

    if v_quantity <= 0 then
      raise exception 'Invalid quantity for product %', v_product_id;
    end if;

    select * into v_product
    from public.products
    where id = v_product_id
    for update;

    if not found then
      raise exception 'Product not found: %', v_product_id;
    end if;

    -- Require seller to be approved
    if v_product.seller_id is null then
      raise exception 'Product % has no seller assigned', v_product_id;
    end if;

    if not exists (
      select 1 from public.sellers s
      where s.id = v_product.seller_id and s.status = 'approved'
    ) then
      raise exception 'Product % is not available for ordering', v_product_id;
    end if;

    if v_product.stock is null or v_product.stock < v_quantity then
      raise exception 'Insufficient stock for product % (have %, need %)',
        v_product_id, coalesce(v_product.stock, 0), v_quantity;
    end if;
  end loop;

  -- ------------------------------------------------------------------
  -- Second pass: create one order per seller (rows ordered by seller_id
  -- so all items for a seller are contiguous), insert order_items,
  -- compute totals, deduct stock — all inside this transaction.
  -- ------------------------------------------------------------------
  for v_group in
    select
      p.id as product_id,
      sum((ci.value->>'quantity')::integer) as quantity,
      p.seller_id,
      p.price
    from jsonb_array_elements(p_items) as ci(value)
    join public.products p on p.id = (ci.value->>'product_id')::uuid
    group by p.id, p.seller_id, p.price
    order by p.seller_id
  loop
    v_product_id := v_group.product_id;
    v_quantity := v_group.quantity;
    v_seller_id := v_group.seller_id;
    v_price := v_group.price;

    -- New seller group: create a new order
    if v_seller_id is distinct from v_current_seller then
      v_current_seller := v_seller_id;
      v_subtotal := 0;

      insert into public.orders (
        customer_id, seller_id,
        delivery_name, delivery_phone, delivery_address,
        delivery_fee, total, payment_method, payment_status, order_status
      )
      values (
        v_customer_id, v_current_seller,
        p_delivery_info->>'name', p_delivery_info->>'phone', p_delivery_info->>'address',
        50.00, 0, p_payment_method, 'pending', 'pending'
      )
      returning id into v_order_id;

      return next v_order_id;
    end if;

    -- Add order item to current order
    insert into public.order_items (order_id, product_id, quantity, unit_price)
    values (v_order_id, v_product_id, v_quantity, v_price);

    -- Update order running total
    v_subtotal := v_subtotal + (v_price * v_quantity);
    v_total := v_subtotal + 50.00;

    update public.orders
    set total = v_total
    where id = v_order_id;

    -- Deduct stock
    update public.products
    set stock = stock - v_quantity
    where id = v_product_id;
  end loop;

  return;
end;
$$ language plpgsql security definer
set search_path = public;

-- Restrict execute: only authenticated (customer) can call checkout_cart.
-- The function itself validates role = 'customer'.
grant execute on function public.checkout_cart(jsonb, jsonb, text) to authenticated;
revoke execute on function public.checkout_cart(jsonb, jsonb, text) from anon;
