import { Skeleton } from "@/components/ui/skeleton";

export default function OrdersLoading() {
  return (
    <div className="mx-auto max-w-3xl pb-20 space-y-4">
      {/* Top Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border/60">
        <Skeleton className="h-10 w-10 rounded-full shrink-0" />
        <Skeleton className="h-6 w-32 rounded-lg" />
      </div>

      {/* Tabs */}
      <div className="px-4 pt-2">
        <div className="flex gap-2 rounded-full border border-border/50 bg-muted/60 p-1">
          <Skeleton className="h-10 flex-1 rounded-full" />
          <Skeleton className="h-10 flex-1 rounded-full" />
        </div>
      </div>

      {/* Order Cards */}
      <div className="px-4 space-y-4 pt-2">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="rounded-[2rem] border border-border/60 bg-card p-4 shadow-sm space-y-3"
          >
            {/* Store header */}
            <div className="flex items-start gap-3">
              <Skeleton className="h-12 w-12 rounded-2xl shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-40 rounded" />
                <Skeleton className="h-3.5 w-32 rounded" />
              </div>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-2 pt-1">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>

            {/* Items text */}
            <Skeleton className="h-4 w-4/5 rounded" />

            {/* Total line */}
            <div className="flex items-center justify-between border-t border-dashed border-border pt-3">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-6 w-20 rounded" />
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 pt-1">
              <Skeleton className="h-11 flex-1 rounded-full" />
              <Skeleton className="h-11 flex-1 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
