"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { client } from "@/sanity/lib/client";
import { PRODUCTS_BY_IDS_QUERY } from "@/sanity/queries/products";
import { getOrCreatePaymongoCustomer } from "@/lib/actions/customer";
import { CartItem } from "../store/cart-store";

if (!process.env.PAYMONGO_SECRET_KEY) {
  throw new Error("PAYMONGO_SECRET_KEY is not defined");
}

const PAYMONGO_BASE_URL = "https://api.paymongo.com/v1";
const PAYMONGO_AUTH = Buffer.from(process.env.PAYMONGO_SECRET_KEY).toString("base64");

// Types

interface CheckoutResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Creates a PayMongo Checkout Session from cart items
 * Validates stock and prices against Sanity before creating session
 */
export async function createCheckoutSession(
  items: CartItem[],
  address: {
    fullName: string;
    phone: string;
    line1: string;
    line2: string;
    barangay: string;
    city: string;
    province: string;
    zipCode: string;
  },
): Promise<CheckoutResult> {
  try {
    // 1. Verify user is authenticated
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return { success: false, error: "Please sign in to checkout" };
    }

    // 2. Validate cart is not empty
    if (!items || items.length === 0) {
      return { success: false, error: "Your cart is empty" };
    }

    // 3. Fetch current product data from Sanity to validate prices/stock
    const productIds = items.map((item) => item.productId);
    const products = await client.fetch(PRODUCTS_BY_IDS_QUERY, {
      ids: productIds,
    });

    // 4. Validate each item
    const validationErrors: string[] = [];
    const validatedItems: {
      product: (typeof products)[number];
      quantity: number;
    }[] = [];

    for (const item of items) {
      const product = products.find((p: { _id: string }) => p._id === item.productId);

      if (!product) {
        validationErrors.push(`Product "${item.name}" is no longer available`);
        continue;
      }

      if ((product.stock ?? 0) === 0) {
        validationErrors.push(`"${product.name}" is out of stock`);
        continue;
      }

      if (item.quantity > (product.stock ?? 0)) {
        validationErrors.push(`Only ${product.stock} of "${product.name}" available`);
        continue;
      }

      validatedItems.push({ product, quantity: item.quantity });
    }

    if (validationErrors.length > 0) {
      return { success: false, error: validationErrors.join(". ") };
    }

    // 5. Build PayMongo line items (amounts in centavos)
    const lineItems = validatedItems.map(({ product, quantity }) => ({
      amount: Math.round((product.price ?? 0) * 100), // PHP centavos
      currency: "PHP",
      name: product.name ?? "Product",
      quantity,
      images: product.image?.asset?.url ? [product.image.asset.url] : [],
    }));

    // 6. Get or create PayMongo customer
    const userEmail = user.emailAddresses[0]?.emailAddress ?? "";
    const userName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || userEmail;

    const { paymongoCustomerId, sanityCustomerId } = await getOrCreatePaymongoCustomer(userEmail, userName, userId);

    // 7. Base URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) || "http://localhost:3000";

    // 8. Create PayMongo Checkout Session
    const response = await fetch(`${PAYMONGO_BASE_URL}/checkout_sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${PAYMONGO_AUTH}`,
      },
      body: JSON.stringify({
        data: {
          attributes: {
            billing: {
              email: userEmail,
              name: userName,
            },
            line_items: lineItems,
            payment_method_types: ["gcash", "paymaya", "card", "dob", "brankas_bdo", "brankas_landbank", "brankas_metrobank"],
            success_url: `${baseUrl}/checkout/success?session_id={id}`,
            cancel_url: `${baseUrl}/checkout`,
            metadata: {
              clerkUserId: userId,
              userEmail,
              sanityCustomerId,
              paymongoCustomerId,
              productIds: validatedItems.map((i) => i.product._id).join(","),
              quantities: validatedItems.map((i) => i.quantity).join(","),
              // Address fields
              addressName: address.fullName,
              addressPhone: address.phone,
              addressLine1: address.line1,
              addressLine2: address.line2,
              addressBarangay: address.barangay,
              addressCity: address.city,
              addressProvince: address.province,
              addressZipCode: address.zipCode,
            },
            send_email_receipt: true,
            show_description: true,
            show_line_items: true,
            description: "Bedazzled Nails Order",
          },
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("PayMongo error:", errorData);
      return { success: false, error: "Failed to create checkout session" };
    }

    const data = await response.json();
    const checkoutUrl = data.data?.attributes?.checkout_url;

    return { success: true, url: checkoutUrl ?? undefined };
  } catch (error) {
    console.error("Checkout error:", error);
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }
}

/**
 * Retrieves a PayMongo checkout session by ID (for success page)
 */
export async function getCheckoutSession(sessionId: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "Not authenticated" };
    }

    const response = await fetch(`${PAYMONGO_BASE_URL}/checkout_sessions/${sessionId}`, {
      headers: {
        Authorization: `Basic ${PAYMONGO_AUTH}`,
      },
    });

    if (!response.ok) {
      return { success: false, error: "Could not retrieve order details" };
    }

    const data = await response.json();
    const session = data.data?.attributes;

    // Verify session belongs to this user
    if (session?.metadata?.clerkUserId !== userId) {
      return { success: false, error: "Session not found" };
    }

    return {
      success: true,
      session: {
        id: data.data.id,
        customerEmail: session.billing?.email,
        customerName: session.billing?.name,
        amountTotal: session.line_items?.reduce((sum: number, item: { amount: number; quantity: number }) => sum + item.amount * item.quantity, 0),
        paymentStatus: session.payment_status,
        lineItems: session.line_items?.map((item: { name: string; quantity: number; amount: number }) => ({
          name: item.name,
          quantity: item.quantity,
          amount: item.amount * item.quantity,
        })),
      },
    };
  } catch (error) {
    console.error("Get session error:", error);
    return { success: false, error: "Could not retrieve order details" };
  }
}
