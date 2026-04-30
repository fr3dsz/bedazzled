import { Skeleton } from "@/components/ui/skeleton";

export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 md:gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#F0D6E8] dark:bg-[#6A395B] dark:ring-[#8F4D7B]/30">
          <Skeleton className="aspect-4/5 w-full bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
          <div className="space-y-3 p-5">
            <Skeleton className="h-5 w-4/5 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-7 w-24 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
              <Skeleton className="h-5 w-16 rounded-full bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
            </div>
            <Skeleton className="h-11 w-full rounded-lg bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
          </div>
        </div>
      ))}
    </div>
  );
}
