import {useMutation, useQueryClient} from '@tanstack/react-query';
import {logout} from '@/lib/api/authApi';
import {meQueryKey} from './useMeQuery';
import {clearCart} from '@/lib/cart/cart-store';

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      clearCart();
      await queryClient.invalidateQueries({queryKey: meQueryKey});
      await queryClient.resetQueries({queryKey: meQueryKey});
    }
  });
}