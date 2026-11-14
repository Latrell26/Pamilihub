-- Migration: 017_fix_process_mockpay_cancel_where
-- Fixes process_mockpay's cancel branch, which was missing a WHERE clause on
-- the orders UPDATE. Without it the statement is rejected by the database
-- ("UPDATE requires a WHERE clause") and the cancel path never completes.

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
    set payment_status = 'cancelled', order_status = 'cancelled'
    where id = p_order_id;

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
