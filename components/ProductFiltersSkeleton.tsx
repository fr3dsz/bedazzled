import { Skeleton } from "@/components/ui/skeleton";

export function ProductFiltersSkeleton() {
  return (
    <div className="space-y-6 rounded-lg border border-[#F0D6E8] bg-white p-6 dark:border-[#8F4D7B]/30 dark:bg-[#6A395B]">
      {/* Search */}
      <div>
        <Skeleton className="mb-2 h-4 w-16 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
        <div className="flex gap-2">
          <Skeleton className="h-10 flex-1 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
          <Skeleton className="h-10 w-20 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
        </div>
      </div>

      {/* Category */}
      <div>
        <Skeleton className="mb-2 h-4 w-20 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
        <Skeleton className="h-10 w-full bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
      </div>

      {/* Color */}
      <div>
        <Skeleton className="mb-2 h-4 w-12 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
        <Skeleton className="h-10 w-full bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
      </div>

      {/* Nail Shape */}
      <div>
        <Skeleton className="mb-2 h-4 w-20 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
        <Skeleton className="h-10 w-full bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
      </div>

      {/* Price Range */}
      <div>
        <Skeleton className="mb-2 h-4 w-32 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
        <Skeleton className="mt-4 h-2 w-full bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
      </div>

      {/* Sort */}
      <div>
        <Skeleton className="mb-2 h-4 w-14 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
        <Skeleton className="h-10 w-full bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
      </div>
    </div>
  );
}
