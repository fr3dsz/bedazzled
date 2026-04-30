import { CategoryTilesSkeleton } from "@/components/CategoryTilesSkeleton";
import { ProductFiltersSkeleton } from "@/components/ProductFiltersSkeleton";
import { ProductGridSkeleton } from "@/components/ProductGridSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-[#FDF7FB] dark:bg-[#3D1F35]">
      {/* Page Banner */}
      <div className="border-b border-[#F0D6E8] bg-white dark:border-[#8F4D7B]/30 dark:bg-[#6A395B]">
        <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <Skeleton className="h-8 w-48 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
          <Skeleton className="mt-2 h-4 w-56 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
        </div>

        {/* Category Tiles */}
        <div className="mt-6">
          <CategoryTilesSkeleton />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar Filters */}
          <aside className="w-full shrink-0 lg:w-72">
            <ProductFiltersSkeleton />
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            {/* Results count */}
            <div className="mb-6 flex items-center justify-between">
              <Skeleton className="h-4 w-32 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
            </div>

            <ProductGridSkeleton />
          </main>
        </div>
      </div>
    </div>
  );
}
