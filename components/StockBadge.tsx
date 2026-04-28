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
      <Badge variant="secondary" className={cn("w-fit bg-[#F9F1F4] text-[#7D2035] dark:bg-[#4A0E1F]/50 dark:text-[#F5EDE0]", className)}>
        Max in cart
      </Badge>
    );
  }

  if (lowStock) {
    return (
      <Badge variant="secondary" className={cn("w-fit bg-[#F5E0E6] text-[#4A0E1F] dark:bg-[#7D2035]/30 dark:text-[#E8C8D4]", className)}>
        Only {stock} left in stock
      </Badge>
    );
  }

  return null;
}
