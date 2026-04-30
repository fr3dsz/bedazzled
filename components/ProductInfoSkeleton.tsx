import { Skeleton } from "@/components/ui/skeleton";

export function ProductInfoSkeleton() {
  return (
    <div className="flex flex-col space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-16 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
        <Skeleton className="h-4 w-4 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
        <Skeleton className="h-4 w-24 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
      </div>

      {/* Title */}
      <Skeleton className="h-9 w-3/4 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />

      {/* Price */}
      <Skeleton className="h-8 w-28 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />

      {/* Description */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
        <Skeleton className="h-4 w-full bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
        <Skeleton className="h-4 w-2/3 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
      </div>

      {/* Stock Badge */}
      <Skeleton className="h-6 w-20 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />

      {/* Product Details */}
      <div className="space-y-3 border-t border-[#F0D6E8] pt-6 dark:border-[#8F4D7B]/30">
        <Skeleton className="h-5 w-32 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-1">
              <Skeleton className="h-4 w-16 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
              <Skeleton className="h-4 w-24 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
            </div>
          ))}
        </div>
      </div>

      {/* Add to Cart Button */}
      <Skeleton className="h-12 w-full bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />

      {/* Removed AI Similar Button — feature not planned */}
    </div>
  );
}
