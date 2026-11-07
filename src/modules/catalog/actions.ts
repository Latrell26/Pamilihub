"use server";

import { createClient } from "@/lib/supabase/server";
import {
  categoryCreateSchema,
  categoryUpdateSchema,
  productCreateSchema,
  productUpdateSchema,
} from "./schemas";
import { requireAdmin, requireRole, getCurrentUser } from "@/lib/auth/roles";
import { revalidatePath } from "next/cache";

type ActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

const BUCKET = "product-images";

/* ------------------------------------------------------------------ */
/* Admin: Categories                                                  */
/* ------------------------------------------------------------------ */

export async function createCategoryAction(
  _prev: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const supabase = createClient();
  await requireAdmin();

  const parsed = categoryCreateSchema.safeParse({
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase
    .from("categories")
    .insert({ name: parsed.data.name });

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/products", "layout");
  return { success: true, message: "Category created." };
}

export async function updateCategoryAction(
  _prev: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const supabase = createClient();
  await requireAdmin();

  const parsed = categoryUpdateSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase
    .from("categories")
    .update({ name: parsed.data.name })
    .eq("id", parsed.data.id);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/products", "layout");
  return { success: true, message: "Category updated." };
}

export async function deleteCategoryAction(
  _prev: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const supabase = createClient();
  await requireAdmin();

  const id = formData.get("id") as string;
  if (!id) {
    return { success: false, message: "Category ID is required." };
  }

  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/products", "layout");
  return { success: true, message: "Category deleted." };
}

/* ------------------------------------------------------------------ */
/* Seller: Products                                                   */
/* ------------------------------------------------------------------ */

async function getCurrentSellerId(supabase: ReturnType<typeof createClient>) {
  const user = await getCurrentUser(supabase);
  if (!user) return null;

  const { data: seller } = await supabase
    .from("sellers")
    .select("id, profile_id, status")
    .eq("profile_id", user.id)
    .single();

  return seller;
}

async function uploadProductImage(
  supabase: ReturnType<typeof createClient>,
  profileId: string,
  file: File
): Promise<{ url: string | null; error: string | null }> {
  try {
    const safeName = file.name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9._-]/g, "");
    const fileName = `${profileId}/${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, file);

    if (uploadError) {
      return { url: null, error: uploadError.message };
    }

    const { data: urlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(fileName);

    return { url: urlData.publicUrl, error: null };
  } catch (err: any) {
    return { url: null, error: err?.message || "Image upload failed." };
  }
}

export async function createProductAction(
  _prev: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const supabase = createClient();
  const seller = await getCurrentSellerId(supabase);

  if (!seller) {
    return { success: false, message: "Seller profile not found." };
  }
  if (seller.status !== "approved") {
    return {
      success: false,
      message: "Only approved sellers can add products.",
    };
  }

  const parsed = productCreateSchema.safeParse({
    category_id: formData.get("category_id"),
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    stock: formData.get("stock"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const imageFile = formData.get("image") as File | null;
  let imageUrl: string | null = null;

  if (imageFile && imageFile.size > 0) {
    const uploaded = await uploadProductImage(supabase, seller.profile_id, imageFile);
    if (uploaded.error) {
      return { success: false, message: uploaded.error };
    }
    imageUrl = uploaded.url;
  }

  const { error } = await supabase.from("products").insert({
    seller_id: seller.id,
    category_id: parsed.data.category_id,
    name: parsed.data.name,
    description: parsed.data.description ?? null,
    price: parsed.data.price,
    stock: parsed.data.stock,
    image_url: imageUrl,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/seller/products");
  revalidatePath("/products", "layout");
  return { success: true, message: "Product added." };
}

export async function updateProductAction(
  _prev: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const supabase = createClient();
  const seller = await getCurrentSellerId(supabase);

  if (!seller) {
    return { success: false, message: "Seller profile not found." };
  }

  const parsed = productUpdateSchema.safeParse({
    id: formData.get("id"),
    category_id: formData.get("category_id"),
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    stock: formData.get("stock"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { id, ...updates } = parsed.data;

  // Verify ownership
  const { data: existing } = await supabase
    .from("products")
    .select("id, seller_id, image_url")
    .eq("id", id)
    .single();

  if (!existing || existing.seller_id !== seller.id) {
    return { success: false, message: "Product not found or not owned by you." };
  }

  // Handle image replacement
  let imageUrl = existing.image_url;
  const imageFile = formData.get("image") as File | null;
  const removeImage = formData.get("remove_image") === "true";

  if (removeImage) {
    imageUrl = null;
  } else if (imageFile && imageFile.size > 0) {
    // Delete old image if exists
    if (existing.image_url) {
      try {
        const oldPath = existing.image_url.split("/").slice(-2).join("/");
        await supabase.storage.from(BUCKET).remove([oldPath]);
      } catch {
        // ignore delete errors
      }
    }
    const uploaded = await uploadProductImage(supabase, seller.profile_id, imageFile);
    if (uploaded.error) {
      return { success: false, message: uploaded.error };
    }
    imageUrl = uploaded.url;
  }

  const { error } = await supabase
    .from("products")
    .update({ ...updates, image_url: imageUrl })
    .eq("id", id);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/seller/products");
  revalidatePath("/products", "layout");
  return { success: true, message: "Product updated." };
}

export async function deleteProductAction(
  _prev: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const supabase = createClient();
  const seller = await getCurrentSellerId(supabase);

  if (!seller) {
    return { success: false, message: "Seller profile not found." };
  }

  const id = formData.get("id") as string;
  if (!id) {
    return { success: false, message: "Product ID is required." };
  }

  // Verify ownership and get image for cleanup
  const { data: existing } = await supabase
    .from("products")
    .select("id, seller_id, image_url")
    .eq("id", id)
    .single();

  if (!existing || existing.seller_id !== seller.id) {
    return { success: false, message: "Product not found or not owned by you." };
  }

  // Delete image from storage if exists
  if (existing.image_url) {
    try {
      const oldPath = existing.image_url.split("/").slice(-2).join("/");
      await supabase.storage.from(BUCKET).remove([oldPath]);
    } catch {
      // ignore delete errors
    }
  }

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/seller/products");
  revalidatePath("/products", "layout");
  return { success: true, message: "Product deleted." };
}
