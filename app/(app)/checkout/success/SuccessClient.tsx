"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useCartActions } from "@/lib/store/cart-store-provider";

interface SuccessClientProps {
  session: {
    id: string;
    customerEmail?: string | null;
    customerName?: string | null;
    amountTotal?: number | null;
    paymentStatus: string;
    lineItems?: {
      name?: string | null;
      quantity?: number | null;
      amount: number;
    }[];
  };
}

export function SuccessClient({ session }: SuccessClientProps) {
  const { clearCart } = useCartActions();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-[#8F4D7B] dark:text-[#DA90C4]" />
        <h1 className="mt-4 text-3xl font-bold text-[#6A395B] dark:text-[#F5EDE0]">Order Confirmed! 💅</h1>
        <p className="mt-2 text-[#BE7EAB] dark:text-[#DA90C4]">
          Thank you for your purchase. We&apos;ve sent a confirmation to <span className="font-medium text-[#6A395B] dark:text-[#F5EDE0]">{session.customerEmail}</span>
        </p>
      </div>

      {/* Order Details */}
      <div className="mt-10 rounded-lg border border-[#F0D6E8] bg-white dark:border-[#8F4D7B]/30 dark:bg-[#6A395B]">
        <div className="border-b border-[#F0D6E8] px-6 py-4 dark:border-[#8F4D7B]/30">
          <h2 className="font-semibold text-[#6A395B] dark:text-[#F5EDE0]">Order Details</h2>
        </div>

        <div className="px-6 py-4">
          {/* Items */}
          {session.lineItems && session.lineItems.length > 0 && (
            <div className="space-y-3">
              {session.lineItems.map((item) => (
                <div key={`${item.name}-${item.quantity}-${item.amount}`} className="flex justify-between text-sm">
                  <span className="text-[#BE7EAB] dark:text-[#DA90C4]">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-medium text-[#6A395B] dark:text-[#F5EDE0]">{formatPrice(item.amount / 100)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Total */}
          <div className="mt-4 border-t border-[#F0D6E8] pt-4 dark:border-[#8F4D7B]/30">
            <div className="flex justify-between text-base font-semibold">
              <span className="text-[#6A395B] dark:text-[#F5EDE0]">Total</span>
              <span className="text-[#8F4D7B] dark:text-[#DA90C4]">{formatPrice((session.amountTotal ?? 0) / 100)}</span>
            </div>
          </div>
        </div>

        {/* Payment Status */}
        <div className="border-t border-[#F0D6E8] px-6 py-4 dark:border-[#8F4D7B]/30">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-[#BE7EAB] dark:text-[#DA90C4]" />
            <span className="text-sm text-[#BE7EAB] dark:text-[#DA90C4]">
              Payment status: <span className="font-medium capitalize text-[#8F4D7B] dark:text-[#DA90C4]">{session.paymentStatus}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button asChild variant="outline" className="border-[#F0D6E8] text-[#8F4D7B] hover:bg-[#FAE8F3] hover:text-[#6A395B] dark:border-[#8F4D7B]/30 dark:text-[#DA90C4] dark:hover:bg-[#6A395B]/30">
          <Link href="/orders">
            View Your Orders
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button asChild className="bg-[#8F4D7B] text-[#F5EDE0] hover:bg-[#6A395B] transition-colors duration-200">
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  );
}
