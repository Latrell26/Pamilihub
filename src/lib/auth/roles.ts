import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type AppUser = {
  id: string;
  email: string | null;
  role: "customer" | "seller" | "admin";
};

/**
 * Returns the current authenticated user with their profile role,
 * or null if not signed in.
 */
export async function getCurrentUser(supabase?: ReturnType<typeof createClient>) {
  const sb = supabase ?? createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return null;

  const { data: profile } = await sb
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return {
    id: user.id,
    email: user.email,
    role: (profile?.role as AppUser["role"]) ?? "customer",
  } as AppUser;
}

/**
 * Requires the caller to be signed in.
 * Throws a redirect to /login if not.
 */
export async function requireUser() {
  const supabase = createClient();
  const user = await getCurrentUser(supabase);
  if (!user) redirect("/login");
  return user;
}

/**
 * Requires the caller to have one of the given roles.
 * Throws a redirect to /unauthorized if not.
 */
export async function requireRole(...allowedRoles: AppUser["role"][]) {
  const user = await requireUser();
  if (!allowedRoles.includes(user.role)) {
    redirect("/unauthorized");
  }
  return user;
}

/**
 * Requires the caller to be an admin.
 */
export async function requireAdmin() {
  return requireRole("admin");
}
