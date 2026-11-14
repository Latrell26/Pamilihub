"use server";

import { createClient } from "@/lib/supabase/server";
import {
  registerSchema,
  loginSchema,
  profileUpdateSchema,
  sellerApplicationSchema,
} from "./schemas";
import { getCurrentUser } from "@/lib/auth/roles";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

type ActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

/* ------------------------------------------------------------------ */
/* Auth                                                               */
/* ------------------------------------------------------------------ */

export async function registerAction(
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const supabase = createClient();

  const parsed = registerSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    full_name: formData.get("full_name"),
    phone: formData.get("phone"),
    address: formData.get("address"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { email, password, ...metadata } = parsed.data;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: metadata.full_name,
        phone: metadata.phone,
        address: metadata.address,
      },
    },
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath("/", "layout");
  return {
    success: true,
    message: "Account created. You can now sign in.",
  };
}

export async function loginAction(
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const supabase = createClient();

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  redirect("/dashboard");
}

export async function logoutAction(): Promise<ActionState> {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

/**
 * Sign-out server action for use in <form action={...}>.
 * Returns void so it's assignable to a form action.
 */
export async function signoutAction(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

/* ------------------------------------------------------------------ */
/* Profile                                                            */
/* ------------------------------------------------------------------ */

export async function updateProfileAction(
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const supabase = createClient();
  const user = await getCurrentUser(supabase);
  if (!user) {
    return { success: false, message: "Not authenticated." };
  }

  const parsed = profileUpdateSchema.safeParse({
    full_name: formData.get("full_name"),
    phone: formData.get("phone"),
    address: formData.get("address"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase
    .from("profiles")
    .update(parsed.data)
    .eq("id", user.id);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/profile");
  return { success: true, message: "Profile updated." };
}

/* ------------------------------------------------------------------ */
/* Seller application                                                 */
/* ------------------------------------------------------------------ */

export async function applySellerAction(
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const supabase = createClient();
  const user = await getCurrentUser(supabase);
  if (!user) {
    return { success: false, message: "Not authenticated." };
  }

  // Only customers can apply (role check enforced in RLS + here)
  if (user.role !== "customer") {
    return {
      success: false,
      message: "Only customers can apply for a seller account.",
    };
  }

  // Parse and validate the application form first
  const parsed = sellerApplicationSchema.safeParse({
    store_name: formData.get("store_name"),
    description: formData.get("description"),
    location: formData.get("location"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  // Prevent duplicate pending applications; allow rejected sellers to re-apply
  const { data: existing } = await supabase
    .from("sellers")
    .select("id, status")
    .eq("profile_id", user.id)
    .maybeSingle();

  if (existing) {
    if (existing.status === "pending") {
      return {
        success: false,
        message: "You already have a pending seller application.",
      };
    }
    // Re-apply: update the existing rejected row back to pending
    const { error: updError } = await supabase
      .from("sellers")
      .update({
        store_name: parsed.data.store_name,
        description: parsed.data.description,
        location: parsed.data.location,
        status: "pending",
      })
      .eq("profile_id", user.id);

    if (updError) {
      return { success: false, message: updError.message };
    }

    revalidatePath("/apply");
    return {
      success: true,
      message: "Seller application resubmitted for review.",
    };
  }

  const { error } = await supabase.from("sellers").insert({
    profile_id: user.id,
    store_name: parsed.data.store_name,
    description: parsed.data.description,
    location: parsed.data.location,
    status: "pending",
  });

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/apply");
  return { success: true, message: "Seller application submitted." };
}
