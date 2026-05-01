import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, CreditCard, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { sanityFetch } from "@/sanity/lib/live";
import { getOrderStatus } from "@/lib/constants/orderStatus";
import { formatPrice, formatDate } from "@/lib/utils";
import { ORDER_BY_ID_QUERY } from "@/sanity/queries/orders";

export const metadata = {
  title: "Order Details | Bedazzled Nails",
  description: "View your order details",
};

interface OrderPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderPageProps) {
  const { id } = await params;
  const { userId } = await auth();

  const { data: order } = await sanityFetch({
    query: ORDER_BY_ID_QUERY,
    params: { id },
  });

  if (!order || order.clerkUserId !== userId) {
    notFound();
  }

  const status = getOrderStatus(order.status);
  const StatusIcon = status.icon;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/orders" className="inline-flex items-center text-sm text-[#BE7EAB] hover:text-[#8F4D7B] dark:text-[#DA90C4] dark:hover:text-[#F5EDE0] transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Link>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#6A395B] dark:text-[#F5EDE0]">Order {order.orderNumber}</h1>
            <p className="mt-1 text-sm text-[#BE7EAB] dark:text-[#DA90C4]">Placed on {formatDate(order.createdAt, "datetime")}</p>
          </div>
          <Badge className={`${status.color} flex items-center gap-1.5`}>
            <StatusIcon className="h-4 w-4" />
            {status.label}
          </Badge>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Order Items */}
        <div className="lg:col-span-3">
          <div className="rounded-lg border border-[#F0D6E8] bg-white dark:border-[#8F4D7B]/30 dark:bg-[#6A395B]">
            <div className="border-b border-[#F0D6E8] px-6 py-4 dark:border-[#8F4D7B]/30">
              <h2 className="font-semibold text-[#6A395B] dark:text-[#F5EDE0]">Items ({order.items?.length ?? 0})</h2>
            </div>
            <div className="divide-y divide-[#F0D6E8] dark:divide-[#8F4D7B]/30">
              {order.items?.map((item) => (
                <div key={item._key} className="flex gap-4 px-6 py-4">
                  {/* Image */}
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-[#FAE8F3] dark:bg-[#6A395B]">{item.product?.image?.asset?.url ? <Image src={item.product.image.asset.url} alt={item.product.name ?? "Product"} fill className="object-cover" sizes="80px" /> : <div className="flex h-full items-center justify-center text-xs text-[#BE7EAB] dark:text-[#DA90C4]">No image</div>}</div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <Link href={`/products/${item.product?.slug}`} className="font-medium text-[#6A395B] hover:text-[#8F4D7B] dark:text-[#F5EDE0] dark:hover:text-[#DA90C4] transition-colors">
                        {item.product?.name ?? "Unknown Product"}
                      </Link>
                      <p className="mt-1 text-sm text-[#BE7EAB] dark:text-[#DA90C4]">Qty: {item.quantity}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="font-medium text-[#6A395B] dark:text-[#F5EDE0]">{formatPrice((item.priceAtPurchase ?? 0) * (item.quantity ?? 1))}</p>
                    {(item.quantity ?? 1) > 1 && <p className="text-sm text-[#BE7EAB] dark:text-[#DA90C4]">{formatPrice(item.priceAtPurchase)} each</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary & Details */}
        <div className="space-y-6 lg:col-span-2">
          {/* Summary */}
          <div className="rounded-lg border border-[#F0D6E8] bg-white p-6 dark:border-[#8F4D7B]/30 dark:bg-[#6A395B]">
            <h2 className="font-semibold text-[#6A395B] dark:text-[#F5EDE0]">Order Summary</h2>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#BE7EAB] dark:text-[#DA90C4]">Subtotal</span>
                <span className="text-[#6A395B] dark:text-[#F5EDE0]">{formatPrice(order.total)}</span>
              </div>
              <div className="border-t border-[#F0D6E8] pt-3 dark:border-[#8F4D7B]/30">
                <div className="flex justify-between font-semibold">
                  <span className="text-[#6A395B] dark:text-[#F5EDE0]">Total</span>
                  <span className="text-[#8F4D7B] dark:text-[#DA90C4]">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address — updated for PH format */}
          {order.address && (
            <div className="rounded-lg border border-[#F0D6E8] bg-white p-6 dark:border-[#8F4D7B]/30 dark:bg-[#6A395B]">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#BE7EAB] dark:text-[#DA90C4]" />
                <h2 className="font-semibold text-[#6A395B] dark:text-[#F5EDE0]">Delivery Address</h2>
              </div>
              <div className="mt-4 space-y-0.5 text-sm text-[#6A395B] dark:text-[#F5EDE0]">
                {order.address.name && <p className="font-medium">{order.address.name}</p>}
                {order.address.line1 && <p>{order.address.line1}</p>}
                {order.address.line2 && <p>{order.address.line2}</p>}
                {order.address.barangay && <p>{order.address.barangay}</p>}
                <p>{[order.address.city, order.address.province, order.address.zipCode].filter(Boolean).join(", ")}</p>
                {order.address.country && <p className="text-[#BE7EAB] dark:text-[#DA90C4]">{order.address.country}</p>}
              </div>
            </div>
          )}

          {/* Payment Info */}
          <div className="rounded-lg border border-[#F0D6E8] bg-white p-6 dark:border-[#8F4D7B]/30 dark:bg-[#6A395B]">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-[#BE7EAB] dark:text-[#DA90C4]" />
              <h2 className="font-semibold text-[#6A395B] dark:text-[#F5EDE0]">Payment</h2>
            </div>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-light tracking-wide text-[#BE7EAB] dark:text-[#DA90C4]">Status</span>
                <span className="text-sm font-medium capitalize text-[#8F4D7B] dark:text-[#DA90C4]">{order.status}</span>
              </div>
              {order.email && (
                <div className="flex items-center justify-between">
                  <p className="text-xs font-light tracking-wide text-[#BE7EAB] dark:text-[#DA90C4]">Email</p>
                  <p className="min-w-0 truncate text-sm text-[#6A395B] dark:text-[#F5EDE0]">{order.email}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
