import { createClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client using the SERVICE_ROLE key.
 *
 * Bypasses Row Level Security. Must ONLY be used in server actions / API routes,
 * never in client components. The service-role key is never exposed to the browser.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables. "
        + "The service-role client must not be used in client components.",
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
