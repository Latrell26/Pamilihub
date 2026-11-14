-- Migration: 016_enforce_payment_before_accept
-- Backend enforcement so sellers cannot accept a MockPay order before the
-- customer has paid, and so MockPay processing can't corrupt terminal orders.
--
-- update_order_status:
--   - Block 'accepted' when payment_method = 'mockpay' and payment_status <> 'paid'
--   - Fix unpaid rejected/cancelled to restore stock (previously only 'cancelled' did)
-- process_mockpay:
--   - Reject if payment_method <> 'mockpay'
--   - Reject if order_status is already terminal (rejected/cancelled/completed)
--   - On cancel: set BOTH payment_status AND order_status = 'cancelled', restore stock
--   - Explicitly grant/revoke execute so only authenticated callers can invoke

-- ============================================================
-- 1. update_order_status: payment-gated accept + stock restore
-- ============================================================

create or replace function public.update_order_status(
  p_order_id uuid,
  p_new_status text
) returns void as $$
declare
  v_order record;
  v_is_seller boolean := false;
  v_valid_transition boolean := false;
begin
  select * into v_order
  from public.orders
  where id = p_order_id;

  if not found then
    raise exception 'Order not found';
  end if;

  -- Verify caller is the seller for this store or an admin
  if not public.is_admin() then
    select true into v_is_seller
    from public.sellers s
    where s.id = v_order.seller_id and s.profile_id = auth.uid();

    if v_is_seller is not true then
      raise exception 'Only the seller or admin can update order status.';
    end if;
  end if;

  -- Validate status value
  if p_new_status not in ('pending', 'accepted', 'rejected', 'preparing', 'delivering', 'completed', 'cancelled') then
    raise exception 'Invalid order status';
  end if;

  -- Terminal states: no further transitions allowed
  if v_order.order_status in ('completed', 'rejected', 'cancelled') then
    raise exception 'Order is already in a terminal state (%).', v_order.order_status;
  end if;

  -- No-op: same status is allowed but skips all side effects
  if v_order.order_status = p_new_status then
    return;
  end if;

  -- MockPay: seller may not accept before the customer has paid
  if p_new_status = 'accepted'
     and v_order.payment_method = 'mockpay'
     and v_order.payment_status <> 'paid' then
    raise exception 'Customer has not paid for this MockPay order yet.';
  end if;

  -- Validate transition
  -- pending → accepted, rejected, cancelled
  -- accepted → preparing, rejected, cancelled
  -- preparing → delivering, rejected, cancelled
  -- delivering → completed, rejected, cancelled
  if v_order.order_status = 'pending' and p_new_status in ('accepted', 'rejected', 'cancelled') then
    v_valid_transition := true;
  elsif v_order.order_status = 'accepted' and p_new_status in ('preparing', 'rejected', 'cancelled') then
    v_valid_transition := true;
  elsif v_order.order_status = 'preparing' and p_new_status in ('delivering', 'rejected', 'cancelled') then
    v_valid_transition := true;
  elsif v_order.order_status = 'delivering' and p_new_status in ('completed', 'rejected', 'cancelled') then
    v_valid_transition := true;
  end if;

  if not v_valid_transition then
    raise exception 'Invalid transition from % to %.', v_order.order_status, p_new_status;
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
    -- Paid order rejected/cancelled -> simulated refund + restore stock
    update public.orders
    set order_status = p_new_status, payment_status = 'refunded'
    where id = p_order_id;

    insert into public.payments (order_id, method, status)
    values (p_order_id, v_order.payment_method, 'refunded');

    update public.products p
    set stock = stock + oi.quantity
    from public.order_items oi
    where oi.order_id = p_order_id and p.id = oi.product_id;

  elsif p_new_status in ('rejected', 'cancelled')
     and v_order.payment_status = 'pending' then
    -- Unpaid order rejected/cancelled -> restore stock
    update public.orders
    set order_status = p_new_status, payment_status = 'cancelled'
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
$$ language plpgsql security definer
set search_path = public;

-- Re-grant execute to authenticated (re-created function loses grants)
grant execute on function public.update_order_status(uuid, text) to authenticated;

-- ============================================================
-- 2. process_mockpay: strict guards + cancel sets order status
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

  -- Only MockPay orders can be processed through MockPay
  if v_order.payment_method <> 'mockpay' then
    raise exception 'This order was not placed via MockPay.';
  end if;

  -- Verify caller is the customer who owns the order
  if v_order.customer_id <> auth.uid() then
    raise exception 'Order does not belong to caller.';
  end if;

  -- Cannot pay an order already in a terminal state
  if v_order.order_status in ('rejected', 'cancelled', 'completed') then
    raise exception 'Order is already in a terminal state (%).', v_order.order_status;
  end if;

  -- Verify order is awaiting payment
  if v_order.payment_status <> 'pending' then
    raise exception 'Order is not awaiting payment.';
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
    set payment_status = 'cancelled', order_status = 'cancelled';

    insert into public.payments (order_id, method, status)
    values (p_order_id, 'mockpay', 'cancelled');

    -- Restore stock for all items in the order
    update public.products p
    set stock = stock + oi.quantity
    from public.order_items oi
    where oi.order_id = p_order_id and p.id = oi.product_id;

  else
    raise exception 'Invalid result: must be approve or cancel.';
  end if;
end;
$$ language plpgsql security definer
set search_path = public;

-- Restrict execute: only authenticated callers may invoke MockPay via RPC
grant execute on function public.process_mockpay(uuid, numeric, text) to authenticated;
revoke execute on function public.process_mockpay(uuid, numeric, text) from anon;
