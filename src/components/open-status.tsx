"use client";

import { useSyncExternalStore } from "react";
import { site } from "@/content/site";
import { describeStatus, getOpenStatus } from "@/lib/hours";

// The page is pre-rendered once at build time, so the server can't know "now".
// The server snapshot is null (we render neutral text), and the browser fills in the real status,
// re-checking every 30 seconds so the label flips at 10:00pm without a reload.
const subscribe = (tick: () => void) => {
  const timer = setInterval(tick, 30_000);
  return () => clearInterval(timer);
};
const currentMinute = () => Math.floor(Date.now() / 60_000);
const noMinute = () => null;

export function OpenStatus({ className = "" }: { className?: string }) {
  const minute = useSyncExternalStore(subscribe, currentMinute, noMinute);

  if (minute === null) {
    return (
      <span className={`inline-flex items-center gap-2 ${className}`}>
        <span className="size-1.5 rounded-full bg-stone/50" aria-hidden="true" />
        Lunch &amp; dinner, Tuesday to Sunday
      </span>
    );
  }

  const status = getOpenStatus(site.hours, new Date(minute * 60_000), site.timeZone);
  const { headline, detail } = describeStatus(status);

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className="relative flex size-1.5" aria-hidden="true">
        {status.isOpen && (
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400/70 motion-reduce:hidden" />
        )}
        <span className={`relative inline-flex size-1.5 rounded-full ${status.isOpen ? "bg-emerald-400" : "bg-stone"}`} />
      </span>
      <span>
        {headline} · {detail}
      </span>
    </span>
  );
}
