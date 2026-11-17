"use client";

import { createBrowserClient as createBrowserSupabaseClient } from "@/lib/supabase/browser";
import type { PostgrestError } from "@supabase/supabase-js";

/** SWR fetcher that calls Supabase through the browser client (RLS still enforced). */
export async function swrSupabase<T>(
  query: () => Promise<{ data: T | null; error: PostgrestError | null }>
): Promise<T> {
  const { data, error } = await query();
  if (error) throw error;
  if (!data) throw new Error("No data returned");
  return data;
}

export function createBrowserClient() {
  return createBrowserSupabaseClient();
}
