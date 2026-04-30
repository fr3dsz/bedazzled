import { Suspense } from "react";
import { sanityFetch } from "@/sanity/lib/live";
import { FEATURED_PRODUCTS_QUERY, FILTER_PRODUCTS_BY_NAME_QUERY, FILTER_PRODUCTS_BY_PRICE_ASC_QUERY, FILTER_PRODUCTS_BY_PRICE_DESC_QUERY, FILTER_PRODUCTS_BY_RELEVANCE_QUERY, FILTER_PRODUCTS_BY_NEWEST_QUERY } from "@/sanity/queries/products";
import { FeaturedCarousel } from "@/components/LandingPage/FeaturedCarousel";
import { ALL_CATEGORIES_QUERY } from "@/sanity/queries/categories";
import { CategoryTiles } from "@/components/LandingPage/CategoryTiles";
import { FeaturedCarouselSkeleton } from "@/components/LandingPage/FeaturedCarouselSkeleton";
import { ProductSection } from "@/components/LandingPage/ProductSection";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    color?: string;
    shape?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    inStock?: string;
  }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;

  const searchQuery = params.q ?? "";
  const categorySlug = params.category ?? "";
  const color = params.color ?? "";
  const shape = params.shape ?? ""; // ← was material
  const minPrice = Number(params.minPrice) || 0;
  const maxPrice = Number(params.maxPrice) || 0;
  const sort = params.sort ?? "name";
  const inStock = params.inStock === "true";

  // Select query based on sort parameter
  const getQuery = () => {
    if (searchQuery && sort === "relevance") {
      return FILTER_PRODUCTS_BY_RELEVANCE_QUERY;
    }

    switch (sort) {
      case "price_asc":
        return FILTER_PRODUCTS_BY_PRICE_ASC_QUERY;
      case "price_desc":
        return FILTER_PRODUCTS_BY_PRICE_DESC_QUERY;
      case "relevance":
        return FILTER_PRODUCTS_BY_RELEVANCE_QUERY;
      case "newest": // ← added
        return FILTER_PRODUCTS_BY_NEWEST_QUERY;
      default:
        return FILTER_PRODUCTS_BY_NAME_QUERY;
    }
  };

  // Fetch products with filters (server-side via GROQ)
  const { data: products } = await sanityFetch({
    query: getQuery(),
    params: {
      searchQuery,
      categorySlug,
      color,
      shape,
      minPrice,
      maxPrice,
      inStock,
    },
  });

  // Fetch categories for filter sidebar
  const { data: categories } = await sanityFetch({
    query: ALL_CATEGORIES_QUERY,
  });

  // Fetch featured products for carousel
  const { data: featuredProducts } = await sanityFetch({
    query: FEATURED_PRODUCTS_QUERY,
  });

  return (
    <div className="min-h-screen bg-[#FDF7FB] dark:bg-[#3D1F35]">
      {/* Featured Products Carousel */}
      {featuredProducts.length > 0 && (
        <Suspense fallback={<FeaturedCarouselSkeleton />}>
          <FeaturedCarousel products={featuredProducts} />
        </Suspense>
      )}

      {/* Page Banner */}
      <div className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        {/* Category Tiles - Full width */}
        {/* <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold tracking-tight text-[#6A395B] dark:text-[#F5EDE0]">{categorySlug ? categorySlug : "All Designs"}</h1>
          <p className="mt-1 text-sm text-[#BE7EAB] dark:text-[#DA90C4]">Handcrafted nail extensions, designed just for you 💅</p>
        </div>
        <div className="mt-6">
          <CategoryTiles categories={categories} activeCategory={categorySlug || undefined} />
        </div> */}
      </div>

      {/* Product Section */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ProductSection categories={categories} products={products} searchQuery={searchQuery} />
      </div>
    </div>
  );
}
