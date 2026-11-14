export default function AdminLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-4 w-32 bg-primary/20 rounded-full" />
        <div className="h-8 w-64 bg-muted/60 rounded-xl" />
        <div className="h-4 w-96 bg-muted/40 rounded" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 rounded-2xl border border-border/50 bg-card/60 p-4 space-y-3" />
        ))}
      </div>

      {/* Table / List skeleton */}
      <div className="h-80 rounded-2xl border border-border/50 bg-card/60 p-6 space-y-4" />
    </div>
  );
}
