export default function OrdersLoading() {
  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-5 animate-pulse">
      {/* Header */}
      <div className="border-b border-border pb-3 px-1 space-y-2">
        <div className="h-7 w-36 bg-muted/60 rounded-lg" />
        <div className="h-4 w-64 bg-muted/40 rounded" />
      </div>

      {/* Order cards */}
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border/50 bg-card/60 p-4 sm:p-5 space-y-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="h-5 w-40 bg-muted/60 rounded" />
              <div className="h-6 w-20 bg-muted/50 rounded-full" />
            </div>
            <div className="h-16 bg-muted/30 rounded-xl" />
            <div className="flex items-center justify-between pt-2 border-t border-border/40">
              <div className="h-4 w-28 bg-muted/40 rounded" />
              <div className="h-5 w-24 bg-muted/60 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
