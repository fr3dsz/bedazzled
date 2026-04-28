import { defineQuery } from "next-sanity";

/**
 * Get total product count
 */
export const PRODUCT_COUNT_QUERY = defineQuery(`count(*[_type == "product"])`);

/**
 * Get total order count
 */
export const ORDER_COUNT_QUERY = defineQuery(`count(*[_type == "order"])`);

/**
 * Get total revenue from completed orders
 */
export const TOTAL_REVENUE_QUERY = defineQuery(`math::sum(*[
  _type == "order"
  && status in ["paid", "shipped", "delivered"]
].total)`);

// ============================================
// AI Insights Analytics Queries
// ============================================

/**
 * Get orders from the last 7 days with details
 */
export const ORDERS_LAST_7_DAYS_QUERY = defineQuery(`*[
  _type == "order"
  && createdAt >= $startDate
  && !(_id in path("drafts.**"))
] | order(createdAt desc) {
  _id,
  orderNumber,
  total,
  status,
  paymentMethod,
  createdAt,
  "itemCount": count(items),
  items[]{
    quantity,
    priceAtPurchase,
    "productName": product->name,
    "productId": product->_id
  }
}`);

/**
 * Get order status distribution
 */
export const ORDER_STATUS_DISTRIBUTION_QUERY = defineQuery(`{
  "paid": count(*[_type == "order" && status == "paid" && !(_id in path("drafts.**"))]),
  "shipped": count(*[_type == "order" && status == "shipped" && !(_id in path("drafts.**"))]),
  "delivered": count(*[_type == "order" && status == "delivered" && !(_id in path("drafts.**"))]),
  "cancelled": count(*[_type == "order" && status == "cancelled" && !(_id in path("drafts.**"))])
}`);

/**
 * Get payment method distribution
 * Useful for knowing which PH payment methods customers prefer
 */
export const PAYMENT_METHOD_DISTRIBUTION_QUERY = defineQuery(`{
  "gcash": count(*[_type == "order" && paymentMethod == "gcash" && !(_id in path("drafts.**"))]),
  "maya": count(*[_type == "order" && paymentMethod == "maya" && !(_id in path("drafts.**"))]),
  "card": count(*[_type == "order" && paymentMethod == "card" && !(_id in path("drafts.**"))]),
  "bank_transfer": count(*[_type == "order" && paymentMethod == "bank_transfer" && !(_id in path("drafts.**"))])
}`);

/**
 * Get top selling products by quantity sold
 */
export const TOP_SELLING_PRODUCTS_QUERY = defineQuery(`*[
  _type == "order"
  && status in ["paid", "shipped", "delivered"]
  && !(_id in path("drafts.**"))
] {
  items[]{
    "productId": product->_id,
    "productName": product->name,
    "productPrice": product->price,
    quantity
  }
}.items[]`);

/**
 * Get all products with stock and sales data for inventory analysis
 */
export const PRODUCTS_INVENTORY_QUERY = defineQuery(`*[_type == "product"] {
  _id,
  name,
  price,
  stock,
  shape,
  "category": category->title
}`);

/**
 * Get unfulfilled orders (paid but not yet shipped)
 */
export const UNFULFILLED_ORDERS_QUERY = defineQuery(`*[
  _type == "order"
  && status == "paid"
  && !(_id in path("drafts.**"))
] | order(createdAt asc) {
  _id,
  orderNumber,
  total,
  createdAt,
  email,
  paymentMethod,
  "itemCount": count(items)
}`);

/**
 * Get revenue comparison data (current vs previous period)
 */
export const REVENUE_BY_PERIOD_QUERY = defineQuery(`{
  "currentPeriod": math::sum(*[
    _type == "order"
    && status in ["paid", "shipped", "delivered"]
    && createdAt >= $currentStart
    && !(_id in path("drafts.**"))
  ].total),
  "previousPeriod": math::sum(*[
    _type == "order"
    && status in ["paid", "shipped", "delivered"]
    && createdAt >= $previousStart
    && createdAt < $currentStart
    && !(_id in path("drafts.**"))
  ].total),
  "currentOrderCount": count(*[
    _type == "order"
    && createdAt >= $currentStart
    && !(_id in path("drafts.**"))
  ]),
  "previousOrderCount": count(*[
    _type == "order"
    && createdAt >= $previousStart
    && createdAt < $currentStart
    && !(_id in path("drafts.**"))
  ])
}`);
