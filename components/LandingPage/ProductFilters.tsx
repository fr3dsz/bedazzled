"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { COLORS, SHAPES, SORT_OPTIONS } from "@/lib/constants/filters";
import type { ALL_CATEGORIES_QUERY_RESULT } from "@/sanity.types";

interface ProductFiltersProps {
  categories: ALL_CATEGORIES_QUERY_RESULT;
}

export function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("q") ?? "";
  const currentCategory = searchParams.get("category") ?? "";
  const currentColor = searchParams.get("color") ?? "";
  const currentShape = searchParams.get("shape") ?? "";
  const currentSort = searchParams.get("sort") ?? "name";
  const urlMinPrice = Number(searchParams.get("minPrice")) || 0;
  const urlMaxPrice = Number(searchParams.get("maxPrice")) || 1000;
  const currentInStock = searchParams.get("inStock") === "true";

  const [priceRange, setPriceRange] = useState<[number, number]>([urlMinPrice, urlMaxPrice]);

  useEffect(() => {
    setPriceRange([urlMinPrice, urlMaxPrice]);
  }, [urlMinPrice, urlMaxPrice]);

  const isSearchActive = !!currentSearch;
  const isCategoryActive = !!currentCategory;
  const isColorActive = !!currentColor;
  const isShapeActive = !!currentShape;
  const isPriceActive = urlMinPrice > 0 || urlMaxPrice < 1000;
  const isInStockActive = currentInStock;

  const hasActiveFilters = isSearchActive || isCategoryActive || isColorActive || isShapeActive || isPriceActive || isInStockActive;

  const activeFilterCount = [isSearchActive, isCategoryActive, isColorActive, isShapeActive, isPriceActive, isInStockActive].filter(Boolean).length;

  const updateParams = useCallback(
    (updates: Record<string, string | number | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "" || value === 0) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchQuery = formData.get("search") as string;
    updateParams({ q: searchQuery || null });
  };

  const handleClearFilters = () => {
    router.push("/", { scroll: false });
  };

  const clearSingleFilter = (key: string) => {
    if (key === "price") {
      updateParams({ minPrice: null, maxPrice: null });
    } else {
      updateParams({ [key]: null });
    }
  };

  const FilterLabel = ({ children, isActive, filterKey }: { children: React.ReactNode; isActive: boolean; filterKey: string }) => (
    <div className="mb-2 flex items-center justify-between">
      <span className={`block text-sm font-medium ${isActive ? "text-[#6A395B] dark:text-[#F5EDE0]" : "text-[#8F4D7B]/70 dark:text-[#BE7EAB]"}`}>
        {children}
        {isActive && <Badge className="ml-2 h-5 bg-[#8F4D7B] px-1.5 text-xs text-[#F5EDE0] hover:bg-[#6A395B]">Active</Badge>}
      </span>
      {isActive && (
        <button type="button" onClick={() => clearSingleFilter(filterKey)} className="text-[#BE7EAB] hover:text-[#8F4D7B] dark:hover:text-[#F5EDE0]" aria-label={`Clear ${filterKey} filter`}>
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );

  const activeInputClass = "border-[#8F4D7B] ring-1 ring-[#8F4D7B] dark:border-[#DA90C4] dark:ring-[#DA90C4]";

  return (
    <div className="space-y-6 rounded-lg border border-[#F0D6E8] bg-white p-6 dark:border-[#8F4D7B]/30 dark:bg-[#6A395B]">
      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="rounded-lg border-2 border-[#BE7EAB] bg-[#FDF7FB] p-3 dark:border-[#8F4D7B] dark:bg-[#3D1F35]/40">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-[#8F4D7B] dark:text-[#F5EDE0]">
              {activeFilterCount} {activeFilterCount === 1 ? "filter" : "filters"} applied
            </span>
          </div>
          <Button size="sm" onClick={handleClearFilters} className="w-full bg-[#8F4D7B] text-[#F5EDE0] hover:bg-[#6A395B] dark:bg-[#8F4D7B] dark:hover:bg-[#6A395B]">
            <X className="mr-2 h-4 w-4" />
            Clear All Filters
          </Button>
        </div>
      )}

      {/* Search */}
      <div>
        <FilterLabel isActive={isSearchActive} filterKey="q">
          Search
        </FilterLabel>
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <Input name="search" placeholder="Search nail designs..." defaultValue={currentSearch} className={`flex-1 ${isSearchActive ? activeInputClass : ""}`} />
          <Button type="submit" size="sm" className="bg-[#8F4D7B] text-[#F5EDE0] hover:bg-[#6A395B]">
            Search
          </Button>
        </form>
      </div>

      {/* Category */}
      <div>
        <FilterLabel isActive={isCategoryActive} filterKey="category">
          Category
        </FilterLabel>
        <Select value={currentCategory || "all"} onValueChange={(value) => updateParams({ category: value === "all" ? null : value })}>
          <SelectTrigger className={isCategoryActive ? activeInputClass : ""}>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category._id} value={category.slug ?? ""}>
                {category.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Color / Finish */}
      <div>
        <FilterLabel isActive={isColorActive} filterKey="color">
          Color / Finish
        </FilterLabel>
        <Select value={currentColor || "all"} onValueChange={(value) => updateParams({ color: value === "all" ? null : value })}>
          <SelectTrigger className={isColorActive ? activeInputClass : ""}>
            <SelectValue placeholder="All Colors" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Colors</SelectItem>
            {COLORS.map((color) => (
              <SelectItem key={color.value} value={color.value}>
                {color.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Nail Shape */}
      <div>
        <FilterLabel isActive={isShapeActive} filterKey="shape">
          Nail Shape
        </FilterLabel>
        <Select value={currentShape || "all"} onValueChange={(value) => updateParams({ shape: value === "all" ? null : value })}>
          <SelectTrigger className={isShapeActive ? activeInputClass : ""}>
            <SelectValue placeholder="All Shapes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Shapes</SelectItem>
            {SHAPES.map((shape) => (
              <SelectItem key={shape.value} value={shape.value}>
                {shape.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div>
        <FilterLabel isActive={isPriceActive} filterKey="price">
          Price Range: ₱{priceRange[0]} - ₱{priceRange[1]}
        </FilterLabel>
        <Slider
          min={0}
          max={1000}
          step={100}
          value={priceRange}
          onValueChange={(value) => setPriceRange(value as [number, number])}
          onValueCommitted={(value) => {
            const [min, max] = value as [number, number];
            updateParams({
              minPrice: min > 0 ? min : null,
              maxPrice: max < 1000 ? max : null,
            });
          }}
          className={`mt-4 ${isPriceActive ? "[&_[role=slider]]:border-[#8F4D7B] [&_[role=slider]]:ring-[#8F4D7B]" : ""}`}
        />
      </div>

      {/* In Stock Only */}
      <div>
        <label className="flex cursor-pointer items-center gap-3">
          <input type="checkbox" checked={currentInStock} onChange={(e) => updateParams({ inStock: e.target.checked ? "true" : null })} className="h-5 w-5 rounded border-[#F0D6E8] text-[#8F4D7B] focus:ring-[#8F4D7B] dark:border-[#8F4D7B]/50 dark:bg-[#6A395B]" />
          <span className={`text-sm font-medium ${isInStockActive ? "text-[#6A395B] dark:text-[#F5EDE0]" : "text-[#8F4D7B]/70 dark:text-[#BE7EAB]"}`}>
            Show only in-stock
            {isInStockActive && <Badge className="ml-2 h-5 bg-[#8F4D7B] px-1.5 text-xs text-[#F5EDE0] hover:bg-[#6A395B]">Active</Badge>}
          </span>
        </label>
      </div>

      {/* Sort */}
      <div>
        <span className="mb-2 block text-sm font-medium text-[#8F4D7B]/70 dark:text-[#BE7EAB]">Sort By</span>
        <Select value={currentSort} onValueChange={(value) => updateParams({ sort: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
