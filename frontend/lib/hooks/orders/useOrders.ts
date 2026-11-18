import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {
  getAdminOrders,
  getLiveMenu,
  getMyOrder,
  getMyOrders,
  placeOrder,
  updateOrderStatus,
  type AdminOrderFilter,
  type OrderStatus
} from '@/lib/api/ordersApi';

export const myOrdersKey = ['orders', 'mine'] as const;
export const adminOrdersKey = ['admin', 'orders'] as const;

export function useMyOrders() {
  return useQuery({queryKey: myOrdersKey, queryFn: getMyOrders});
}

/** One order, refreshed every 30 s while open so status changes show up. */
export function useMyOrder(id: string) {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => getMyOrder(id),
    refetchInterval: 30_000
  });
}

export function usePlaceOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: placeOrder,
    onSuccess: () => queryClient.invalidateQueries({queryKey: myOrdersKey})
  });
}

/** Admin list, refreshed every 15 s so new orders appear on their own. */
export function useAdminOrders(filter: AdminOrderFilter) {
  return useQuery({
    queryKey: [...adminOrdersKey, filter],
    queryFn: () => getAdminOrders(filter),
    refetchInterval: 15_000,
    refetchIntervalInBackground: true
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({id, status}: {id: string; status: OrderStatus}) => updateOrderStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({queryKey: adminOrdersKey})
  });
}

export function useLiveMenu() {
  return useQuery({queryKey: ['menu', 'live'], queryFn: getLiveMenu, staleTime: 30_000});
}
