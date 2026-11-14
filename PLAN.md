# PLAN.md — Ami Bread & Coffee web app

> Capstone project. Built one step at a time: customers and guests first, then the admin side, then ordering and payments. Tick boxes as steps land and add a line to the changelog at the bottom.

## 1. The shop

| | |
|---|---|
| Name | Ami Bread & Coffee ("fresh from home") |
| Address | Purok 2 (Beside Sugarland Estate), Trece Martires, Cavite 4109 |
| Hours | Open daily, 7:00 AM – 9:00 PM (Asia/Manila) |
| Phone | 0917 137 8754 |
| Facebook | https://www.facebook.com/profile.php?id=61588894828344 |

Shop details live in `frontend/lib/shop.ts`.

## 2. Who uses the site

| User | What they can do |
|---|---|
| **Guest** (not signed in) | Browse home, menu, visit page. Sees "Create account / Sign in". |
| **Customer** (registered, email + password) | Everything a guest can, plus their account page. Later: cart, pre-order, track and review orders. |
| **Admin** (one shared account for the owner and the cashier) | Admin dashboard. Later: orders (who ordered what), menu manager, shop settings. |

## 3. Stack

- **Frontend** `frontend/`: Next.js 16 (App Router), React 19, Tailwind v4, shadcn/ui, TanStack Query, Axios. Runs on http://localhost:3000.
- **Backend** `backend/`: Express, Mongoose (MongoDB Atlas, db `ami_bread_and_coffee`), JWT in HTTP-only cookies with refresh rotation, CSRF, Zod, Nodemailer (email codes). Runs on http://localhost:5000.
- `npm run dev` at the repo root starts both. `cd frontend && npm run dev` starts only the website.

## 4. Design direction: "fresh from home"

Taken from the shop itself: the terracotta line-art **logo** (girl carrying a loaf), the **hand-lettered printed menu** on grey-cream paper with inky asterisks, circles and hearts, and the **dark wood counter in golden window light** inside the store.

| Token | Hex | Use |
|---|---|---|
| `paper` | #EFEAE2 | Page background (printed menu paper) + light grain |
| `linen` | #F8F4EE | Cards, menu sheets |
| `ink` | #2B2420 | Text, borders, doodles |
| `cocoa` | #8B451E | Logo colour, primary buttons, prices (5.9:1 on paper) |
| `wood` | #231812 | Header strip, hero, footer |
| `honey` | #E0A64B | Golden accents on wood (7.1:1) |
| `cream` | #F6EEDF | Text on wood |
| `clay`, `slate`, `blueberry` | | Sampler-box flavour swatches, brush tag |

Fonts: **Fraunces** (soft vintage serif headings), **Patrick Hand** (menu item names and prices, like the printed menu), **Homemade Apple** (small script accents only), **Nunito Sans** (body and forms).

Motifs: dotted leaders between item name and price, inked underlines, "Any 3 for ₱220" brush tag, the boxed Sampler Box, polaroid photo with tape, letterpress offset shadow on buttons. Admin pages use the palette but no texture or doodles.

Accessibility: text contrast ≥ 4.5:1, 48px touch targets, visible focus ring, skip link, decorative SVGs `aria-hidden`, reduced-motion respected.

## 5. Roadmap

### Step 0 — Clean up ✅
- [x] One backend (MongoDB `backend/`) and one frontend (`frontend/`). Removed the Prisma `apps/api`, the old `apps/web`, and `packages/shared`.
- [x] Root `npm run dev` runs both.

### Step 1 — Design system ✅
- [x] Palette, fonts, paper grain, doodles, logo + "ami" wordmark assets, restyled buttons/inputs.

### Step 2 — Guest & customer pages ✅
- [x] Header (open/closed status in Manila time, phone, nav, sign-in state) and footer.
- [x] Home: hero with shop photo, customer favourites, sampler box, how ordering will work, visit strip.
- [x] Menu: two printed-menu sheets ("From the oven", "From the café") loaded from the API.
- [x] Visit us: details, map, directions, call.
- [x] Menu API `GET /api/menu`, `GET /api/menu/items/:slug`, seed from the printed menus (`npm run seed:menu`).

### Step 3 — Customer accounts ✅ (first pass)
- [x] Sign up (first/last name, email, password with live checklist), email code, sign in, forgot/reset password.
- [x] `/account` page (details, sign out, empty "Your orders").
- [ ] Edit profile and change password from `/account`.

### Step 4 — Admin basics
- [x] `/admin` guarded page (shared owner/cashier account from `npm run seed:admin`).
- [ ] Menu manager: add/edit items and prices, mark sold out, upload photos.
- [ ] Shop settings: open/closed switch, hours, contact.
- [ ] Item photos on the menu (owner to supply).

### Step 5 — Ordering
- [ ] Cart (guests are asked to sign in before checkout).
- [ ] Checkout: pickup or delivery, date/time, notes.
- [ ] Customer order history + status tracker (received → baking → ready → on the way → completed / cancelled).
- [ ] Admin orders dashboard: list, who ordered, items, totals, status buttons, auto-refresh.
- [ ] Email notifications for "order received" and "ready".

### Step 6 — Payments (later)
- [ ] GCash / Maya: show the shop's QR or number, customer uploads a payment screenshot, admin marks paid.
- [ ] Optional: payment gateway (e.g. PayMongo) for automatic confirmation.

## 6. Open questions for the owner
1. Exact Google Maps pin (the Facebook/Bing pin lands in Cavite City, so the site searches by address for now).
2. Item photos and short descriptions.
3. Pickup only, or delivery too? If delivery: areas and fees.
4. Hot/iced: same price? Any size options?
5. "Welsch's Zero" on the printed menu, shown on the site as "Welch's Zero". Is that right?

## 7. Changelog
- 2026-11-14 — Restarted the project: single MongoDB backend, rebuilt frontend in the "fresh from home" vintage style; home, menu, visit, auth, account and admin placeholder done; menu seeded from the printed menus.
