/**
 * Uploads demo product images to Supabase Storage and updates product image_urls.
 *
 * Run with: pnpm exec tsx scripts/seed-images.ts
 * Requires: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env
 */

import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env",
  );
  process.exit(1);
}

// Service-role client bypasses RLS
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const BUCKET = "product-images";
const DEMO_FOLDER = "demo";

const PRODUCTS: Array<{
  name: string;
  svgFile: string;
  width?: number;
  height?: number;
}> = [
  { name: "Buko Pie", svgFile: "buko-pie.png" },
  { name: "Egg Pie", svgFile: "egg-pie.png" },
  { name: "Biko", svgFile: "biko.png" },
  { name: "Suman", svgFile: "suman.png" },
  { name: "Barako Coffee", svgFile: "barako-coffee.png" },
];

async function ensureBucket() {
  const { data: buckets, error: listErr } = await supabase.storage.listBuckets();
  if (listErr) {
    console.error("Failed to list buckets:", listErr.message);
    process.exit(1);
  }

  const exists = buckets?.some((b) => b.name === BUCKET);
  if (!exists) {
    console.log(`Bucket "${BUCKET}" does not exist. Run migrations first (005_storage_bucket.sql).`);
    process.exit(1);
  }
}

async function uploadImages() {
  const imagesDir = path.join(process.cwd(), "scripts/demo-images");
  const uploaded: Record<string, string> = {};

  for (const p of PRODUCTS) {
    const filePath = path.join(imagesDir, p.svgFile);
    if (!fs.existsSync(filePath)) {
      console.error(`Image file not found: ${filePath}`);
      process.exit(1);
    }

    const fileBuffer = fs.readFileSync(filePath);
    const fileName = `${DEMO_FOLDER}/${p.svgFile.replace(/\.svg$/, ".svg")}`;

    console.log(`Uploading ${fileName}...`);

    const { error: uploadErr } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, fileBuffer, {
        contentType: "image/png",
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadErr) {
      console.error(`  Upload failed: ${uploadErr.message}`);
      continue;
    }

    const { data: urlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(fileName);

    uploaded[p.name] = urlData.publicUrl;
    console.log(`  → ${urlData.publicUrl}`);
  }

  return uploaded;
}

async function updateProducts(uploaded: Record<string, string>) {
  for (const p of PRODUCTS) {
    const url = uploaded[p.name];
    if (!url) continue;

    const { error } = await supabase
      .from("products")
      .update({ image_url: url })
      .eq("name", p.name);

    if (error) {
      console.error(`  Failed to update ${p.name}: ${error.message}`);
    } else {
      console.log(`Updated product "${p.name}" image_url → ${url}`);
    }
  }
}

async function main() {
  console.log("🖼️  Seeding demo product images...");
  await ensureBucket();
  const uploaded = await uploadImages();
  await updateProducts(uploaded);
  console.log("✅ Demo images seeded!");
}

main().catch((err) => {
  console.error("Seed images failed:", err);
  process.exit(1);
});
