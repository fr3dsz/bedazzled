import { Skeleton } from "@/components/ui/skeleton";

export function OrderDetailSkeleton() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <Skeleton className="h-4 w-28 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
        <div className="mt-4 flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
            <Skeleton className="mt-2 h-4 w-56 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
          </div>
          <Skeleton className="h-6 w-24 rounded-full bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Order Items */}
        <div className="lg:col-span-3">
          <div className="rounded-lg border border-[#F0D6E8] bg-white dark:border-[#8F4D7B]/30 dark:bg-[#6A395B]">
            <div className="border-b border-[#F0D6E8] px-6 py-4 dark:border-[#8F4D7B]/30">
              <Skeleton className="h-5 w-24 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
            </div>
            <div className="divide-y divide-[#F0D6E8] dark:divide-[#8F4D7B]/30">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-4 px-6 py-4">
                  <Skeleton className="h-20 w-20 shrink-0 rounded-md bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-40 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
                      <Skeleton className="h-4 w-16 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
                    </div>
                  </div>
                  <div className="space-y-2 text-right">
                    <Skeleton className="h-5 w-16 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
                    <Skeleton className="h-4 w-20 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary & Details */}
        <div className="space-y-6 lg:col-span-2">
          {/* Summary */}
          <div className="rounded-lg border border-[#F0D6E8] bg-white p-6 dark:border-[#8F4D7B]/30 dark:bg-[#6A395B]">
            <Skeleton className="h-5 w-32 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
            <div className="mt-4 space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
                <Skeleton className="h-4 w-16 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
              </div>
              <div className="border-t border-[#F0D6E8] pt-3 dark:border-[#8F4D7B]/30">
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-12 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
                  <Skeleton className="h-5 w-20 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="rounded-lg border border-[#F0D6E8] bg-white p-6 dark:border-[#8F4D7B]/30 dark:bg-[#6A395B]">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
              <Skeleton className="h-5 w-36 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
            </div>
            <div className="mt-4 space-y-2">
              <Skeleton className="h-4 w-32 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
              <Skeleton className="h-4 w-40 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
              <Skeleton className="h-4 w-28 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
              <Skeleton className="h-4 w-24 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
            </div>
          </div>

          {/* Payment Info */}
          <div className="rounded-lg border border-[#F0D6E8] bg-white p-6 dark:border-[#8F4D7B]/30 dark:bg-[#6A395B]">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
              <Skeleton className="h-5 w-20 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
            </div>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-12 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
                <Skeleton className="h-4 w-16 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-12 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
                <Skeleton className="h-4 w-36 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
