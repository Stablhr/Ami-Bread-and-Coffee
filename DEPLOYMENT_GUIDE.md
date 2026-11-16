# Ami Bread & Coffee - Vercel Deployment Guide

## Overview
Deploying the AMI Bread & Coffee backend and frontend to Vercel.

## Backend Deployment (ami backend)

### Existing Configuration ✅
The backend already has a `vercel.json` configured:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "index.ts"
    }
  ]
}
```

### Environment Variables (Required)
Set these in the Vercel Dashboard > Project > Settings > Environment Variables:

| Variable | Description |
|---|---|
| `PORT` | Server port (default: 5000) |
| `NODE_ENV` | development or production |
| `JWT_SECRET` | Random secret for JWT signing |
| `JWT_REFRESH_SECRET` | Random secret for refresh tokens |
| `MONGO_URI` | MongoDB Atlas connection string |
| `SMTP_HOST` | SMTP server (e.g., smtp.gmail.com) |
| `SMTP_PORT` | SMTP port (e.g., 465) |
| `SMTP_USER` | SMTP email user |
| `SMTP_PASS` | SMTP email password |
| `SMTP_FROM` | From address for emails |
| `COOKIE_SECURE` | `true`/`false` - HTTPS only cookies |
| `COOKIE_SAMESITE` | `strict`/`lax`/`none` |
| `CORS_ORIGINS` | Comma-separated list of allowed origins |
| `SEED_ADMIN_EMAIL` | Admin account email |
| `SEED_ADMIN_PASSWORD` | Admin account password |
| `SEED_ADMIN_FIRST_NAME` | Admin first name |
| `SEED_ADMIN_LAST_NAME` | Admin last name |
| `RATE_LIMIT_ENABLED` | `true`/`false` |
| `ADMIN_EMAILS` | Comma-separated list of admin emails |
| `YOUTUBE_API_KEY` | YouTube Data API v3 key |

### Backend Build & Start
- **Build**: `tsc` (compiles TypeScript to `dist/`)
- **Start**: `node dist/index.js`
- Vercel automatically uses `@vercel/node` to run TypeScript

### Local Test Before Deploy
```bash
cd backend
cp .env.example .env  # customize as needed
npm run build
vercel dev
```

## Frontend Deployment (ami bread & coffee)

### Existing Configuration ✅
The frontend is a standard Next.js 16 App Router project. The `next.config.ts` is minimal and works out-of-the-box with Vercel.

### Environment Variables (Required)
Set these in the Vercel Dashboard > Project > Settings > Environment Variables:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL (e.g., `https://ami-backend.vercel.app`) |

**Important**: `NEXT_PUBLIC_API_URL` must include the protocol (`https://`). Without it, requests will resolve against the frontend origin and return 404.

The current `.env.example`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

In production, set this to your deployed backend URL, e.g.:
```
NEXT_PUBLIC_API_URL=https://ami-backend.vercel.app
```

### Frontend Build & Start
- **Build**: `next build`
- **Start**: `next start`
- Vercel automatically handles Next.js production builds

### Local Test Before Deploy
```bash
cd frontend
cp .env.example .env  # customize as needed
npm run build
vercel dev
```

## Deployment Steps

### 1. Backend on Vercel
1. Go to [vercel.com](https://vercel.com) and log in
2. Click "Add New Project" → "Import Git Repository"
3. Select the `ABC` repository
4. Set Framework Preset to "Other" (or "Node.js")
5. Root Directory: `backend`
6. Click "Deploy"
7. Go to Project Settings → Environment Variables and add all the variables listed above
8. Click "Redeploy" if needed

### 2. Frontend on Vercel
1. Click "Add New Project" → "Import Git Repository" (same repo)
2. Set Framework Preset to "Next.js"
3. Root Directory: `frontend`
4. Click "Deploy"
5. Go to Project Settings → Environment Variables and add:
   - `NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app`
6. Click "Redeploy"

### 3. Verify Deployment
- Visit the frontend URL
- Test API calls by visiting `/api/menu` or `/api/auth/me` (should redirect to sign-in)
- Test admin routes if you have the admin credentials

## Directory Structure
```
ABC/
├── backend/       # Express.js + Mongoose API
│   └── vercel.json  # Vercel config for backend
├── frontend/      # Next.js 16 App Router
│   └── next-config.ts  # Minimal config (works out-of-the-box)
└── DEPLOYMENT_GUIDE.md  # This guide
```

## Notes
- **Never commit `.env` files** - only `.env.example` is tracked
- The backend `index.ts` detects `process.env.VERCEL !== '1'` to decide whether to start the server manually or let Vercel handle it
- Refresh tokens are rotated on use with a 60s grace window for tab races
- The admin account is seeded with `npm run seed:admin` after deployment