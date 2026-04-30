"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatPrice } from "@/lib/utils";
import type { FEATURED_PRODUCTS_QUERY_RESULT } from "@/sanity.types";

type FeaturedProduct = FEATURED_PRODUCTS_QUERY_RESULT[number];

interface FeaturedCarouselProps {
  products: FEATURED_PRODUCTS_QUERY_RESULT;
}

export function FeaturedCarousel({ products }: FeaturedCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api],
  );

  if (products.length === 0) return null;

  return (
    <div className="relative w-full bg-gradient-to-br from-[#6A395B] via-[#8F4D7B] to-[#6A395B] dark:from-[#3D1F35] dark:via-[#6A395B] dark:to-[#3D1F35]">
      <Carousel setApi={setApi} opts={{ loop: true, align: "start" }} plugins={[Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })]} className="w-full">
        <CarouselContent className="-ml-0">
          {products.map((product) => (
            <CarouselItem key={product._id} className="pl-0">
              <FeaturedSlide product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation arrows */}
        <CarouselPrevious className="left-4 border-[#8F4D7B] bg-[#6A395B]/80 text-[#F5EDE0] hover:bg-[#8F4D7B] hover:text-[#F5EDE0] sm:left-8" />
        <CarouselNext className="right-4 border-[#8F4D7B] bg-[#6A395B]/80 text-[#F5EDE0] hover:bg-[#8F4D7B] hover:text-[#F5EDE0] sm:right-8" />
      </Carousel>

      {/* Dot indicators */}
      {count > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 sm:bottom-6">
          {Array.from({ length: count }).map((_, index) => (
            <button key={`dot-${index}`} type="button" onClick={() => scrollTo(index)} className={cn("h-2 rounded-full transition-all duration-300", current === index ? "w-6 bg-[#F5EDE0]" : "w-2 bg-[#DA90C4]/50 hover:bg-[#DA90C4]")} aria-label={`Go to slide ${index + 1}`} />
          ))}
        </div>
      )}
    </div>
  );
}

interface FeaturedSlideProps {
  product: FeaturedProduct;
}

function FeaturedSlide({ product }: FeaturedSlideProps) {
  const mainImage = product.images?.[0]?.asset?.url;

  return (
    <div className="flex min-h-[400px] flex-col md:min-h-[450px] md:flex-row lg:min-h-[500px]">
      {/* Image Section - Left side */}
      <div className="relative h-64 w-full md:h-auto md:w-3/5">
        {mainImage ? (
          <Image src={mainImage} alt={product.name ?? "Featured product"} fill className="object-cover" sizes="(max-width: 768px) 100vw, 60vw" priority />
        ) : (
          <div className="flex h-full items-center justify-center bg-[#6A395B]">
            <span className="text-[#BE7EAB]">No image</span>
          </div>
        )}

        {/* Gradient overlay blending into content */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#6A395B]/90 dark:to-[#3D1F35]/90 hidden md:block" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#6A395B]/90 via-transparent to-transparent md:hidden" />
      </div>

      {/* Content Section - Right side */}
      <div className="flex w-full flex-col justify-center px-6 py-8 md:w-2/5 md:px-10 lg:px-16">
        {product.category && (
          <Badge variant="secondary" className="mb-4 w-fit bg-[#8F4D7B]/30 text-[#F5EDE0] hover:bg-[#8F4D7B]/50 border border-[#DA90C4]/30">
            {product.category.title}
          </Badge>
        )}

        <h2 className="text-2xl font-bold tracking-tight text-[#F5EDE0] sm:text-3xl lg:text-4xl">{product.name}</h2>
        {product.description && <p className="mt-4 line-clamp-3 text-sm text-[#EDD5E8] sm:text-base lg:text-lg">{product.description}</p>}
        <p className="mt-6 text-3xl font-bold text-[#F5EDE0] lg:text-4xl">{formatPrice(product.price)}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="bg-[#F5EDE0] text-[#6A395B] hover:bg-[#EDD5E8] transition-colors duration-200">
            <Link href={`/products/${product.slug}`}>
              Shop Now <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
