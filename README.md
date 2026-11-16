# Ami Bread & Coffee

Website for **Ami Bread & Coffee**, a sourdough bakery and café in Trece Martires City, Cavite. *Fresh from home.*

- `frontend/` — Next.js 16 website (http://localhost:3000)
- `backend/` — Express + MongoDB API (http://localhost:5000/api)

See [PLAN.md](./PLAN.md) for the roadmap and design direction.

## First-time setup

Needs Node.js 20+ and a MongoDB database (Atlas is fine; see [docs/CREDENTIALS.md](./docs/CREDENTIALS.md)).

```bash
npm run install:all
```

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Fill in `backend/.env` (MongoDB URI, JWT secrets, SMTP for email codes, seed admin), then load the menu and the admin account:

```bash
npm run seed
```

## Run it

```bash
npm run dev
```

Starts the API (:5000) and the website (:3000) together. To run only one:

```bash
cd frontend && npm run dev
```

```bash
cd backend && npm run dev
```

The website still loads without the API, but the menu shows a friendly "menu is taking a break" message.

## Accounts

| Who | How |
|---|---|
| Guest | No account. Can browse home, menu and visit page. |
| Customer | Sign up at `/sign-up` with email + password, confirm the 6-digit email code, then sign in. Lands on `/account`. |
| Admin (owner + cashier) | One shared account created by `npm run seed:admin` from `SEED_ADMIN_*` in `backend/.env`. Lands on `/admin`. |

## API

| Method | Path | Notes |
|---|---|---|
| GET | `/api/menu` | Full menu grouped by category |
| GET | `/api/menu/items/:slug` | One item |
| GET | `/api/images/:id` | Uploaded product photo |
| GET / POST / PATCH / DELETE | `/api/admin/menu`, `/api/admin/menu/items[/:id]` | Admin only: list, add, edit, delete products |
| POST | `/api/admin/uploads/image` | Admin only: upload a product photo (field `image`) |
| POST | `/api/auth/register` | firstName, lastName, email, password |
| POST | `/api/auth/verify` | email + 6-digit code |
| POST | `/api/auth/login` | sets HTTP-only cookies |
| GET | `/api/auth/me` | id, type (`user`/`admin`), firstName, lastName, email |
| POST | `/api/auth/logout`, `/refresh`, `/forgot-password`, `/verify-reset-code`, `/reset-password`, `/resend-*` | |

Unsafe requests need the CSRF header from `GET /api/auth/csrf` (the frontend `httpClient` handles this).

## Deploying to Vercel

Two Vercel projects from this repo: **backend** (root directory `backend`) and **frontend** (root directory `frontend`).

The browser only ever talks to the website. `frontend/proxy.ts` forwards `/api/*` to the backend, so login cookies are first-party (two different `*.vercel.app` sites are "cross-site", and Safari/iPhone would block the cookies otherwise).

**Backend project → Settings → Environment Variables**

| Name | Value |
|---|---|
| `NODE_ENV` | `production` |
| `MONGO_URI`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `SMTP_*` | same as your local `.env` |
| `COOKIE_SECURE` | `true` |
| `COOKIE_SAMESITE` | `lax` |
| `CORS_ORIGINS` | your website URL, e.g. `https://ami-bread.vercel.app` |
| `PROXY_SECRET` | a long random string (same as frontend) |
| `RATE_LIMIT_ENABLED` | `true` |

MongoDB Atlas → Network Access must allow Vercel (`0.0.0.0/0`), because Vercel has no fixed IP.

**Frontend project → Settings → Environment Variables**

| Name | Value |
|---|---|
| `BACKEND_URL` | your backend URL, e.g. `https://ami-backend.vercel.app` (no `/api`) |
| `PROXY_SECRET` | the same random string as the backend |
| `NEXT_PUBLIC_API_URL` | **delete it** if it exists |

Redeploy both projects after changing variables (Deployments → ⋯ → Redeploy).

## Scripts (repo root)

| Command | What it does |
|---|---|
| `npm run dev` | API + website |
| `npm run seed` | Seed menu (idempotent) and admin account |
| `npm run build` | Build both |
| `npm run lint` | Lint both |

Backend only: `npm run seed:menu`, `npm run seed:admin`, `npm test` (inside `backend/`).
