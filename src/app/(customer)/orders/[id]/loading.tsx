import { Skeleton } from "@/components/ui/skeleton";

export default function OrderDetailLoading() {
  return (
    <div className="mx-auto max-w-3xl lg:px-8 lg:py-6 pb-28">
      {/* Brand header banner */}
      <section className="bg-primary/90 px-4 pb-14 pt-4 sm:px-6 lg:rounded-3xl space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full bg-white/25 shrink-0" />
          <Skeleton className="h-4 w-32 rounded bg-white/30" />
        </div>
        <div className="space-y-2 pt-2">
          <Skeleton className="h-8 w-60 rounded-xl bg-white/40" />
          <Skeleton className="h-4 w-72 rounded-md bg-white/30" />
        </div>
        <div className="pt-2">
          <Skeleton className="h-2 w-full rounded-full bg-white/30" />
        </div>
      </section>

      {/* Overlapping white card sheet */}
      <section className="-mt-8 space-y-4 rounded-t-[2rem] bg-background px-4 pb-10 pt-5 sm:px-6 lg:rounded-b-3xl">
        {/* Order summary card */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-3">
          <div className="flex items-center gap-3 border-b border-border pb-3">
            <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-5 w-36 rounded" />
              <Skeleton className="h-3 w-16 rounded" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>

          <div className="space-y-3 pt-1">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
                <Skeleton className="h-6 w-8 rounded" />
                <Skeleton className="h-4 flex-1 rounded" />
                <Skeleton className="h-4 w-16 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Payment summary card */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-3">
          <Skeleton className="h-5 w-36 rounded" />
          <div className="space-y-2 pt-1">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20 rounded" />
              <Skeleton className="h-4 w-16 rounded" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-4 w-14 rounded" />
            </div>
            <div className="flex justify-between pt-2 border-t border-border">
              <Skeleton className="h-5 w-16 rounded" />
              <Skeleton className="h-6 w-24 rounded" />
            </div>
          </div>
        </div>

        {/* Delivery details card */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-3">
          <Skeleton className="h-5 w-32 rounded" />
          <div className="space-y-2.5 pt-1">
            <Skeleton className="h-4 w-40 rounded" />
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-4 w-full rounded" />
          </div>
        </div>
      </section>
    </div>
  );
}
