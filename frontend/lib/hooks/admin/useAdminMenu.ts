import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {
  createProduct,
  deleteProduct,
  getAdminMenu,
  updateProduct,
  type ProductInput
} from '@/lib/api/adminMenuApi';

export const adminMenuQueryKey = ['admin', 'menu'] as const;

export function useAdminMenuQuery() {
  return useQuery({
    queryKey: adminMenuQueryKey,
    queryFn: getAdminMenu,
    refetchOnWindowFocus: true
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => queryClient.invalidateQueries({queryKey: adminMenuQueryKey})
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({id, input}: {id: string; input: Partial<ProductInput>}) => updateProduct(id, input),
    onSuccess: () => queryClient.invalidateQueries({queryKey: adminMenuQueryKey})
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => queryClient.invalidateQueries({queryKey: adminMenuQueryKey})
  });
}
