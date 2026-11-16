import { Skeleton } from "@/components/ui/skeleton";

export default function SellerProductsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 animate-in fade-in duration-300">
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="space-y-1.5">
          <Skeleton className="h-8 w-44 rounded-lg" />
          <Skeleton className="h-4 w-72 rounded" />
        </div>
        <Skeleton className="h-11 w-36 rounded-2xl" />
      </div>

      {/* Delicacies Table Skeleton */}
      <div className="rounded-3xl border border-border/60 bg-card overflow-hidden shadow-sm">
        {/* Table header */}
        <div className="border-b border-border bg-muted/40 px-5 py-3.5 flex items-center justify-between">
          <Skeleton className="h-4 w-16 rounded" />
          <Skeleton className="h-4 w-32 rounded" />
          <Skeleton className="h-4 w-20 rounded" />
          <Skeleton className="h-4 w-16 rounded" />
          <Skeleton className="h-4 w-20 rounded" />
        </div>

        {/* Table rows */}
        <div className="divide-y divide-border">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="px-5 py-4 flex items-center justify-between gap-4">
              <Skeleton className="h-14 w-14 shrink-0 rounded-2xl" />
              <div className="flex-1 min-w-0 space-y-1.5 px-2">
                <Skeleton className="h-4 w-48 rounded" />
                <Skeleton className="h-3 w-28 rounded" />
              </div>
              <Skeleton className="h-4 w-16 rounded" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-14 rounded-lg" />
                <Skeleton className="h-8 w-14 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
