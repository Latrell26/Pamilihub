import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:py-8 space-y-6 animate-in fade-in duration-300">
      {/* Header Profile Card */}
      <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm flex items-center gap-4 sm:gap-5">
        <Skeleton className="h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-full" />
        <div className="space-y-2 flex-1 min-w-0">
          <Skeleton className="h-6 w-44 rounded-lg" />
          <Skeleton className="h-3.5 w-32 rounded" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>

      {/* Quick Access Tiles */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-sm"
          >
            <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
            <div className="space-y-1.5 flex-1 min-w-0">
              <Skeleton className="h-4 w-20 rounded" />
              <Skeleton className="h-3 w-16 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Account Info Section */}
      <div className="space-y-3">
        <Skeleton className="h-3.5 w-28 ml-1 rounded" />
        <div className="rounded-3xl border border-border/60 bg-card p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-5 w-40 rounded-md" />
            </div>
            <Skeleton className="h-8 w-16 rounded-lg" />
          </div>
          <div className="border-t border-border/40 pt-4 space-y-1.5">
            <Skeleton className="h-4 w-28 rounded" />
            <Skeleton className="h-5 w-36 rounded-md" />
          </div>
        </div>
      </div>

      {/* Delivery Address Section */}
      <div className="space-y-3">
        <Skeleton className="h-3.5 w-32 ml-1 rounded" />
        <div className="rounded-3xl border border-border/60 bg-card p-5 sm:p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-28 rounded" />
            </div>
            <Skeleton className="h-8 w-16 rounded-lg" />
          </div>
          <Skeleton className="h-4 w-4/5 rounded" />
          <Skeleton className="h-4 w-2/3 rounded" />
        </div>
      </div>

      {/* Seller Application / Status Card */}
      <div className="rounded-3xl border border-primary/20 bg-primary/5 p-5 sm:p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-5 w-36 rounded-md" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <Skeleton className="h-3.5 w-full rounded" />
        <Skeleton className="h-3.5 w-3/4 rounded" />
      </div>

      {/* Sign Out Button */}
      <Skeleton className="h-12 w-full rounded-2xl" />
    </div>
  );
}
