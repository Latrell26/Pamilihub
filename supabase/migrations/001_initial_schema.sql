-- Migration: 001_initial_schema
-- Creates core tables per docs/DATABASE.md

-- Enable extensions
create extension if not exists "pgcrypto";

-- Table: profiles
-- One row per user, linked to Supabase Auth
create table if not exists public.profiles (
  id uuid not null primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('customer', 'seller', 'admin')) default 'customer',
  full_name text,
  phone text,
  address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Table: sellers
-- Store profile and approval status
create table if not exists public.sellers (
  id uuid not null primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  store_name text not null,
  description text,
  location text,
  status text not null check (status in ('pending', 'approved', 'rejected')) default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (profile_id)
);

-- Table: categories
-- Product categories
create table if not exists public.categories (
  id uuid not null primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

-- Table: products
-- Product listings
create table if not exists public.products (
  id uuid not null primary key default gen_random_uuid(),
  seller_id uuid not null references public.sellers(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  name text not null,
  description text,
  price numeric(10, 2) not null check (price >= 0),
  stock integer not null check (stock >= 0) default 0,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Table: orders
-- One order per seller
create table if not exists public.orders (
  id uuid not null primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id) on delete cascade,
  seller_id uuid not null references public.sellers(id) on delete cascade,
  delivery_name text not null,
  delivery_phone text not null,
  delivery_address text not null,
  delivery_fee numeric(10, 2) not null check (delivery_fee >= 0) default 0,
  total numeric(10, 2) not null check (total >= 0),
  payment_method text not null check (payment_method in ('mockpay', 'cod')) default 'mockpay',
  payment_status text not null check (payment_status in ('pending', 'paid', 'failed', 'cancelled', 'refunded')) default 'pending',
  order_status text not null check (order_status in ('pending', 'accepted', 'rejected', 'preparing', 'delivering', 'completed', 'cancelled')) default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Table: order_items
-- Items in an order
create table if not exists public.order_items (
  id uuid not null primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10, 2) not null check (unit_price >= 0),
  created_at timestamptz not null default now()
);

-- Table: payments
-- Record of each simulated payment result
create table if not exists public.payments (
  id uuid not null primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  method text not null check (method in ('mockpay', 'cod')),
  status text not null check (status in ('pending', 'paid', 'failed', 'cancelled', 'refunded')) default 'pending',
  created_at timestamptz not null default now()
);

-- Indexes for common queries
create index if not exists idx_products_seller_id on public.products(seller_id);
create index if not exists idx_products_category_id on public.products(category_id);
create index if not exists idx_orders_customer_id on public.orders(customer_id);
create index if not exists idx_orders_seller_id on public.orders(seller_id);
create index if not exists idx_order_items_order_id on public.order_items(order_id);
create index if not exists idx_payments_order_id on public.payments(order_id);

-- Updated at trigger function (shared)
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply updated_at triggers to tables that have updated_at (idempotent)
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'profiles')
    and not exists (select 1 from pg_trigger t join pg_class c on c.oid = t.tgrelid join pg_namespace n on n.oid = c.relnamespace where n.nspname = 'public' and c.relname = 'profiles' and t.tgname = 'profiles_updated_at') then
    create trigger profiles_updated_at before update on public.profiles for each row execute function public.update_updated_at_column();
  end if;
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'sellers')
    and not exists (select 1 from pg_trigger t join pg_class c on c.oid = t.tgrelid join pg_namespace n on n.oid = c.relnamespace where n.nspname = 'public' and c.relname = 'sellers' and t.tgname = 'sellers_updated_at') then
    create trigger sellers_updated_at before update on public.sellers for each row execute function public.update_updated_at_column();
  end if;
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'products')
    and not exists (select 1 from pg_trigger t join pg_class c on c.oid = t.tgrelid join pg_namespace n on n.oid = c.relnamespace where n.nspname = 'public' and c.relname = 'products' and t.tgname = 'products_updated_at') then
    create trigger products_updated_at before update on public.products for each row execute function public.update_updated_at_column();
  end if;
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'orders')
    and not exists (select 1 from pg_trigger t join pg_class c on c.oid = t.tgrelid join pg_namespace n on n.oid = c.relnamespace where n.nspname = 'public' and c.relname = 'orders' and t.tgname = 'orders_updated_at') then
    create trigger orders_updated_at before update on public.orders for each row execute function public.update_updated_at_column();
  end if;
end $$;
