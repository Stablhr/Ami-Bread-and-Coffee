import type {OrderStatus} from '@/lib/api/ordersApi';

/** Words customers and staff see for each order status. */
export const STATUS_LABEL: Record<OrderStatus, string> = {
  received: 'Received',
  preparing: 'Being prepared',
  ready: 'Ready for pickup',
  completed: 'Picked up',
  cancelled: 'Cancelled'
};

/** Badge colors (text is always white, ≥ 4.5:1). */
export const STATUS_BADGE: Record<OrderStatus, string> = {
  received: 'bg-[#1d4ed8]',
  preparing: 'bg-[#b45309]',
  ready: 'bg-[#15803d]',
  completed: 'bg-[#4b5563]',
  cancelled: 'bg-[#b91c1c]'
};

/** Button text for moving an order to this status (admin). */
export const STATUS_ACTION: Record<OrderStatus, string> = {
  received: 'Mark received',
  preparing: 'Start preparing',
  ready: 'Mark ready',
  completed: 'Picked up',
  cancelled: 'Cancel order'
};

/** "09171234567" → "0917 123 4567", "+639171234567" → "+63 917 123 4567" (easier to read aloud). */
export function formatPhone(phone: string) {
  const local = phone.match(/^09(\d{2})(\d{3})(\d{4})$/);
  if (local) return `09${local[1]} ${local[2]} ${local[3]}`;
  const intl = phone.match(/^\+639(\d{2})(\d{3})(\d{4})$/);
  if (intl) return `+63 9${intl[1]} ${intl[2]} ${intl[3]}`;
  return phone;
}
