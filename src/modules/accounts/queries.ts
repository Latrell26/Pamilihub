"use server";

import { createClient } from "@/lib/supabase/server";

export async function getProfile() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, role, full_name, phone, address, created_at, updated_at")
    .eq("id", user.id)
    .single();

  if (error) return null;
  return data;
}

export async function getSellerStatus() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("sellers")
    .select("id, store_name, status, created_at")
    .eq("profile_id", user.id)
    .single();

  if (error) return null;
  return data;
}
