# Frontend AGENTS.md

## Stack

Next.js 16 App Router, React 19, TypeScript 5, TailwindCSS v4, shadcn/ui, TanStack Query v5, Axios

## Commands

```bash
cd frontend
npm run dev          # Start dev server (port 3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # ESLint
```

## Architecture

```
app/(public)/       # Site with header + footer: / (home), /menu, /visit, /account (customers only)
app/(auth)/         # sign-in, sign-up, verify-email (?mode=reset for password reset), forgot/reset-password
app/(admin)/admin/  # Admin area (owner + cashier shared account), guarded in (admin)/layout.tsx
components/brand/   # Logo, "ami" wordmark, doodles (asterisk, heart, wavy rule), section heading, brush tag
components/layout/  # Site header/footer, open-now status, page loading
components/menu/    # Printed-menu pieces: item row with dotted leader, category block, sampler box
components/auth/    # Form bits (password checklist, messages), RequireRole guard, sign-out button
components/ui/      # shadcn/ui primitives, restyled to the shop theme
lib/api/            # httpClient (Axios, auth/CSRF/refresh), authApi, menuApi (server fetch)
lib/shop.ts         # Shop name, address, hours, phone, Facebook, map links, peso formatting
lib/hooks/          # React Query hooks (useMeQuery, useLogout)
```

## Design

"Fresh from home" vintage theme from the real shop (logo, printed menu, wood counter). Tokens live in `app/globals.css` (`paper`, `linen`, `ink`, `cocoa`, `wood`, `honey`, `cream`…). Fonts: `font-display` (Fraunces), `font-hand` (Patrick Hand), `font-script` (Homemade Apple, accents only, never body text), `font-sans` (Nunito Sans). Keep text contrast ≥ 4.5:1, touch targets ≥ 48px, decorative SVGs `aria-hidden`. Admin pages: palette only, no texture or doodles.

## Code Style

- TypeScript strict mode — no `any` types in new code
- Frontend errors go through `getFriendlyErrorMessage()` — never show raw backend messages to users
- React Query hooks in `frontend/lib/hooks/` for all server state
- Use shadcn/ui components from `frontend/components/ui/` — never build form inputs or modals from scratch
- API calls live in `frontend/lib/api/` (`authApi.ts`, `menuApi.ts`) — keep them centralized
- Shop facts (address, hours, phone) come from `lib/shop.ts` — never hard-code them in pages

## Error Handling

All API errors are normalized through `frontend/lib/api/httpClient.ts` into this shape:

```ts
type NormalizedApiError = {
  status: number | null;
  code: string;
  message: string;
  details?: unknown;
};
```

The `getFriendlyErrorMessage()` function maps error codes to user-friendly messages. If a new error code is added on the backend, add a mapping here too.

## Route Groups

- `(public)` — No auth required, except `/account`, which is wrapped in `<RequireRole role="user">`.
- `(auth)` — Auth forms. Signed-in visitors are redirected to their home (`getHomePathFor`).
- `(admin)` — Requires an admin account; customers go to `/account`, guests to `/sign-in`.

## Security Rules

- Never commit `.env` files — only `.env.example` is tracked
- Never log tokens, passwords, or secrets
- All API requests go through `httpClient.ts` (handles auth, refresh, error normalization)
- Do not store tokens in localStorage — cookies are managed by the backend
