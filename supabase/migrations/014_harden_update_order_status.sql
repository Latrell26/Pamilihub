-- Migration: 014_harden_update_order_status
-- Add order status transition validation to update_order_status:
--   - Valid flow: pending → accepted → preparing → delivering → completed
--   - Exits: rejected (by seller) or cancelled (from any non-terminal state)
--   - Terminal states: completed, rejected, cancelled (no further changes)
--   - Prevents duplicate payment processing on repeated calls
--   - Prevents double stock restore

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
$$ language plpgsql security definer
set search_path = public;

-- Re-grant execute to authenticated (re-created function loses grants)
grant execute on function public.update_order_status(uuid, text) to authenticated;
