import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { createAccountEntity, type UserAccount } from "@/lib/oop";

export type AppUser = {
  id: string;
  email: string | null;
  role: "customer" | "seller" | "admin";
};

/** Cached fetcher for current user to deduplicate round-trips within the same request. */
const fetchCurrentUser = cache(async () => {
  const sb = createClient();
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
});

/**
 * Returns the current authenticated user with their profile role,
 * or null if not signed in. Deduplicated across RSC render tree.
 */
export async function getCurrentUser(supabase?: ReturnType<typeof createClient>) {
  if (supabase) {
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
      email: user.email,
      role: (profile?.role as AppUser["role"]) ?? "customer",
    } as AppUser;
  }

  return fetchCurrentUser();
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
  const account = createAccountEntity({
    id: user.id,
    email: user.email,
    role: user.role,
  });
  if (!allowedRoles.includes(account.getRole())) {
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

/**
 * Returns the current authenticated user wrapped in a polymorphic `UserAccount`
 * subclass (`CustomerAccount`, `SellerAccount`, or `AdminAccount`), or null.
 */
export async function getCurrentAccount(): Promise<UserAccount | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  return createAccountEntity({
    id: user.id,
    email: user.email,
    role: user.role,
  });
}
