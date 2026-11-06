/**
 * Seed script for Pamilihub
 *
 * Uses the Supabase service-role key to:
 * 1. Create demo auth users (admin, sellers, customers)
 * 2. Insert profiles, sellers, categories, products
 * 3. Is idempotent — skips users that already exist
 *
 * Run with: pnpm exec tsx scripts/seed.ts
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

// Service-role client bypasses RLS
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const DEMO_USERS = [
  {
    email: "admin@pamilihub.test",
    password: "password123",
    role: "admin",
    full_name: "Platform Administrator",
    phone: "+63 917 000 0001",
    address: "San Pablo City, Laguna",
  },
  {
    email: "maria@pamilihub.test",
    password: "password123",
    role: "seller",
    full_name: "Maria Santos",
    phone: "+63 917 000 0002",
    address: "Brgy. San Rafael, San Pablo City, Laguna",
    store: {
      store_name: "Lola Mayas Bakeshop",
      description:
        "Home-baked buko pie, egg pie, and pastries from San Pablo.",
      location: "Brgy. San Rafael, San Pablo City, Laguna",
      status: "approved",
    },
  },
  {
    email: "jose@pamilihub.test",
    password: "password123",
    role: "seller",
    full_name: "Jose Reyes",
    phone: "+63 917 000 0003",
    address: "Brgy. Del Remedio, San Pablo City, Laguna",
    store: {
      store_name: "Kakanin ni Lola",
      description: "Traditional kakanin: biko, suman, sapin-sapin.",
      location: "Brgy. Del Remedio, San Pablo City, Laguna",
      status: "approved",
    },
  },
  {
    email: "pending@pamilihub.test",
    password: "password123",
    role: "seller",
    full_name: "Pending Applicant",
    phone: "+63 917 000 0004",
    address: "Brgy. San Vicente, San Pablo City, Laguna",
    store: {
      store_name: "Pending Store",
      description: "Awaiting admin approval.",
      location: "Brgy. San Vicente, San Pablo City, Laguna",
      status: "pending",
    },
  },
  {
    email: "ana@pamilihub.test",
    password: "password123",
    role: "customer",
    full_name: "Ana Customer",
    phone: "+63 917 000 0010",
    address: "Brgy. San Francisco, San Pablo City, Laguna",
  },
  {
    email: "bob@pamilihub.test",
    password: "password123",
    role: "customer",
    full_name: "Bob Buyer",
    phone: "+63 917 000 0011",
    address: "Brgy. Santa Cruz, San Pablo City, Laguna",
  },
  {
    email: "carla@pamilihub.test",
    password: "password123",
    role: "customer",
    full_name: "Carla Shopper",
    phone: "+63 917 000 0012",
    address: "Brgy. Concepcion, San Pablo City, Laguna",
  },
];

const CATEGORIES = [
  "Pies and Pastries",
  "Kakanin",
  "Coffee",
  "Snacks",
];

const PRODUCTS: Array<{
  seller_email: string;
  category: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
}> = [
  {
    seller_email: "maria@pamilihub.test",
    category: "Pies and Pastries",
    name: "Buko Pie",
    description: "Fresh young coconut pie with flaky crust.",
    price: 350.00,
    stock: 20,
    image_url: "product-images/placeholder/buko-pie.jpg",
  },
  {
    seller_email: "maria@pamilihub.test",
    category: "Pies and Pastries",
    name: "Egg Pie",
    description: "Creamy custard egg pie.",
    price: 250.00,
    stock: 15,
    image_url: "product-images/placeholder/egg-pie.jpg",
  },
  {
    seller_email: "jose@pamilihub.test",
    category: "Kakanin",
    name: "Biko",
    description: "Sticky rice cake with coconut caramel topping.",
    price: 120.00,
    stock: 30,
    image_url: "product-images/placeholder/biko.jpg",
  },
  {
    seller_email: "jose@pamilihub.test",
    category: "Kakanin",
    name: "Suman",
    description: "Sticky rice in coconut milk, wrapped in banana leaves.",
    price: 80.00,
    stock: 40,
    image_url: "product-images/placeholder/suman.jpg",
  },
  {
    seller_email: "jose@pamilihub.test",
    category: "Coffee",
    name: "Barako Coffee",
    description: "Locally roasted Barako coffee beans.",
    price: 200.00,
    stock: 25,
    image_url: "product-images/placeholder/barako-coffee.jpg",
  },
];

async function main() {
  console.log("🌱 Starting seed...");

  // 1. Create categories
  const categoryIds: Record<string, string> = {};
  for (const name of CATEGORIES) {
    const { data, error } = await supabase
      .from("categories")
      .upsert({ name }, { onConflict: "name" })
      .select("id")
      .single();

    if (error) {
      console.error(`Failed to upsert category "${name}":`, error.message);
      continue;
    }
    categoryIds[name] = data.id;
    console.log(`  Category: ${name} → ${data.id}`);
  }

  // 2. Create users, profiles, sellers, products
  for (const u of DEMO_USERS) {
    // Look up existing user first (idempotent)
    const { data: users, error: listErr } =
      await supabase.auth.admin.listUsers();
    if (listErr) {
      console.error("    Failed to list users:", listErr.message);
      continue;
    }
    const existing = users.users.find((x) => x.email === u.email);

    let authUser: { id: string; email?: string } | null = null;

    if (existing) {
      authUser = existing;
      console.log(`  User: ${u.email} → ${existing.id} (existing)`);
    } else {
      // Create auth user
      const { data, error } = await supabase.auth.admin.createUser({
        email: u.email,
        password: u.password,
        email_confirm: true,
        user_metadata: { full_name: u.full_name, phone: u.phone },
      });
      if (error) {
        console.error(`  Failed to create user ${u.email}:`, error.message);
        continue;
      }
      authUser = data.user;
      console.log(`  User: ${u.email} → ${data.user.id} (created)`);
    }

    const userId = authUser.id;

    // Create profile
    const { error: profileError } = await supabase.from("profiles").upsert(
      {
        id: userId,
        role: u.role,
        full_name: u.full_name,
        phone: u.phone,
        address: u.address,
      },
      { onConflict: "id" },
    );

    if (profileError) {
      console.error(`    Profile error:`, profileError.message);
    } else {
      console.log(`    Profile: ${u.role}`);
    }

    // Create seller if applicable
    if (u.store && u.role === "seller") {
      const { data: sellerData, error: sellerError } = await supabase
        .from("sellers")
        .upsert(
          {
            profile_id: userId,
            store_name: u.store.store_name,
            description: u.store.description,
            location: u.store.location,
            status: u.store.status,
          },
          { onConflict: "profile_id" },
        )
        .select("id")
        .single();

      if (sellerError) {
        console.error(`    Seller error:`, sellerError.message);
      } else {
        console.log(`    Seller: ${u.store.store_name} → ${sellerData.id}`);

        // Create products for this seller
        const sellerProducts = PRODUCTS.filter(
          (p) => p.seller_email === u.email,
        );
        for (const p of sellerProducts) {
          const categoryId = categoryIds[p.category];
          if (!categoryId) {
            console.error(`    Category "${p.category}" not found`);
            continue;
          }

          // Check if product already exists
          const { data: existing } = await supabase
            .from("products")
            .select("id")
            .eq("name", p.name)
            .eq("seller_id", sellerData.id)
            .single();

          if (existing) {
            console.log(`    Product: ${p.name} (already exists)`);
            continue;
          }

          const { error: prodError } = await supabase.from("products").insert({
            seller_id: sellerData.id,
            category_id: categoryId,
            name: p.name,
            description: p.description,
            price: p.price,
            stock: p.stock,
            image_url: p.image_url,
          });

          if (prodError) {
            console.error(`    Product "${p.name}" error:`, prodError.message);
          } else {
            console.log(`    Product: ${p.name} (₱${p.price}, stock ${p.stock})`);
          }
        }
      }
    }
  }

  console.log("✅ Seed complete!");
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
