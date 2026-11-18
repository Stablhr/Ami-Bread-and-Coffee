/**
 * Pickup time rules (shop is in Asia/Manila, UTC+8, no daylight saving):
 *  - at least 30 minutes from now, so the shop has time to prepare;
 *  - within the next 7 days;
 *  - between 7:30 AM and 8:30 PM Manila time (shop is open 7 AM – 9 PM).
 */
const MANILA_OFFSET_MS = 8 * 60 * 60 * 1000;
export const PICKUP_RULES = {
  minLeadMinutes: 30,
  maxDaysAhead: 7,
  earliestMinutes: 7 * 60 + 30,
  latestMinutes: 20 * 60 + 30
};

export function checkPickupTime(pickupAt: Date, now: Date = new Date()): string | null {
  if (Number.isNaN(pickupAt.getTime())) return 'Choose a pickup time.';
  if (pickupAt.getTime() < now.getTime() + PICKUP_RULES.minLeadMinutes * 60_000) {
    return 'Please choose a pickup time at least 30 minutes from now.';
  }
  if (pickupAt.getTime() > now.getTime() + PICKUP_RULES.maxDaysAhead * 24 * 60 * 60_000) {
    return 'You can order up to 7 days ahead.';
  }
  const manila = new Date(pickupAt.getTime() + MANILA_OFFSET_MS);
  const minutes = manila.getUTCHours() * 60 + manila.getUTCMinutes();
  if (minutes < PICKUP_RULES.earliestMinutes || minutes > PICKUP_RULES.latestMinutes) {
    return 'Pickup is between 7:30 AM and 8:30 PM.';
  }
  return null;
}
