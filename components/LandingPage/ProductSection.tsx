"use client";

import { useState } from "react";
import { PanelLeftClose, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ALL_CATEGORIES_QUERY_RESULT, FILTER_PRODUCTS_BY_NAME_QUERY_RESULT } from "@/sanity.types";
import { ProductFilters } from "./ProductFilters";
import { ProductGrid } from "./ProductGrid";

interface ProductSectionProps {
  categories: ALL_CATEGORIES_QUERY_RESULT;
  products: FILTER_PRODUCTS_BY_NAME_QUERY_RESULT;
  searchQuery: string;
}

export function ProductSection({ categories, products, searchQuery }: ProductSectionProps) {
  const [filtersOpen, setFiltersOpen] = useState(true);

  return (
    <div className="flex flex-col gap-6">
      {/* Header with results count and filter toggle */}
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-[#8F4D7B]/70 dark:text-[#BE7EAB]">
          {products.length} {products.length === 1 ? "design" : "designs"} found
          {searchQuery && (
            <span>
              {" "}
              for &quot;<span className="font-medium text-[#6A395B] dark:text-[#F5EDE0]">{searchQuery}</span>&quot;
            </span>
          )}
        </p>

        {/* Filter toggle button */}
        <Button variant="outline" size="sm" onClick={() => setFiltersOpen(!filtersOpen)} className="flex items-center gap-2 border-[#F0D6E8] bg-white text-[#8F4D7B] hover:bg-[#FDF7FB] hover:text-[#6A395B] dark:border-[#8F4D7B]/30 dark:bg-[#6A395B] dark:text-[#DA90C4] dark:hover:bg-[#3D1F35]/30" aria-label={filtersOpen ? "Hide filters" : "Show filters"}>
          {filtersOpen ? (
            <>
              <PanelLeftClose className="h-4 w-4" />
              <span className="hidden sm:inline">Hide Filters</span>
              <span className="sm:hidden">Hide</span>
            </>
          ) : (
            <>
              <PanelLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Show Filters</span>
              <span className="sm:hidden">Filters</span>
            </>
          )}
        </Button>
      </div>

      {/* Main content area */}
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar Filters */}
        <aside className={`shrink-0 transition-all duration-300 ease-in-out ${filtersOpen ? "w-full lg:w-72 lg:opacity-100" : "hidden lg:hidden"}`}>
          <ProductFilters categories={categories} />
        </aside>

        {/* Product Grid */}
        <main className="flex-1 transition-all duration-300">
          <ProductGrid products={products} />
        </main>
      </div>
    </div>
  );
}
