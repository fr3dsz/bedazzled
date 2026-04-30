import { PackageSearch } from "lucide-react";
import type { FILTER_PRODUCTS_BY_NAME_QUERY_RESULT } from "@/sanity.types";
import { EmptyState } from "../ui/empty-state";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: FILTER_PRODUCTS_BY_NAME_QUERY_RESULT;
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="min-h-[400px] rounded-2xl border-2 border-dashed border-[#F0D6E8] bg-[#FDF7FB]/50 dark:border-[#8F4D7B]/30 dark:bg-[#6A395B]/50">
        <EmptyState icon={PackageSearch} title="No designs found" description="Try adjusting your search or filters to find what you're looking for" size="lg" />
      </div>
    );
  }

  return (
    <div className="@container">
      <div className="grid grid-cols-1 gap-6 @md:grid-cols-2 @xl:grid-cols-3 @6xl:grid-cols-4 @md:gap-8">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
