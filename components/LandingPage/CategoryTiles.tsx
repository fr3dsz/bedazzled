import Link from "next/link";
import Image from "next/image";
import { Grid2x2 } from "lucide-react";
import type { ALL_CATEGORIES_QUERY_RESULT } from "@/sanity.types";

interface CategoryTilesProps {
  categories: ALL_CATEGORIES_QUERY_RESULT;
  activeCategory?: string;
}

export function CategoryTiles({ categories, activeCategory }: CategoryTilesProps) {
  return (
    <div className="relative">
      <div className="flex gap-4 overflow-x-auto py-4 pl-8 pr-4 sm:pl-12 sm:pr-6 lg:pl-10 lg:pr-8 scrollbar-hide">
        {/* All Products tile */}
        <Link href="/" className={`group relative flex-shrink-0 overflow-hidden rounded-xl transition-all duration-300 ${!activeCategory ? "ring-2 ring-[#7D2035] ring-offset-2 dark:ring-offset-[#1A0810]" : "hover:ring-2 hover:ring-[#B8899A] hover:ring-offset-2 dark:hover:ring-[#B8899A] dark:hover:ring-offset-[#1A0810]"}`}>
          <div className="relative h-32 w-56 sm:h-56 sm:w-80">
            {/* Mauve gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#B8899A] to-[#7D2035] dark:from-[#4A0E1F] dark:to-[#2D1018]" />

            {/* Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Grid2x2 className="h-12 w-12 text-white/60 transition-transform duration-300 group-hover:scale-110" />
            </div>

            {/* Dark overlay for text */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Category name */}
            <div className="absolute inset-x-0 bottom-0 p-4">
              <span className="text-base font-semibold text-[#F5EDE0] drop-shadow-md">All Designs</span>
            </div>
          </div>
        </Link>

        {/* Category tiles */}
        {categories.map((category) => {
          const isActive = activeCategory === category.slug;
          const imageUrl = category.image?.asset?.url;

          return (
            <Link key={category._id} href={`/?category=${category.slug}`} className={`group relative flex-shrink-0 overflow-hidden rounded-xl transition-all duration-300 ${isActive ? "ring-2 ring-[#7D2035] ring-offset-2 dark:ring-offset-[#1A0810]" : "hover:ring-2 hover:ring-[#B8899A] hover:ring-offset-2 dark:hover:ring-[#B8899A] dark:hover:ring-offset-[#1A0810]"}`}>
              <div className="relative h-32 w-56 sm:h-56 sm:w-80">
                {/* Background image or mauve gradient fallback */}
                {imageUrl ? <Image src={imageUrl} alt={category.title ?? "Category"} fill className="object-cover transition-transform duration-500 group-hover:scale-110" /> : <div className="absolute inset-0 bg-gradient-to-br from-[#B8899A] to-[#7D2035]" />}

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300 group-hover:from-black/80" />

                {/* Category name */}
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <span className="text-base font-semibold text-[#F5EDE0] drop-shadow-md">{category.title}</span>
                </div>

                {/* Active indicator */}
                {isActive && (
                  <div className="absolute top-2 right-2">
                    <span className="flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#B8899A] opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-[#7D2035]" />
                    </span>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
