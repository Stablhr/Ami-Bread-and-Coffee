"use client";

import { useEffect, useState } from "react";

const OPEN_HOUR = 7;
const CLOSE_HOUR = 21;

type Status = {
  open: boolean;
  text: string;
};

function manilaNow(): Date {
  // Convert the current instant to a Date whose local getters read Manila time.
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).formatToParts(new Date());

  const get = (type: string) => Number(parts.find((part) => part.type === type)?.value ?? 0);
  return new Date(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"));
}

function computeStatus(): Status {
  const now = manilaNow();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const openAt = OPEN_HOUR * 60;
  const closeAt = CLOSE_HOUR * 60;

  if (minutes >= openAt && minutes < closeAt) {
    return { open: true, text: "Open now until 9:00 PM" };
  }
  if (minutes < openAt) {
    return { open: false, text: "Closed — opens today at 7:00 AM" };
  }
  return { open: false, text: "Closed — opens tomorrow at 7:00 AM" };
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
      className="inline-flex min-h-[32px] items-center gap-2 font-[family-name:var(--font-ui-stack)] text-base"
      aria-live="polite"
    >
      <span
        aria-hidden="true"
        className={
          "inline-block size-2.5 rounded-full " +
          (status ? (status.open ? "bg-status-ready" : "bg-status-cancelled") : "bg-ochre")
        }
      />
      <span>{status ? status.text : "Open daily 7:00 AM – 9:00 PM"}</span>
    </p>
  );
}
