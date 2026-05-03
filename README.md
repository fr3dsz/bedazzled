<div align="center">
  <h1>💅 Bedazzled Nails</h1>
  <p>A production-ready full-stack e-commerce platform for a Philippine nail extension business</p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
    <img src="https://img.shields.io/badge/Sanity-F03E2F?style=for-the-badge&logo=sanity&logoColor=white" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
    <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" />
  </p>
</div>

---

## Overview

Bedazzled Nails is a complete e-commerce solution built for a small Philippine nail extension business. Customers can browse handcrafted nail extension sets, filter by shape and color/finish, manage their cart, and pay using Philippine payment methods — GCash, Maya, card, and bank transfer — via **PayMongo**. The store owner manages products and orders through a custom real-time **admin panel** powered by the Sanity App SDK.

---

## Features

### Customer

- 🛍️ Browse nail extension sets with multi-image hover preview
- 🔍 Filter by nail shape, color/finish, price range, category, and in-stock
- ⭐ Featured products carousel on homepage
- 🛒 Persistent cart with real-time stock validation
- 📦 Multi-step checkout with Philippine address form (barangay, city, province, ZIP)
- 💳 Pay via GCash, Maya, card, InstaPay, or bank transfer (PayMongo)
- 📋 Order history and order detail pages
- 🔐 Authentication via Clerk (Google, email)
- 🌙 Full dark/light mode

### Admin

- 📊 Dashboard with stats, low stock alerts, and recent orders
- 📦 Real-time product management (create, edit, publish)
- 🗂️ Order management with status updates (paid → shipped → delivered)
- 📍 Editable delivery address per order
- 🔗 Embedded Sanity Studio at `/studio`

---

## Tech Stack

| Category        | Technology                             |
| --------------- | -------------------------------------- |
| Framework       | Next.js 16 (App Router)                |
| Language        | TypeScript                             |
| Styling         | Tailwind CSS 4, shadcn/ui, Base UI     |
| State           | Zustand                                |
| Auth            | Clerk                                  |
| CMS             | Sanity v3, GROQ                        |
| Payments        | PayMongo (GCash, Maya, Card, InstaPay) |
| Admin           | Sanity App SDK                         |
| Deployment      | Vercel                                 |
| Package Manager | pnpm                                   |

---

## Project Structure

```
bedazzled/
├── app/
│   ├── (app)/                    # Storefront
│   │   ├── page.tsx              # Homepage
│   │   ├── products/[slug]/      # Product detail
│   │   ├── checkout/             # Checkout + success
│   │   └── orders/               # Order history
│   ├── (admin)/admin/            # Admin panel
│   ├── api/webhooks/paymongo/    # Webhook handler
│   └── studio/                   # Sanity Studio
├── components/
│   ├── app/                      # Feature components
│   ├── admin/                    # Admin components
│   └── ui/                       # shadcn/ui primitives
├── lib/
│   ├── actions/                  # Server Actions (checkout, customer)
│   ├── constants/                # Filters, order status, stock
│   ├── hooks/                    # useCartStock
│   └── store/                    # Zustand cart store
├── sanity/
│   ├── schemaTypes/              # Product, category, order, customer schemas
│   └── queries/                  # GROQ queries
└── studio-bedazzled/             # Sanity Studio config
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- Sanity account
- Clerk account
- PayMongo account

### Installation

```bash
# Clone the repo
git clone https://github.com/fr3dsz/bedazzled.git
cd bedazzled

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Fill in your keys (see Environment Variables below)

# Run the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the store.

---

## Environment Variables

```dotenv
# App
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# PayMongo
PAYMONGO_SECRET_KEY=
PAYMONGO_PUBLIC_KEY=
PAYMONGO_WEBHOOK_SECRET=
```

### Where to get each key

| Key                     | Where                                                                            |
| ----------------------- | -------------------------------------------------------------------------------- |
| Sanity keys             | [sanity.io/manage](https://sanity.io/manage) → your project → API                |
| Clerk keys              | [clerk.com](https://clerk.com) → your app → API Keys                             |
| PayMongo keys           | [dashboard.paymongo.com](https://dashboard.paymongo.com) → Developers → API Keys |
| PayMongo webhook secret | PayMongo → Developers → Webhooks → Add endpoint                                  |

---

## PayMongo Webhook (Local Development)

```bash
# Forward webhooks to your local server
paymongo listen --forward-to localhost:3000/api/webhooks/paymongo
```

Webhook event to subscribe to: `checkout_session.payment.paid`

---

## Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm typegen      # Generate TypeScript types from Sanity schema
pnpm lint         # Run Biome linter
```

---

## Key Implementation Notes

### Philippine Address Collection

PayMongo does not natively collect shipping addresses. A custom multi-step checkout flow collects Philippine delivery details (barangay, city, province, ZIP code) before redirecting to PayMongo. The address is stored in session metadata and retrieved in the webhook to save against the order in Sanity.

### Webhook Verification

PayMongo webhooks are verified using HMAC-SHA256 signature checking against the `paymongo-signature` header — implemented from scratch without an SDK.

### Real-time Admin

The admin panel uses the Sanity App SDK (`@sanity/sdk-react`) for real-time document editing. Status changes are published instantly via `publishDocument`.

### Type Safety

Sanity types are auto-generated via `pnpm typegen`, ensuring end-to-end type safety between the CMS schema, GROQ queries, and React components.

---

## Deployment

This project is deployed on **Vercel** with automatic deployments on every push to `main`.

1. Push to GitHub
2. Import repo in [vercel.com](https://vercel.com)
3. Add all environment variables
4. Deploy

After deploying, register your production URL as a PayMongo webhook endpoint and add it to Sanity CORS origins and Clerk production domains.

---

## License

This project was built for **Bedazzled Nails** as a client project. All rights reserved.

---

<div align="center">
  Built by <a href="https://github.com/fr3dsz">Luis Frederick Conda</a>
</div>
