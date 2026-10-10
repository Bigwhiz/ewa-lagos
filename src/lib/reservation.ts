import { z } from "zod";
import { formatClock, type Service, type WeeklyHours } from "@/lib/hours";

export const LAST_SEATING_BEFORE_CLOSE = 90; // minutes
export const MAX_PARTY = 8;

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** Bookable times for one day, every 30 minutes, stopping 90 minutes before each service closes. */
export function reservationSlots(services: Service[]): string[] {
  return services.flatMap((s) => {
    const slots: string[] = [];
    for (let t = toMinutes(s.open); t <= toMinutes(s.close) - LAST_SEATING_BEFORE_CLOSE; t += 30) {
      slots.push(`${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`);
    }
    return slots;
  });
}

/** "2026-10-13" → its weekday, read as a calendar date (no time zone involved). */
export function weekdayOf(isoDate: string): number {
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export function reservationSchema(hours: WeeklyHours, todayIso: string) {
  return z
    .object({
      name: z.string().trim().min(2, "Please tell us your name").max(80),
      date: z.iso.date("Choose a date").refine((d) => d >= todayIso, "Choose today or a later date"),
      time: z.string().regex(/^\d{2}:\d{2}$/, "Choose a time"),
      guests: z.coerce.number().int().min(1).max(MAX_PARTY),
      occasion: z.string().trim().max(200).optional(),
    })
    .refine((r) => reservationSlots(hours[weekdayOf(r.date)]).includes(r.time), {
      path: ["time"],
      message: "We're not seating at that time",
    });
}

export type Reservation = z.infer<ReturnType<typeof reservationSchema>>;

export function buildReservationMessage(r: Reservation, restaurantName: string): string {
  const date = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(new Date(`${r.date}T00:00:00Z`));

  return [
    `Hello ${restaurantName}, I'd like to book a table.`,
    "",
    `Name: ${r.name}`,
    `Date: ${date}`,
    `Time: ${formatClock(toMinutes(r.time))}`,
    `Guests: ${r.guests}`,
    r.occasion ? `Occasion / requests: ${r.occasion}` : null,
  ]
    .filter((l) => l !== null)
    .join("\n");
}
