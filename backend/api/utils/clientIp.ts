import {timingSafeEqual} from 'crypto';
import type {Request} from 'express';
import {env} from '../config/env';

function sameSecret(given: string, expected: string) {
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * The visitor's real IP address.
 *
 * In production the website proxies /api/* to this backend (frontend/proxy.ts),
 * so every request arrives from Vercel's servers. The proxy adds the visitor's
 * IP in `x-client-ip` together with a shared `x-proxy-secret`. We only trust
 * that header when the secret matches, so nobody can fake their IP to dodge
 * the login rate limit by calling the backend directly.
 */
export function getClientIp(req: Request): string {
  const secret = env.PROXY_SECRET;
  const givenSecret = req.get('x-proxy-secret');
  const forwarded = req.get('x-client-ip');

  if (secret && givenSecret && forwarded && sameSecret(givenSecret, secret)) {
    return forwarded.trim().slice(0, 64);
  }
  return req.ip ?? 'unknown';
}
