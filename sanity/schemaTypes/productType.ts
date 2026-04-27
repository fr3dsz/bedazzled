import { PackageIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { COLORS_SANITY_LIST } from "@/lib/constants/filters";

const NAIL_SHAPES = [
  { title: "Almond", value: "almond" },
  { title: "Square", value: "square" },
  { title: "Oval", value: "oval" },
  { title: "Stiletto", value: "stiletto" },
  { title: "Coffin / Ballerina", value: "coffin" },
  { title: "Round", value: "round" },
  { title: "Squoval", value: "squoval" },
];

export const productType = defineType({
  name: "product",
  title: "Product",
  type: "document",
  icon: PackageIcon,
  groups: [
    { name: "details", title: "Details", default: true },
    { name: "media", title: "Media" },
    { name: "inventory", title: "Inventory" },
  ],
  fields: [
    defineField({
      name: "name",
      type: "string",
      group: "details",
      validation: (rule) => [rule.required().error("Product name is required")],
    }),
    defineField({
      name: "slug",
      type: "slug",
      group: "details",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (rule) => [rule.required().error("Slug is required for URL generation")],
    }),
    defineField({
      name: "description",
      type: "text",
      group: "details",
      rows: 4,
      description: "Product description",
    }),
    defineField({
      name: "price",
      type: "number",
      group: "details",
      description: "Price in PHP (e.g., 599.00)",
      validation: (rule) => [rule.required().error("Price is required"), rule.positive().error("Price must be a positive number")],
    }),
    defineField({
      name: "category",
      type: "reference",
      to: [{ type: "category" }],
      group: "details",
      validation: (rule) => [rule.required().error("Category is required")],
    }),
    defineField({
      name: "shape",
      type: "string",
      group: "details",
      description: "Nail extension shape",
      options: {
        list: NAIL_SHAPES,
        layout: "radio",
      },
    }),
    defineField({
      name: "colors",
      type: "array",
      group: "details",
      description: "Colors or finishes in this design",
      of: [{ type: "string" }],
      options: {
        list: COLORS_SANITY_LIST,
        layout: "grid", // displays as checkboxes in a grid
      },
      validation: (rule) => [rule.min(1).error("At least one color is required")],
    }),
    defineField({
      name: "images",
      type: "array",
      group: "media",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
        },
      ],
      validation: (rule) => [rule.min(1).error("At least one image is required")],
    }),
    defineField({
      name: "stock",
      type: "number",
      group: "inventory",
      initialValue: 0,
      description: "Number of sets in stock",
      validation: (rule) => [rule.min(0).error("Stock cannot be negative"), rule.integer().error("Stock must be a whole number")],
    }),
    defineField({
      name: "featured",
      type: "boolean",
      group: "inventory",
      initialValue: false,
      description: "Show on homepage and promotions",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "category.title",
      media: "images.0",
      price: "price",
    },
    prepare({ title, subtitle, media, price }) {
      return {
        title,
        subtitle: `${subtitle ? subtitle + " • " : ""}₱${price ?? 0}`,
        media,
      };
    },
  },
});
