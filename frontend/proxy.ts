import {NextResponse, type NextRequest} from 'next/server';

/**
 * Forwards every /api/* request from the browser to the Express backend.
 *
 * Why: the website and the API live on different Vercel domains. Calling the
 * API directly makes the login cookies "third-party", which Safari/iPhone and
 * private windows block. Going through the website's own /api keeps the
 * cookies first-party, so sign-in works everywhere.
 *
 * Env (Vercel → frontend project → Settings → Environment Variables):
 *   BACKEND_URL   e.g. https://ami-backend.vercel.app   (no trailing /api)
 *   PROXY_SECRET  same value as in the backend project
 */
const BACKEND_URL = (process.env.BACKEND_URL ?? 'http://localhost:5000').replace(/\/+$/, '');

export function proxy(request: NextRequest) {
  const target = new URL(request.nextUrl.pathname + request.nextUrl.search, BACKEND_URL);

  const headers = new Headers(request.headers);
  // Pass the visitor's IP along so the backend rate-limits per visitor, not
  // per Vercel server. The secret proves the header came from us.
  const visitorIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip');
  headers.delete('x-client-ip');
  headers.delete('x-proxy-secret');
  if (visitorIp && process.env.PROXY_SECRET) {
    headers.set('x-client-ip', visitorIp);
    headers.set('x-proxy-secret', process.env.PROXY_SECRET);
  }

  return NextResponse.rewrite(target, {request: {headers}});
}

export const config = {
  matcher: '/api/:path*'
};
