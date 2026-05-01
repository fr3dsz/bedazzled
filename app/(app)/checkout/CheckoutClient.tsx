"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShoppingBag, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCartItems, useTotalPrice, useTotalItems } from "@/lib/store/cart-store-provider";
import { useCartStock } from "@/lib/hooks/useCartStock";
import { createCheckoutSession } from "@/lib/actions/checkout";
import { AddressForm, type DeliveryAddress } from "@/components/AddressForm";

export function CheckoutClient() {
  const items = useCartItems();
  const totalPrice = useTotalPrice();
  const totalItems = useTotalItems();
  const { stockMap, isLoading, hasStockIssues } = useCartStock(items);
  const [address, setAddress] = useState<DeliveryAddress | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const router = useRouter();

  const handleAddressSubmit = (submittedAddress: DeliveryAddress) => {
    setAddress(submittedAddress);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePayment = async () => {
    if (!address) return;
    setIsPaying(true);
    const result = await createCheckoutSession(items, address);
    if (result.success && result.url) {
      router.push(result.url);
    } else {
      toast.error("Checkout Error", {
        description: result.error ?? "Something went wrong",
      });
      setIsPaying(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <ShoppingBag className="mx-auto h-16 w-16 text-[#F0D6E8] dark:text-[#6A395B]" />
          <h1 className="mt-6 text-2xl font-bold text-[#6A395B] dark:text-[#F5EDE0]">Your cart is empty</h1>
          <p className="mt-2 text-[#BE7EAB] dark:text-[#DA90C4]">Add some items to your cart before checking out.</p>
          <Button asChild className="mt-8 bg-[#8F4D7B] text-[#F5EDE0] hover:bg-[#6A395B]">
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-sm text-[#BE7EAB] hover:text-[#8F4D7B] dark:text-[#DA90C4] dark:hover:text-[#F5EDE0] transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Continue Shopping
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-[#6A395B] dark:text-[#F5EDE0]">Checkout</h1>

        {/* Step indicator */}
        <div className="mt-4 flex items-center gap-3">
          <div className={`flex items-center gap-2 text-sm font-medium ${!address ? "text-[#8F4D7B]" : "text-[#BE7EAB]"}`}>
            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${!address ? "bg-[#8F4D7B] text-[#F5EDE0]" : "bg-[#FAE8F3] text-[#BE7EAB]"}`}>1</span>
            Delivery Address
          </div>
          <div className="h-px w-8 bg-[#F0D6E8]" />
          <div className={`flex items-center gap-2 text-sm font-medium ${address ? "text-[#8F4D7B]" : "text-[#BE7EAB]/50"}`}>
            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${address ? "bg-[#8F4D7B] text-[#F5EDE0]" : "bg-[#FAE8F3] text-[#BE7EAB]/50"}`}>2</span>
            Payment
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Left — Address or Payment */}
        <div className="lg:col-span-3 space-y-4">
          {!address ? (
            <AddressForm onSubmit={handleAddressSubmit} />
          ) : (
            /* Confirmed address summary */
            <div className="rounded-lg border border-[#F0D6E8] bg-white p-6 dark:border-[#8F4D7B]/30 dark:bg-[#6A395B]">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-[#6A395B] dark:text-[#F5EDE0]">Delivering to</h2>
                <button onClick={() => setAddress(null)} className="text-sm text-[#BE7EAB] hover:text-[#8F4D7B] transition-colors">
                  Change
                </button>
              </div>
              <div className="text-sm space-y-0.5 text-[#6A395B] dark:text-[#F5EDE0]">
                <p className="font-medium">{address.fullName}</p>
                <p className="text-[#BE7EAB] dark:text-[#DA90C4]">{address.phone}</p>
                <p>
                  {address.line1}
                  {address.line2 ? `, ${address.line2}` : ""}
                </p>
                <p>
                  {address.barangay}, {address.city}
                </p>
                <p>
                  {address.province}, {address.zipCode}
                </p>
                <p>Philippines</p>
              </div>
            </div>
          )}

          {/* Order Items */}
          <div className="rounded-lg border border-[#F0D6E8] bg-white dark:border-[#8F4D7B]/30 dark:bg-[#6A395B]">
            <div className="border-b border-[#F0D6E8] px-6 py-4 dark:border-[#8F4D7B]/30">
              <h2 className="font-semibold text-[#6A395B] dark:text-[#F5EDE0]">
                Order Summary ({totalItems} {totalItems === 1 ? "item" : "items"})
              </h2>
            </div>

            {/* Stock Issues Warning */}
            {hasStockIssues && !isLoading && (
              <div className="mx-6 mt-4 flex items-center gap-2 rounded-lg border border-[#F0D6E8] bg-[#FAE8F3] px-4 py-3 text-sm text-[#6A395B] dark:border-[#8F4D7B]/30 dark:bg-[#6A395B]/40 dark:text-[#F5EDE0]">
                <AlertTriangle className="h-5 w-5 shrink-0 text-[#8F4D7B] dark:text-[#DA90C4]" />
                <span>Some items have stock issues. Please update your cart before proceeding.</span>
              </div>
            )}

            {/* Loading */}
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-[#BE7EAB] dark:text-[#DA90C4]" />
                <span className="ml-2 text-sm text-[#BE7EAB] dark:text-[#DA90C4]">Verifying stock...</span>
              </div>
            )}

            {/* Items */}
            <div className="divide-y divide-[#F0D6E8] dark:divide-[#8F4D7B]/30">
              {items.map((item) => {
                const stockInfo = stockMap.get(item.productId);
                const hasIssue = stockInfo?.isOutOfStock || stockInfo?.exceedsStock;

                return (
                  <div key={item.productId} className={`flex gap-4 px-6 py-4 ${hasIssue ? "bg-[#FAE8F3] dark:bg-[#6A395B]/40" : ""}`}>
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-[#FAE8F3] dark:bg-[#6A395B]">{item.image ? <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" /> : <div className="flex h-full items-center justify-center text-xs text-[#BE7EAB]">No image</div>}</div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h3 className="font-medium text-[#6A395B] dark:text-[#F5EDE0]">{item.name}</h3>
                        <p className="mt-1 text-sm text-[#BE7EAB] dark:text-[#DA90C4]">Qty: {item.quantity}</p>
                        {stockInfo?.isOutOfStock && <p className="mt-1 text-sm font-medium text-[#8F4D7B]">Out of stock</p>}
                        {stockInfo?.exceedsStock && !stockInfo.isOutOfStock && <p className="mt-1 text-sm font-medium text-[#BE7EAB]">Only {stockInfo.currentStock} available</p>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-[#6A395B] dark:text-[#F5EDE0]">{formatPrice(item.price * item.quantity)}</p>
                      {item.quantity > 1 && <p className="text-sm text-[#BE7EAB] dark:text-[#DA90C4]">{formatPrice(item.price)} each</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right — Payment Summary */}
        <div className="lg:col-span-2">
          <div className="sticky top-24 rounded-lg border border-[#F0D6E8] bg-white p-6 dark:border-[#8F4D7B]/30 dark:bg-[#6A395B]">
            <h2 className="font-semibold text-[#6A395B] dark:text-[#F5EDE0]">Payment Summary</h2>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-[#BE7EAB] dark:text-[#DA90C4]">Subtotal</span>
                <span className="text-[#6A395B] dark:text-[#F5EDE0]">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#BE7EAB] dark:text-[#DA90C4]">Shipping</span>
                <span className="text-[#6A395B] dark:text-[#F5EDE0]">Calculated at checkout</span>
              </div>
              <div className="border-t border-[#F0D6E8] pt-4 dark:border-[#8F4D7B]/30">
                <div className="flex justify-between text-base font-semibold">
                  <span className="text-[#6A395B] dark:text-[#F5EDE0]">Total</span>
                  <span className="text-[#8F4D7B] dark:text-[#DA90C4]">{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button onClick={handlePayment} disabled={!address || hasStockIssues || isLoading || isPaying} size="lg" className="w-full bg-[#8F4D7B] text-[#F5EDE0] hover:bg-[#6A395B] disabled:bg-[#FAE8F3] disabled:text-[#BE7EAB] transition-colors duration-200">
                {isPaying ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : !address ? (
                  "Enter address first"
                ) : (
                  "Pay with PayMongo"
                )}
              </Button>
            </div>

            {!address && <p className="mt-3 text-center text-xs text-[#BE7EAB] dark:text-[#DA90C4]">Please fill in your delivery address to continue</p>}

            <p className="mt-4 text-center text-xs text-[#BE7EAB] dark:text-[#DA90C4]">You&apos;ll be redirected to PayMongo&apos;s secure checkout</p>
          </div>
        </div>
      </div>
    </div>
  );
}
