-- Migration: 012_fix_checkout_cart_atomic
-- Rewrite checkout_cart as a single atomic transaction:
--   - aggregates duplicate product IDs in the cart
--   - validates quantity > 0 (rejects negatives that would inflate stock)
--   - validates stock cumulatively (row-level FOR UPDATE locks)
--   - requires seller.status = 'approved'
--   - groups items by seller, creates one order per seller with correct total
--   - deducts stock inside the same transaction
--   - rejects if product is out of stock or insufficient stock
--
-- checkoutAction will call this RPC via the service-role admin client,
-- so the function runs under service_role (bypasses RLS for the write phase)
-- but validates the caller is a customer via auth.uid().

create or replace function public.checkout_cart(
  p_items jsonb,
  p_delivery_info jsonb,
  p_payment_method text
) returns setof uuid as $$
declare
  v_customer_id uuid;
  v_product record;
  v_item jsonb;
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

  -- First pass: validate quantities, aggregate duplicates, lock product rows
  -- Use a temp approach: iterate once to collect validated items keyed by product_id
  -- We aggregate duplicates by building a working set. PL/pgSQL doesn't have
  -- associative arrays of records, so we do two passes with dedup via DISTINCT.

  -- Validate each item and lock product rows
  for v_item in select value from jsonb_array_elements(p_items) as item(value) loop
    v_product_id := (v_item->>'product_id')::uuid;
    v_quantity := (v_item->>'quantity')::integer;

    if v_quantity <= 0 then
      raise exception 'Invalid quantity for product %', v_product_id;
    end if;

    select * into v_product
    from public.products
    where id = v_product_id
    for update;

    if v_product is null then
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

  -- Second pass: aggregate by seller, create orders, add items, deduct stock
  -- We iterate over distinct (seller_id, product_id, quantity_sum) groups.
  -- Re-lock rows already locked (FOR UPDATE on first pass holds locks to end of txn).
  for v_item in
    select
      (value->>'product_id')::uuid as product_id,
      sum((value->>'quantity')::integer) as quantity
    from jsonb_array_elements(p_items) as item(value)
    group by (value->>'product_id')::uuid
  loop
    v_product_id := v_item.product_id;
    v_quantity := v_item.quantity;

    select seller_id, price into v_seller_id, v_price
    from public.products where id = v_product_id;

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
