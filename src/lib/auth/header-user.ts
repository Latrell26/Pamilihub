"use server";

import { createClient } from "@/lib/supabase/server";

export type HeaderUser = {
  id: string;
  email: string | null;
  role: string;
};

export async function getHeaderUser(): Promise<HeaderUser | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return {
    id: user.id,
    email: user.email ?? null,
    role: (profile?.role as string | null) ?? "customer",
  };
}
