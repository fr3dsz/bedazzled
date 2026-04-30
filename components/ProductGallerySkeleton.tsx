import { Skeleton } from "@/components/ui/skeleton";

export function ProductGallerySkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <Skeleton className="aspect-square w-full rounded-lg bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />

      {/* Thumbnail Gallery */}
      <div className="flex gap-2 overflow-x-auto">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-20 shrink-0 rounded-md bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
        ))}
      </div>
    </div>
  );
}
