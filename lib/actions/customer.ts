"use server";

import { client, writeClient } from "@/sanity/lib/client";
import { CUSTOMER_BY_EMAIL_QUERY } from "@/sanity/queries/customers";

if (!process.env.PAYMONGO_SECRET_KEY) {
  throw new Error("PAYMONGO_SECRET_KEY is not defined");
}

const PAYMONGO_BASE_URL = "https://api.paymongo.com/v1";
const PAYMONGO_AUTH = Buffer.from(process.env.PAYMONGO_SECRET_KEY).toString("base64");

/**
 * Gets or creates a PayMongo customer by email
 * Also syncs the customer to Sanity database
 */
export async function getOrCreatePaymongoCustomer(email: string, name: string, clerkUserId: string): Promise<{ paymongoCustomerId: string; sanityCustomerId: string }> {
  // 1. Check if customer already exists in Sanity
  const existingCustomer = await client.fetch(CUSTOMER_BY_EMAIL_QUERY, {
    email,
  });

  if (existingCustomer?.paymongoCustomerId) {
    return {
      paymongoCustomerId: existingCustomer.paymongoCustomerId,
      sanityCustomerId: existingCustomer._id,
    };
  }

  // 2. Create new PayMongo customer
  const response = await fetch(`${PAYMONGO_BASE_URL}/customers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${PAYMONGO_AUTH}`,
    },
    body: JSON.stringify({
      data: {
        attributes: {
          email,
          first_name: name.split(" ")[0] ?? name,
          last_name: name.split(" ").slice(1).join(" ") || undefined,
          metadata: {
            clerkUserId,
          },
        },
      },
    }),
  });

  let paymongoCustomerId: string;

  if (response.ok) {
    const data = await response.json();
    paymongoCustomerId = data.data.id;
  } else {
    // PayMongo customer creation failed — proceed without a customer ID
    // checkout session will still work, just won't be linked to a customer
    console.warn("PayMongo customer creation failed, proceeding without customer ID");
    paymongoCustomerId = "";
  }

  // 3. Update existing Sanity customer with PayMongo ID
  if (existingCustomer) {
    await writeClient.patch(existingCustomer._id).set({ paymongoCustomerId, clerkUserId, name }).commit();

    return {
      paymongoCustomerId,
      sanityCustomerId: existingCustomer._id,
    };
  }

  // 4. Create new customer in Sanity
  const newSanityCustomer = await writeClient.create({
    _type: "customer",
    email,
    name,
    clerkUserId,
    paymongoCustomerId,
    createdAt: new Date().toISOString(),
  });

  return {
    paymongoCustomerId,
    sanityCustomerId: newSanityCustomer._id,
  };
}
