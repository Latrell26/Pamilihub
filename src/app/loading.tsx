export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 animate-pulse">
      {/* Search / Header skeleton */}
      <div className="h-12 bg-muted/60 rounded-2xl w-full max-w-2xl" />

      {/* Hero / Filter Pills skeleton */}
      <div className="flex items-center gap-2 overflow-hidden py-1">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-9 w-24 bg-muted/50 rounded-xl shrink-0" />
        ))}
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border/50 bg-card/60 p-3 space-y-3 shadow-sm"
          >
            <div className="h-32 sm:h-44 w-full bg-muted/50 rounded-xl" />
            <div className="space-y-2">
              <div className="h-3 w-20 bg-muted/50 rounded" />
              <div className="h-4 w-full bg-muted/60 rounded" />
              <div className="h-4 w-16 bg-muted/60 rounded pt-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
