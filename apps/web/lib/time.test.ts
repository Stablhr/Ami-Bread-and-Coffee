import { describe, expect, it } from "vitest";
import {
  addDays,
  BOOKING_WINDOW_DAYS,
  checkOrderDate,
  formatManilaDate,
  formatShopHour,
  getBookingWindow,
  getCutoffInstant,
  isShopOpen,
  parseDateString,
  toDateString
} from "@ami/shared";

/** Builds a UTC instant for a given Manila wall-clock time (UTC+8). */
function manila(year: number, month: number, day: number, hour = 0, minute = 0): Date {
  return new Date(Date.UTC(year, month - 1, day, hour - 8, minute));
}

describe("Manila time", () => {
  it("reads the Manila calendar date across the UTC boundary", () => {
    // 2026-11-11 23:30 UTC is already 2026-11-12 07:30 in Manila.
    expect(toDateString(new Date(Date.UTC(2026, 10, 11, 23, 30)))).toBe("2026-11-12");
  });

  it("rejects impossible dates", () => {
    expect(parseDateString("2026-02-30")).toBeNull();
    expect(parseDateString("2026-13-01")).toBeNull();
    expect(parseDateString("12-01-2026")).toBeNull();
    expect(parseDateString("2026-02-28")).not.toBeNull();
  });

  it("adds days across month boundaries", () => {
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
  });

  it("knows when the shop is open", () => {
    expect(isShopOpen(manila(2026, 11, 11, 6, 59))).toBe(false);
    expect(isShopOpen(manila(2026, 11, 11, 7, 0))).toBe(true);
    expect(isShopOpen(manila(2026, 11, 11, 20, 59))).toBe(true);
    expect(isShopOpen(manila(2026, 11, 11, 21, 0))).toBe(false);
  });

  it("formats shop hours in 12-hour time", () => {
    expect(formatShopHour(7)).toBe("7:00 AM");
    expect(formatShopHour(21)).toBe("9:00 PM");
  });

  it("formats a Manila date label", () => {
    expect(formatManilaDate("2026-11-12")).toContain("Nov 12, 2026");
  });
});

describe("order cutoff", () => {
  it("closes at 18:00 Manila the day before pickup", () => {
    // Pickup 2026-11-12 → cutoff 2026-11-11 18:00 Manila = 2026-11-11 10:00 UTC.
    expect(getCutoffInstant("2026-11-12").toISOString()).toBe("2026-11-11T10:00:00.000Z");
  });

  it("accepts a pickup date before the cutoff", () => {
    const now = manila(2026, 11, 11, 17, 59);
    expect(checkOrderDate("2026-11-12", now)).toEqual({ ok: true });
  });

  it("rejects a pickup date at or after the cutoff", () => {
    expect(checkOrderDate("2026-11-12", manila(2026, 11, 11, 18, 0)).reason).toBe("CUTOFF");
    expect(checkOrderDate("2026-11-12", manila(2026, 11, 11, 20, 0)).reason).toBe("CUTOFF");
  });

  it("rejects same-day and past dates", () => {
    const now = manila(2026, 11, 11, 9, 0);
    expect(checkOrderDate("2026-11-11", now).reason).toBe("PAST");
    expect(checkOrderDate("2026-11-10", now).reason).toBe("PAST");
  });

  it("rejects malformed dates", () => {
    expect(checkOrderDate("not-a-date", manila(2026, 11, 11, 9, 0)).reason).toBe("INVALID");
  });
});

describe("booking window", () => {
  it("starts tomorrow and spans 14 days", () => {
    const window = getBookingWindow(manila(2026, 11, 11, 9, 0));
    expect(window).toHaveLength(BOOKING_WINDOW_DAYS);
    expect(window[0]).toBe("2026-11-12");
    expect(window[window.length - 1]).toBe("2026-11-25");
  });

  it("allows the last bookable day and rejects the next one", () => {
    const now = manila(2026, 11, 11, 9, 0);
    const lastDay = addDays("2026-11-11", BOOKING_WINDOW_DAYS);
    expect(checkOrderDate(lastDay, now)).toEqual({ ok: true });
    expect(checkOrderDate(addDays(lastDay, 1), now).reason).toBe("TOO_FAR");
  });
});
