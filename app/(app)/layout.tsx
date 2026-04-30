import { CartSheet } from "@/components/CartSheet";
import { Header } from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";
import { CartStoreProvider } from "@/lib/store/cart-store-provider";
import { SanityLive } from "@/sanity/lib/live";
import { ClerkProvider } from "@clerk/nextjs";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <CartStoreProvider>
        <Header />
        <main>{children}</main>;
        <CartSheet />
        <Toaster position="bottom-center" />
        <SanityLive />
      </CartStoreProvider>
    </ClerkProvider>
  );
}

export default Layout;
