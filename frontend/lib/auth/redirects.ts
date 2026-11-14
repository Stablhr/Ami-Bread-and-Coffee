export type UserType = 'user' | 'admin';

/** Where each kind of account lands after signing in. */
export function getHomePathFor(userType: UserType) {
  return userType === 'admin' ? '/admin' : '/account';
}
