import * as z from "zod/mini";
import type { WeeklyHours } from "@/lib/hours";
import { MAX_PARTY, reservationSlots, weekdayOf } from "@/lib/reservation";

// Loaded on demand by the booking form (see order-schema.ts for why).
export function reservationSchema(hours: WeeklyHours, todayIso: string) {
  return z
    .object({
      name: z.string().check(z.trim(), z.minLength(2, "Please tell us your name"), z.maxLength(80)),
      date: z.iso.date("Choose a date").check(z.refine((d) => d >= todayIso, "Choose today or a later date")),
      time: z.string().check(z.regex(/^\d{2}:\d{2}$/, "Choose a time")),
      guests: z.coerce.number().check(z.refine(Number.isInteger), z.gte(1), z.lte(MAX_PARTY)),
      occasion: z.optional(z.string().check(z.trim(), z.maxLength(200))),
    })
    .check(
      z.refine((r) => reservationSlots(hours[weekdayOf(r.date)]).includes(r.time), {
        path: ["time"],
        error: "We're not seating at that time",
      }),
    );
}

export type Reservation = z.infer<ReturnType<typeof reservationSchema>>;
