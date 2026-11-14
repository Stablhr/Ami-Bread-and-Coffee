/**
 * Shop details shown across the site. Kept in one place so the owner's info
 * is easy to update (and can move to an admin "Shop settings" page later).
 */
export const SHOP = {
  name: 'Ami Bread & Coffee',
  tagline: 'fresh from home',
  address: {
    line1: 'Purok 2 (Beside Sugarland Estate)',
    line2: 'Trece Martires, Cavite 4109',
    short: 'Beside Sugarland Estate, Trece Martires'
  },
  /**
   * Map search text. The pin on the shop's Facebook/Bing link (14.48237,
   * 120.9123) lands in Cavite City, so we search by address until the owner
   * confirms the exact Google Maps pin.
   */
  mapQuery: 'Sugarland Estate, Trece Martires City, Cavite',
  phoneDisplay: '0917 137 8754',
  phoneHref: 'tel:+639171378754',
  facebookUrl: 'https://www.facebook.com/profile.php?id=61588894828344',
  hours: {
    label: 'Open daily, 7:00 AM – 9:00 PM',
    openHour: 7,
    closeHour: 21
  },
  timeZone: 'Asia/Manila'
} as const;

const MAP_QUERY = encodeURIComponent(SHOP.mapQuery);
export const MAP_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${MAP_QUERY}`;
export const MAP_EMBED_URL = `https://www.google.com/maps?q=${MAP_QUERY}&z=16&output=embed`;

/** Current hour/minute in Manila, regardless of the visitor's own time zone. */
export function getManilaTime(now: Date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: SHOP.timeZone,
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23'
  }).formatToParts(now);
  const hour = Number(parts.find(p => p.type === 'hour')?.value ?? 0);
  const minute = Number(parts.find(p => p.type === 'minute')?.value ?? 0);
  return {hour, minute};
}

export function isShopOpen(now: Date = new Date()) {
  const {hour} = getManilaTime(now);
  return hour >= SHOP.hours.openHour && hour < SHOP.hours.closeHour;
}

export function formatPeso(amount: number) {
  return `₱${amount.toLocaleString('en-PH')}`;
}
