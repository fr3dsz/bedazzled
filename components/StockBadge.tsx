"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { isLowStock as checkLowStock } from "@/lib/constants/stock";
import { useCartItem } from "@/lib/store/cart-store-provider";

interface StockBadgeProps {
  productId: string;
  stock: number;
  className?: string;
}

export function StockBadge({ productId, stock, className }: StockBadgeProps) {
  const cartItem = useCartItem(productId);

  const quantityInCart = cartItem?.quantity ?? 0;
  const isAtMax = quantityInCart >= stock && stock > 0;
  const lowStock = checkLowStock(stock);

  if (isAtMax) {
    return (
      <Badge variant="secondary" className={cn("w-fit bg-[#F9EEF5] text-[#8F4D7B] dark:bg-[#3D1F35]/50 dark:text-[#F5EDE0]", className)}>
        Max in cart
      </Badge>
    );
  }

  if (lowStock) {
    return (
      <Badge variant="secondary" className={cn("w-fit bg-[#FAE8F3] text-[#6A395B] dark:bg-[#8F4D7B]/30 dark:text-[#EDD5E8]", className)}>
        Only {stock} left in stock
      </Badge>
    );
  }

  return null;
}
