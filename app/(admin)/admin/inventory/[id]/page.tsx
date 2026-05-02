"use client";

import { Suspense, use } from "react";
import Link from "next/link";
import { useDocument, useEditDocument, useDocumentProjection, type DocumentHandle } from "@sanity/sdk-react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PublishButton, RevertButton, ImageUploader, DeleteButton } from "@/components/admin";
import { SHAPES, COLORS } from "@/lib/constants/filters";

// ============================================
// Field Editors
// ============================================

function NameEditor(handle: DocumentHandle) {
  const { data: name } = useDocument({ ...handle, path: "name" });
  const editName = useEditDocument({ ...handle, path: "name" });

  return <Input value={(name as string) ?? ""} onChange={(e) => editName(e.target.value)} placeholder="Product name" className="border-[#F0D6E8] focus-visible:ring-[#8F4D7B] dark:border-[#8F4D7B]/30 dark:bg-[#3D1F35]" />;
}

function SlugEditor(handle: DocumentHandle) {
  const { data: slug } = useDocument({ ...handle, path: "slug" });
  const editSlug = useEditDocument({ ...handle, path: "slug" });
  const slugValue = (slug as { current?: string })?.current ?? "";

  return <Input value={slugValue} onChange={(e) => editSlug({ _type: "slug", current: e.target.value })} placeholder="product-slug" className="border-[#F0D6E8] focus-visible:ring-[#8F4D7B] dark:border-[#8F4D7B]/30 dark:bg-[#3D1F35]" />;
}

function DescriptionEditor(handle: DocumentHandle) {
  const { data: description } = useDocument({ ...handle, path: "description" });
  const editDescription = useEditDocument({ ...handle, path: "description" });

  return <Textarea value={(description as string) ?? ""} onChange={(e) => editDescription(e.target.value)} placeholder="Product description..." rows={4} className="border-[#F0D6E8] focus-visible:ring-[#8F4D7B] dark:border-[#8F4D7B]/30 dark:bg-[#3D1F35]" />;
}

function PriceEditor(handle: DocumentHandle) {
  const { data: price } = useDocument({ ...handle, path: "price" });
  const editPrice = useEditDocument({ ...handle, path: "price" });

  return <Input type="number" step="0.01" min="0" value={(price as number) ?? ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => editPrice(parseFloat(e.target.value) || 0)} placeholder="0.00" className="border-[#F0D6E8] focus-visible:ring-[#8F4D7B] dark:border-[#8F4D7B]/30 dark:bg-[#3D1F35]" />;
}

function StockEditor(handle: DocumentHandle) {
  const { data: stock } = useDocument({ ...handle, path: "stock" });
  const editStock = useEditDocument({ ...handle, path: "stock" });

  return <Input type="number" min="0" value={(stock as number) ?? 0} onChange={(e) => editStock(parseInt(e.target.value) || 0)} placeholder="0" className="border-[#F0D6E8] focus-visible:ring-[#8F4D7B] dark:border-[#8F4D7B]/30 dark:bg-[#3D1F35]" />;
}

// ← was MaterialEditor, now ShapeEditor
function ShapeEditor(handle: DocumentHandle) {
  const { data: shape } = useDocument({ ...handle, path: "shape" });
  const editShape = useEditDocument({ ...handle, path: "shape" });

  return (
    <Select value={(shape as string) ?? ""} onValueChange={(value) => editShape(value)}>
      <SelectTrigger className="border-[#F0D6E8] focus:ring-[#8F4D7B] dark:border-[#8F4D7B]/30 dark:bg-[#3D1F35]">
        <SelectValue placeholder="Select nail shape" />
      </SelectTrigger>
      <SelectContent className="dark:border-[#8F4D7B]/30 dark:bg-[#6A395B]">
        {SHAPES.map((s) => (
          <SelectItem key={s.value} value={s.value} className="text-[#6A395B] focus:bg-[#FAE8F3] dark:text-[#F5EDE0] dark:focus:bg-[#8F4D7B]/20">
            {s.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// ← was ColorEditor (single), now ColorsEditor (multi-checkbox)
function ColorsEditor(handle: DocumentHandle) {
  const { data: colors } = useDocument({ ...handle, path: "colors" });
  const editColors = useEditDocument({ ...handle, path: "colors" });

  const selectedColors = (colors as string[]) ?? [];

  const toggle = (value: string) => {
    const updated = selectedColors.includes(value) ? selectedColors.filter((c) => c !== value) : [...selectedColors, value];
    editColors(updated);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {COLORS.map((c) => {
        const isSelected = selectedColors.includes(c.value);
        return (
          <button key={c.value} type="button" onClick={() => toggle(c.value)} className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${isSelected ? "bg-[#8F4D7B] text-[#F5EDE0]" : "bg-[#FAE8F3] text-[#BE7EAB] hover:bg-[#F0D6E8] hover:text-[#8F4D7B] dark:bg-[#6A395B]/50 dark:text-[#DA90C4]"}`}>
            {c.label}
          </button>
        );
      })}
    </div>
  );
}

function FeaturedEditor(handle: DocumentHandle) {
  const { data: featured } = useDocument({ ...handle, path: "featured" });
  const editFeatured = useEditDocument({ ...handle, path: "featured" });

  return <Switch checked={(featured as boolean) ?? false} onCheckedChange={(checked: boolean) => editFeatured(checked)} />;
}

interface ProductSlugProjection {
  slug: { current: string } | null;
}

function ProductStoreLink(handle: DocumentHandle) {
  const { data } = useDocumentProjection<ProductSlugProjection>({
    ...handle,
    projection: `{ slug }`,
  });

  const slug = data?.slug?.current;
  if (!slug) return null;

  return (
    <Link href={`/products/${slug}`} target="_blank" className="flex items-center justify-center gap-1 text-sm text-[#BE7EAB] hover:text-[#8F4D7B] dark:text-[#DA90C4] dark:hover:text-[#F5EDE0] transition-colors">
      View on store
      <ExternalLink className="h-3.5 w-3.5" />
    </Link>
  );
}

// ============================================
// Main Content
// ============================================

function ProductDetailContent({ handle }: { handle: DocumentHandle }) {
  const { data: name } = useDocument({ ...handle, path: "name" });

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#6A395B] dark:text-[#F5EDE0] sm:text-2xl">{(name as string) || "New Product"}</h1>
          <p className="mt-1 text-sm text-[#BE7EAB] dark:text-[#DA90C4]">Edit product details</p>
        </div>
        <div className="flex items-center gap-2">
          <DeleteButton handle={handle} />
          <Suspense fallback={null}>
            <RevertButton {...handle} />
          </Suspense>
          <Suspense fallback={null}>
            <PublishButton {...handle} />
          </Suspense>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
        {/* Main Form */}
        <div className="space-y-6 lg:col-span-2">
          {/* Basic Info */}
          <div className="rounded-xl border border-[#F0D6E8] bg-white p-4 dark:border-[#8F4D7B]/30 dark:bg-[#6A395B] sm:p-6">
            <h2 className="mb-4 font-semibold text-[#6A395B] dark:text-[#F5EDE0]">Basic Information</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[#6A395B] dark:text-[#F5EDE0]">Name</Label>
                <Suspense fallback={<Skeleton className="h-10 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />}>
                  <NameEditor {...handle} />
                </Suspense>
              </div>
              <div className="space-y-2">
                <Label className="text-[#6A395B] dark:text-[#F5EDE0]">Slug</Label>
                <Suspense fallback={<Skeleton className="h-10 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />}>
                  <SlugEditor {...handle} />
                </Suspense>
              </div>
              <div className="space-y-2">
                <Label className="text-[#6A395B] dark:text-[#F5EDE0]">Description</Label>
                <Suspense fallback={<Skeleton className="h-24 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />}>
                  <DescriptionEditor {...handle} />
                </Suspense>
              </div>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="rounded-xl border border-[#F0D6E8] bg-white p-4 dark:border-[#8F4D7B]/30 dark:bg-[#6A395B] sm:p-6">
            <h2 className="mb-4 font-semibold text-[#6A395B] dark:text-[#F5EDE0]">Pricing & Inventory</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-[#6A395B] dark:text-[#F5EDE0]">Price (₱)</Label>
                <Suspense fallback={<Skeleton className="h-10 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />}>
                  <PriceEditor {...handle} />
                </Suspense>
              </div>
              <div className="space-y-2">
                <Label className="text-[#6A395B] dark:text-[#F5EDE0]">Stock (sets)</Label>
                <Suspense fallback={<Skeleton className="h-10 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />}>
                  <StockEditor {...handle} />
                </Suspense>
              </div>
            </div>
          </div>

          {/* Attributes — updated for nails */}
          <div className="rounded-xl border border-[#F0D6E8] bg-white p-4 dark:border-[#8F4D7B]/30 dark:bg-[#6A395B] sm:p-6">
            <h2 className="mb-4 font-semibold text-[#6A395B] dark:text-[#F5EDE0]">Nail Attributes</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[#6A395B] dark:text-[#F5EDE0]">Nail Shape</Label>
                <Suspense fallback={<Skeleton className="h-10 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />}>
                  <ShapeEditor {...handle} />
                </Suspense>
              </div>
              <div className="space-y-2">
                <Label className="text-[#6A395B] dark:text-[#F5EDE0]">
                  Colors / Finishes
                  <span className="ml-2 text-xs font-normal text-[#BE7EAB]">Select all that apply</span>
                </Label>
                <Suspense fallback={<Skeleton className="h-10 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />}>
                  <ColorsEditor {...handle} />
                </Suspense>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="rounded-xl border border-[#F0D6E8] bg-white p-4 dark:border-[#8F4D7B]/30 dark:bg-[#6A395B] sm:p-6">
            <h2 className="mb-4 font-semibold text-[#6A395B] dark:text-[#F5EDE0]">Options</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[#6A395B] dark:text-[#F5EDE0]">Featured Product</p>
                <p className="text-sm text-[#BE7EAB] dark:text-[#DA90C4]">Show on homepage and promotions</p>
              </div>
              <Suspense fallback={<Skeleton className="h-6 w-11 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />}>
                <FeaturedEditor {...handle} />
              </Suspense>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Image Upload */}
          <div className="rounded-xl border border-[#F0D6E8] bg-white p-4 dark:border-[#8F4D7B]/30 dark:bg-[#6A395B] sm:p-6">
            <h2 className="mb-4 font-semibold text-[#6A395B] dark:text-[#F5EDE0]">Product Images</h2>
            <ImageUploader {...handle} />
            <div className="mt-4">
              <Suspense fallback={null}>
                <ProductStoreLink {...handle} />
              </Suspense>
            </div>
          </div>

          {/* Studio Link */}
          <div className="rounded-xl border border-[#F0D6E8] bg-white p-4 dark:border-[#8F4D7B]/30 dark:bg-[#6A395B] sm:p-6">
            <h2 className="font-semibold text-[#6A395B] dark:text-[#F5EDE0]">Advanced Editing</h2>
            <p className="mt-2 text-sm text-[#BE7EAB] dark:text-[#DA90C4]">Set category and other options in Sanity Studio.</p>
            <Link href={`/studio/structure/product;${handle.documentId}`} target="_blank" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[#8F4D7B] hover:text-[#6A395B] dark:text-[#DA90C4] dark:hover:text-[#F5EDE0] transition-colors">
              Open in Studio
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Skeleton
// ============================================

function ProductDetailSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Skeleton className="h-7 w-48 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30 sm:h-8" />
          <Skeleton className="mt-2 h-4 w-32 bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
        </div>
        <Skeleton className="h-10 w-[140px] bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
      </div>
      <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
        <div className="space-y-6 lg:col-span-2">
          <Skeleton className="h-64 rounded-xl bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
          <Skeleton className="h-40 rounded-xl bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
          <Skeleton className="h-48 rounded-xl bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-80 rounded-xl bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
          <Skeleton className="h-32 rounded-xl bg-[#FAE8F3] dark:bg-[#8F4D7B]/30" />
        </div>
      </div>
    </div>
  );
}

// ============================================
// Page
// ============================================

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const { id } = use(params);

  const handle: DocumentHandle = {
    documentId: id,
    documentType: "product",
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Link href="/admin/inventory" className="inline-flex items-center text-sm text-[#BE7EAB] hover:text-[#8F4D7B] dark:text-[#DA90C4] dark:hover:text-[#F5EDE0] transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Inventory
      </Link>

      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductDetailContent handle={handle} />
      </Suspense>
    </div>
  );
}
