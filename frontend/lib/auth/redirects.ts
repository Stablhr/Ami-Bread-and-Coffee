export type UserType = 'user' | 'admin';

/** Where each kind of account lands after signing in. */
export function getHomePathFor(userType: UserType) {
  return userType === 'admin' ? '/admin' : '/account';
}

/**
 * A safe "come back here after signing in" path from ?next=…
 * Only same-site paths like "/checkout" are allowed (never "//evil.com").
 */
export function readNextPath(): string | null {
  if (typeof window === 'undefined') return null;
  const next = new URLSearchParams(window.location.search).get('next');
  const safe = next !== null && next.startsWith('/') && !next.startsWith('//') && !next.includes('\\');
  return safe ? next : null;
}

/** Where to go after sign-in: the saved page for customers, otherwise their home. */
export function afterSignInPath(userType: UserType) {
  const next = readNextPath();
  return userType === 'user' && next ? next : getHomePathFor(userType);
}
