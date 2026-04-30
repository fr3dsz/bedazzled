"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { PRODUCT_BY_SLUG_QUERY_RESULT } from "@/sanity.types";

type ProductImages = NonNullable<NonNullable<PRODUCT_BY_SLUG_QUERY_RESULT>["images"]>;

interface ProductGalleryProps {
  images: ProductImages | null;
  productName: string | null;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-lg bg-[#FAE8F3] dark:bg-[#6A395B]">
        <span className="text-[#BE7EAB] dark:text-[#DA90C4]">No images available</span>
      </div>
    );
  }

  const selectedImage = images[selectedIndex];

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-lg bg-[#FAE8F3] dark:bg-[#6A395B]">{selectedImage?.asset?.url ? <Image src={selectedImage.asset.url} alt={productName ?? "Product image"} fill className="object-contain" sizes="(max-width: 1024px) 100vw, 50vw" priority /> : <div className="flex h-full items-center justify-center text-[#BE7EAB] dark:text-[#DA90C4]">No image</div>}</div>

      {/* Thumbnail Grid */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-6">
          {images.map((image, index) => (
            <button key={image._key} type="button" onClick={() => setSelectedIndex(index)} aria-label={`View image ${index + 1}`} aria-pressed={selectedIndex === index} className={cn("relative aspect-square overflow-hidden rounded-md bg-[#FAE8F3] transition-all dark:bg-[#6A395B]", selectedIndex === index ? "ring-2 ring-[#8F4D7B] ring-offset-2 ring-offset-[#FDF7FB] dark:ring-[#DA90C4] dark:ring-offset-[#3D1F35]" : "hover:opacity-75 hover:ring-1 hover:ring-[#BE7EAB]")}>
              {image.asset?.url ? <Image src={image.asset.url} alt={`${productName} thumbnail ${index + 1}`} fill className="object-cover" sizes="100px" /> : <div className="flex h-full items-center justify-center text-xs text-[#BE7EAB] dark:text-[#DA90C4]">N/A</div>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
