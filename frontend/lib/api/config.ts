/**
 * Where the website talks to the API.
 *
 * Browser: always "/api" on the website itself. proxy.ts forwards it to the
 * backend, so login cookies stay first-party (Safari/iPhone-safe).
 *
 * Server (proxy.ts and Server Components): call the backend directly.
 * BACKEND_URL can override the address; if it is missing or points at
 * localhost on the live site, we use the deployed backend below, so a
 * forgotten Vercel setting can't break login or the menu.
 */
export const PUBLIC_API_BASE = '/api';

/** The deployed Express backend on Vercel. */
const PRODUCTION_BACKEND = 'https://ami-bread-and-coffee-p2yn.vercel.app';
const LOCAL_BACKEND = 'http://localhost:5000';

const isLocalAddress = (url: string) => /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:|\/|$)/i.test(url);

/** Backend origin without "/api", e.g. "https://ami-bread-and-coffee-p2yn.vercel.app". */
export function backendOrigin() {
  const isProduction = process.env.NODE_ENV === 'production' && process.env.VERCEL === '1';
  const configured = process.env.BACKEND_URL?.trim().replace(/\/+$/, '').replace(/\/api$/i, '');

  if (configured && /^https?:\/\//i.test(configured) && !(isProduction && isLocalAddress(configured))) {
    return configured;
  }
  return isProduction ? PRODUCTION_BACKEND : LOCAL_BACKEND;
}

export function serverApiBase() {
  return `${backendOrigin()}/api`;
}
