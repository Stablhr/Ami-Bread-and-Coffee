import {useMeQuery} from './useMeQuery';

/**
 * Only registered customers can order. Guests (and the admin account) can
 * browse the menu but don't see cart buttons.
 */
export function useIsCustomer() {
  const {data, isPending, isError} = useMeQuery();
  const type = !isError && data ? data.user.type : null;
  return {isCustomer: type === 'user', isAdmin: type === 'admin', isGuest: !isPending && type === null, isPending};
}
