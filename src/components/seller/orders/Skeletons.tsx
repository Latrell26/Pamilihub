/** Loading skeletons for the order list and detail panel. */

export function OrderCardSkeleton() {
  return (
    <div
      className="border-b border-border px-4 py-4 animate-pulse"
      aria-hidden="true"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <div className="h-4 w-32 rounded bg-muted" />
          <div className="h-3 w-20 rounded bg-muted" />
          <div className="h-3 w-48 rounded bg-muted" />
        </div>
        <div className="space-y-2 text-right">
          <div className="h-4 w-20 rounded bg-muted" />
          <div className="h-5 w-16 rounded-full bg-muted" />
        </div>
      </div>
    </div>
  );
}

export function OrderListSkeleton() {
  return (
    <div role="status" aria-label="Loading orders…">
      {Array.from({ length: 6 }).map((_, i) => (
        <OrderCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function OrderDetailSkeleton() {
  return (
    <div className="p-6 space-y-6 animate-pulse" aria-hidden="true">
      <div className="space-y-2">
        <div className="h-5 w-40 rounded bg-muted" />
        <div className="h-3 w-24 rounded bg-muted" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex justify-between">
            <div className="h-4 w-40 rounded bg-muted" />
            <div className="h-4 w-16 rounded bg-muted" />
          </div>
        ))}
      </div>
      <div className="h-px bg-border" />
      <div className="space-y-2">
        <div className="h-4 w-32 rounded bg-muted" />
        <div className="h-3 w-56 rounded bg-muted" />
        <div className="h-3 w-44 rounded bg-muted" />
      </div>
    </div>
  );
}
