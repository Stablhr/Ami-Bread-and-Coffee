"use client";

import { useEffect, useState } from "react";
import {
  formatShopHour,
  getManilaParts,
  isShopOpen,
  SHOP_CLOSE_HOUR,
  SHOP_OPEN_HOUR
} from "@ami/shared";

type Status = {
  open: boolean;
  text: string;
};

const openLabel = formatShopHour(SHOP_OPEN_HOUR);
const closeLabel = formatShopHour(SHOP_CLOSE_HOUR);

function computeStatus(now: Date = new Date()): Status {
  if (isShopOpen(now)) {
    return { open: true, text: `Open now until ${closeLabel}` };
  }

  const { hour } = getManilaParts(now);
  return hour < SHOP_OPEN_HOUR
    ? { open: false, text: `Closed — opens today at ${openLabel}` }
    : { open: false, text: `Closed — opens tomorrow at ${openLabel}` };
}

export function OpenStatus() {
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    const update = () => setStatus(computeStatus());
    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <p
      className="inline-flex min-h-[32px] items-center gap-2 font-sans text-base"
      aria-live="polite"
    >
      <span
        aria-hidden="true"
        className={
          "inline-block size-2.5 rounded-full " +
          (status ? (status.open ? "bg-status-ready" : "bg-status-cancelled") : "bg-ochre")
        }
      />
      <span>{status ? status.text : `Open daily ${openLabel} – ${closeLabel}`}</span>
    </p>
  );
}
