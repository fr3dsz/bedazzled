import { Skeleton } from "@/components/ui/skeleton";

export function SuccessPageSkeleton() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        {/* Success Icon */}
        <Skeleton className="mx-auto h-20 w-20 rounded-full bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />

        {/* Title */}
        <Skeleton className="mx-auto mt-6 h-8 w-56 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />

        {/* Description */}
        <Skeleton className="mx-auto mt-2 h-5 w-80 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />

        {/* Order Details Card */}
        <div className="mt-8 rounded-lg border border-[#F0D6E8] bg-white p-6 text-left dark:border-[#8F4D7B]/30 dark:bg-[#6A395B]">
          <Skeleton className="h-5 w-32 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />

          <div className="mt-4 space-y-3">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-28 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
              <Skeleton className="h-4 w-32 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
              <Skeleton className="h-4 w-40 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-16 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
              <Skeleton className="h-4 w-20 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Skeleton className="h-10 w-full bg-[#FAE8F3] dark:bg-[#8F4D7B]/30 sm:w-32" />
          <Skeleton className="h-10 w-full bg-[#FAE8F3] dark:bg-[#8F4D7B]/30 sm:w-40" />
        </div>
      </div>
    </div>
  );
}
