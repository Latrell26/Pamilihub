-- Migration: 004_rpc_functions
-- Transactional database functions per docs/BUSINESS_RULES.md

-- ============================================================
-- checkout_cart: validates stock, creates one order per seller,
-- deducts stock in a single transaction
-- ============================================================
create or replace function public.checkout_cart(
  p_items jsonb,
  p_delivery_info jsonb,
  p_payment_method text
) returns setof uuid as $$
declare
  v_customer_id uuid;
  v_product record;
  v_item record;
  v_seller_id uuid;
  v_price numeric;
  v_quantity integer;
  v_product_id uuid;
  v_current_seller uuid := null;
  v_order_id uuid;
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

  -- First pass: validate stock and lock all product rows (prevents overselling)
  for v_item in select * from jsonb_array_elements(p_items) as elem(item) loop
    v_product_id := (v_item.item->>'product_id')::uuid;
    v_quantity := (v_item.item->>'quantity')::integer;

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

    if v_product.stock < v_quantity then
      raise exception 'Insufficient stock for product %', v_product_id;
    end if;
  end loop;

  -- Second pass: create one order per seller, add items, deduct stock
  for v_item in select * from jsonb_array_elements(p_items) as elem(item) loop
    v_product_id := (v_item.item->>'product_id')::uuid;
    v_quantity := (v_item.item->>'quantity')::integer;

    select seller_id, price into v_seller_id, v_price
    from public.products where id = v_product_id;

    -- New seller group: create a new order
    if v_seller_id is distinct from v_current_seller then
      v_current_seller := v_seller_id;

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
    update public.orders
    set total = total + (v_price * v_quantity)
    where id = v_order_id;

    -- Deduct stock
    update public.products
    set stock = stock - v_quantity
    where id = v_product_id;
  end loop;

  return;
end;
$$ language plpgsql security definer;

-- ============================================================
-- process_mockpay: approves or cancels a simulated payment
-- ============================================================
create or replace function public.process_mockpay(
  p_order_id uuid,
  p_amount numeric,
  p_result text
) returns void as $$
declare
  v_order record;
begin
  select * into v_order
  from public.orders
  where id = p_order_id;

  if not found then
    raise exception 'Order not found';
  end if;

  -- Verify caller is the customer who owns the order
  if v_order.customer_id <> auth.uid() then
    raise exception 'Order does not belong to caller';
  end if;

  -- Verify order is awaiting payment
  if v_order.payment_status <> 'pending' then
    raise exception 'Order is not awaiting payment';
  end if;

  -- Validate amount matches order total
  if p_amount <> v_order.total then
    raise exception 'Amount does not match order total';
  end if;

  if p_result = 'approve' then
    update public.orders
    set payment_status = 'paid'
    where id = p_order_id;

    insert into public.payments (order_id, method, status)
    values (p_order_id, 'mockpay', 'paid');

  elsif p_result = 'cancel' then
    update public.orders
    set payment_status = 'cancelled'
    where id = p_order_id;

    insert into public.payments (order_id, method, status)
    values (p_order_id, 'mockpay', 'cancelled');

    -- Restore stock for all items in the order
    update public.products p
    set stock = stock + oi.quantity
    from public.order_items oi
    where oi.order_id = p_order_id and p.id = oi.product_id;

  else
    raise exception 'Invalid result: must be approve or cancel';
  end if;
end;
$$ language plpgsql security definer;

-- ============================================================
-- update_order_status: seller/admin updates order status
-- Handles COD paid-on-completion and refunded-on-rejection
-- ============================================================
create or replace function public.update_order_status(
  p_order_id uuid,
  p_new_status text
) returns void as $$
declare
  v_order record;
  v_is_seller boolean;
begin
  select * into v_order
  from public.orders
  where id = p_order_id;

  if not found then
    raise exception 'Order not found';
  end if;

  -- Verify caller is seller for this store or admin
  if not public.is_admin() then
    select true into v_is_seller
    from public.sellers s
    where s.id = v_order.seller_id and s.profile_id = auth.uid();

    if not v_is_seller then
      raise exception 'Only the seller or admin can update order status';
    end if;
  end if;

  -- Validate status value
  if p_new_status not in ('pending', 'accepted', 'rejected', 'preparing', 'delivering', 'completed', 'cancelled') then
    raise exception 'Invalid order status';
  end if;

  -- Business rules for payment status transitions
  if p_new_status = 'completed'
     and v_order.payment_method = 'cod'
     and v_order.payment_status = 'pending' then
    -- COD: payment becomes paid when seller marks completed
    update public.orders
    set order_status = 'completed', payment_status = 'paid'
    where id = p_order_id;

    insert into public.payments (order_id, method, status)
    values (p_order_id, 'cod', 'paid');

  elsif p_new_status in ('rejected', 'cancelled')
     and v_order.payment_status = 'paid' then
    -- Paid order rejected/cancelled -> simulated refund
    update public.orders
    set order_status = p_new_status, payment_status = 'refunded'
    where id = p_order_id;

    insert into public.payments (order_id, method, status)
    values (p_order_id, v_order.payment_method, 'refunded');

    -- Restore stock
    update public.products p
    set stock = stock + oi.quantity
    from public.order_items oi
    where oi.order_id = p_order_id and p.id = oi.product_id;

  elsif p_new_status = 'cancelled'
     and v_order.payment_status = 'pending' then
    -- Cancelled before payment -> restore stock
    update public.orders
    set order_status = 'cancelled'
    where id = p_order_id;

    update public.products p
    set stock = stock + oi.quantity
    from public.order_items oi
    where oi.order_id = p_order_id and p.id = oi.product_id;

  else
    update public.orders
    set order_status = p_new_status
    where id = p_order_id;
  end if;
end;
$$ language plpgsql security definer;
