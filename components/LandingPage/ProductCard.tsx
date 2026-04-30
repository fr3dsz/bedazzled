"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, formatPrice } from "@/lib/utils";
import type { FILTER_PRODUCTS_BY_NAME_QUERY_RESULT } from "@/sanity.types";
import { StockBadge } from "../StockBadge";
import { AddToCartButton } from "../AddToCartButton";

type Product = FILTER_PRODUCTS_BY_NAME_QUERY_RESULT[number];

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [hoveredImageIndex, setHoveredImageIndex] = useState<number | null>(null);

  const images = product.images ?? [];
  const mainImageUrl = images[0]?.asset?.url;
  const displayedImageUrl = hoveredImageIndex !== null ? images[hoveredImageIndex]?.asset?.url : mainImageUrl;

  const stock = product.stock ?? 0;
  const isOutOfStock = stock <= 0;
  const hasMultipleImages = images.length > 1;

  return (
    <Card className="group relative flex h-full flex-col overflow-hidden rounded-2xl border-0 bg-white p-0 shadow-sm ring-1 ring-[#F0D6E8] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#BE7EAB]/20 dark:bg-[#6A395B] dark:ring-[#8F4D7B]/30 dark:hover:shadow-[#3D1F35]/50">
      <Link href={`/products/${product.slug}`} className="block">
        <div className={cn("relative overflow-hidden bg-linear-to-br from-[#FDF7FB] to-[#F9EEF5] dark:from-[#6A395B] dark:to-[#3D1F35]", hasMultipleImages ? "aspect-square" : "aspect-4/5")}>
          {displayedImageUrl ? (
            <Image src={displayedImageUrl} alt={product.name ?? "Product image"} fill className="object-cover transition-transform duration-500 ease-out group-hover:scale-110" sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" />
          ) : (
            <div className="flex h-full items-center justify-center text-[#BE7EAB]">
              <svg className="h-16 w-16 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-linear-to-t from-[#6A395B]/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          {isOutOfStock && (
            <Badge variant="destructive" className="absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-medium shadow-lg">
              Out of Stock
            </Badge>
          )}

          {product.category && <span className="absolute left-3 top-3 rounded-full bg-[#F5EDE0]/90 px-3 py-1 text-xs font-medium text-[#8F4D7B] shadow-sm backdrop-blur-sm dark:bg-[#6A395B]/90 dark:text-[#F5EDE0]">{product.category.title}</span>}
        </div>
      </Link>

      {/* Thumbnail strip */}
      {hasMultipleImages && (
        <div className="flex gap-2 border-t border-[#F0D6E8] bg-[#FDF7FB]/50 p-3 dark:border-[#8F4D7B]/20 dark:bg-[#3D1F35]/30">
          {images.map((image, index) => (
            <button key={image._key ?? index} type="button" className={cn("relative h-14 flex-1 overflow-hidden rounded-lg transition-all duration-200", hoveredImageIndex === index ? "ring-2 ring-[#8F4D7B] ring-offset-2 dark:ring-[#DA90C4] dark:ring-offset-[#6A395B]" : "opacity-50 hover:opacity-100")} onMouseEnter={() => setHoveredImageIndex(index)} onMouseLeave={() => setHoveredImageIndex(null)}>
              {image.asset?.url && <Image src={image.asset.url} alt={`${product.name} - view ${index + 1}`} fill className="object-cover" sizes="100px" />}
            </button>
          ))}
        </div>
      )}

      <CardContent className="flex grow flex-col justify-between gap-2 p-5">
        <Link href={`/products/${product.slug}`} className="block">
          <h3 className="line-clamp-2 text-base font-semibold leading-tight text-[#6A395B] transition-colors group-hover:text-[#8F4D7B] dark:text-[#F5EDE0] dark:group-hover:text-[#EDD5E8]">{product.name}</h3>
        </Link>
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-xl font-bold tracking-tight text-[#8F4D7B] dark:text-[#F5EDE0]">{formatPrice(product.price)}</p>
          <StockBadge productId={product._id} stock={stock} />
        </div>
      </CardContent>

      <CardFooter className="mt-auto p-5 pt-0">
        <AddToCartButton productId={product._id} name={product.name ?? "Unknown Product"} price={product.price ?? 0} image={mainImageUrl ?? undefined} stock={stock} />
      </CardFooter>
    </Card>
  );
}
