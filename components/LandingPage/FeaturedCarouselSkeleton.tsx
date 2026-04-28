import { Skeleton } from "@/components/ui/skeleton";

export function FeaturedCarouselSkeleton() {
  return (
    <div className="relative w-full bg-gradient-to-br from-[#2D1018] via-[#4A0E1F] to-[#2D1018] dark:from-[#1A0810] dark:via-[#2D1018] dark:to-[#1A0810]">
      <div className="flex min-h-[400px] flex-col md:min-h-[450px] md:flex-row lg:min-h-[500px]">
        {/* Image Section Skeleton */}
        <div className="relative h-64 w-full md:h-auto md:w-3/5">
          <Skeleton className="h-full w-full rounded-none bg-[#4A0E1F]" />
        </div>

        {/* Content Section Skeleton */}
        <div className="flex w-full flex-col justify-center px-6 py-8 md:w-2/5 md:px-10 lg:px-16">
          {/* Category badge */}
          <Skeleton className="mb-4 h-6 w-24 bg-[#7D2035]/50" />

          {/* Title */}
          <Skeleton className="h-10 w-3/4 bg-[#7D2035]/50 sm:h-12" />

          {/* Description */}
          <div className="mt-4 space-y-2">
            <Skeleton className="h-4 w-full bg-[#7D2035]/50" />
            <Skeleton className="h-4 w-5/6 bg-[#7D2035]/50" />
            <Skeleton className="h-4 w-4/6 bg-[#7D2035]/50" />
          </div>

          {/* Price */}
          <Skeleton className="mt-6 h-10 w-32 bg-[#7D2035]/50" />

          {/* Button */}
          <Skeleton className="mt-8 h-12 w-36 bg-[#7D2035]/50" />
        </div>
      </div>

      {/* Dot indicators skeleton */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 sm:bottom-6">
        <Skeleton className="h-2 w-6 rounded-full bg-[#B8899A]/40" />
        <Skeleton className="h-2 w-2 rounded-full bg-[#B8899A]/40" />
        <Skeleton className="h-2 w-2 rounded-full bg-[#B8899A]/40" />
      </div>
    </div>
  );
}
