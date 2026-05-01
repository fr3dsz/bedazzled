"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useApplyDocumentActions, createDocumentHandle, createDocument } from "@sanity/sdk-react";
import { Package, ShoppingCart, TrendingUp, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard, LowStockAlert, RecentOrders } from "@/components/admin";

export default function AdminDashboard() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const apply = useApplyDocumentActions();

  const handleCreateProduct = () => {
    startTransition(async () => {
      const newDocHandle = createDocumentHandle({
        documentId: crypto.randomUUID(),
        documentType: "product",
      });
      await apply(createDocument(newDocHandle));
      router.push(`/admin/inventory/${newDocHandle.documentId}`);
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#6A395B] dark:text-[#F5EDE0] sm:text-3xl">Dashboard</h1>
          <p className="mt-1 text-sm text-[#BE7EAB] dark:text-[#DA90C4] sm:text-base">Overview of your store</p>
        </div>
        <Button onClick={handleCreateProduct} disabled={isPending} className="w-full bg-[#8F4D7B] text-[#F5EDE0] hover:bg-[#6A395B] disabled:bg-[#FAE8F3] disabled:text-[#BE7EAB] transition-colors duration-200 sm:w-auto">
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
          New Product
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Products" icon={Package} documentType="product" href="/admin/inventory" />
        <StatCard title="Total Orders" icon={ShoppingCart} documentType="order" href="/admin/orders" />
        <StatCard title="Low Stock Items" icon={TrendingUp} documentType="product" filter="stock <= 5" href="/admin/inventory" />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <LowStockAlert />
        <RecentOrders />
      </div>
    </div>
  );
}
