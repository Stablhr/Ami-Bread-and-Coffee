import {useMutation, useQueryClient} from '@tanstack/react-query';
import {updateProfile} from '@/lib/api/authApi';
import {meQueryKey} from './useMeQuery';

/** Saves name, mobile number and address, then refreshes the signed-in user. */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: data => queryClient.setQueryData(meQueryKey, data)
  });
}
