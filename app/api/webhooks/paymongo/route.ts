import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createHmac } from "crypto";
import { client, writeClient } from "@/sanity/lib/client";
import { ORDER_BY_PAYMONGO_PAYMENT_ID_QUERY } from "@/sanity/queries/orders";

if (!process.env.PAYMONGO_WEBHOOK_SECRET) {
  throw new Error("PAYMONGO_WEBHOOK_SECRET is not defined");
}

const webhookSecret = process.env.PAYMONGO_WEBHOOK_SECRET;

// ============================================
// Verify PayMongo webhook signature
// ============================================
function verifyPaymongoSignature(body: string, signatureHeader: string, secret: string): boolean {
  try {
    // PayMongo signature format: "t=timestamp,te=test_sig,li=live_sig"
    const parts = Object.fromEntries(signatureHeader.split(",").map((p) => p.split("=") as [string, string]));

    const timestamp = parts["t"];
    const signature = parts["li"] ?? parts["te"]; // live or test signature

    if (!timestamp || !signature) return false;

    const message = `${timestamp}.${body}`;
    const expected = createHmac("sha256", secret).update(message).digest("hex");

    return expected === signature;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signatureHeader = headersList.get("paymongo-signature");

  if (!signatureHeader) {
    return NextResponse.json({ error: "Missing paymongo-signature header" }, { status: 400 });
  }

  // Verify webhook signature
  const isValid = verifyPaymongoSignature(body, signatureHeader, webhookSecret);

  if (!isValid) {
    console.error("PayMongo webhook signature verification failed");
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  let event: PaymongoEvent;

  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Handle the event
  switch (event.data.attributes.type) {
    case "checkout_session.payment.paid": {
      await handleCheckoutPaid(event.data.attributes.data);
      break;
    }
    default:
      console.log(`Unhandled event type: ${event.data.attributes.type}`);
  }

  return NextResponse.json({ received: true });
}

// ============================================
// Types
// ============================================
interface PaymongoEvent {
  data: {
    attributes: {
      type: string;
      data: PaymongoCheckoutSession;
    };
  };
}

interface PaymongoCheckoutSession {
  id: string;
  attributes: {
    payment_intent: {
      id: string;
      attributes: {
        payments: Array<{
          id: string;
          attributes: {
            amount: number;
            status: string;
          };
        }>;
      };
    };
    line_items: Array<{
      name: string;
      quantity: number;
      amount: number;
    }>;
    billing: {
      name?: string;
      email?: string;
      address?: {
        line1?: string;
        line2?: string;
        city?: string;
        state?: string;
        postal_code?: string;
        country?: string;
      };
    };
    metadata: {
      clerkUserId?: string;
      userEmail?: string;
      sanityCustomerId?: string;
      paymongoCustomerId?: string;
      productIds?: string;
      quantities?: string;
      addressName?: string;
      addressPhone?: string;
      addressLine1?: string;
      addressLine2?: string;
      addressBarangay?: string;
      addressCity?: string;
      addressProvince?: string;
      addressZipCode?: string;
    };
    total_amount: number;
    status: string;
  };
}

// ============================================
// Handle checkout paid event
// ============================================
async function handleCheckoutPaid(session: PaymongoCheckoutSession) {
  const paymongoPaymentId = session.id;

  try {
    // Idempotency check — prevent duplicate orders on webhook retries
    const existingOrder = await client.fetch(ORDER_BY_PAYMONGO_PAYMENT_ID_QUERY, { paymongoPaymentId });

    if (existingOrder) {
      console.log(`Webhook already processed for payment ${paymongoPaymentId}, skipping`);
      return;
    }

    // Extract metadata
    const { clerkUserId, userEmail, sanityCustomerId, productIds: productIdsString, quantities: quantitiesString, addressName, addressPhone, addressLine1, addressLine2, addressBarangay, addressCity, addressProvince, addressZipCode } = session.attributes.metadata ?? {};

    if (!clerkUserId || !productIdsString || !quantitiesString) {
      console.error("Missing metadata in checkout session");
      return;
    }

    const productIds = productIdsString.split(",");
    const quantities = quantitiesString.split(",").map(Number);
    const lineItems = session.attributes.line_items ?? [];

    // Build order items array
    const orderItems = productIds.map((productId, index) => ({
      _key: `item-${index}`,
      product: {
        _type: "reference" as const,
        _ref: productId,
      },
      quantity: quantities[index],
      priceAtPurchase: lineItems[index] ? (lineItems[index].amount * lineItems[index].quantity) / 100 : 0,
    }));

    // Generate order number
    const orderNumber = `BDZ-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Extract billing/shipping address
    const billing = session.attributes.billing;
    const address = addressLine1
      ? {
          name: addressName ?? "",
          phone: addressPhone ?? "",
          line1: addressLine1 ?? "",
          line2: addressLine2 ?? "",
          barangay: addressBarangay ?? "",
          city: addressCity ?? "",
          province: addressProvince ?? "",
          zipCode: addressZipCode ?? "",
          country: "PH",
        }
      : undefined;

    // Create order in Sanity
    const order = await writeClient.create({
      _type: "order",
      orderNumber,
      ...(sanityCustomerId && {
        customer: {
          _type: "reference",
          _ref: sanityCustomerId,
        },
      }),
      clerkUserId,
      email: userEmail ?? billing?.email ?? "",
      items: orderItems,
      total: (session.attributes.total_amount ?? 0) / 100,
      status: "paid",
      paymongoPaymentId,
      paymentMethod: "paymongo",
      address,
      createdAt: new Date().toISOString(),
    });

    console.log(`Order created: ${order._id} (${orderNumber})`);

    // Decrease stock for all products
    await productIds.reduce((tx, productId, i) => tx.patch(productId, (p) => p.dec({ stock: quantities[i] })), writeClient.transaction()).commit();

    console.log(`Stock updated for ${productIds.length} products`);
  } catch (error) {
    console.error("Error handling checkout_session.payment.paid:", error);
    throw error; // Re-throw to return 500 and trigger PayMongo retry
  }
}
