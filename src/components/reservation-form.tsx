"use client";

import { useEffect, useId, useState, useSyncExternalStore } from "react";
import { site } from "@/content/site";
import { formatClock } from "@/lib/hours";
import { whatsappUrl } from "@/lib/order";
import { buildReservationMessage, MAX_PARTY, reservationSlots, weekdayOf } from "@/lib/reservation";
import type { Reservation } from "@/lib/reservation-schema";
import { openWhatsApp } from "./order/open-whatsapp";
import { WhatsAppIcon } from "./order/order-sheet";

type Errors = Partial<Record<keyof Reservation, string>>;

// "Today" means today in Lagos. en-CA formats dates as YYYY-MM-DD. Unknown on the server, so null there.
const lagosToday = () => new Intl.DateTimeFormat("en-CA", { timeZone: site.timeZone }).format(new Date());
const noop = () => () => {};

export function ReservationForm() {
  const id = useId();
  const today = useSyncExternalStore(noop, lagosToday, () => null);
  const [date, setDate] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    void import("@/lib/reservation-schema"); // warm the cache; see order-sheet.tsx
  }, []);

  const slots = date ? reservationSlots(site.hours[weekdayOf(date)]) : [];
  const closedThatDay = date !== "" && slots.length === 0;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const { reservationSchema } = await import("@/lib/reservation-schema");
    const parsed = reservationSchema(site.hours, lagosToday()).safeParse({
      name: form.get("name"),
      date: form.get("date"),
      time: form.get("time") ?? "",
      guests: form.get("guests"),
      occasion: form.get("occasion") || undefined,
    });
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) next[issue.path[0] as keyof Reservation] ??= issue.message;
      setErrors(next);
      return;
    }
    setErrors({});
    openWhatsApp(whatsappUrl(site.whatsapp, buildReservationMessage(parsed.data, site.name)));
  }

  const field =
    "mt-2 block h-12 w-full rounded-none border-0 border-b border-line bg-transparent px-0 text-[15px] text-ivory focus:border-brass focus:outline-none [color-scheme:dark]";
  const error = (key: keyof Reservation) =>
    errors[key] && (
      <span id={`${id}-${key}-error`} className="mt-1.5 block text-xs text-[#e8a090]">
        {errors[key]}
      </span>
    );
  const describedBy = (key: keyof Reservation) => (errors[key] ? `${id}-${key}-error` : undefined);

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
      <label className="block sm:col-span-2">
        <span className="eyebrow text-stone">Name</span>
        <input name="name" autoComplete="name" className={field} aria-invalid={!!errors.name} aria-describedby={describedBy("name")} />
        {error("name")}
      </label>

      <label className="block">
        <span className="eyebrow text-stone">Date</span>
        <input
          type="date"
          name="date"
          min={today ?? undefined}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={field}
          aria-invalid={!!errors.date}
          aria-describedby={describedBy("date")}
        />
        {error("date")}
        {closedThatDay && <span className="mt-1.5 block text-xs text-stone">We&rsquo;re closed on Mondays.</span>}
      </label>

      <label className="block">
        <span className="eyebrow text-stone">Time</span>
        <select
          name="time"
          disabled={slots.length === 0}
          className={`${field} disabled:opacity-50`}
          aria-invalid={!!errors.time}
          aria-describedby={describedBy("time")}
          defaultValue=""
          key={date}
        >
          <option value="" disabled>
            {date ? (closedThatDay ? "No tables" : "Choose a time") : "Pick a date first"}
          </option>
          {slots.map((slot) => {
            const [h, m] = slot.split(":").map(Number);
            return (
              <option key={slot} value={slot} className="bg-ink-2">
                {formatClock(h * 60 + m)}
              </option>
            );
          })}
        </select>
        {error("time")}
      </label>

      <label className="block">
        <span className="eyebrow text-stone">Guests</span>
        <select name="guests" defaultValue="2" className={field}>
          {Array.from({ length: MAX_PARTY }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n} className="bg-ink-2">
              {n} {n === 1 ? "guest" : "guests"}
            </option>
          ))}
        </select>
        <span className="mt-1.5 block text-xs text-stone">Nine or more? Ask about the private room.</span>
      </label>

      <label className="block">
        <span className="eyebrow text-stone">Occasion or requests</span>
        <input name="occasion" placeholder="Birthday, allergies, a quiet table" className={`${field} placeholder:text-stone/60`} />
      </label>

      <div className="sm:col-span-2">
        <button
          type="submit"
          className="flex h-13 w-full items-center justify-center gap-3 rounded-full bg-brass text-sm font-semibold tracking-wide text-ink transition-colors duration-300 hover:bg-ivory sm:w-auto sm:px-10"
        >
          <WhatsAppIcon />
          Request on WhatsApp
        </button>
        <p className="mt-4 text-xs leading-relaxed text-stone">
          We reply within the hour during opening times and hold tables for 15 minutes.
        </p>
      </div>
    </form>
  );
}
