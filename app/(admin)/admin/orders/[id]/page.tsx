"use client";

import { Suspense, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDocumentProjection, type DocumentHandle } from "@sanity/sdk-react";
import { ArrowLeft, MapPin, CreditCard, ExternalLink, Edit2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusSelect, AddressEditor, PublishButton, RevertButton } from "@/components/admin";
import { formatPrice, formatDate } from "@/lib/utils";

interface OrderDetailProjection {
  orderNumber: string;
  email: string;
  total: number;
  status: string;
  createdAt: string;
  paymongoPaymentId: string | null; // ← was stripePaymentId
  address: {
    name: string;
    line1: string;
    line2: string | null;
    barangay: string | null; // ← added
    city: string;
    province: string | null; // ← added
    zipCode: string; // ← was postcode
    country: string;
  } | null;
  items: Array<{
    _key: string;
    quantity: number;
    priceAtPurchase: number;
    product: {
      _id: string;
      name: string;
      slug: string;
      image: { asset: { url: string } | null } | null;
    } | null;
  }>;
}

function OrderDetailContent({ handle }: { handle: DocumentHandle }) {
  const { data } = useDocumentProjection<OrderDetailProjection>({
    ...handle,
    projection: `{
      orderNumber,
      email,
      total,
      status,
      createdAt,
      paymongoPaymentId,
      address{
        name,
        line1,
        line2,
        barangay,
        city,
        province,
        zipCode,
        country
      },
      items[]{
        _key,
        quantity,
        priceAtPurchase,
        product->{
          _id,
          name,
          "slug": slug.current,
          "image": images[0]{
            asset->{ url }
          }
        }
      }
    }`,
  });

  if (!data) {
    return (
      <div className="py-16 text-center">
        <p className="text-[#BE7EAB] dark:text-[#DA90C4]">Order not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#6A395B] dark:text-[#F5EDE0] sm:text-2xl">Order {data.orderNumber}</h1>
          <p className="mt-1 text-sm text-[#BE7EAB] dark:text-[#DA90C4]">{formatDate(data.createdAt, "datetime")}</p>
        </div>

        {/* Status and Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-[#BE7EAB] dark:text-[#DA90C4]">Status:</span>
            <Suspense fallback={<Skeleton className="h-10 w-[140px] bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />}>
              <StatusSelect {...handle} />
            </Suspense>
          </div>
          <div className="flex items-center gap-2">
            <Suspense fallback={null}>
              <RevertButton {...handle} />
            </Suspense>
            <Suspense fallback={null}>
              <PublishButton {...handle} />
            </Suspense>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5 lg:gap-8">
        {/* Order Items */}
        <div className="space-y-6 lg:col-span-3">
          <div className="rounded-xl border border-[#F0D6E8] bg-white dark:border-[#8F4D7B]/30 dark:bg-[#6A395B]">
            <div className="border-b border-[#F0D6E8] px-4 py-3 dark:border-[#8F4D7B]/30 sm:px-6 sm:py-4">
              <h2 className="font-semibold text-[#6A395B] dark:text-[#F5EDE0]">Items ({data.items?.length ?? 0})</h2>
            </div>
            <div className="divide-y divide-[#F0D6E8] dark:divide-[#8F4D7B]/30">
              {data.items?.map((item) => (
                <div key={item._key} className="flex gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4">
                  {/* Image */}
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-[#FAE8F3] dark:bg-[#6A395B] sm:h-20 sm:w-20">{item.product?.image?.asset?.url ? <Image src={item.product.image.asset.url} alt={item.product.name ?? "Product"} fill className="object-cover" sizes="80px" /> : <div className="flex h-full items-center justify-center text-xs text-[#BE7EAB] dark:text-[#DA90C4]">No image</div>}</div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start gap-2">
                        <span className="text-sm font-medium text-[#6A395B] dark:text-[#F5EDE0] sm:text-base">{item.product?.name ?? "Unknown Product"}</span>
                        {item.product?.slug && (
                          <Link href={`/products/${item.product.slug}`} target="_blank" className="shrink-0 text-[#BE7EAB] hover:text-[#8F4D7B] dark:text-[#DA90C4] dark:hover:text-[#F5EDE0]">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-[#BE7EAB] dark:text-[#DA90C4] sm:text-sm">
                        Qty: {item.quantity} × {formatPrice(item.priceAtPurchase)}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="text-sm font-medium text-[#6A395B] dark:text-[#F5EDE0] sm:text-base">{formatPrice((item.priceAtPurchase ?? 0) * (item.quantity ?? 1))}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="rounded-xl border border-[#F0D6E8] bg-white p-4 dark:border-[#8F4D7B]/30 dark:bg-[#6A395B] sm:p-6">
            <h2 className="font-semibold text-[#6A395B] dark:text-[#F5EDE0]">Order Summary</h2>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#BE7EAB] dark:text-[#DA90C4]">Subtotal</span>
                <span className="text-[#6A395B] dark:text-[#F5EDE0]">{formatPrice(data.total)}</span>
              </div>
              <div className="border-t border-[#F0D6E8] pt-3 dark:border-[#8F4D7B]/30">
                <div className="flex justify-between font-semibold">
                  <span className="text-[#6A395B] dark:text-[#F5EDE0]">Total</span>
                  <span className="text-[#8F4D7B] dark:text-[#DA90C4]">{formatPrice(data.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6 lg:col-span-2">
          {/* Customer Info */}
          <div className="rounded-xl border border-[#F0D6E8] bg-white p-4 dark:border-[#8F4D7B]/30 dark:bg-[#6A395B] sm:p-6">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-[#BE7EAB] dark:text-[#DA90C4]" />
              <h2 className="font-semibold text-[#6A395B] dark:text-[#F5EDE0]">Customer</h2>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <p className="break-all text-[#6A395B] dark:text-[#F5EDE0]">{data.email}</p>
              {data.paymongoPaymentId && <p className="break-all text-xs text-[#BE7EAB] dark:text-[#DA90C4]">PayMongo ID: {data.paymongoPaymentId}</p>}
            </div>
          </div>

          {/* Editable Delivery Address */}
          <div className="rounded-xl border border-[#F0D6E8] bg-white p-4 dark:border-[#8F4D7B]/30 dark:bg-[#6A395B] sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#BE7EAB] dark:text-[#DA90C4]" />
                <h2 className="font-semibold text-[#6A395B] dark:text-[#F5EDE0]">Delivery Address</h2>
              </div>
              <Edit2 className="h-4 w-4 text-[#BE7EAB] dark:text-[#DA90C4]" />
            </div>
            <div className="mt-4">
              <Suspense
                fallback={
                  <div className="space-y-3">
                    <Skeleton className="h-16 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
                    <Skeleton className="h-16 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
                    <Skeleton className="h-16 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
                  </div>
                }
              >
                <AddressEditor {...handle} />
              </Suspense>
            </div>
          </div>

          {/* Studio Link */}
          <div className="rounded-xl border border-[#F0D6E8] bg-white p-4 dark:border-[#8F4D7B]/30 dark:bg-[#6A395B] sm:p-6">
            <h2 className="font-semibold text-[#6A395B] dark:text-[#F5EDE0]">Advanced Editing</h2>
            <p className="mt-2 text-sm text-[#BE7EAB] dark:text-[#DA90C4]">For additional changes, edit this order in Sanity Studio.</p>
            <Link href={`/studio/structure/order;${handle.documentId}`} target="_blank" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[#8F4D7B] hover:text-[#6A395B] dark:text-[#DA90C4] dark:hover:text-[#F5EDE0] transition-colors">
              Open in Studio
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderDetailSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Skeleton className="h-7 w-40 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30 sm:h-8 sm:w-48" />
          <Skeleton className="mt-2 h-4 w-32 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
        </div>
        <Skeleton className="h-10 w-full bg-[#FAE8F3] dark:bg-[#8F4D7B]/30 sm:w-[180px]" />
      </div>
      <div className="grid gap-6 lg:grid-cols-5 lg:gap-8">
        <div className="space-y-6 lg:col-span-3">
          <Skeleton className="h-64 rounded-xl bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
          <Skeleton className="h-32 rounded-xl bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
        </div>
        <div className="space-y-6 lg:col-span-2">
          <Skeleton className="h-32 rounded-xl bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
          <Skeleton className="h-64 rounded-xl bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
          <Skeleton className="h-32 rounded-xl bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
        </div>
      </div>
    </div>
  );
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: PageProps) {
  const { id } = use(params);

  const handle: DocumentHandle = {
    documentId: id,
    documentType: "order",
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Link href="/admin/orders" className="inline-flex items-center text-sm text-[#BE7EAB] hover:text-[#8F4D7B] dark:text-[#DA90C4] dark:hover:text-[#F5EDE0] transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Orders
      </Link>

      <Suspense fallback={<OrderDetailSkeleton />}>
        <OrderDetailContent handle={handle} />
      </Suspense>
    </div>
  );
}
