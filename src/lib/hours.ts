/** 0 = Sunday … 6 = Saturday, matching Date#getDay. */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** One sitting, in 24-hour "HH:MM" Lagos time. Validated at build time in content/validate.ts. */
export type Service = { open: string; close: string };
/** Index by Weekday. An empty array means closed all day. */
export type WeeklyHours = Service[][];

export type OpenStatus =
  | { isOpen: true; closesAt: number }
  | {
      isOpen: false;
      /** null when the schedule has no services at all */
      next: { daysAhead: number; weekday: Weekday; opensAt: number } | null;
    };

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/**
 * The weekday and minute-of-day *in the restaurant's time zone*, regardless of where the
 * visitor's device is. Intl does the conversion, so we never hard-code "+1 hour".
 */
export function zonedClock(now: Date, timeZone: string): { weekday: Weekday; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return {
    weekday: WEEKDAYS.indexOf(get("weekday")) as Weekday,
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

export function getOpenStatus(hours: WeeklyHours, now: Date, timeZone: string): OpenStatus {
  const { weekday, minutes } = zonedClock(now, timeZone);

  // Open is inclusive, close is exclusive: closing at 22:00 means open at 21:59, closed at 22:00.
  const current = hours[weekday].find(
    (s) => toMinutes(s.open) <= minutes && minutes < toMinutes(s.close),
  );
  if (current) return { isOpen: true, closesAt: toMinutes(current.close) };

  // Look for the next opening: later today first, then up to a full week ahead.
  for (let daysAhead = 0; daysAhead <= 7; daysAhead++) {
    const day = ((weekday + daysAhead) % 7) as Weekday;
    const next = hours[day]
      .map((s) => toMinutes(s.open))
      .sort((a, b) => a - b)
      .find((open) => daysAhead > 0 || open > minutes);
    if (next !== undefined) return { isOpen: false, next: { daysAhead, weekday: day, opensAt: next } };
  }
  return { isOpen: false, next: null };
}

/** 1320 → "10pm", 1110 → "6:30pm" */
export function formatClock(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const suffix = h < 12 ? "am" : "pm";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${h12}${suffix}` : `${h12}:${String(m).padStart(2, "0")}${suffix}`;
}

export function describeStatus(status: OpenStatus): { headline: string; detail: string } {
  if (status.isOpen) return { headline: "Open now", detail: `Closes at ${formatClock(status.closesAt)}` };
  if (!status.next) return { headline: "Closed", detail: "Temporarily closed" };

  const { daysAhead, weekday, opensAt } = status.next;
  const when =
    daysAhead === 0 ? "" : daysAhead === 1 ? " tomorrow" : ` ${WEEKDAY_NAMES[weekday]}`;
  return { headline: "Closed", detail: `Opens${when} at ${formatClock(opensAt)}` };
}

/** "18:00"–"22:00" → "6pm – 10pm" for printed opening hours. */
export function formatService(s: Service): string {
  return `${formatClock(toMinutes(s.open))} – ${formatClock(toMinutes(s.close))}`;
}

export { WEEKDAY_NAMES };
