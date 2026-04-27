// ============================================
// Product Attribute Constants
// Shared between frontend filters and Sanity schema
// ============================================

export const COLORS = [
  { value: "nude", label: "Nude" },
  { value: "pink", label: "Pink" },
  { value: "red", label: "Red" },
  { value: "white", label: "White" },
  { value: "black", label: "Black" },
  { value: "french", label: "French" },
  { value: "glitter", label: "Glitter" },
  { value: "holographic", label: "Holographic" },
  { value: "ombre", label: "Ombre" },
  { value: "chrome", label: "Chrome" },
  { value: "pastel", label: "Pastel" },
  { value: "custom", label: "Custom" },
] as const;

export const SHAPES = [
  { value: "almond", label: "Almond" },
  { value: "square", label: "Square" },
  { value: "oval", label: "Oval" },
  { value: "stiletto", label: "Stiletto" },
  { value: "coffin", label: "Coffin / Ballerina" },
  { value: "round", label: "Round" },
  { value: "squoval", label: "Squoval" },
] as const;

export const SORT_OPTIONS = [
  { value: "name", label: "Name (A-Z)" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "relevance", label: "Relevance" },
  { value: "newest", label: "Newest" },
] as const;

// Type exports
export type ColorValue = (typeof COLORS)[number]["value"];
export type ShapeValue = (typeof SHAPES)[number]["value"];
export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

// ============================================
// Sanity Schema Format Exports
// Format compatible with Sanity's options.list
// ============================================

/** Colors formatted for Sanity schema options.list */
export const COLORS_SANITY_LIST = COLORS.map(({ value, label }) => ({
  title: label,
  value,
}));

/** Shapes formatted for Sanity schema options.list */
export const SHAPES_SANITY_LIST = SHAPES.map(({ value, label }) => ({
  title: label,
  value,
}));

/** Color values array for zod enums or validation */
export const COLOR_VALUES = COLORS.map((c) => c.value) as [ColorValue, ...ColorValue[]];

/** Shape values array for zod enums or validation */
export const SHAPE_VALUES = SHAPES.map((s) => s.value) as [ShapeValue, ...ShapeValue[]];
