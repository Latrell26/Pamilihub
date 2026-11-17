"use client";

import { notFound, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@/lib/auth/swr";
import { useStoreMenu } from "@/modules/catalog/swr";
import { StoreMenuView } from "@/components/catalog/store-menu-view";
import { Skeleton } from "@/components/ui/skeleton";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function StoreMenuSkeleton() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="animate-pulse bg-muted/70 animate-shimmer h-4 w-48 rounded-full" />
      <div className="animate-pulse bg-muted/70 animate-shimmer h-4 w-28 rounded-full hidden sm:block" />
      <div className="space-y-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="h-10 w-full rounded-lg bg-muted/70 animate-pulse animate-shimmer" />
            <div className="h-4 w-24 rounded-full bg-muted/70 animate-pulse animate-shimmer mt-2" />
          </div>
          <div className="h-10 w-10 rounded-full bg-muted/70 animate-pulse animate-shimmer shrink-0" />
        </div>
        <div className="h-4 w-full rounded-lg bg-muted/70 animate-pulse animate-shimmer" />
        <div className="h-4 w-1/2 rounded-lg bg-muted/70 animate-pulse animate-shimmer" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-4">
            <div className="h-32 w-full rounded-xl bg-muted/70 animate-pulse animate-shimmer" />
            <div className="h-4 w-32 rounded-lg bg-muted/70 animate-pulse animate-shimmer mt-3" />
            <div className="h-3 w-20 rounded-full bg-muted/70 animate-pulse animate-shimmer mt-2" />
            <div className="h-3 w-48 rounded-full bg-muted/70 animate-pulse animate-shimmer mt-1" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function StoreMenuClient({
  storeId,
  initialSearch,
  initialCategory,
  fromSearch,
  searchQueryParam,
}: {
  storeId: string;
  initialSearch?: string;
  initialCategory?: string;
  fromSearch?: boolean;
  searchQueryParam?: string;
}) {
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();
  const { menu, isLoading: menuLoading, error } = useStoreMenu(storeId || null);

  const isLoading = userLoading || menuLoading;

  // Redirect admin/seller away from store pages (they shouldn't browse as customers).
  useEffect(() => {
    if (userLoading || !user) return;
    if (user.role === "admin") {
      router.push("/admin/dashboard");
    }
    if (user.role === "seller") {
      router.push("/seller/orders");
    }
  }, [user, userLoading, router]);

  if (user?.role === "admin" || user?.role === "seller") {
    return null;
  }

  // Not found: invalid UUID or store not approved / doesn't exist.
  if (!storeId || !UUID_REGEX.test(storeId)) {
    notFound();
  }

  if (isLoading) {
    return <StoreMenuSkeleton />;
  }

  if (error || !menu) {
    notFound();
  }

  if (menu.status !== "approved") {
    notFound();
  }

  return (
    <StoreMenuView
      store={menu}
      userRole={user?.role}
      initialSearch={initialSearch}
      initialCategory={initialCategory}
      fromSearch={Boolean(fromSearch)}
      searchQueryParam={searchQueryParam}
    />
  );
}
