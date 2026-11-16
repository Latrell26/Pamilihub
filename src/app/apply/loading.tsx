import { Skeleton } from "@/components/ui/skeleton";

export default function ApplyLoading() {
  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:py-12 space-y-6 animate-in fade-in duration-300">
      <div className="space-y-2">
        <Skeleton className="h-8 w-56 rounded-lg" />
        <Skeleton className="h-4 w-80 rounded" />
      </div>

      <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-28 rounded" />
          <Skeleton className="h-12 w-full rounded-2xl" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-32 rounded" />
          <Skeleton className="h-24 w-full rounded-2xl" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-12 w-full rounded-2xl" />
        </div>
        <Skeleton className="h-12 w-full rounded-2xl pt-2" />
      </div>
    </div>
  );
}
