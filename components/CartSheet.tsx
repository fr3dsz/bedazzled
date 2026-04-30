"use client";
import { AlertTriangle, Loader2, ShoppingBag } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCartItems, useCartIsOpen, useCartActions, useTotalItems } from "@/lib/store/cart-store-provider";
import { useCartStock } from "@/lib/hooks/useCartStock";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";

export function CartSheet() {
  const items = useCartItems();
  const isOpen = useCartIsOpen();
  const totalItems = useTotalItems();
  const { closeCart } = useCartActions();
  const { stockMap, isLoading, hasStockIssues } = useCartStock(items);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="flex w-full flex-col sm:max-w-lg gap-0 bg-[#FDF7FB] dark:bg-[#3D1F35]">
        <SheetHeader className="border-b border-[#F0D6E8] dark:border-[#8F4D7B]/30">
          <SheetTitle className="flex items-center gap-2 text-[#6A395B] dark:text-[#F5EDE0]">
            <ShoppingBag className="h-5 w-5 text-[#8F4D7B] dark:text-[#DA90C4]" />
            Shopping Cart ({totalItems}){isLoading && <Loader2 className="h-4 w-4 animate-spin text-[#BE7EAB] dark:text-[#DA90C4]" />}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <ShoppingBag className="h-12 w-12 text-[#F0D6E8] dark:text-[#6A395B]" />
            <h3 className="mt-4 text-lg font-medium text-[#6A395B] dark:text-[#F5EDE0]">Your cart is empty</h3>
            <p className="mt-1 text-sm text-[#BE7EAB] dark:text-[#DA90C4]">Add some items to get started</p>
          </div>
        ) : (
          <>
            {/* Stock Issues Banner */}
            {hasStockIssues && !isLoading && (
              <div className="flex items-center gap-2 rounded-lg border border-[#F0D6E8] bg-[#FAE8F3] px-3 py-2 text-sm text-[#6A395B] dark:border-[#8F4D7B]/30 dark:bg-[#6A395B]/40 dark:text-[#F5EDE0]">
                <AlertTriangle className="h-4 w-4 shrink-0 text-[#8F4D7B] dark:text-[#DA90C4]" />
                <span>Some items have stock issues. Please review before checkout.</span>
              </div>
            )}

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-5">
              <div className="space-y-2 py-2 divide-y divide-[#F0D6E8] dark:divide-[#8F4D7B]/30">
                {items.map((item) => (
                  <CartItem key={item.productId} item={item} stockInfo={stockMap.get(item.productId)} />
                ))}
              </div>
            </div>

            {/* Summary */}
            <CartSummary hasStockIssues={hasStockIssues} />
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
