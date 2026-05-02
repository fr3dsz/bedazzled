"use client";

import { Suspense, useState } from "react";
import { useDocuments } from "@sanity/sdk-react";
import { ShoppingCart } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { OrderRow, OrderRowSkeleton, AdminSearch, useOrderSearchFilter, OrderTableHeader } from "@/components/admin";
import { ORDER_STATUS_TABS } from "@/lib/constants/orderStatus";

interface OrderListContentProps {
  statusFilter: string;
  searchFilter?: string;
}

function OrderListContent({ statusFilter, searchFilter }: OrderListContentProps) {
  const filters: string[] = [];
  if (statusFilter !== "all") filters.push(`status == "${statusFilter}"`);
  if (searchFilter) filters.push(`(${searchFilter})`);
  const filter = filters.length > 0 ? filters.join(" && ") : undefined;

  const {
    data: orders,
    hasMore,
    loadMore,
    isPending,
  } = useDocuments({
    documentType: "order",
    filter,
    orderings: [{ field: "_createdAt", direction: "desc" }],
    batchSize: 20,
  });

  if (!orders || orders.length === 0) {
    const description = searchFilter ? "Try adjusting your search terms." : statusFilter === "all" ? "Orders will appear here when customers make purchases." : `No ${statusFilter} orders at the moment.`;

    return <EmptyState icon={ShoppingCart} title="No orders found" description={description} />;
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-[#F0D6E8] bg-white dark:border-[#8F4D7B]/30 dark:bg-[#6A395B]">
        <Table>
          <OrderTableHeader />
          <TableBody>
            {orders.map((handle) => (
              <OrderRow key={handle.documentId} {...handle} />
            ))}
          </TableBody>
        </Table>
      </div>

      {hasMore && (
        <div className="mt-4 flex justify-center">
          <Button variant="outline" onClick={() => loadMore()} disabled={isPending} className="border-[#F0D6E8] text-[#8F4D7B] hover:bg-[#FAE8F3] hover:text-[#6A395B] dark:border-[#8F4D7B]/30 dark:text-[#DA90C4] dark:hover:bg-[#8F4D7B]/20">
            {isPending ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </>
  );
}

function OrderListSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-[#F0D6E8] bg-white dark:border-[#8F4D7B]/30 dark:bg-[#6A395B]">
      <Table>
        <OrderTableHeader />
        <TableBody>
          {[1, 2, 3, 4, 5].map((i) => (
            <OrderRowSkeleton key={i} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { filter: searchFilter, isSearching } = useOrderSearchFilter(searchQuery);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#6A395B] dark:text-[#F5EDE0] sm:text-3xl">Orders</h1>
        <p className="mt-1 text-sm text-[#BE7EAB] dark:text-[#DA90C4] sm:text-base">Manage and track customer orders</p>
      </div>

      {/* Search and Tabs */}
      <div className="flex flex-col gap-4">
        <AdminSearch placeholder="Search by order # or email..." value={searchQuery} onChange={setSearchQuery} className="w-full sm:max-w-xs" />
        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <Tabs value={statusFilter} onValueChange={setStatusFilter}>
            <TabsList className="w-max bg-[#FAE8F3] dark:bg-[#6A395B]">
              {ORDER_STATUS_TABS.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value} className="text-xs text-[#BE7EAB] data-[state=active]:bg-[#8F4D7B] data-[state=active]:text-[#F5EDE0] dark:text-[#DA90C4] dark:data-[state=active]:bg-[#8F4D7B] sm:text-sm">
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Order List */}
      {isSearching ? (
        <OrderListSkeleton />
      ) : (
        <Suspense key={`${statusFilter}-${searchFilter ?? ""}`} fallback={<OrderListSkeleton />}>
          <OrderListContent statusFilter={statusFilter} searchFilter={searchFilter} />
        </Suspense>
      )}
    </div>
  );
}
