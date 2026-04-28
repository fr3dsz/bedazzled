"use client";

import { Minus, Plus, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCartActions, useCartItem } from "@/lib/store/cart-store-provider";

interface AddToCartButtonProps {
  productId: string;
  name: string;
  price: number;
  image?: string;
  stock: number;
  className?: string;
}

export function AddToCartButton({ productId, name, price, image, stock, className }: AddToCartButtonProps) {
  const { addItem, updateQuantity } = useCartActions();
  const cartItem = useCartItem(productId);

  const quantityInCart = cartItem?.quantity ?? 0;
  const isOutOfStock = stock <= 0;
  const isAtMax = quantityInCart >= stock;

  const handleAdd = () => {
    if (quantityInCart < stock) {
      addItem({ productId, name, price, image }, 1);
      toast.success(`Added ${name}`);
    }
  };

  const handleDecrement = () => {
    if (quantityInCart > 0) {
      updateQuantity(productId, quantityInCart - 1);
    }
  };

  // Out of stock
  if (isOutOfStock) {
    return (
      <Button disabled variant="secondary" className={cn("h-11 w-full bg-[#F9F1F4] text-[#B8899A] dark:bg-[#2D1018] dark:text-[#7D2035]/50", className)}>
        Out of Stock
      </Button>
    );
  }

  // Not in cart — show Add to Basket button
  if (quantityInCart === 0) {
    return (
      <Button onClick={handleAdd} className={cn("h-11 w-full bg-[#7D2035] text-[#F5EDE0] hover:bg-[#4A0E1F] dark:bg-[#7D2035] dark:text-[#F5EDE0] dark:hover:bg-[#4A0E1F]", className)}>
        <ShoppingBag className="mr-2 h-4 w-4" />
        Add to Basket
      </Button>
    );
  }

  // In cart — show quantity controls
  return (
    <div className={cn("flex h-11 w-full items-center rounded-md border border-[#E8D0D8] bg-white dark:border-[#7D2035]/30 dark:bg-[#2D1018]", className)}>
      <Button variant="ghost" size="icon" className="h-full flex-1 rounded-r-none text-[#7D2035] hover:bg-[#FFF8F5] hover:text-[#4A0E1F] dark:text-[#B8899A] dark:hover:bg-[#4A0E1F]/30" onClick={handleDecrement}>
        <Minus className="h-4 w-4" />
      </Button>

      <span className="flex-1 text-center text-sm font-semibold tabular-nums text-[#2D1018] dark:text-[#F5EDE0]">{quantityInCart}</span>

      <Button variant="ghost" size="icon" className="h-full flex-1 rounded-l-none text-[#7D2035] hover:bg-[#FFF8F5] hover:text-[#4A0E1F] disabled:opacity-20 dark:text-[#B8899A] dark:hover:bg-[#4A0E1F]/30" onClick={handleAdd} disabled={isAtMax}>
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
