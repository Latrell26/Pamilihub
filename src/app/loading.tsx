import { Skeleton } from "@/components/ui/skeleton";

export default function HomeCatalogLoading() {
  return (
    <div className="mx-auto max-w-4xl px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
      {/* Top Search Bar & Location skeleton */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-48 rounded-full" />
          <Skeleton className="h-4 w-28 rounded-full hidden sm:block" />
        </div>
        <Skeleton className="h-13 w-full rounded-full" />
      </div>

      {/* Category Pills skeleton */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <Skeleton className="h-9 w-16 rounded-full shrink-0" />
        <Skeleton className="h-9 w-28 rounded-full shrink-0" />
        <Skeleton className="h-9 w-24 rounded-full shrink-0" />
        <Skeleton className="h-9 w-32 rounded-full shrink-0" />
        <Skeleton className="h-9 w-20 rounded-full shrink-0" />
      </div>

      {/* Store cards grid */}
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-[2rem] border border-border/60 bg-card p-4 sm:p-5 shadow-sm space-y-4"
          >
            {/* Store Hero Banner */}
            <Skeleton className="h-40 sm:h-48 w-full rounded-2xl" />

            {/* Store Title & Badges */}
            <div className="flex items-start justify-between gap-3 pt-1">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-6 w-44 rounded-lg" />
                <Skeleton className="h-3.5 w-60 rounded-md" />
              </div>
              <Skeleton className="h-7 w-20 rounded-full" />
            </div>

            {/* Delicacies samples row */}
            <div className="flex items-center gap-2 pt-2">
              <Skeleton className="h-14 w-14 rounded-xl shrink-0" />
              <Skeleton className="h-14 w-14 rounded-xl shrink-0" />
              <Skeleton className="h-14 w-14 rounded-xl shrink-0" />
              <div className="flex-1 space-y-1.5 pl-2">
                <Skeleton className="h-3.5 w-32 rounded" />
                <Skeleton className="h-4 w-20 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
