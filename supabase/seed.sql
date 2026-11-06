-- Seed data for Pamilihub
-- NOTE: Auth users (auth.users) must be created separately via Supabase Auth
-- (signup through the app, or via Supabase dashboard/API). The profile_id
-- values below must match the auth.users id of each created account.

-- -------------------------------------------------------------------
-- Profiles
-- -------------------------------------------------------------------
insert into public.profiles (id, role, full_name, phone, address) values
  ('a1111111-1111-1111-1111-111111111111', 'admin', 'Platform Administrator', '+63 917 000 0001', 'San Pablo City, Laguna'),
  ('s1111111-1111-1111-1111-111111111111', 'seller', 'Maria Santos', '+63 917 000 0002', 'Brgy. San Rafael, San Pablo City, Laguna'),
  ('s2222222-2222-2222-2222-222222222222', 'seller', 'Jose Reyes', '+63 917 000 0003', 'Brgy. Del Remedio, San Pablo City, Laguna'),
  ('s3333333-3333-3333-3333-333333333333', 'seller', 'Pending Applicant', '+63 917 000 0004', 'Brgy. San Vicente, San Pablo City, Laguna'),
  ('c1111111-1111-1111-1111-111111111111', 'customer', 'Ana Customer', '+63 917 000 0010', 'Brgy. San Francisco, San Pablo City, Laguna'),
  ('c2222222-2222-2222-2222-222222222222', 'customer', 'Bob Buyer', '+63 917 000 0011', 'Brgy. Santa Cruz, San Pablo City, Laguna'),
  ('c3333333-3333-3333-3333-333333333333', 'customer', 'Carla Shopper', '+63 917 000 0012', 'Brgy. Concepcion, San Pablo City, Laguna')
on conflict (id) do nothing;

-- -------------------------------------------------------------------
-- Sellers
-- -------------------------------------------------------------------
insert into public.sellers (id, profile_id, store_name, description, location, status) values
  ('sh111111-1111-1111-1111-111111111111', 's1111111-1111-1111-1111-111111111111', 'Lola Mayas Bakeshop', 'Home-baked buko pie, egg pie, and pastries from San Pablo.', 'Brgy. San Rafael, San Pablo City, Laguna', 'approved'),
  ('sh222222-2222-2222-2222-222222222222', 's2222222-2222-2222-2222-222222222222', 'Kakanin ni Lola', 'Traditional kakanin: biko, suman, sapin-sapin.', 'Brgy. Del Remedio, San Pablo City, Laguna', 'approved'),
  ('sh333333-3333-3333-3333-333333333333', 's3333333-3333-3333-3333-333333333333', 'Pending Store', 'Awaiting admin approval.', 'Brgy. San Vicente, San Pablo City, Laguna', 'pending')
on conflict (id) do nothing;

-- -------------------------------------------------------------------
-- Categories
-- -------------------------------------------------------------------
insert into public.categories (id, name) values
  ('cat1', 'Pies and Pastries'),
  ('cat2', 'Kakanin'),
  ('cat3', 'Coffee'),
  ('cat4', 'Snacks')
on conflict (id) do nothing;

-- -------------------------------------------------------------------
-- Products (seller 1: Lola Mayas Bakeshop - approved)
-- -------------------------------------------------------------------
insert into public.products (id, seller_id, category_id, name, description, price, stock, image_url) values
  ('p101', 'sh111111-1111-1111-1111-111111111111', 'cat1', 'Buko Pie', 'Fresh young coconut pie with flaky crust.', 350.00, 20, 'product-images/sh111111-1111-1111-1111-111111111111/buko-pie.jpg'),
  ('p102', 'sh111111-1111-1111-1111-111111111111', 'cat1', 'Egg Pie', 'Creamy custard egg pie.', 250.00, 15, 'product-images/sh111111-1111-1111-1111-111111111111/egg-pie.jpg')
on conflict (id) do nothing;

-- -------------------------------------------------------------------
-- Products (seller 2: Kakanin ni Lola - approved)
-- -------------------------------------------------------------------
insert into public.products (id, seller_id, category_id, name, description, price, stock, image_url) values
  ('p201', 'sh222222-2222-2222-2222-222222222222', 'cat2', 'Biko', 'Sticky rice cake with coconut caramel topping.', 120.00, 30, 'product-images/sh222222-2222-2222-2222-222222222222/biko.jpg'),
  ('p202', 'sh222222-2222-2222-2222-222222222222', 'cat2', 'Suman', 'Sticky rice in coconut milk, wrapped in banana leaves.', 80.00, 40, 'product-images/sh222222-2222-2222-2222-222222222222/suman.jpg'),
  ('p203', 'sh222222-2222-2222-2222-222222222222', 'cat3', 'Barako Coffee', 'Locally roasted Barako coffee beans.', 200.00, 25, 'product-images/sh222222-2222-2222-2222-222222222222/barako-coffee.jpg')
on conflict (id) do nothing;

-- -------------------------------------------------------------------
-- Products (seller 3: Pending Store - no products until approved)
-- -------------------------------------------------------------------
