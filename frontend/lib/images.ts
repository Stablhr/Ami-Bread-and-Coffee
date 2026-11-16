import {PUBLIC_API_BASE} from '@/lib/api/config';

/** Set only when the API is called directly (absolute NEXT_PUBLIC_API_URL). */
const API_ORIGIN = /^https?:\/\//i.test(PUBLIC_API_BASE) ? PUBLIC_API_BASE.replace(/\/api$/, '') : '';

/**
 * Product photos come from two places:
 *  - "/api/images/<id>"  uploaded in Admin, served by the backend (through
 *                        the website's /api proxy, so the path works as-is)
 *  - "/products/<file>"  starter photos shipped in frontend/public
 */
export function resolveImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith('/api/')) return `${API_ORIGIN}${url}`;
  return url;
}

/** Uploaded photos are already resized in the browser, so skip Next's optimizer for them. */
export function isUploadedImage(url: string | null | undefined) {
  return Boolean(url?.startsWith('/api/'));
}
