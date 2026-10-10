import { describe, expect, it } from "vitest";
import { site } from "@/content/site";
import { buildReservationMessage, reservationSchema, reservationSlots, weekdayOf } from "@/lib/reservation";

describe("reservationSlots", () => {
  it("offers lunch and dinner slots up to 90 minutes before close", () => {
    expect(reservationSlots(site.hours[2])).toEqual([
      "12:00", "12:30", "13:00", "13:30",
      "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
    ]);
  });

  it("offers nothing on Monday", () => {
    expect(reservationSlots(site.hours[1])).toEqual([]);
  });
});

describe("reservationSchema", () => {
  const schema = reservationSchema(site.hours, "2026-10-10");
  const base = { name: "Kemi", date: "2026-10-13", time: "19:30", guests: "4" };

  it("accepts a valid Tuesday dinner booking and coerces guests to a number", () => {
    const r = schema.parse(base);
    expect(r.guests).toBe(4);
    expect(weekdayOf(r.date)).toBe(2);
  });

  it.each([
    ["a past date", { date: "2026-10-09" }],
    ["a Monday", { date: "2026-10-12" }],
    ["a time after last seating", { time: "21:00" }],
    ["a party over 8", { guests: "12" }],
  ])("rejects %s", (_label, change) => {
    expect(schema.safeParse({ ...base, ...change }).success).toBe(false);
  });
});

describe("buildReservationMessage", () => {
  it("spells out the date and time", () => {
    const r = reservationSchema(site.hours, "2026-10-10").parse({
      name: "Kemi",
      date: "2026-10-13",
      time: "19:30",
      guests: "4",
      occasion: "Anniversary",
    });
    expect(buildReservationMessage(r, "Ẹwà")).toBe(
      [
        "Hello Ẹwà, I'd like to book a table.",
        "",
        "Name: Kemi",
        "Date: Tuesday 13 October",
        "Time: 7:30pm",
        "Guests: 4",
        "Occasion / requests: Anniversary",
      ].join("\n"),
    );
  });
});
