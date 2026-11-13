-- Migration: 010_fix_update_order_status
-- 1) Security fix: v_is_seller stayed NULL when the caller was not the seller,
--    so `if not v_is_seller` evaluated to NULL and the exception was skipped.
-- 2) Business rule fix: rejecting an unpaid (pending) order now restores stock.
-- 3) Harden with `set search_path = public`.

create or replace function public.update_order_status(
  p_order_id uuid,
  p_new_status text
) returns void as $$
declare
  v_order record;
  v_is_seller boolean := false;
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

  elsif p_new_status in ('rejected', 'cancelled') then
    if v_order.payment_status = 'paid' then
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

    elsif v_order.payment_status = 'pending' then
      -- Unpaid order rejected/cancelled -> restore stock
      update public.orders
      set order_status = p_new_status
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

  else
    update public.orders
    set order_status = p_new_status
    where id = p_order_id;
  end if;
end;
$$ language plpgsql security definer
set search_path = public;

-- Authenticated users may call it; the function itself verifies seller/admin.
grant execute on function public.update_order_status(uuid, text) to authenticated;
