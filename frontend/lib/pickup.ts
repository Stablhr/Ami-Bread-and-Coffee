import {SHOP} from '@/lib/shop';

/**
 * Pickup time choices in Manila time (UTC+8). Same rules as the backend
 * (backend/api/utils/pickupTime.ts): 7:30 AM – 8:30 PM, at least 30 minutes
 * from now, up to 7 days ahead.
 */
const EARLIEST = 7 * 60 + 30;
const LATEST = 20 * 60 + 30;
const STEP = 30;
const LEAD = 30;
const DAYS_AHEAD = 7;

function manilaParts(date: Date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: SHOP.timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(date);
  const get = (type: string) => parts.find(p => p.type === type)?.value ?? '00';
  return {date: `${get('year')}-${get('month')}-${get('day')}`, minutes: Number(get('hour')) * 60 + Number(get('minute'))};
}

const pad = (n: number) => String(n).padStart(2, '0');
const toTime = (minutes: number) => `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;

export function timeLabel(time: string) {
  const [h, m] = time.split(':').map(Number);
  const hour12 = ((h + 11) % 12) + 1;
  return `${hour12}:${pad(m)} ${h < 12 ? 'AM' : 'PM'}`;
}

/** Time slots ("HH:MM") for a Manila date, skipping ones too soon. */
export function pickupSlots(dateValue: string, now = new Date()) {
  const today = manilaParts(now);
  const slots: string[] = [];
  for (let minutes = EARLIEST; minutes <= LATEST; minutes += STEP) {
    if (dateValue === today.date && minutes < today.minutes + LEAD) continue;
    slots.push(toTime(minutes));
  }
  return slots;
}

/** Days customers can pick, starting today if any slot is left. */
export function pickupDays(now = new Date()) {
  const days: {value: string; label: string}[] = [];
  for (let offset = 0; offset < DAYS_AHEAD; offset += 1) {
    const day = new Date(now.getTime() + offset * 24 * 60 * 60 * 1000);
    const {date} = manilaParts(day);
    if (pickupSlots(date, now).length === 0) continue;
    const pretty = new Intl.DateTimeFormat('en-PH', {
      timeZone: SHOP.timeZone,
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    }).format(day);
    days.push({value: date, label: offset === 0 ? `Today, ${pretty}` : offset === 1 ? `Tomorrow, ${pretty}` : pretty});
  }
  return days;
}

/** "2026-11-18" + "09:30" → "2026-11-18T09:30:00+08:00" */
export function toPickupIso(dateValue: string, time: string) {
  return `${dateValue}T${time}:00+08:00`;
}

/** e.g. "Wed, Nov 18 · 9:30 AM" in Manila time. */
export function formatPickup(iso: string) {
  const date = new Date(iso);
  const day = new Intl.DateTimeFormat('en-PH', {timeZone: SHOP.timeZone, weekday: 'short', month: 'short', day: 'numeric'}).format(date);
  const time = new Intl.DateTimeFormat('en-PH', {timeZone: SHOP.timeZone, hour: 'numeric', minute: '2-digit'}).format(date);
  return `${day} · ${time}`;
}

/** e.g. "Nov 17, 2:05 PM" */
export function formatPlacedAt(iso: string) {
  return new Intl.DateTimeFormat('en-PH', {
    timeZone: SHOP.timeZone,
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(new Date(iso));
}
