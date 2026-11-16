import { Skeleton } from "@/components/ui/skeleton";

export default function StoreLoading() {
  return (
    <div className="mx-auto max-w-4xl pb-32">
      {/* Hero photo banner */}
      <Skeleton className="h-56 sm:h-72 w-full rounded-none sm:rounded-b-3xl" />

      {/* Sheet overlapping hero */}
      <div className="relative -mt-8 rounded-t-[2rem] bg-background px-4 pb-6 pt-12 sm:px-6">
        {/* Floating Store Logo */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2">
          <Skeleton className="h-20 w-20 rounded-3xl border-4 border-background shadow-md" />
        </div>

        {/* Store Title & Meta */}
        <div className="space-y-3 text-center pt-2">
          <Skeleton className="mx-auto h-7 w-52 rounded-xl" />
          <Skeleton className="mx-auto h-4 w-72 rounded-md" />
          <div className="flex items-center justify-center gap-2 pt-1">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-32 rounded-full" />
          </div>
        </div>

        {/* Search bar inside store */}
        <div className="mt-6">
          <Skeleton className="h-12 w-full rounded-full" />
        </div>

        {/* Category Pills */}
        <div className="mt-4 flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <Skeleton className="h-8 w-20 rounded-full shrink-0" />
          <Skeleton className="h-8 w-24 rounded-full shrink-0" />
          <Skeleton className="h-8 w-28 rounded-full shrink-0" />
        </div>

        {/* Delicacies List */}
        <div className="mt-6 space-y-4">
          <Skeleton className="h-6 w-36 rounded-md" />
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3.5 rounded-2xl border border-border/60 bg-card p-3 shadow-sm"
              >
                <Skeleton className="h-24 w-24 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-40 rounded" />
                  <Skeleton className="h-3.5 w-full max-w-xs rounded" />
                  <Skeleton className="h-4 w-20 rounded pt-1" />
                </div>
                <Skeleton className="h-10 w-10 rounded-full shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
