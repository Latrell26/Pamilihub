import { Skeleton } from "@/components/ui/skeleton";

export default function CheckoutLoading() {
  return (
    <div className="mx-auto max-w-3xl pb-32 space-y-6 animate-in fade-in duration-300">
      {/* Sticky header skeleton */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border/60">
        <div className="mx-auto max-w-3xl flex items-center gap-3 px-4 py-3">
          <Skeleton className="h-11 w-11 shrink-0 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-28 rounded-md" />
            <Skeleton className="h-3.5 w-36 rounded" />
          </div>
        </div>
      </div>

      <div className="space-y-6 px-4 pt-2">
        {/* Delivery address section */}
        <div className="rounded-[2rem] border border-border/60 bg-card p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-6 w-44 rounded-md" />
          </div>

          <div className="space-y-3.5 pt-1">
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-28 rounded" />
              <Skeleton className="h-12 w-full rounded-2xl" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-28 rounded" />
              <Skeleton className="h-12 w-full rounded-2xl" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-40 rounded" />
              <Skeleton className="h-20 w-full rounded-2xl" />
            </div>
          </div>
        </div>

        {/* Payment method section */}
        <div className="rounded-[2rem] border border-border/60 bg-card p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-6 w-40 rounded-md" />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 pt-1">
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 space-y-2">
              <div className="flex items-center gap-2.5">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-4 w-32 rounded-md" />
              </div>
              <Skeleton className="h-3 w-full rounded" />
              <Skeleton className="h-3 w-4/5 rounded" />
            </div>
            <div className="rounded-2xl border border-border/60 bg-card p-4 space-y-2">
              <div className="flex items-center gap-2.5">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-4 w-32 rounded-md" />
              </div>
              <Skeleton className="h-3 w-full rounded" />
              <Skeleton className="h-3 w-4/5 rounded" />
            </div>
          </div>
        </div>

        {/* Order items summary section */}
        <div className="rounded-[2rem] border border-border/60 bg-card p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-36 rounded-md" />
            <Skeleton className="h-4 w-16 rounded" />
          </div>

          <div className="divide-y divide-border/40">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3 py-3">
                <Skeleton className="h-14 w-14 shrink-0 rounded-xl" />
                <div className="min-w-0 flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-3/4 rounded" />
                  <Skeleton className="h-3.5 w-1/4 rounded" />
                </div>
                <Skeleton className="h-4 w-16 rounded text-right" />
              </div>
            ))}
          </div>

          <div className="space-y-2 border-t border-border/60 pt-3">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20 rounded" />
              <Skeleton className="h-4 w-16 rounded" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-4 w-14 rounded" />
            </div>
            <div className="flex justify-between pt-2 border-t border-border/40">
              <Skeleton className="h-6 w-24 rounded-md" />
              <Skeleton className="h-6 w-24 rounded-md" />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Skeleton className="h-14 w-full rounded-2xl" />
      </div>
    </div>
  );
}
