/**
 * Shop time helpers. The shop runs on Asia/Manila (UTC+8, no daylight saving),
 * opens daily 07:00–21:00, and closes orders at 18:00 the day before pickup.
 */

export const SHOP_TIME_ZONE = "Asia/Manila";
/** Manila is UTC+8 all year; no DST. */
export const SHOP_UTC_OFFSET_MINUTES = 8 * 60;
export const SHOP_OPEN_HOUR = 7;
export const SHOP_CLOSE_HOUR = 21;
export const ORDER_CUTOFF_HOUR = 18;
export const BOOKING_WINDOW_DAYS = 14;

export type ManilaParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
};

export type OrderDateReason = "INVALID" | "PAST" | "CUTOFF" | "TOO_FAR";

export type OrderDateCheck = {
  ok: boolean;
  reason?: OrderDateReason;
};

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export function getManilaParts(date: Date = new Date()): ManilaParts {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: SHOP_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).formatToParts(date);

  const read = (type: Intl.DateTimeFormatPartTypes): number =>
    Number(parts.find((part) => part.type === type)?.value ?? 0);

  return {
    year: read("year"),
    month: read("month"),
    day: read("day"),
    hour: read("hour") % 24,
    minute: read("minute")
  };
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

/** Returns the Manila calendar date as `YYYY-MM-DD`. */
export function toDateString(date: Date = new Date()): string {
  const { year, month, day } = getManilaParts(date);
  return `${year}-${pad(month)}-${pad(day)}`;
}

export function parseDateString(value: string): ManilaParts | null {
  const match = DATE_PATTERN.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const check = new Date(Date.UTC(year, month - 1, day));
  if (
    check.getUTCFullYear() !== year ||
    check.getUTCMonth() !== month - 1 ||
    check.getUTCDate() !== day
  ) {
    return null;
  }
  return { year, month, day, hour: 0, minute: 0 };
}

/** Adds days to a `YYYY-MM-DD` string and returns the new date string. */
export function addDays(dateString: string, days: number): string {
  const parts = parseDateString(dateString);
  if (!parts) throw new Error(`Invalid date: ${dateString}`);
  const next = new Date(Date.UTC(parts.year, parts.month - 1, parts.day + days));
  return `${next.getUTCFullYear()}-${pad(next.getUTCMonth() + 1)}-${pad(next.getUTCDate())}`;
}

export function compareDateStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function isShopOpen(date: Date = new Date()): boolean {
  const { hour, minute } = getManilaParts(date);
  const minutes = hour * 60 + minute;
  return minutes >= SHOP_OPEN_HOUR * 60 && minutes < SHOP_CLOSE_HOUR * 60;
}

/**
 * The instant ordering closes for a pickup date: 18:00 Manila on the day
 * before. Returned as a real `Date` (UTC instant) for easy comparison.
 */
export function getCutoffInstant(pickupDate: string): Date {
  const parts = parseDateString(pickupDate);
  if (!parts) throw new Error(`Invalid date: ${pickupDate}`);
  const utcMidnight = Date.UTC(parts.year, parts.month - 1, parts.day - 1);
  return new Date(utcMidnight + ORDER_CUTOFF_HOUR * 60 * 60 * 1000 - SHOP_UTC_OFFSET_MINUTES * 60 * 1000);
}

/** Tomorrow through the booking window, inclusive. */
export function getBookingWindow(now: Date = new Date()): string[] {
  const today = toDateString(now);
  return Array.from({ length: BOOKING_WINDOW_DAYS }, (_, index) => addDays(today, index + 1));
}

/**
 * Checks whether a pickup/delivery date can still be ordered for.
 * Same-day ordering is off in v1, so the earliest date is tomorrow.
 */
export function checkOrderDate(pickupDate: string, now: Date = new Date()): OrderDateCheck {
  if (!parseDateString(pickupDate)) return { ok: false, reason: "INVALID" };

  const today = toDateString(now);
  if (compareDateStrings(pickupDate, today) <= 0) return { ok: false, reason: "PAST" };

  if (now.getTime() >= getCutoffInstant(pickupDate).getTime()) {
    return { ok: false, reason: "CUTOFF" };
  }

  if (compareDateStrings(pickupDate, addDays(today, BOOKING_WINDOW_DAYS)) > 0) {
    return { ok: false, reason: "TOO_FAR" };
  }

  return { ok: true };
}

export function formatManilaTime(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-PH", {
    timeZone: SHOP_TIME_ZONE,
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  }).format(date);
}

/** Formats a shop hour (e.g. 7 → "7:00 AM") without any timezone shifting. */
export function formatShopHour(hour: number, minute = 0): string {
  return new Intl.DateTimeFormat("en-PH", {
    timeZone: "UTC",
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  }).format(new Date(Date.UTC(2000, 0, 1, hour, minute)));
}

export function formatManilaDate(dateString: string): string {
  const parts = parseDateString(dateString);
  if (!parts) return dateString;
  return new Intl.DateTimeFormat("en-PH", {
    timeZone: "UTC",
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(Date.UTC(parts.year, parts.month - 1, parts.day)));
}
