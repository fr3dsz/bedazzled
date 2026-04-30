"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useTotalPrice, useTotalItems, useCartActions } from "@/lib/store/cart-store-provider";

interface CartSummaryProps {
  hasStockIssues?: boolean;
}

export function CartSummary({ hasStockIssues = false }: CartSummaryProps) {
  const totalPrice = useTotalPrice();
  const totalItems = useTotalItems();
  const { closeCart } = useCartActions();

  if (totalItems === 0) return null;

  return (
    <div className="border-t border-[#F0D6E8] p-4 dark:border-[#8F4D7B]/30">
      <div className="flex justify-between text-base font-medium text-[#6A395B] dark:text-[#F5EDE0]">
        <span>Subtotal</span>
        <span>{formatPrice(totalPrice)}</span>
      </div>
      <p className="mt-1 text-sm text-[#BE7EAB] dark:text-[#DA90C4]">Shipping calculated at checkout</p>
      <div className="mt-4">
        {hasStockIssues ? (
          <Button disabled className="w-full bg-[#FAE8F3] text-[#BE7EAB] dark:bg-[#6A395B]/50 dark:text-[#DA90C4]/50">
            Resolve stock issues to checkout
          </Button>
        ) : (
          <Button asChild className="w-full bg-[#8F4D7B] text-[#F5EDE0] hover:bg-[#6A395B] transition-colors duration-200">
            <Link href="/checkout" onClick={() => closeCart()}>
              Checkout
            </Link>
          </Button>
        )}
      </div>
      <div className="mt-3 text-center">
        <Link href="/" onClick={() => closeCart()} className="text-sm text-[#BE7EAB] hover:text-[#8F4D7B] dark:text-[#DA90C4] dark:hover:text-[#F5EDE0] transition-colors">
          Continue Shopping →
        </Link>
      </div>
    </div>
  );
}
