import { Skeleton } from "@/components/ui/skeleton";

interface OrderCardSkeletonProps {
  count?: number;
}

export function OrderCardSkeleton({ count = 3 }: OrderCardSkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border border-[#F0D6E8] bg-white dark:border-[#8F4D7B]/30 dark:bg-[#6A395B]">
          <div className="flex gap-5 p-5">
            {/* Left: Product Images Stack */}
            <Skeleton className="h-20 w-20 shrink-0 rounded-lg bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />

            {/* Right: Order Details */}
            <div className="flex min-w-0 flex-1 flex-col justify-between">
              {/* Top: Order Info + Status */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1.5">
                  <Skeleton className="h-5 w-32 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
                  <Skeleton className="h-4 w-24 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
              </div>

              {/* Bottom: Items + Total */}
              <div className="mt-2 flex items-end justify-between">
                <Skeleton className="h-4 w-16 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
                <Skeleton className="h-6 w-20 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-[#F0D6E8] px-5 py-3 dark:border-[#8F4D7B]/30">
            <Skeleton className="h-4 w-40 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
            <Skeleton className="h-4 w-20 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
          </div>
        </div>
      ))}
    </div>
  );
}
