import {API_BASE} from '@/lib/api/menuApi';

/** Origin of the API, e.g. "http://localhost:5000" (API_BASE minus "/api"). */
const API_ORIGIN = API_BASE.replace(/\/api$/, '');

/**
 * Product photos come from two places:
 *  - "/api/images/<id>"  uploaded in Admin, served by the backend
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
