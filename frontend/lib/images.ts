/**
 * Product photos come from two places, and both paths work as-is:
 *  - "/api/images/<id>"  uploaded in Admin, served by the backend through
 *                        the website's /api proxy (proxy.ts)
 *  - "/products/<file>"  starter photos shipped in frontend/public
 */
export function resolveImageUrl(url: string | null | undefined): string | null {
  return url || null;
}

/** Uploaded photos are already resized in the browser, so skip Next's optimizer for them. */
export function isUploadedImage(url: string | null | undefined) {
  return Boolean(url?.startsWith('/api/'));
}
