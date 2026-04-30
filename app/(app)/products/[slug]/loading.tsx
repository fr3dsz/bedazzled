import { ProductGallerySkeleton } from "@/components/ProductGallerySkeleton";
import { ProductInfoSkeleton } from "@/components/ProductInfoSkeleton";

export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-[#FDF7FB] dark:bg-[#3D1F35]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <ProductGallerySkeleton />
          <ProductInfoSkeleton />
        </div>
      </div>
    </div>
  );
}
