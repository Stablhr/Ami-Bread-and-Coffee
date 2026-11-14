# AGENTS.md

## Project Overview

Ami Bread & Coffee — bakery/café website. Next.js 16 frontend + Express/MongoDB backend with email + password JWT auth. Users: guests (browse), customers (`user` accounts), and one shared admin account for the owner and cashier. Roadmap and design direction: [PLAN.md](./PLAN.md).

## Stack

- **Frontend (`frontend/`):** Next.js 16 App Router, React 19, TypeScript 5, TailwindCSS v4, shadcn/ui, TanStack Query v5, Axios
- **Backend (`backend/`):** Express.js, Mongoose (MongoDB), jsonwebtoken, bcrypt, Zod, Nodemailer, Pino
- **Testing:** Jest + Supertest in `backend/tests/`
- **Runtime:** Node.js 20+

`npm run dev` at the root starts both (API :5000, web :3000).

## Sub-Agents

| Scope | Read this file |
|-------|----------------|
| Frontend work (React, Next.js, UI, pages) | [frontend/AGENTS.md](./frontend/AGENTS.md) |
| Backend work (Express, API, DB, auth logic) | [backend/AGENTS.md](./backend/AGENTS.md) |

## Commits

Use conventional commits: `fix:`, `feat:`, `refactor:`, `chore:`, `docs:`
