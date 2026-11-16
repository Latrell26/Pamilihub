import { Skeleton } from "@/components/ui/skeleton";

export default function SearchLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-4 sm:py-6 space-y-5 animate-in fade-in duration-300">
      {/* Top Search Bar */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-11 w-11 shrink-0 rounded-full" />
        <Skeleton className="h-12 flex-1 rounded-2xl" />
      </div>

      {/* Filter Tabs / Quick Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[20, 24, 28, 20, 24].map((width, i) => (
          <Skeleton
            key={i}
            className={`h-9 w-${width} shrink-0 rounded-full`}
            style={{ width: `${width * 4}px` }}
          />
        ))}
      </div>

      {/* Search Result Items */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between px-1">
          <Skeleton className="h-4 w-28 rounded" />
          <Skeleton className="h-3 w-16 rounded" />
        </div>

        {/* Product / Store Cards */}
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3.5 rounded-2xl border border-border/50 bg-card p-3 shadow-xs"
          >
            <Skeleton className="h-16 w-16 shrink-0 rounded-xl" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-3/5 rounded-md" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-3.5 w-24 rounded" />
                <Skeleton className="h-3.5 w-16 rounded" />
              </div>
            </div>
            <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
