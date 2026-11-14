-- Migration: 013_allow_seller_reapply
-- Allow rejected sellers to re-apply (status: rejected → pending) while
-- still blocking self-approval and other status changes by non-admin.
-- This complements migration 011's guard_sellers_status_change trigger.

create or replace function public.guard_sellers_status_change()
returns trigger as $$
begin
  if auth.uid() is null then
    return new;
  end if;

  if public.is_admin() then
    return new;
  end if;

  -- profile_id must not change
  if new.profile_id is distinct from old.profile_id then
    raise exception 'seller profile_id is immutable.';
  end if;

  -- Allow re-apply: rejected -> pending is the only status change a
  -- non-admin may make (blocks self-approval and arbitrary transitions).
  if new.status is distinct from old.status then
    if not (old.status = 'rejected' and new.status = 'pending') then
      raise exception 'Only admins can change seller status.';
    end if;
  end if;

  return new;
end;
$$ language plpgsql security definer
set search_path = public;

drop trigger if exists guard_sellers_status_change on public.sellers;
create trigger guard_sellers_status_change
before update on public.sellers
for each row
execute function public.guard_sellers_status_change();
