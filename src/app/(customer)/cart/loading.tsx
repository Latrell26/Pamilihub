import { Skeleton } from "@/components/ui/skeleton";

export default function CartLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:py-8 pb-36 space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-border/50 pb-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-6 w-32 rounded-lg" />
            <Skeleton className="h-3.5 w-24 rounded" />
          </div>
        </div>
        <Skeleton className="h-8 w-20 rounded-full" />
      </div>

      {/* Store Group 1 */}
      <div className="rounded-3xl border border-border/60 bg-card p-4 sm:p-5 shadow-sm space-y-4">
        {/* Store Title */}
        <div className="flex items-center justify-between border-b border-border/40 pb-3">
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-5 w-40 rounded-md" />
          </div>
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>

        {/* Item Rows */}
        <div className="space-y-3.5">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3.5 rounded-2xl border border-border/40 bg-muted/20 p-3"
            >
              <Skeleton className="h-20 w-20 shrink-0 rounded-2xl" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4 rounded-md" />
                <Skeleton className="h-3.5 w-1/3 rounded" />
                <div className="flex items-center justify-between pt-1">
                  <Skeleton className="h-5 w-20 rounded-md" />
                  <Skeleton className="h-8 w-24 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Store Group 2 */}
      <div className="rounded-3xl border border-border/60 bg-card p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-border/40 pb-3">
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-5 w-36 rounded-md" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>

        <div className="flex items-center gap-3.5 rounded-2xl border border-border/40 bg-muted/20 p-3">
          <Skeleton className="h-20 w-20 shrink-0 rounded-2xl" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3 rounded-md" />
            <Skeleton className="h-3.5 w-1/4 rounded" />
            <div className="flex items-center justify-between pt-1">
              <Skeleton className="h-5 w-16 rounded-md" />
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Order Summary Card */}
      <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm space-y-3.5">
        <Skeleton className="h-5 w-32 rounded-md" />
        <div className="space-y-2 pt-2 border-t border-border/40">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-20 rounded" />
            <Skeleton className="h-4 w-16 rounded" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-4 w-14 rounded" />
          </div>
          <div className="flex justify-between pt-2 border-t border-border/40">
            <Skeleton className="h-6 w-20 rounded-md" />
            <Skeleton className="h-6 w-24 rounded-md" />
          </div>
        </div>
        <Skeleton className="h-12 w-full rounded-2xl" />
      </div>

      {/* Mobile Sticky Bar Skeleton */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-border/60 bg-background/95 backdrop-blur-md p-4 sm:hidden">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <Skeleton className="h-3 w-16 rounded" />
            <Skeleton className="h-6 w-24 rounded-md" />
          </div>
          <Skeleton className="h-12 w-44 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
