"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import type { Key } from "swr";
import { createBrowserClient } from "@/lib/swr/supabase";
import type { HeaderUser } from "@/lib/auth/header-user";

const USER_KEY: Key = "pamilihub:user";

function mapUser(user: any, profile: any): HeaderUser | null {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email ?? null,
    role: profile?.role ?? "customer",
    full_name: profile?.full_name ?? null,
  };
}

/** Fetch the current user + profile from Supabase. */
async function fetchUser(): Promise<HeaderUser | null> {
  const supabase = createBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  return mapUser(user, profile);
}

/** React hook: current signed-in user. Reactive to auth state changes. */
export function useUser() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data, mutate, error } = useSWR<HeaderUser | null>(USER_KEY, fetchUser, {
    dedupingInterval: 0,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    fallbackData: null,
  });

  // Listen to auth state changes and refresh SWR cache.
  useEffect(() => {
    if (!mounted) return;
    const supabase = createBrowserClient();
    const { data: sub } = supabase.auth.onAuthStateChange(async () => {
      await mutate(fetchUser);
    });
    return () => {
      sub?.subscription?.unsubscribe?.();
    };
  }, [mounted, mutate]);

  return { user: data, isLoading: mounted && !data && !error, mutate };
}
