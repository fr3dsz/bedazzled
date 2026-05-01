"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCartItems } from "@/lib/store/cart-store-provider";
import { createCheckoutSession } from "@/lib/actions/checkout";

interface CheckoutButtonProps {
  disabled?: boolean;
}

export function CheckoutButton({ disabled }: CheckoutButtonProps) {
  const router = useRouter();
  const items = useCartItems();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = () => {
    setError(null);
    startTransition(async () => {
      const result = await createCheckoutSession(items);
      if (result.success && result.url) {
        // Redirect to PayMongo Checkout
        router.push(result.url);
      } else {
        setError(result.error ?? "Checkout failed");
        toast.error("Checkout Error", {
          description: result.error ?? "Something went wrong",
        });
      }
    });
  };

  return (
    <div className="space-y-2">
      <Button onClick={handleCheckout} disabled={disabled || isPending || items.length === 0} size="lg" className="w-full bg-[#8F4D7B] text-[#F5EDE0] hover:bg-[#6A395B] disabled:bg-[#FAE8F3] disabled:text-[#BE7EAB] dark:disabled:bg-[#6A395B]/30 dark:disabled:text-[#DA90C4]/50 transition-colors duration-200">
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-5 w-5" />
            Pay with PayMongo
          </>
        )}
      </Button>
      {error && <p className="text-center text-sm text-[#8F4D7B] dark:text-[#DA90C4]">{error}</p>}
    </div>
  );
}
