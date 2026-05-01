import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/live";
import { PRODUCT_BY_SLUG_QUERY } from "@/sanity/queries/products";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductInfo } from "@/components/ProductInfo";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const { data: product } = await sanityFetch({
    query: PRODUCT_BY_SLUG_QUERY,
    params: { slug },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#FDF7FB] dark:bg-[#3D1F35]">
      <div className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 lg:px-12 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-start xl:grid-cols-[55%_45%]">
          {/* Image Gallery — sticky + bigger */}
          <div className="lg:sticky lg:top-24">
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* Product Info */}
          <ProductInfo product={product} />
        </div>
      </div>
    </div>
  );
}
