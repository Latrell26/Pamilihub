-- =============================================================================
-- Seed data for (SP) Pamilihub
-- =============================================================================
-- The demo accounts must already exist in Supabase Auth, because
-- `public.profiles.id` references `auth.users.id` and the profile rows are
-- created by the `on_auth_user_created` trigger.
--
--   Recommended: run `pnpm exec tsx scripts/seed.ts` instead. That script
--   creates the auth accounts AND fills every table below in one command.
--   Use this file only when the accounts already exist (for example after
--   `supabase db reset` plus manual signup, or on an existing project).
--
-- No hard-coded UUIDs are used: every primary key comes from
-- `gen_random_uuid()` and every relationship is resolved through a natural key
-- (auth email, store name, category name). The file is therefore idempotent
-- and safe to run more than once.
-- =============================================================================

-- -------------------------------------------------------------------
-- 1. Profiles
--    The auth trigger already creates a profiles row per account with the
--    default role `customer`, so here we only fill in the demo details.
-- -------------------------------------------------------------------
update public.profiles p
set role      = d.role,
    full_name = d.full_name,
    phone     = d.phone,
    address   = d.address
from (
  select u.id as user_id, d.role, d.full_name, d.phone, d.address
  from auth.users u
  join (values
    ('admin@pamilihub.test',   'admin',    'Platform Administrator', '+63 917 000 0001', 'San Pablo City, Laguna'),
    ('maria@pamilihub.test',   'seller',   'Maria Santos',           '+63 917 000 0002', 'Brgy. San Rafael, San Pablo City, Laguna'),
    ('jose@pamilihub.test',    'seller',   'Jose Reyes',             '+63 917 000 0003', 'Brgy. Del Remedio, San Pablo City, Laguna'),
    ('pending@pamilihub.test', 'seller',   'Pending Applicant',      '+63 917 000 0004', 'Brgy. San Vicente, San Pablo City, Laguna'),
    ('ana@pamilihub.test',     'customer', 'Ana Customer',           '+63 917 000 0010', 'Brgy. San Francisco, San Pablo City, Laguna'),
    ('bob@pamilihub.test',     'customer', 'Bob Buyer',              '+63 917 000 0011', 'Brgy. Santa Cruz, San Pablo City, Laguna'),
    ('carla@pamilihub.test',   'customer', 'Carla Shopper',          '+63 917 000 0012', 'Brgy. Concepcion, San Pablo City, Laguna')
  ) as d(email, role, full_name, phone, address)
    on d.email = u.email
) d
where p.id = d.user_id;

-- -------------------------------------------------------------------
-- 2. Sellers
--    Resolved from the seller's auth account. `status` is only written on
--    insert, so re-running the file never demotes an approved store.
-- -------------------------------------------------------------------
insert into public.sellers (profile_id, store_name, description, location, status)
select p.id, d.store_name, d.description, d.location, d.status
from (values
  ('maria@pamilihub.test',   'Lola Mayas Bakeshop', 'Home-baked buko pie, egg pie, and pastries from San Pablo.', 'Brgy. San Rafael, San Pablo City, Laguna',   'approved'),
  ('jose@pamilihub.test',    'Kakanin ni Lola',     'Traditional kakanin: biko, suman, sapin-sapin.',      'Brgy. Del Remedio, San Pablo City, Laguna', 'approved'),
  ('pending@pamilihub.test', 'Pending Store',       'Awaiting admin approval.',                                'Brgy. San Vicente, San Pablo City, Laguna', 'pending')
) as d(email, store_name, description, location, status)
join auth.users u on u.email = d.email
join public.profiles p on p.id = u.id
on conflict (profile_id) do update
  set store_name = excluded.store_name,
      description = excluded.description,
      location    = excluded.location;

-- -------------------------------------------------------------------
-- 3. Categories
-- -------------------------------------------------------------------
insert into public.categories (name)
select d.name
from (values
  ('Pies and Pastries'),
  ('Kakanin'),
  ('Coffee'),
  ('Snacks')
) as d(name)
on conflict (name) do nothing;

-- -------------------------------------------------------------------
-- 4. Products
--    Only added when missing, so seller edits (price, stock, image) survive
--    a re-run of the seed.
-- -------------------------------------------------------------------
insert into public.products (seller_id, category_id, name, description, price, stock, image_url)
select s.id, c.id, d.name, d.description, d.price, d.stock, d.image_url
from (values
  ('Lola Mayas Bakeshop', 'Pies and Pastries', 'Buko Pie',      'Fresh young coconut pie with flaky crust.',           350.00, 20, 'https://sauniaihyxypnnktfpip.supabase.co/storage/v1/object/public/product-images/demo/buko-pie.png'),
  ('Lola Mayas Bakeshop', 'Pies and Pastries', 'Egg Pie',       'Creamy custard egg pie.',                              250.00, 15, 'https://sauniaihyxypnnktfpip.supabase.co/storage/v1/object/public/product-images/demo/egg-pie.png'),
  ('Kakanin ni Lola',     'Kakanin',           'Biko',          'Sticky rice cake with coconut caramel topping.',      120.00, 30, 'https://sauniaihyxypnnktfpip.supabase.co/storage/v1/object/public/product-images/demo/biko.png'),
  ('Kakanin ni Lola',     'Kakanin',           'Suman',         'Sticky rice in coconut milk, wrapped in banana leaves.', 80.00, 40, 'https://sauniaihyxypnnktfpip.supabase.co/storage/v1/object/public/product-images/demo/suman.png'),
  ('Kakanin ni Lola',     'Coffee',            'Barako Coffee', 'Locally roasted Barako coffee beans.',                  200.00, 25, 'https://sauniaihyxypnnktfpip.supabase.co/storage/v1/object/public/product-images/demo/barako-coffee.png')
) as d(store_name, category_name, name, description, price, stock, image_url)
join public.sellers s on s.store_name = d.store_name
join public.categories c on c.name = d.category_name
where not exists (
  select 1
  from public.products p
  where p.seller_id = s.id
    and p.name = d.name
);

-- -------------------------------------------------------------------
-- 5. Verification
-- -------------------------------------------------------------------
select
  (select count(*) from public.categories) as categories,
  (select count(*) from public.sellers)    as sellers,
  (select count(*) from public.products)   as products,
  (select count(*) from public.profiles)   as profiles;
