import { Skeleton } from "@/components/ui/skeleton";

export default function RegisterLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="space-y-2">
        <Skeleton className="h-7 w-48 rounded-lg" />
        <Skeleton className="h-4 w-64 rounded" />
      </div>

      <div className="space-y-3.5 pt-2">
        {/* Full Name input skeleton */}
        <Skeleton className="h-12 w-full rounded-2xl" />
        {/* Email input skeleton */}
        <Skeleton className="h-12 w-full rounded-2xl" />
        {/* Password input skeleton */}
        <Skeleton className="h-12 w-full rounded-2xl" />
        {/* Confirm password skeleton */}
        <Skeleton className="h-12 w-full rounded-2xl" />
        {/* Submit button skeleton */}
        <Skeleton className="h-12 w-full rounded-full" />
      </div>

      {/* Switch to login skeleton */}
      <div className="flex justify-center pt-2">
        <Skeleton className="h-4 w-44 rounded" />
      </div>
    </div>
  );
}
