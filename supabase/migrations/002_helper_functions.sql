-- Migration: 002_helper_functions
-- Role helper functions and auth trigger for auto-creating profiles

-- Helper: is_admin() — returns true if current auth user has admin role
create or replace function public.is_admin()
returns boolean as $$
declare
  user_role text;
begin
  select p.role into user_role
  from public.profiles p
  where p.id = auth.uid();

  return user_role = 'admin';
end;
$$ language plpgsql stable;

-- Helper: current_seller_id() — returns the seller id linked to current auth user
create or replace function public.current_seller_id()
returns uuid as $$
declare
  seller_id uuid;
begin
  select s.id into seller_id
  from public.sellers s
  where s.profile_id = auth.uid();

  return seller_id;
end;
$$ language plpgsql stable;

-- Trigger: auto-create profiles row when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role, full_name, phone, address)
  values (new.id, 'customer', new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'phone', new.raw_user_meta_data->>'address')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Attach trigger to auth.users (Supabase Auth)
do $$
begin
  if not exists (
    select 1 from pg_trigger t
    join pg_class c on c.oid = t.tgrelid
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'auth' and c.relname = 'users' and t.tgname = 'on_auth_user_created'
  ) then
    create trigger on_auth_user_created
      after insert on auth.users
      for each row
      execute function public.handle_new_user();
  end if;
end $$;
