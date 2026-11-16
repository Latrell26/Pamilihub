import { Skeleton } from "@/components/ui/skeleton";

export default function SellerOrdersLoading() {
  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden animate-in fade-in duration-300">
      {/* Aside Order List */}
      <aside className="w-full md:w-80 lg:w-96 border-r border-border flex flex-col bg-card shrink-0">
        <div className="p-4 border-b border-border space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Skeleton className="h-6 w-28 rounded-md" />
              <Skeleton className="h-3.5 w-16 rounded" />
            </div>
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
          <Skeleton className="h-10 w-full rounded-xl" />
          {/* Status chips */}
          <div className="flex gap-1.5 overflow-x-auto pt-1">
            {[14, 18, 20, 16].map((w, i) => (
              <Skeleton
                key={i}
                className="h-7 shrink-0 rounded-full"
                style={{ width: `${w * 4}px` }}
              />
            ))}
          </div>
        </div>

        {/* Order items in list */}
        <div className="flex-1 overflow-y-auto divide-y divide-border/50 p-2 space-y-1">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-3 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-32 rounded" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-3.5 w-20 rounded" />
                <Skeleton className="h-4 w-16 rounded font-semibold" />
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Order Detail Pane */}
      <main className="hidden md:flex flex-1 flex-col bg-background p-6 space-y-6 overflow-y-auto">
        <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm space-y-6">
          {/* Header of detail */}
          <div className="flex items-center justify-between border-b border-border/40 pb-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Skeleton className="h-7 w-44 rounded-lg" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <Skeleton className="h-4 w-36 rounded" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-9 w-24 rounded-xl" />
              <Skeleton className="h-9 w-24 rounded-xl" />
            </div>
          </div>

          {/* Customer & Delivery details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-border/40 bg-muted/20 p-4 space-y-2">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-5 w-40 rounded-md" />
              <Skeleton className="h-3.5 w-32 rounded" />
            </div>
            <div className="rounded-2xl border border-border/40 bg-muted/20 p-4 space-y-2">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-5 w-48 rounded-md" />
              <Skeleton className="h-3.5 w-36 rounded" />
            </div>
          </div>

          {/* Ordered Delicacies List */}
          <div className="space-y-3 pt-2">
            <Skeleton className="h-5 w-36 rounded-md" />
            {[1, 2].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 border-b border-border/40 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="h-14 w-14 rounded-xl" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-40 rounded" />
                    <Skeleton className="h-3.5 w-20 rounded" />
                  </div>
                </div>
                <Skeleton className="h-5 w-16 rounded" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
