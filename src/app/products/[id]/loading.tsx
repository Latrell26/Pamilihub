import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-4 sm:py-8 pb-32 space-y-6">
      {/* Top back & title */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full shrink-0" />
        <Skeleton className="h-6 w-36 rounded-lg" />
      </div>

      {/* Product Image */}
      <Skeleton className="h-64 sm:h-96 w-full rounded-3xl" />

      {/* Info card */}
      <div className="rounded-3xl border border-border/60 bg-card p-5 sm:p-6 space-y-4 shadow-sm">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <Skeleton className="h-7 w-48 rounded-xl" />
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
          <Skeleton className="h-4 w-36 rounded-md" />
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-border/60">
          <Skeleton className="h-6 w-28 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>

        <div className="space-y-2 pt-3 border-t border-border/60">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-5/6 rounded" />
          <Skeleton className="h-4 w-3/4 rounded" />
        </div>
      </div>

      {/* Fixed bottom action bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <Skeleton className="h-12 w-28 rounded-full shrink-0" />
          <Skeleton className="h-12 flex-1 rounded-full" />
        </div>
      </div>
    </div>
  );
}
