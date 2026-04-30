import Link from "next/link";
import { AddToCartButton } from "@/components/AddToCartButton";
import { StockBadge } from "@/components/StockBadge";
import { formatPrice } from "@/lib/utils";
import type { PRODUCT_BY_SLUG_QUERY_RESULT } from "@/sanity.types";

interface ProductInfoProps {
  product: NonNullable<PRODUCT_BY_SLUG_QUERY_RESULT>;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const imageUrl = product.images?.[0]?.asset?.url;

  return (
    <div className="flex flex-col">
      {/* Category */}
      {product.category && (
        <Link href={`/?category=${product.category.slug}`} className="text-sm text-[#BE7EAB] hover:text-[#8F4D7B] dark:text-[#DA90C4] dark:hover:text-[#F5EDE0] transition-colors">
          {product.category.title}
        </Link>
      )}

      {/* Title */}
      <h1 className="mt-2 text-3xl font-bold text-[#6A395B] dark:text-[#F5EDE0]">{product.name}</h1>

      {/* Price */}
      <p className="mt-4 text-2xl font-semibold text-[#8F4D7B] dark:text-[#DA90C4]">{formatPrice(product.price)}</p>

      {/* Description */}
      {product.description && <p className="mt-4 text-[#6A395B]/70 dark:text-[#F5EDE0]/70">{product.description}</p>}

      {/* Stock & Add to Cart */}
      <div className="mt-6 flex flex-col gap-3">
        <StockBadge productId={product._id} stock={product.stock ?? 0} />
        <AddToCartButton productId={product._id} name={product.name ?? "Unknown Product"} price={product.price ?? 0} image={imageUrl ?? undefined} stock={product.stock ?? 0} />
      </div>

      {/* Metadata */}
      <div className="mt-6 space-y-2 border-t border-[#F0D6E8] pt-6 dark:border-[#8F4D7B]/30">
        {/* Nail Shape */}
        {product.shape && (
          <div className="flex justify-between text-sm">
            <span className="text-[#BE7EAB] dark:text-[#DA90C4]">Nail Shape</span>
            <span className="font-medium capitalize text-[#6A395B] dark:text-[#F5EDE0]">{product.shape}</span>
          </div>
        )}

        {/* Colors — now an array */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-[#BE7EAB] dark:text-[#DA90C4]">Colors / Finish</span>
            <div className="flex flex-wrap justify-end gap-1">
              {product.colors.map((color) => (
                <span key={color} className="rounded-full bg-[#FAE8F3] px-2 py-0.5 text-xs font-medium capitalize text-[#8F4D7B] dark:bg-[#6A395B]/50 dark:text-[#DA90C4]">
                  {color}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Stock count */}
        {product.stock !== null && product.stock !== undefined && (
          <div className="flex justify-between text-sm">
            <span className="text-[#BE7EAB] dark:text-[#DA90C4]">Availability</span>
            <span className="font-medium text-[#6A395B] dark:text-[#F5EDE0]">{product.stock > 0 ? `${product.stock} sets in stock` : "Out of stock"}</span>
          </div>
        )}
      </div>
    </div>
  );
}
