import { defineQuery } from "next-sanity";

export const CUSTOMER_BY_EMAIL_QUERY = defineQuery(`*[
  _type == "customer"
  && email == $email
][0]{
  _id,
  email,
  name,
  clerkUserId,
  paymongoCustomerId,
  createdAt
}`);

export const CUSTOMER_BY_PAYMONGO_ID_QUERY = defineQuery(`*[
  _type == "customer"
  && paymongoCustomerId == $paymongoCustomerId
][0]{
  _id,
  email,
  name,
  clerkUserId,
  paymongoCustomerId,
  createdAt
}`);
