/**
 * Where the website talks to the API.
 *
 * Browser: "/api" on the website itself. proxy.ts forwards it to the backend,
 * so cookies stay first-party. (NEXT_PUBLIC_API_URL can override this, e.g.
 * to call a backend directly, but leave it unset on Vercel.)
 *
 * Server Components: call the backend directly with BACKEND_URL, because a
 * server-side fetch has no "current website" to resolve "/api" against.
 */
export const PUBLIC_API_BASE = (process.env.NEXT_PUBLIC_API_URL || '/api').replace(/\/+$/, '');

export function serverApiBase() {
  const backend = (process.env.BACKEND_URL ?? 'http://localhost:5000').replace(/\/+$/, '');
  return `${backend}/api`;
}
