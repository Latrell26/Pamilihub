import { Skeleton } from "@/components/ui/skeleton";

export default function OrderPayLoading() {
  return (
    <div className="mx-auto max-w-3xl lg:px-8 lg:py-6 animate-in fade-in duration-300">
      {/* Brand Hero Header Skeleton */}
      <section className="bg-primary px-4 pb-14 pt-4 text-primary-foreground sm:px-6 lg:rounded-3xl space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 shrink-0 rounded-full bg-white/20" />
          <Skeleton className="h-4 w-32 rounded bg-white/30" />
        </div>
        <div className="space-y-2 pt-1">
          <Skeleton className="h-8 w-56 rounded-lg bg-white/30" />
          <Skeleton className="h-4 w-72 max-w-full rounded bg-white/20" />
        </div>
      </section>

      {/* Overlapping Content Sheet Skeleton */}
      <section className="-mt-8 space-y-4 rounded-t-[2rem] bg-background px-4 pb-12 pt-5 sm:px-6 lg:rounded-b-3xl">
        {/* Merchant & Order Summary Skeleton Card */}
        <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/40">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-2xl" />
              <div className="space-y-1.5">
                <Skeleton className="h-5 w-40 rounded-md" />
                <Skeleton className="h-3.5 w-24 rounded" />
              </div>
            </div>
            <div className="space-y-1 flex flex-col items-end">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
          </div>
          <div className="space-y-2 pt-1">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-4 w-16 rounded" />
            </div>
          </div>
        </div>

        {/* Payment Method Skeleton Card */}
        <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-28 rounded" />
            <Skeleton className="h-5 w-32 rounded-full" />
          </div>
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-4 w-36 rounded" />
              <Skeleton className="h-3 w-52 max-w-full rounded" />
            </div>
            <Skeleton className="h-5 w-5 rounded-full" />
          </div>
        </div>

        {/* Bill Details Skeleton Card */}
        <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm space-y-3">
          <Skeleton className="h-4 w-24 rounded" />
          <div className="space-y-2 pt-1">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20 rounded" />
              <Skeleton className="h-4 w-16 rounded" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-4 w-14 rounded" />
            </div>
            <div className="flex justify-between pt-2 border-t border-dashed border-border">
              <Skeleton className="h-5 w-24 rounded" />
              <Skeleton className="h-6 w-24 rounded-md" />
            </div>
          </div>
        </div>

        {/* Pay Action Skeleton */}
        <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm space-y-3">
          <Skeleton className="h-4 w-44 rounded" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <Skeleton className="h-12 w-full rounded-2xl" />
            <Skeleton className="h-12 w-full rounded-2xl" />
          </div>
        </div>
      </section>
    </div>
  );
}
