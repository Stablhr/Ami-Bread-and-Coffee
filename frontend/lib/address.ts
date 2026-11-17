import type {Address} from '@/lib/api/authApi';

/** "Blk 2 Lot 5 Mabini St, Brgy. Osorio, Trece Martires, Cavite" */
export function formatAddress(address: Address | null | undefined) {
  if (!address) return '';
  return [address.street, address.barangay, address.city, address.province].filter(Boolean).join(', ');
}

export const EMPTY_ADDRESS: Address = {
  street: '',
  barangay: '',
  city: 'Trece Martires',
  province: 'Cavite',
  landmark: ''
};

export const cleanPhone = (value: string) => value.replace(/[\s-]/g, '');
export const isPhMobile = (value: string) => /^(09\d{9}|\+639\d{9})$/.test(cleanPhone(value));
