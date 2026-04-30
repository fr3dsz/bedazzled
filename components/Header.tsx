"use client";
import Link from "next/link";
import { Package, ShoppingBag, User } from "lucide-react";
import { useAuth, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useCartActions, useTotalItems } from "@/lib/store/cart-store-provider";

export function Header() {
  const { openCart } = useCartActions();
  const totalItems = useTotalItems();
  const { isSignedIn } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-[#6A395B]/30 bg-gradient-to-r from-[#8F4D7B] via-[#BE7EAB] to-[#8F4D7B] backdrop-blur-md dark:from-[#6A395B] dark:via-[#8F4D7B] dark:to-[#6A395B]">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex flex-col leading-tight gap-0.5">
          <span className="text-2xl font-semibold tracking-tight text-[#F5EDE0]">Bedazzled Nails</span>
          <span className="text-xs font-medium tracking-[0.12em] text-[#F5EDE0]/80">By Kyle</span>
        </Link>
        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* My Orders */}
          {isSignedIn && (
            <Button className="rounded-full bg-[#6A395B] text-[#F5EDE0] hover:bg-[#DA90C4] hover:text-[#6A395B] transition-colors duration-200">
              <Link href="/orders" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span className="hidden text-sm font-medium sm:inline">My Orders</span>
              </Link>
            </Button>
          )}

          {/* Cart Button */}
          <Button variant="ghost" size="icon" className="relative rounded-lg border border-[#F5EDE0]/30 text-[#F5EDE0] hover:bg-[#F5EDE0]/20" onClick={openCart}>
            <ShoppingBag className="h-5 w-5" />
            {totalItems > 0 && <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#DA90C4] text-[#6A395B] text-[10px] font-semibold dark:bg-[#DA90C4] dark:text-[#6A395B]">{totalItems > 99 ? "99+" : totalItems}</span>}
            <span className="sr-only">Open cart ({totalItems} items)</span>
          </Button>

          {/* User */}
          {isSignedIn ? (
            <UserButton
              afterSwitchSessionUrl="/"
              appearance={{
                elements: { avatarBox: "h-9 w-9" },
              }}
            >
              <UserButton.MenuItems>
                <UserButton.Link label="My Orders" labelIcon={<Package className="h-4 w-4" />} href="/orders" />
              </UserButton.MenuItems>
            </UserButton>
          ) : (
            <SignInButton mode="modal">
              <Button variant="ghost" size="icon" className="rounded-lg border border-[#F5EDE0]/30 text-[#F5EDE0] hover:bg-[#F5EDE0]/20 hover:text-[#8F4D7B] dark:border-[#8F4D7B]/30 dark:text-[#DA90C4] dark:hover:bg-[#6A395B]/30">
                <User className="h-5 w-5" />
                <span className="sr-only">Sign in</span>
              </Button>
            </SignInButton>
          )}
        </div>
      </div>
    </header>
  );
}
