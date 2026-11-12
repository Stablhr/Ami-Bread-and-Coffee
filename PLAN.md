# PLAN.md — Ami Bread & Coffee Pre-Order Platform

> Single source of truth for implementation. Later sessions tick task boxes and append to the changelog in the appendix.

## 1. Overview and goals

### 1.1 Product summary

Ami Bread & Coffee Pre-Order Platform is a mobile-first web app for a neighborhood bakery in Trece Martires City, Cavite, Philippines. Customers browse a vintage-styled menu, choose a pickup or delivery date, pre-order sourdough breads, scones, toast, focaccia, coffee, and drinks, and track order status. The owner and a single cashier run the day from a simple dashboard. The shop is open daily 7:00 AM–9:00 PM, Asia/Manila, currency PHP.

No account is required to browse. Sign-in is requested only at **Place order**. Roles: `CUSTOMER`, `STAFF` (cashier), `OWNER`.

### 1.2 Primary users

- **Guest** — browse menu, item detail, ingredients, allergens, reviews.
- **Customer** — date picker, cart, express checkout, tracking, history, reorder, cancel before baking, review after completion.
- **Cashier (STAFF)** — live order feed and status buttons only.
- **Owner (OWNER)** — full control: items, prices, caps, closures, zones, payment details, staff, open/closed switch, day summary, bake list.

### 1.3 Measurable goals

| # | Goal | Target |
|---|------|--------|
| G1 | Mobile task success: a customer can place a pre-order | ≤ 3 minutes, ≥ 90% success in usability tests with adults 60+ |
| G2 | Zero oversells | 0 oversells in the 50-concurrent-orders load test for the last 10 units |
| G3 | Accessibility | 0 serious/critical axe violations on all primary routes; WCAG 2.1 AA |
| G4 | Performance | LCP ≤ 2.5 s on mid-range Android over 4G; CLS ≤ 0.1 |
| G5 | Reliability | ≥ 99% uptime during the first 30 days after soft launch |
| G6 | Owner efficiency | Owner can change an item price or daily cap in ≤ 2 minutes |
| G7 | Operational visibility | New order appears on the owner dashboard within 5 s (SSE) or 10 s (polling fallback) |
| G8 | Cancellation safety | Stock is returned within the same transaction as cancellation; no orphaned reservations |

### 1.4 Non-goals (version 1)

- No courier integration; the owner arranges delivery.
- No payment gateway in v1; GCash/Maya/bank transfer use screenshot + manual **Mark as Paid**. Gateway (e.g. PayMongo) is v1.1 and must not require rewriting orders.
- No native mobile app.
- No nutrition or health-benefit claims unless owner verifies data.
- No loyalty, coupons, or subscriptions.

---

## 2. Assumptions and open questions

### 2.1 Assumptions (each marked [ASSUMPTION])

- [ASSUMPTION] A-1: All prices are stored in centavos (`Int`) to avoid floating point errors; display formatting happens in the web app.
- [ASSUMPTION] A-2: Pickup orders do not select a time slot; pickup is any time during shop hours on the chosen date. Date only is simpler for older users.
- [ASSUMPTION] A-3: Scone "80 each or 3 for 220" is modeled as a single menu item with quantity-based pricing (1 = 80, 3 = 220); any flavors may be mixed. Owner confirms.
- [ASSUMPTION] A-4: The Sampler Box consumes stock from the four loaf types (Plain, Multigrain, Dried Fruits & Nuts, Blueberry), one unit of each per box. It does not have its own cap. Bundled items are modeled with `MenuItem.stockComponents`.
- [ASSUMPTION] A-5: Coffee and drink items are modeled exactly like other menu items; prices are supplied by the owner before seed data is finalized.
- [ASSUMPTION] A-6: Same-day ordering stays **off in v1**. The owner toggle exists but is disabled because cutoff semantics for same-day orders are not defined in v1. Enabling same-day orders is a v1.1 change.
- [ASSUMPTION] A-7: Reviews are per menu item within a completed order; one review per customer per item per order.
- [ASSUMPTION] A-8: Delivery fee is per zone per order, not per item.
- [ASSUMPTION] A-9: Data retention: keep order and payment-proof data for 24 months, then anonymize customer PII and retain aggregated sales. Owner confirms.
- [ASSUMPTION] A-10: Fonts are self-hosted via `next/font` using the suggested pairings; exact font files are chosen during Phase 1 and recorded in the changelog.
- [ASSUMPTION] A-11: The hero image file currently named `hero section.png` will be normalized to `hero-section.png` during the monorepo migration. No heritage/founding-year text is added.
- [ASSUMPTION] A-12: The Dish Orbit Carousel is used as the **featured dishes gallery** on the home page and as the visual product gallery on `/menu`; it is not used on the cashier/owner dashboards.
- [ASSUMPTION] A-13: Owner 2FA uses TOTP (authenticator app) plus 8 single-use backup codes stored hashed.
- [ASSUMPTION] A-14: The shop's Messenger link and phone number are configured via environment variables and admin settings, not hard-coded.
- [ASSUMPTION] A-15: `DailyItemCap.sold` is a cached counter updated only inside the order transaction; it is the source of truth for remaining stock, with a nightly reconciliation job.
- [ASSUMPTION] A-16: Delivery fee uses owner-defined distance bands plus a small-order surcharge below a subtotal threshold and free delivery above a threshold; exact bands/thresholds are owner-configured. Default bands: 0–3 km ₱50, 3–6 km ₱80, 6–10 km ₱120; small-order surcharge ₱30 below ₱500; free delivery at ₱1,000+ within 6 km.
- [ASSUMPTION] A-17: Online payment proof is uploaded after order confirmation from the order tracker. Cash on pickup remains available unless the owner disables it.

### 2.2 Open questions for the owner (answer before Gate B)

1. **Sampler Box stock model** — resolved: consumes stock from the four loaf types (A-4).
2. **Coffee and drink prices** — supply full list with sizes if applicable.
3. **Ingredients and allergens** — provide verified data per item. Placeholders marked `OWNER TO CONFIRM` only; no health claims (diabetic-friendly, low GI, sugar-free) unless verified.
4. **Scone bundle rule** — is "3 for 220" any 3 flavors or a fixed set?
5. **Delivery zones** — exact list of barangays/subdivisions in Trece Martires City and fees; minimum order if any.
6. **Payment details** — GCash/Maya/bank account name and number for display and screenshot matching.
7. **Shop contact** — Messenger page URL and phone number for the "Message the shop" button.
8. **Notifications** — SMS sender name/ID and email sender address; which events besides order placed and ready (if any) should also be SMS?
9. **Data retention** — confirm 24 months before anonymization (A-9).
10. **Reviews** — are reviews public immediately or after owner approval? Default: public immediately, owner can hide.
11. **Closures** — who may close a date, and what notice is shown to customers with existing orders?
12. **Pickup** — is a pickup time window needed, or date only? Default: date only (A-2).

---

### 2.3 Resolved owner answers (2026-11-11)

1. Sampler Box consumes stock from the four loaf types (A-4).
2. Coffee/drink prices use sample values for now; owner will replace them later.
3. Ingredient/allergen data uses sample placeholders for now; owner will replace later.
4. Delivery fees are based on overall order amount and receiver distance (A-16).
5. Online payments are collected after the customer confirms the order; proof upload happens from the tracker (A-17).

## 3. Architecture

### 3.1 System diagram

```mermaid
flowchart LR
  Customer[Customer browser] --> Web[Next.js web app]
  Staff[Staff browser] --> Web
  Owner[Owner browser] --> Web
  Web -->|REST /api/v1 + SSE| API[Express API]
  API --> DB[(PostgreSQL via Prisma)]
  API --> Storage[Storage adapter: local/S3/Cloudinary]
  API --> SMS[SMS adapter: console/Semaphore/Twilio]
  API --> Email[Email adapter: console/SMTP/Resend]
  API --> Auth[JWT httpOnly cookies]
  Web -. polling fallback .-> API
```

### 3.2 Monorepo folder tree

```
ami-bread-and-coffee/
├── package.json                      # npm workspaces root
├── PLAN.md
├── packages/
│   └── shared/
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
│           ├── index.ts
│           ├── schemas/              # Zod schemas (auth, menu, orders, settings)
│           ├── types/                # TypeScript types inferred from Zod
│           └── constants/            # roles, statuses, limits
├── apps/
│   ├── api/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   ├── migrations/
│   │   │   └── seed.ts
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── app.ts
│   │   │   ├── config/
│   │   │   ├── middleware/           # auth, role, csrf, rate-limit, error
│   │   │   ├── modules/
│   │   │   │   ├── auth/
│   │   │   │   ├── users/
│   │   │   │   ├── menu/
│   │   │   │   ├── caps/
│   │   │   │   ├── closures/
│   │   │   │   ├── zones/
│   │   │   │   ├── settings/
│   │   │   │   ├── orders/
│   │   │   │   ├── payments/
│   │   │   │   ├── uploads/
│   │   │   │   ├── reviews/
│   │   │   │   ├── notifications/
│   │   │   │   ├── realtime/
│   │   │   │   └── audit/
│   │   │   ├── adapters/
│   │   │   │   ├── storage/
│   │   │   │   ├── sms/
│   │   │   │   └── email/
│   │   │   └── lib/                  # time (Asia/Manila), money, prisma
│   │   └── tests/
│   └── web/
│       ├── package.json
│       ├── next.config.ts
│       ├── tailwind.config.ts
│       ├── app/
│       │   ├── (public)/
│       │   ├── (auth)/
│       │   ├── (customer)/
│       │   ├── (staff)/
│       │   └── (owner)/
│       ├── components/
│       │   ├── ui/                   # shadcn + dish-orbit-carousel.tsx
│       │   └── vintage/              # paper cards, stamp badges, doodles
│       ├── lib/
│       │   ├── api/
│       │   ├── hooks/
│       │   ├── auth/
│       │   └── time/
│       └── public/
│           ├── hero-section.png       # normalized from "hero section.png"
│           ├── textures/paper-grain.webp
│           └── fonts/
```

### 3.3 Environment variables

#### `apps/api/.env.example`

```env
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ami_bread_coffee?schema=public
JWT_ACCESS_SECRET=change-me-access
JWT_REFRESH_SECRET=change-me-refresh
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=30d
COOKIE_DOMAIN=localhost
WEB_ORIGIN=http://localhost:3000
SHOP_TIMEZONE=Asia/Manila
SHOP_PHONE=+639000000000
SHOP_MESSENGER_URL=https://m.me/ami-bread-and-coffee
STORAGE_PROVIDER=local
S3_BUCKET=
S3_REGION=
S3_ENDPOINT=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
SMS_PROVIDER=console
SEMAPHORE_API_KEY=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_FROM=
EMAIL_PROVIDER=console
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
RESEND_API_KEY=
OWNER_TOTP_ISSUER=Ami Bread and Coffee
RATE_LIMIT_REDIS_URL=
```

#### `apps/web/.env.example`

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SHOP_PHONE=+639000000000
NEXT_PUBLIC_SHOP_MESSENGER_URL=https://m.me/ami-bread-and-coffee
```

### 3.4 Local development setup

1. Install Node.js 18+ and PostgreSQL 15+ (or Docker).
2. `npm install` at repo root.
3. Copy `apps/api/.env.example` to `apps/api/.env` and `apps/web/.env.example` to `apps/web/.env.local`.
4. Start Postgres; create database `ami_bread_coffee`.
5. `npm run db:migrate -w apps/api` then `npm run db:seed -w apps/api`.
6. `npm run dev` (runs both workspaces) or `npm run dev:web` / `npm run dev:api`.
7. Web: http://localhost:3000, API: http://localhost:4000, health check `/api/v1/health`.

### 3.5 npm scripts

Root `package.json`:

```json
{
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev": "npm run dev --workspaces --if-present",
    "dev:web": "npm run dev -w apps/web",
    "dev:api": "npm run dev -w apps/api",
    "build": "npm run build --workspaces --if-present",
    "lint": "npm run lint --workspaces --if-present",
    "typecheck": "npm run typecheck --workspaces --if-present",
    "test": "npm run test --workspaces --if-present",
    "test:e2e": "npm run test:e2e -w apps/web",
    "db:migrate": "npm run prisma:migrate -w apps/api",
    "db:deploy": "npm run prisma:deploy -w apps/api",
    "db:seed": "npm run db:seed -w apps/api"
  }
}
```

API scripts: `dev`, `build`, `start`, `typecheck`, `test`, `prisma:generate`, `prisma:migrate`, `prisma:deploy`, `db:seed`.  
Web scripts: `dev`, `build`, `start`, `lint`, `typecheck`, `test`, `test:e2e`.

---

## 4. Data model

### 4.1 Table overview

| Table | Purpose |
|-------|---------|
| `User` | Customers, staff, owner |
| `RefreshToken` | Rotating refresh tokens (hashed) |
| `AuthChallenge` | OTP and magic-link challenges |
| `Category` | Menu categories |
| `MenuItem` | Sellable items with base price and default cap |
| `DailyItemCap` | Per item per date cap and sold counter |
| `DeliveryZone` | Owner-defined delivery areas and fees |
| `ShopClosure` | Closed dates |
| `ShopSettings` | Singleton shop configuration |
| `Order` | Order header, status, payment status, fulfillment |
| `OrderItem` | Line items with price snapshot |
| `Payment` | Payment records and proof |
| `Review` | Customer reviews after completion |
| `AuditLog` | State changes and admin actions |
| `Notification` | SMS/email delivery log |

### 4.2 Key tables and fields

**User**
- `id` UUID PK
- `phone` String? unique
- `email` String? unique
- `name` String
- `role` Enum `CUSTOMER | STAFF | OWNER`
- `totpSecret` String? (owner only, encrypted at rest)
- `backupCodes` String[] hashed
- `createdAt`, `updatedAt`, `deletedAt` (soft delete for data deletion)
- Indexes: `phone`, `email`, `role`

**RefreshToken**
- `id` UUID PK, `userId` FK, `tokenHash` String unique, `expiresAt`, `revokedAt`, `replacedById`, `createdAt`
- Indexes: `userId`, `tokenHash`, `expiresAt`

**AuthChallenge**
- `id` UUID PK, `type` Enum `PHONE_OTP | EMAIL_MAGIC`, `destination` String, `codeHash` String, `expiresAt`, `attempts` Int default 0, `consumedAt`, `ipAddress`, `createdAt`
- Indexes: `destination, createdAt`, `expiresAt`

**Category**
- `id` UUID PK, `slug` String unique, `name` String, `description` String?, `sortOrder` Int, `active` Boolean default true

**MenuItem**
- `id` UUID PK, `categoryId` FK, `slug` String unique, `name` String, `description` String, `price` Int (centavos), `weightLabel` String?, `imageUrl` String?, `active` Boolean default true, `defaultDailyCap` Int default 20 (ignored when `stockComponents` is set), `maxPerOrder` Int default 5, `stockComponents` Json? (array of `{ menuItemId, quantity }` for bundled items such as the Sampler Box), `ingredients` String[] (owner to confirm), `allergens` String[] (owner to confirm), `tags` String[] (only verified-true tags), `sortOrder` Int, `createdAt`, `updatedAt`
- Indexes: `categoryId, active`, `active, sortOrder`

**DailyItemCap**
- `id` UUID PK, `menuItemId` FK, `date` Date, `cap` Int, `sold` Int default 0, `createdAt`, `updatedAt`
- Unique: `(menuItemId, date)`
- Indexes: `date`, `(menuItemId, date)`
- DB check: `sold >= 0 AND sold <= cap AND cap >= 0` (see 4.4)

**DeliveryZone**
- `id` UUID PK, `name` String, `areas` String[] (barangays/subdivisions), `fee` Decimal(10,2), `active` Boolean default true, `createdAt`, `updatedAt`

**ShopClosure**
- `id` UUID PK, `date` Date unique, `reason` String?, `createdById` FK, `createdAt`

**ShopSettings** (singleton, id = 1)
- `id` Int PK default 1
- `isOpen` Boolean default true
- `bookingWindowDays` Int default 14
- `cutoffTime` String default "18:00"
- `sameDayOrdersEnabled` Boolean default false
- `defaultDailyCap` Int default 20
- `maxQtyPerItem` Int default 5
- `freeDeliveryThreshold` Decimal(10,2) default 1000.00
- `smallOrderSurcharge` Decimal(10,2) default 30.00
- `smallOrderThreshold` Decimal(10,2) default 500.00
- `cashOnPickupEnabled` Boolean default true
- `timezone` String default "Asia/Manila"
- `smsEnabled` Boolean default true
- `emailEnabled` Boolean default true
- `messengerUrl` String?
- `shopPhone` String?
- `updatedAt`

**Order**
- `id` UUID PK, `orderNumber` String unique (e.g. `AMB-20261111-001`)
- `customerId` FK User
- `status` Enum `RECEIVED | IN_THE_OVEN | READY | COMPLETED | CANCELLED`
- `paymentStatus` Enum `UNPAID | AWAITING_CONFIRMATION | PAID | REFUNDED`
- `fulfillmentType` Enum `PICKUP | DELIVERY`
- `pickupDate` Date
- `customerName` String
- `customerPhone` String
- `customerEmail` String?
- `deliveryAddress` String?
- `deliveryZoneId` FK?
- `deliveryFee` Decimal(10,2) default 0
- `subtotal` Decimal(10,2)
- `total` Decimal(10,2)
- `notes` String?
- `attentionFlag` Boolean default false (closed date with orders)
- `undoUntil` DateTime? (10-second undo window)
- `lastAuditLogId` UUID?
- `createdAt`, `updatedAt`, `cancelledAt`
- Indexes: `customerId, createdAt`, `status, createdAt`, `pickupDate`, `paymentStatus`

**OrderItem**
- `id` UUID PK, `orderId` FK, `menuItemId` FK, `nameSnapshot` String, `quantity` Int, `unitPrice` Decimal(10,2), `lineTotal` Decimal(10,2)
- Constraints: `quantity >= 1 AND quantity <= 5`
- Indexes: `orderId`, `menuItemId`

**Payment**
- `id` UUID PK, `orderId` FK unique, `method` Enum `CASH_ON_PICKUP | GCASH | MAYA | BANK_TRANSFER | GATEWAY`, `amount` Decimal(10,2), `status` (mirrors order payment status or separate), `proofUrl` String? (private storage key), `providerRef` String?, `paidAt`, `refundedAt`, `createdAt`, `updatedAt`

**Review**
- `id` UUID PK, `orderId` FK, `menuItemId` FK, `customerId` FK, `rating` Int (1–5), `comment` String?, `hidden` Boolean default false, `createdAt`
- Unique: `(customerId, orderId, menuItemId)`
- Indexes: `menuItemId`, `customerId`

**AuditLog**
- `id` UUID PK, `entityType` String, `entityId` UUID, `action` String, `fromValue` String?, `toValue` String?, `actorId` UUID?, `actorRole` String?, `metadata` Json?, `createdAt`
- Indexes: `entityType, entityId`, `createdAt`, `actorId`

**Notification**
- `id` UUID PK, `orderId` FK?, `channel` Enum `SMS | EMAIL`, `type` String, `recipient` String, `status` Enum `QUEUED | SENT | FAILED`, `provider` String, `providerRef` String?, `error` String?, `sentAt`, `createdAt`
- Indexes: `orderId`, `status, createdAt`

### 4.3 Relationships

- `User 1..* Order` (customer)
- `Category 1..* MenuItem`
- `MenuItem 1..* DailyItemCap`, `MenuItem 1..* OrderItem`, `MenuItem 1..* Review`
- `Order 1..* OrderItem`, `Order 1..1 Payment`, `Order 1..* Review`, `Order 1..* AuditLog` (by entityId)
- `DeliveryZone 1..* Order`
- `User 1..* RefreshToken`, `User 1..* AuthChallenge` (by destination, loose)

### 4.4 Prisma schema outline (abbreviated)

```prisma
generator client { provider = "prisma-client-js" }
datasource db { provider = "postgresql"; url = env("DATABASE_URL") }

enum Role { CUSTOMER STAFF OWNER }
enum OrderStatus { RECEIVED IN_THE_OVEN READY COMPLETED CANCELLED }
enum PaymentStatus { UNPAID AWAITING_CONFIRMATION PAID REFUNDED }
enum FulfillmentType { PICKUP DELIVERY }
enum PaymentMethod { CASH_ON_PICKUP GCASH MAYA BANK_TRANSFER GATEWAY }

model DailyItemCap {
  id         String   @id @default(uuid())
  menuItemId String
  date       DateTime @db.Date
  cap        Int
  sold       Int      @default(0)
  menuItem   MenuItem @relation(fields: [menuItemId], references: [id], onDelete: Cascade)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  @@unique([menuItemId, date])
  @@index([date])
}
```

Migration SQL for the check constraint:

```sql
ALTER TABLE "DailyItemCap"
  ADD CONSTRAINT "daily_item_cap_sold_range"
  CHECK ("sold" >= 0 AND "sold" <= "cap" AND "cap" >= 0);
```

### 4.5 Sold <= cap enforcement

- `sold` is updated only inside the order transaction.
- The DB check constraint is the final guard; Prisma transactions provide row-level locking.
- Application code never trusts a stale `remaining` value; it re-reads locked rows.

---

## 5. API design

Base path: `/api/v1`. All bodies validated with Zod. Auth via httpOnly cookies. Errors use `{ code, message, details? }`.

| Method | Path | Role | Request body / params | Response | Error cases |
|--------|------|------|-----------------------|----------|-------------|
| GET | `/health` | Public | — | `{ status: "ok" }` | 500 |
| POST | `/auth/otp/request` | Public | `{ phone }` | `{ challengeId, expiresIn }` | 400, 429 |
| POST | `/auth/otp/verify` | Public | `{ challengeId, code }` | user + sets cookies | 400, 401, 429 |
| POST | `/auth/magic-link/request` | Public | `{ email }` | `{ sent: true }` | 400, 429 |
| GET | `/auth/magic-link/verify` | Public | `?token` | user + sets cookies | 400, 401 |
| POST | `/auth/refresh` | Public (cookie) | — | rotates cookies | 401 |
| POST | `/auth/logout` | Auth | — | `{ ok: true }` | 401 |
| POST | `/auth/2fa/verify` | Auth (owner step-up) | `{ code }` | sets full session | 400, 401 |
| GET | `/me` | Auth | — | user profile | 401 |
| PATCH | `/me` | Auth | `{ name?, email?, phone? }` | user | 400, 401, 409 |
| DELETE | `/me/data` | Customer | `{ confirm: true }` | `{ ok: true }` | 400, 401, 403 |
| GET | `/categories` | Public | — | category[] | 500 |
| GET | `/menu-items` | Public | `?categoryId&active` | menuItem[] | 400 |
| GET | `/menu-items/:id` | Public | — | menuItem + reviews summary | 404 |
| POST | `/menu-items` | Owner | menuItem payload | menuItem | 400, 401, 403 |
| PATCH | `/menu-items/:id` | Owner | partial menuItem | menuItem | 400, 401, 403, 404 |
| DELETE | `/menu-items/:id` | Owner | — | `{ ok: true }` | 401, 403, 404 |
| GET | `/menu-items/:id/reviews` | Public | `?page` | review[] | 404 |
| GET | `/caps` | Public/Staff/Owner | `?date&menuItemId` | cap[] with remaining | 400 |
| PATCH | `/caps/:id` | Owner | `{ cap }` | cap | 400, 401, 403, 409 (cap < sold) |
| GET | `/closures` | Public | `?from&to` | closure[] | 400 |
| POST | `/closures` | Owner | `{ date, reason? }` | closure | 400, 401, 403, 409 |
| DELETE | `/closures/:id` | Owner | — | `{ ok: true }` | 401, 403, 404 |
| GET | `/delivery-zones` | Public | — | zone[] | 500 |
| POST | `/delivery-zones` | Owner | zone payload | zone | 400, 401, 403 |
| PATCH | `/delivery-zones/:id` | Owner | partial zone | zone | 400, 401, 403, 404 |
| GET | `/shop/settings` | Public (safe subset) | — | settings | 500 |
| PATCH | `/shop/settings` | Owner | partial settings | settings | 400, 401, 403 |
| POST | `/orders` | Customer | create order payload | order | 400, 401, 403, 409, 422, 429 |
| GET | `/orders` | Customer/Staff/Owner | `?status&date&customerId` | order[] | 401, 403 |
| GET | `/orders/:id` | Owner of order / Staff / Owner | — | order detail | 401, 403, 404 |
| PATCH | `/orders/:id/status` | Staff/Owner | `{ status }` | order | 400, 401, 403, 404, 409, 422 |
| POST | `/orders/:id/cancel` | Customer (own) / Owner | `{ reason? }` | order | 400, 401, 403, 404, 409 |
| POST | `/orders/:id/undo` | Owner | — | order | 400, 401, 403, 404, 409 (window expired) |
| POST | `/orders/:id/payment-proof` | Customer (own) | multipart image | payment | 400, 401, 403, 404, 413 |
| PATCH | `/orders/:id/payment-status` | Owner | `{ paymentStatus }` | order | 400, 401, 403, 404, 422 |
| GET | `/orders/:id/events` | Owner of order / Staff / Owner | SSE | event stream | 401, 403, 404 |
| POST | `/uploads` | Staff/Owner (item photos) / Customer (payment proof via order route) | multipart | `{ url, key }` | 400, 401, 403, 413 |
| GET | `/uploads/:key` | Private (signed/local stream) | — | file stream | 401, 403, 404 |
| GET | `/reviews` | Public | `?menuItemId` | review[] | 400 |
| POST | `/reviews` | Customer | `{ orderId, menuItemId, rating, comment? }` | review | 400, 401, 403, 409 |
| GET | `/staff` | Owner | — | user[] (staff) | 401, 403 |
| POST | `/staff` | Owner | `{ name, phone?, email? }` | user + invite | 400, 401, 403 |
| PATCH | `/staff/:id` | Owner | `{ name?, active? }` | user | 400, 401, 403, 404 |
| GET | `/audit-logs` | Owner | `?entityType&entityId` | auditLog[] | 401, 403 |
| GET | `/reports/day-summary` | Owner | `?date` | summary | 401, 403 |

Create order payload (Zod):

```ts
{
  fulfillmentType: "PICKUP" | "DELIVERY",
  pickupDate: string (YYYY-MM-DD),
  customerName: string,
  customerPhone: string,
  customerEmail?: string,
  deliveryAddress?: string,
  deliveryZoneId?: string,
  paymentMethod: "CASH_ON_PICKUP" | "GCASH" | "MAYA" | "BANK_TRANSFER",
  items: [{ menuItemId: string, quantity: number (1..5) }],
  notes?: string
}
```

---

## 6. Business logic

### 6.1 Time zone handling

- All date/time logic uses `Asia/Manila` via a shared helper (`lib/time.ts` in API, `lib/time.ts` in web).
- Store dates as `DATE` (no time) for pickup dates; store timestamps as `TIMESTAMPTZ` in UTC.
- "Today" and "now" are always computed in Manila on the server; the client only displays.
- Booking window: `today + 1 day` through `today + 14 days` (date only, Manila).

### 6.2 Cutoff and closure logic

For a requested pickup date `D` (Manila date):

1. If `D < today + 1 day` → reject `SAME_DAY_NOT_ALLOWED` (default; see A-6).
2. If `D > today + 14 days` → reject `DATE_TOO_FAR`.
3. Cutoff for `D` is `(D - 1 day) 18:00 Manila`. If `now >= cutoff` → reject `CUTOFF_PASSED`.
4. If `D` exists in `ShopClosure` → reject `DATE_CLOSED`.
5. If `ShopSettings.isOpen === false` → reject `SHOP_CLOSED` (new orders only).
6. Delivery: if `fulfillmentType === DELIVERY`, validate `deliveryZoneId` is active and `deliveryAddress` non-empty; fee = zone base fee + small-order surcharge if subtotal < `smallOrderThreshold`, minus free delivery if subtotal >= `freeDeliveryThreshold` and distance band <= 6 km.

Server rechecks all of the above on submit. The browser is never trusted.

### 6.3 Stock reservation transaction (step by step)

Endpoint `POST /orders`:

1. Authenticate customer; validate body with Zod.
2. Compute Manila `today`; run cutoff/closure/shop-open/delivery checks (6.2).
3. Start Prisma interactive transaction (timeout 10 s, maxWait 5 s).
4. Inside the transaction, in this order:
   1. Expand bundled items using `MenuItem.stockComponents` (e.g. one Sampler Box → one unit of each of the four loaf caps). Collect the full list of component `(menuItemId, quantity)` requirements.
   2. Load and lock `DailyItemCap` rows for all required component `(menuItemId, date)` using raw SQL `SELECT ... FROM "DailyItemCap" WHERE "menuItemId" = ANY($1) AND "date" = $2 FOR UPDATE`, ordered by `menuItemId` to avoid deadlocks. Create missing cap rows from `MenuItem.defaultDailyCap` before locking where needed.
   3. For each required component, verify the menu item is active; verify requested quantity ≤ `maxPerOrder` (5) on the top-level item.
   4. Compute `remaining = cap - sold` from the locked row. If `quantity > remaining`, throw `CAP_EXCEEDED` with `{ menuItemId, remaining }`.
   5. Create `Order` + `OrderItem` rows with price snapshots.
   6. Increment `DailyItemCap.sold` by quantity for each component item.
   7. Create `Payment` row (`UNPAID` for cash on pickup; `AWAITING_CONFIRMATION` otherwise).
   8. Insert `AuditLog` (`ORDER_CREATED`, from null to `RECEIVED`).
   9. Commit.
5. If any step throws, the transaction rolls back and the API returns 409/422 with a plain-language message.
6. After commit: enqueue SMS (order placed) and email confirmation; return 201 with order.

### 6.4 Cancellation

- Allowed only when `status === RECEIVED`.
- Customer may cancel own order; owner may cancel any received order.
- Transaction: lock caps, decrement `sold`, set `status = CANCELLED`, `cancelledAt = now`, `paymentStatus = REFUNDED` if it was `PAID` else unchanged, insert audit log.
- If status is not `RECEIVED`, return 409 `CANNOT_CANCEL_AFTER_BAKING`.

### 6.5 Order state machine

States: `RECEIVED`, `IN_THE_OVEN`, `READY` (display "Ready for Pickup" or "Out for Delivery"), `COMPLETED`, `CANCELLED`.

Allowed transitions:

| From | To | Who |
|------|----|-----|
| RECEIVED | IN_THE_OVEN | Staff/Owner |
| RECEIVED | CANCELLED | Customer (own) / Owner |
| IN_THE_OVEN | READY | Staff/Owner |
| READY | COMPLETED | Staff/Owner |
| READY | (no cancel) | — |

- Invalid transitions return 409 `INVALID_TRANSITION`.
- Every change writes an `AuditLog` row with actor, role, from/to, timestamp.
- Owner has a 10-second undo for the last change: `POST /orders/:id/undo` reverts to the previous state within 10 s of the change, writes a compensating audit log, and is owner-only. If an SMS was already sent, the system records `notificationSentAfterUndo` for owner review (notifications are not recalled).

### 6.6 Notification triggers

- **SMS only**: order placed (confirmation + order number) and order `READY`.
- **Email + status page**: order confirmation, status changes, cancellation, refund, review request after completion.
- `Notification` rows track queued/sent/failed with provider and error; retries with exponential backoff (3 attempts).
- Adapters: `console` (dev), Semaphore/Twilio (SMS), SMTP/Resend (email). Console provider logs full payload and never sends.

### 6.7 Caps, closures, and owner constraints

- Owner cannot set a cap below `sold` (409 `CAP_BELOW_SOLD`).
- Closing a date that already has orders sets `attentionFlag = true` on those orders and notifies the owner.
- Daily cap defaults: 20 per item per date (configurable per item and per date).
- Maximum 5 of one item per order.

---

## 7. Frontend

### 7.1 Route map

| Route | Group | Purpose |
|-------|-------|---------|
| `/` | public | Home: hero, open/closed banner, featured dish orbit gallery, how to order, reviews, message shop |
| `/menu` | public | Menu by category; prices; allergen tags |
| `/menu/[slug]` | public | Item detail: photo, price, ingredients, allergens, reviews, add to cart |
| `/reviews` | public | Public reviews |
| `/sign-in` | auth | Phone OTP or email magic link; privacy notice |
| `/verify` | auth | OTP/magic-link callback handling |
| `/cart` | customer | Cart, quantity, date picker entry |
| `/checkout` | customer | Express checkout |
| `/orders` | customer | Order history with reorder |
| `/orders/[id]` | customer | Tracker, message shop, review after completion |
| `/profile` | customer | Name/phone/email |
| `/dashboard` | staff | Live orders + status buttons |
| `/owner` | owner | Tabbed dashboard |
| `/owner/menu` | owner | Menu manager |
| `/owner/caps` | owner | Daily caps |
| `/owner/closures` | owner | Closures |
| `/owner/zones` | owner | Delivery zones |
| `/owner/settings` | owner | Shop settings, payment details, staff |
| `/owner/bake-list` | owner | Printable bake list |
| `/owner/day-summary` | owner | Day summary |
| `/design-tile` | dev/owner | Vintage style tile for Gate A approval |

### 7.2 Page-by-page spec (components and states)

- **Home `/`**: `OpenClosedBanner`, `HeroSection` (uses `public/hero-section.png`), `DishOrbitCarousel` featured gallery, `HowToOrder`, `ReviewCarousel`, `MessageShopButton`. States: loading skeleton for featured items; empty (no featured items) hides carousel; error shows retry + cached menu.
- **Menu `/menu`**: `CategoryTabs`, `MenuCard` (kraft label, dotted leader name–price), `AllergenBadge`, `Price`. States: loading skeletons; empty category message; error retry.
- **Item detail `/menu/[slug]`**: `ItemPhotoFrame`, `IngredientList`, `AllergenNotice` (thick double-bordered), `ReviewList`, `QuantityStepper`, `AddToCartButton`. States: loading; not found; error.
- **Cart `/cart`**: `CartItemRow`, `QuantityStepper`, `DateAvailabilityHint`, `OrderSummary`. States: empty cart with CTA; loading; error.
- **Checkout `/checkout`**: `FulfillmentToggle` (pickup default), `DeliveryZoneSelect`, `PaymentMethodSelect`, `PaymentProofUpload`, `OrderSummary`, `SubmitOrderButton`. States: submitting spinner, validation errors, server conflict (sold out/cutoff/closed) with plain-language message.
- **Order tracker `/orders/[id]`**: `StatusBadge`, `StatusTimeline`, `OrderItems`, `PaymentStatus`, `MessageShopButton`, `ReviewForm` (after completed), `CancelOrderButton` (before oven). States: loading; not found; error; polling fallback indicator.
- **Order history `/orders`**: `OrderCard`, `ReorderButton`. States: empty; loading; error.
- **Staff dashboard `/dashboard`**: `LiveOrderFeed`, `OrderCard`, `StatusButton`, `NewOrderBadge` + sound. States: empty ("No orders right now"); connection lost banner with polling.
- **Owner dashboard `/owner`**: tabs/cards as in section 8.
- **Design tile `/design-tile`**: palette swatches with ratios, typography samples, buttons, badges, menu card, allergen notice, paper texture.

### 7.3 Vintage design direction

Style: old-time neighborhood bakery. Evoke aged paper, ink-stamped labels, ornamental rules, kraft-paper bag tags, built on the shop identity: terracotta line-art logo (use only as supplied), hand-lettered printed menu, chalkboard sign. **No invented founding year or heritage claims.** Logo used only as supplied.

Typography (self-host via `next/font`):
- Headings: DM Serif Display (vintage display serif).
- Large decorative accents only, ≥ 32 px: a brush script (e.g. Caveat or similar) — accents only, never body.
- Body: Lora, 18 px.
- Forms, buttons, prices, status, dashboard: Nunito Sans, 20 px.

Palette tokens (Tailwind config):

| Token | Hex | Use | Contrast |
|-------|-----|-----|----------|
| `paper` | #F3E9D8 | Page background | — |
| `parchment` | #FBF5E9 | Cards | — |
| `terracotta` | #7A3B14 | Primary buttons/links | 7.09:1 on paper, 7.85:1 on parchment |
| `espresso` | #2B1A10 | Body text | 13.88:1 on paper, 15.37:1 on parchment |
| `dusty-red` | #A23B2A | Alerts/errors | 5.46:1 on paper, 6.05:1 on parchment |
| `ochre` | #B8862B | Decoration only | 2.69:1 on paper (never text on cream) |

Status badges (white text, icon + word):

| Status | Hex | White contrast |
|--------|-----|----------------|
| Received | #1D4ED8 | 6.70:1 |
| In the Oven | #B45309 | 5.02:1 |
| Ready | #15803D | 5.02:1 |
| Completed | #4B5563 | 7.56:1 |
| Cancelled | #B91C1C | 6.47:1 |

Texture and ornament:
- Subtle paper-grain background (optimized image or CSS, < 30 KB) on the page background only, never behind text.
- Solid parchment cards; no texture over text.
- Double-rule borders, stamp-style tag badges, deckled/scalloped card edges, ornamental dividers, small hand-drawn doodles (stars/sparkles) like the printed menu.
- Decorative elements `aria-hidden="true"`.
- Item cards as menu cards/kraft labels with a dotted leader between name and price.
- Allergen warnings in a thick double-bordered notice box.
- Photos with a thin print-style frame and one consistent warm tone.

Readability rules (non-negotiable):
- Text contrast ≥ 4.5:1.
- No distressed/rough textures over text.
- No thin or light serif weights at small sizes.
- No long all-caps text.
- No menu text rendered as images.

Dashboard (staff/owner): same palette and sans-serif, **no textures or ornaments**; vintage limited to colors and the logo header.

### 7.4 Tailwind design tokens

```ts
// tailwind.config.ts (excerpt)
theme: {
  extend: {
    colors: {
      paper: "#F3E9D8",
      parchment: "#FBF5E9",
      terracotta: "#7A3B14",
      espresso: "#2B1A10",
      "dusty-red": "#A23B2A",
      ochre: "#B8862B",
      status: {
        received: "#1D4ED8",
        oven: "#B45309",
        ready: "#15803D",
        completed: "#4B5563",
        cancelled: "#B91C1C",
      },
    },
    fontFamily: {
      display: ["DM Serif Display", "serif"],
      body: ["Lora", "serif"],
      ui: ["Nunito Sans", "sans-serif"],
      accent: ["Caveat", "cursive"],
    },
    fontSize: {
      body: ["18px", "1.6"],
      ui: ["20px", "1.5"],
    },
  },
}
```

CSS variables in `globals.css` mirror these tokens for runtime use.

### 7.5 Form behavior

- React Hook Form + Zod resolver using shared schemas.
- Inline validation on blur; submit disabled until valid.
- Plain-language error messages mapped from backend codes via `getFriendlyErrorMessage()`.
- Phone input accepts `09xx` or `+639xx` and normalizes to `+639xxxxxxxxx`.
- Date picker shows availability (remaining) and disables closed/cutoff dates.
- Quantity stepper clamps 1..5; shows remaining stock.
- Payment proof: client-side image compression to ≤ 1 MB before upload; accept JPEG/PNG/WebP.

### 7.6 Accessibility checklist

- [ ] Semantic landmarks (`header`, `main`, `nav`, `footer`) and one `h1` per page.
- [ ] Skip-to-content link.
- [ ] All inputs have visible labels (no placeholder-only labels).
- [ ] Focus outline 3 px, high contrast, never removed.
- [ ] Touch targets ≥ 48 px (≥ 64 px on owner dashboard).
- [ ] Body text ≥ 18 px; UI text ≥ 20 px.
- [ ] Works at 200% zoom without horizontal scroll.
- [ ] `prefers-reduced-motion` disables non-essential animation (including Dish Orbit Carousel).
- [ ] Color never the only indicator (status badges include icon + word).
- [ ] `aria-live` regions for cart/order status updates.
- [ ] Decorative elements `aria-hidden`.
- [ ] axe scan in CI for all primary routes.
- [ ] Keyboard-only completion of browse → cart → checkout → track.
- [ ] Screen reader tested (NVDA/VoiceOver) for checkout and tracker.

---

## 8. Owner and cashier dashboard

### 8.1 Cashier dashboard (`/dashboard`, STAFF)

- Live order feed sorted by newest first, grouped by status.
- One order per card: order number, time, customer name, items, fulfillment, payment status.
- One big next-step button per card: **Start baking** (RECEIVED→IN_THE_OVEN), **Mark ready** (IN_THE_OVEN→READY), **Complete** (READY→COMPLETED).
- New-order sound + flashing badge; mute toggle persisted.
- Connection status indicator; polling fallback every 10 s if SSE fails.
- No prices, caps, or settings editable.

### 8.2 Owner dashboard (`/owner`, OWNER)

- Persistent OPEN/CLOSED switch with confirmation.
- Tabs: Orders, Menu, Caps, Closures, Zones, Settings, Staff, Reviews, Bake list, Day summary.
- Orders: same cards as cashier plus cancel and undo.
- Menu manager: CRUD items, price, photo, ingredients, allergens, tags, active, default cap, max per order, sort order.
- Caps: per item per date editor; cannot go below sold; shows sold/remaining.
- Closures: calendar picker; warns if date has orders and flags them.
- Zones: CRUD barangays/subdivisions and fees.
- Settings: booking window, cutoff time, default cap, max per item, shop phone, messenger URL, SMS/email toggles, payment details.
- Staff: create/deactivate cashier accounts; reset 2FA (owner only).
- Reviews: view/hide reviews.
- Bake list: printable list grouped by item with totals for a chosen date; print CSS.
- Day summary: orders by status, revenue by payment method, sold-out items, cancellations.
- All destructive actions confirm; undo 10 s for status changes.

---

## 9. Authentication, authorization, and security

### 9.1 Authentication

- Sign-in by phone OTP or email magic link. No passwords.
- OTP: 6 digits, 10-minute expiry, max 5 attempts per challenge, rate limited.
- Magic link: signed token, 15-minute expiry, single use.
- Sessions: access JWT (15 min) + refresh JWT (30 days) in `httpOnly`, `Secure`, `SameSite` cookies. Refresh token rotation with reuse detection (revoke all sessions on reuse).
- Owner requires TOTP 2FA after primary auth; 8 hashed backup codes.

### 9.2 Authorization

- Role middleware on every route: `requireRole(...)`.
- Customers can only read/mutate their own orders.
- Staff can read all orders and change status only; cannot edit catalog/settings.
- Owner has full access.

### 9.3 Security controls

- Zod validation on every endpoint (shared schemas).
- Rate limiting: OTP request 5/phone/15 min; verify 5/challenge; orders 10/user/hour; global 100 req/min/IP.
- `helmet`, strict CORS allowlist (`WEB_ORIGIN`).
- CSRF protection for cookie auth: double-submit token (`X-CSRF-Token` header vs cookie) with `SameSite` cookies.
- Private storage for payment screenshots; access via signed URL or authenticated stream.
- No card data stored (no gateway in v1).
- Minimal PII; privacy notice at sign-in referencing Philippine Data Privacy Act of 2012.
- Delete-customer-data action anonymizes orders (keeps aggregated sales) and removes PII.
- Audit log for all state and catalog changes.
- Secrets only in env; never logged.

---

## 10. Testing strategy

### 10.1 Tools

- API: Jest + Supertest; Prisma test database.
- Web: Vitest + React Testing Library.
- E2E: Playwright (Chromium, Firefox, WebKit; mobile viewport).
- Accessibility: axe-core in Playwright and RTL.
- Load: custom script (50 concurrent orders) against a seeded test DB.

### 10.2 Named test cases

API:
- `POST /orders` creates order and increments `sold` in one transaction.
- `concurrent last 10 units: 50 simultaneous orders → exactly 10 succeed` (assert 10 × 201, 40 × 409, `sold === cap`).
- Cutoff rejects order after 18:00 previous day.
- Closed date rejects order.
- Shop closed rejects new orders but allows reads.
- Delivery zone validation rejects unknown zone.
- Cancel before oven returns stock (`sold` decremented).
- Cancel after baking returns 409.
- Invalid state transitions return 409.
- Owner undo within 10 s restores previous status.
- Cap cannot be set below sold (409).
- Closing a date with orders sets `attentionFlag`.
- OTP rate limit returns 429.
- Refresh token reuse revokes all sessions.
- Role middleware blocks staff from catalog writes.

Frontend:
- Menu card shows dotted leader between name and price.
- Allergen notice renders with double border.
- Cart quantity cannot exceed 5.
- Checkout defaults to pickup and cash on pickup.
- Date picker disables closed and cutoff dates.
- Reduced motion disables carousel animation.
- axe scan passes on home, menu, item detail, cart, checkout, tracker, dashboards.

E2E:
- Guest browses menu → signs in with OTP → places pickup order → sees tracker.
- Customer cancels before baking; stock restored (verified via cap endpoint).
- Staff moves order RECEIVED → IN_THE_OVEN → READY → COMPLETED.
- Owner edits price/cap; customer sees updated price.
- Owner toggles shop closed; customer sees banner and cannot order.
- Accessibility: keyboard-only checkout.

---

## 11. Implementation roadmap (8 weeks)

- **Phase 1 — Design, content, scaffold (weeks 1–2)**  
  Gate A: Design approved (vintage style tile).
- **Phase 2 — Database, auth, catalog, admin menu (weeks 3–4)**  
  Gate B: Catalog live.
- **Phase 3 — Cart, date picker, order engine, checkout, tracker, dashboard, notifications, v1 payments (weeks 5–6)**  
  Gate C: Orders safe (load test passes).
- **Phase 4 — Usability/accessibility testing, hardening, deployment, training, soft launch (weeks 7–8)**  
  Gate D: Go live.

---

## 12. Task breakdown

### Phase 1 — Design, content, scaffold

- [ ] T-001 Initialize monorepo workspaces and root scripts  
  - Depends: none  
  - Files: `package.json`, `.gitignore`, `README.md`  
  - Acceptance: `npm install` succeeds; workspaces resolve.

- [ ] T-002 Scaffold `packages/shared` with TS config and barrel exports  
  - Depends: T-001  
  - Files: `packages/shared/*`  
  - Acceptance: `npm run build -w packages/shared` passes.

- [ ] T-003 Scaffold `apps/api` Express + TypeScript skeleton (app, index, health route)  
  - Depends: T-001, T-002  
  - Files: `apps/api/src/*`, `tsconfig.json`  
  - Acceptance: `GET /api/v1/health` returns 200.

- [ ] T-004 Migrate existing frontend into `apps/web` (Next.js 16, Tailwind v4, shadcn)  
  - Depends: T-001  
  - Files: `apps/web/*`  
  - Acceptance: `npm run dev -w apps/web` starts; lint passes.

- [ ] T-005 Add shared Zod schemas for auth, menu, orders, settings  
  - Depends: T-002  
  - Files: `packages/shared/src/schemas/*`  
  - Acceptance: schemas importable by both apps; typecheck passes.

- [ ] T-006 Implement Tailwind design tokens (colors, fonts, sizes, focus)  
  - Depends: T-004  
  - Files: `apps/web/tailwind.config.ts`, `apps/web/app/globals.css`  
  - Acceptance: token classes render; contrast documented.

- [x] T-007 Build vintage style tile page `/design-tile`  
  - Depends: T-006  
  - Files: `apps/web/app/(public)/design-tile/page.tsx`, `components/vintage/*`  
  - Acceptance: page shows palette, typography, badges, menu card, allergen notice, texture.

- [x] T-008 Normalize hero asset and implement `HeroSection`  
  - Depends: T-004  
  - Files: `apps/web/public/hero-section.png`, `components/hero-section.tsx`  
  - Acceptance: hero renders with `next/image`, descriptive alt, no CLS.

- [x] T-009 Integrate Dish Orbit Carousel component  
  - Depends: T-004  
  - Files: `apps/web/components/ui/dish-orbit-carousel.tsx`, `lib/menu-to-dish.ts`  
  - Acceptance: `npm i gsap` recorded; carousel renders featured items; reduced motion respected.

- [x] T-010 Compose home page  
  - Depends: T-007, T-008, T-009  
  - Files: `apps/web/app/(public)/page.tsx`  
  - Acceptance: hero, banner, gallery, how-to-order, reviews, message shop render.
  - Note: reviews section intentionally omitted until real customer reviews exist (no invented testimonials).

- [ ] T-011 Configure test tooling (Vitest, RTL, Playwright, axe)  
  - Depends: T-003, T-004  
  - Files: config files in both apps  
  - Acceptance: `npm test` runs with 0 failures on empty suites.
  - Progress: Vitest configured in `apps/web` with catalog/mapping tests (8 passing). RTL, Playwright, and axe still to add.

- [x] T-012 Collect owner content into seed spreadsheet (items, prices, ingredients, zones, payment details)  
  - Depends: none (owner)  
  - Files: `apps/api/prisma/seed-data/*.json` (data only)  
  - Acceptance: all menu items from section 16 present; unknowns marked `OWNER TO CONFIRM`.
  - Progress: catalog captured in `apps/web/lib/menu-data.ts`; ingredient/allergen values are sample placeholders pending owner confirmation.

### Phase 2 — Database, auth, catalog, admin menu

- [x] T-013 Initialize Prisma and create full schema  
  - Depends: T-003  
  - Files: `apps/api/prisma/schema.prisma`  
  - Acceptance: `prisma validate` passes; all tables present.
  - Progress: schema validated against Postgres. Money fields stored as integer centavos (per A-1), overriding the earlier `Decimal(10,2)` sketch so the DB matches the shared money helpers. Added `weightLabel` to MenuItem. Local dev uses `npx prisma dev` (no Docker).

- [x] T-014 Create initial migration and check constraint for `DailyItemCap`  
  - Depends: T-013  
  - Files: `apps/api/prisma/migrations/*`  
  - Acceptance: `prisma migrate dev` succeeds; check constraint exists.
  - Progress: `20261111152301_init` applied; `20261111153000_daily_cap_checks` adds non-negative checks on `DailyItemCap.cap`/`sold` and `MenuItem.price`, plus a positive check on `OrderItem.quantity`; `20261111154000_menu_item_weight_label` adds `MenuItem.weightLabel`. Future migrations use `npm run db:migrate:diff` then `npm run db:deploy` (the local Prisma Dev proxy does not support `migrate dev`'s shadow database).

- [x] T-015 Implement seed script  
  - Depends: T-012, T-014  
  - Files: `apps/api/prisma/seed.ts`, `apps/api/prisma/seed-data/catalog.json`  
  - Acceptance: `npm run db:seed` populates categories, items, caps, zones, settings, owner account.
  - Progress: 6 categories, 20 items, 266 daily cap rows (14 days), 2 delivery zones, settings, and an owner account. Sampler Box stores `stockComponents` pointing at the four loaf items. Ingredient/allergen data and drink prices are sample placeholders flagged OWNER TO CONFIRM. Seed is idempotent.

- [x] T-016 Implement time helpers (Asia/Manila) and money formatting  
  - Depends: T-003  
  - Files: `apps/api/src/lib/time.ts`, `apps/web/lib/time.ts`  
  - Acceptance: unit tests for cutoff and booking window pass.
  - Progress: logic lives in `packages/shared/src/lib/time.ts` and `money.ts`; `apps/api/src/lib/time.ts` re-exports it and the web app imports `@ami/shared` directly. 21 Vitest tests pass (Manila date boundary, open hours, 18:00 cutoff, 14-day booking window, peso formatting).

- [ ] T-017 Phone OTP auth (request + verify) with console/SMS adapter  
  - Depends: T-013, T-005  
  - Files: `apps/api/src/modules/auth/*`, `adapters/sms/*`  
  - Acceptance: OTP request/verify works in dev via console log; rate limit works.

- [ ] T-018 Email magic link auth  
  - Depends: T-017, `adapters/email/*`  
  - Files: `apps/api/src/modules/auth/*`  
  - Acceptance: magic link verifies and sets cookies.

- [ ] T-019 JWT cookie sessions + refresh token rotation  
  - Depends: T-017  
  - Files: `apps/api/src/modules/auth/session.ts`, `middleware/auth.ts`  
  - Acceptance: refresh rotation test passes; reuse detection revokes sessions.

- [ ] T-020 Role middleware, helmet, CORS, CSRF  
  - Depends: T-019  
  - Files: `apps/api/src/middleware/*`  
  - Acceptance: unauthorized/forbidden cases return 401/403; CSRF test passes.

- [ ] T-021 Owner 2FA (TOTP + backup codes)  
  - Depends: T-019  
  - Files: `apps/api/src/modules/auth/two-factor.ts`  
  - Acceptance: owner login requires TOTP; backup code works once.

- [ ] T-022 Staff account creation by owner  
  - Depends: T-020, T-021  
  - Files: `apps/api/src/modules/users/*`  
  - Acceptance: owner creates staff; staff can sign in; staff cannot edit catalog.

- [ ] T-023 Public catalog endpoints + web hooks  
  - Depends: T-015, T-005  
  - Files: `apps/api/src/modules/menu/*`, `apps/web/lib/hooks/*`  
  - Acceptance: menu pages render from API; TanStack Query caching works.

- [ ] T-024 Admin menu manager (CRUD)  
  - Depends: T-020, T-023  
  - Files: `apps/web/app/(owner)/owner/menu/*`, API menu module  
  - Acceptance: owner can create/edit/hide item; changes reflect publicly.

- [ ] T-025 Daily cap management endpoints + UI  
  - Depends: T-024  
  - Files: `apps/api/src/modules/caps/*`, `apps/web/app/(owner)/owner/caps/*`  
  - Acceptance: cap update rejects below sold; UI shows sold/remaining.

- [ ] T-026 Closure management  
  - Depends: T-020  
  - Files: `apps/api/src/modules/closures/*`, owner UI  
  - Acceptance: closing a date with orders sets attention flags.

- [ ] T-027 Delivery zone management  
  - Depends: T-020  
  - Files: `apps/api/src/modules/zones/*`, owner UI  
  - Acceptance: zones CRUD; public endpoint lists active zones.

- [ ] T-028 Shop settings endpoint + owner UI (incl. open/closed)  
  - Depends: T-020  
  - Files: `apps/api/src/modules/settings/*`, owner UI  
  - Acceptance: settings persist; open/closed toggles.

- [ ] T-029 Storage adapter + upload endpoint  
  - Depends: T-003  
  - Files: `apps/api/src/adapters/storage/*`, `modules/uploads/*`  
  - Acceptance: local upload in dev; S3/Cloudinary selectable via env.

- [ ] T-030 Reviews endpoints + UI  
  - Depends: T-023  
  - Files: `apps/api/src/modules/reviews/*`, web review components  
  - Acceptance: customer can review completed order item; public list works.

### Phase 3 — Cart, orders, checkout, dashboard, notifications, payments

- [ ] T-031 Cart state (context + localStorage)  
  - Depends: T-023  
  - Files: `apps/web/lib/cart/*`  
  - Acceptance: add/remove/quantity persists across refresh; max 5 per item.

- [ ] T-032 Date picker with Manila timezone, availability, closures  
  - Depends: T-016, T-025, T-026  
  - Files: `apps/web/components/date-picker.tsx`  
  - Acceptance: disables closed/cutoff/past dates; shows remaining.

- [ ] T-033 Checkout form (RHF + Zod) and submission  
  - Depends: T-031, T-032, T-005  
  - Files: `apps/web/app/(customer)/checkout/page.tsx`  
  - Acceptance: validation inline; submit creates order; errors plain-language.

- [ ] T-034 Order engine transaction (stock reservation)  
  - Depends: T-014, T-016  
  - Files: `apps/api/src/modules/orders/create-order.ts`  
  - Acceptance: transaction locks rows; cap enforced; load test passes.

- [ ] T-035 Payment proof upload flow  
  - Depends: T-029, T-033  
  - Files: `apps/web/components/payment-proof-upload.tsx`, API payment module  
  - Acceptance: image uploads privately; proof URL saved to payment.

- [ ] T-036 Order tracker page + polling/SSE client  
  - Depends: T-034  
  - Files: `apps/web/app/(customer)/orders/[id]/page.tsx`, `lib/realtime/*`  
  - Acceptance: status updates within 5 s (SSE) or 10 s (polling).

- [ ] T-037 Order history and one-tap reorder  
  - Depends: T-036  
  - Files: `apps/web/app/(customer)/orders/page.tsx`  
  - Acceptance: history lists orders; reorder fills cart.

- [ ] T-038 Cancellation endpoint + UI  
  - Depends: T-034  
  - Files: `apps/api/src/modules/orders/cancel.ts`, tracker UI  
  - Acceptance: cancel before oven returns stock; later cancel blocked.

- [ ] T-039 State machine + audit log + undo  
  - Depends: T-034  
  - Files: `apps/api/src/modules/orders/status.ts`, `modules/audit/*`  
  - Acceptance: transitions validated; audit rows written; undo works 10 s.

- [ ] T-040 SSE live feed endpoint + client  
  - Depends: T-039  
  - Files: `apps/api/src/modules/realtime/*`, `apps/web/lib/realtime/sse.ts`  
  - Acceptance: staff/owner receive new/changed orders; heartbeat works.

- [ ] T-041 Cashier dashboard UI  
  - Depends: T-040  
  - Files: `apps/web/app/(staff)/dashboard/page.tsx`  
  - Acceptance: live feed, status buttons, sound, mute, polling fallback.

- [ ] T-042 Owner dashboard UI  
  - Depends: T-040, T-024, T-025, T-026, T-027, T-028  
  - Files: `apps/web/app/(owner)/owner/page.tsx`  
  - Acceptance: tabs/cards, open/closed switch, new-order sound, bake list link.

- [ ] T-043 Printable bake list  
  - Depends: T-042  
  - Files: `apps/web/app/(owner)/owner/bake-list/page.tsx`  
  - Acceptance: grouped totals by item for date; print CSS clean.

- [ ] T-044 Notification adapters + triggers  
  - Depends: T-034, T-039  
  - Files: `apps/api/src/adapters/sms/*`, `adapters/email/*`, `modules/notifications/*`  
  - Acceptance: SMS on placed/ready; email on all events; console provider logs in dev.

- [ ] T-045 Payment status actions (mark paid, refund)  
  - Depends: T-035, T-039  
  - Files: `apps/api/src/modules/payments/*`, owner UI  
  - Acceptance: owner can mark paid/refund; customer sees status.

- [ ] T-046 Reviews submission after completion  
  - Depends: T-030, T-039  
  - Files: tracker UI, reviews module  
  - Acceptance: review form appears only after COMPLETED; submit works.

### Phase 4 — Testing, hardening, deployment, training, soft launch

- [ ] T-047 Accessibility audit and fixes  
  - Depends: T-042, T-041, T-036  
  - Files: all web components  
  - Acceptance: axe 0 serious/critical on primary routes; keyboard-only checkout passes.

- [ ] T-048 Usability testing with older adults/low vision and iteration  
  - Depends: T-047  
  - Files: UI copy/layout  
  - Acceptance: task success ≥ 90%; documented findings.

- [ ] T-049 Concurrent order load test (50 simultaneous)  
  - Depends: T-034  
  - Files: `apps/api/tests/load/concurrent-orders.test.ts`  
  - Acceptance: exactly 10 succeed for last 10 units; no oversell.

- [ ] T-050 Security hardening review  
  - Depends: T-020, T-034  
  - Files: middleware, routes  
  - Acceptance: rate limits, CSRF, headers, PII deletion verified.

- [ ] T-051 CI pipeline (lint, typecheck, tests, build, e2e)  
  - Depends: T-011  
  - Files: `.github/workflows/ci.yml`  
  - Acceptance: CI green on main.

- [ ] T-052 Deployment (Vercel web + Render API/Postgres)  
  - Depends: T-051  
  - Files: deployment config  
  - Acceptance: staging environment live; smoke tests pass.

- [ ] T-053 Migrations, backups, monitoring, uptime check  
  - Depends: T-052  
  - Files: ops runbook  
  - Acceptance: backup restore tested; Sentry + uptime alerts configured.

- [ ] T-054 Owner training session + manual  
  - Depends: T-052  
  - Files: `docs/owner-manual.md`  
  - Acceptance: owner completes checklist tasks unaided.

- [ ] T-055 Soft launch + feedback loop  
  - Depends: T-053, T-054  
  - Files: none  
  - Acceptance: 2-week soft launch; feedback triaged; Gate D signed off.

---

## 13. DevOps

### 13.1 CI pipeline

GitHub Actions on PR and push to `main`:
1. Checkout + Node setup.
2. `npm ci`.
3. Lint and typecheck (workspaces).
4. Unit/integration tests with Postgres service container.
5. Build web and API.
6. Playwright E2E + axe (on `main` only or nightly).
7. Upload coverage.

### 13.2 Environments

- **local**: developer machines.
- **staging**: Vercel preview + Render staging + managed Postgres.
- **production**: Vercel production + Render production + managed Postgres.

### 13.3 Deployment

- Web: Vercel (recommended for Next.js App Router).  
- API: Render Web Service (recommended) or Railway/Fly.io.  
- Database: Render PostgreSQL (managed) or Neon/Supabase.  
- Cost estimate (verify current pricing/terms): Vercel Pro ~$20/user/month (commercial use), Render web service ~$7/month, Render Postgres ~$7/month, storage ~$1–$5/month, SMS ~₱500–₱2,000/month depending on volume, email free tier. Total roughly $34/month + SMS. **Verify current pricing and commercial-use terms before committing.**

### 13.4 Database migrations

- Prisma migrations in `apps/api/prisma/migrations`.
- Local: `prisma migrate dev`.
- Deploy: `prisma migrate deploy` in release command.
- Never edit production data manually; use migrations or one-off scripts reviewed in PR.

### 13.5 Backups

- Managed Postgres daily backups (7-day retention) + weekly export to object storage.
- Test restore quarterly; document RTO/RPO (target RPO 24 h, RTO 4 h).

### 13.6 Monitoring and error tracking

- Sentry for web and API.
- Pino structured logs to stdout (Render captures).
- Uptime check every 5 minutes (Better Stack or UptimeRobot) on `/api/v1/health` and web home.
- Alert on 5xx rate > 1% for 5 minutes or uptime failure.

### 13.7 Downtime fallback

- If API is down, web shows cached menu and a banner "We are temporarily unable to take orders. Please try again shortly or message us."
- Order submission disabled; existing trackers show last known status.
- Owner can post a closure notice via a static config update if needed.

---

## 14. Risks and mitigations

1. **Overselling under concurrent load** — Mitigate with row-level locking (`SELECT ... FOR UPDATE`), DB check constraint, transactional increments, and the 50-concurrent load test.
2. **Time zone bugs (Manila vs server UTC)** — Mitigate with a single shared time helper, server-side date computation, and tests around midnight/cutoff.
3. **Accessibility regressions from vintage styling** — Mitigate with contrast table, readability rules, axe in CI, and usability testing with older adults/low vision.
4. **SMS/email delivery failures** — Mitigate with adapter interfaces, console provider in dev, retry/backoff, and `Notification` status tracking.
5. **Owner data entry errors (ingredients/allergens)** — Mitigate with placeholders marked `OWNER TO CONFIRM`, no health claims by default, and owner-only edit with audit log.
6. **Payment proof handling (privacy)** — Mitigate with private storage, signed URLs, size/type limits, and no public listing.
7. **Scope creep (gateway, courier)** — Mitigate by deferring to v1.1 and designing payment behind an interface so orders do not change.
8. **Single owner/cashier operational bottleneck** — Mitigate with simple dashboard, sound alerts, print bake list, and clear training.

---

## 15. Launch checklist and owner training plan

### 15.1 Launch checklist

- [ ] All Phase 4 tasks complete.
- [ ] Seed data verified by owner (prices, ingredients, allergens, zones, payment details).
- [ ] Owner 2FA enrolled and backup codes stored safely.
- [ ] Staff account created and tested.
- [ ] Production env vars set; secrets rotated from dev.
- [ ] Migrations applied; backup restore tested.
- [ ] Sentry and uptime alerts configured and tested.
- [ ] Domain and HTTPS configured; cookies `Secure`.
- [ ] Privacy notice reviewed.
- [ ] Soft launch to 10–20 trusted customers.
- [ ] Feedback triaged; critical issues fixed.
- [ ] Gate D sign-off.

### 15.2 Owner training plan

- 90-minute in-person/remote session using a printed quick guide.
- Walkthrough: open/closed switch, reading an order card, status buttons, undo, adding/editing items, changing caps, closing a date, delivery zones, payment details, marking paid, printing bake list, day summary.
- Practice scenarios: sold-out item, late order, cancellation, closed date with orders, payment proof mismatch.
- Leave a one-page cheat sheet next to the counter; schedule a follow-up after 1 week.

---

## 16. Appendix

### 16.1 Seed data (prices in PHP; ingredients/allergens owner to confirm)

Categories and items:

Sourdough Breads (~800 g):
- Plain — 200
- Multigrain — 250
- Dried Fruits & Nuts — 300
- Blueberry — 300
- Espresso — 300

Sampler Box (4 flavors at 500 g each: Dried Fruits & Nuts, Multigrain, Plain, Blueberry) — 700 (consumes one unit of each of the four loaf caps; no own cap)

Sourdough Scones:
- Chocochip — 80 (or 3 for 220)
- Apple Cinnamon — 80 (or 3 for 220)
- Vanilla Almond — 80 (or 3 for 220)

Sourdough Toast:
- Triple Cheese — 120
- Pizza — 120

Sourdough Focaccia:
- Pepper Jack Jalapeno — 150
- Toasted Brown Sugar Cinnamon — 150
- Pesto — 150

Coffee and drinks: prices supplied by owner (model as standard items). Sample placeholders to be replaced by owner: Americano 120, Latte 150, Cappuccino 150, Iced Coffee 140, Hot Chocolate 130, Iced Tea 90.

All ingredient, allergen, and tag data: `OWNER TO CONFIRM`. Sample placeholders may be used in staging and must be replaced before launch. No health-benefit claims unless verified by owner. Only tags that are true may be shown.

### 16.2 Glossary

- **Cap** — maximum quantity of an item available for a date.
- **Cutoff** — 6:00 PM Manila the day before pickup; last time to place an order.
- **Booking window** — 14 days from tomorrow.
- **SSE** — Server-Sent Events.
- **2FA** — two-factor authentication (TOTP for owner).
- **Centavos** — 1/100 of a peso; storage unit for prices.

### 16.3 Changelog (PLAN.md)

- 2026-11-11: Initial plan created. Includes vintage design direction, Dish Orbit Carousel integration, hero asset `hero-section.png`, accessibility checklist, 55 numbered tasks, and deployment cost estimates.
- 2026-11-11: Applied owner answers: Sampler Box consumes the four loaf caps; coffee/ingredient data uses sample placeholders; delivery fees use amount + distance bands; online payment proof is uploaded after order confirmation.
- 2026-11-11: Phase 1 progress — fixed font theme tokens (display/accent utilities were never generated), added the static catalog (`lib/menu-data.ts`), `/menu` and `/menu/[slug]` pages, Ami-branded public header/footer with live open/closed status, integrated the Dish Orbit Carousel on the home page with optional rating/likes, optimized the hero asset (3.0 MB → 447 KB), and replaced boilerplate auth/dashboard branding. Fixed backend CORS so dev login works from any localhost port.
- 2026-11-11: Added `/design-tile` (Gate A style tile) and Vitest in `apps/web` with 8 passing catalog/mapping tests. T-011 remains open for RTL, Playwright, and axe.
- 2026-11-11: Added shared Asia/Manila time + centavo money helpers (`packages/shared/src/lib`), re-exported them from the API, and switched the web app's `formatPeso` and open/closed badge to the shared implementations. Added cutoff and booking-window tests (21 passing). Root `postinstall` now builds `@ami/shared` so a fresh clone works.
- 2026-11-12: Phase 2 progress — local Postgres via `prisma dev` (no Docker), initial migration applied with cap checks, seed script populates 6 categories / 20 items / 266 daily caps / 2 zones / settings / owner account. Money fields stored as integer centavos. Added Prisma client singleton and `db:migrate:diff` workflow.