import { afterAll, describe, expect, it } from "vitest";
import { site } from "@/content/site";
import { describeStatus, formatClock, getOpenStatus } from "@/lib/hours";

const LAGOS = "Africa/Lagos";

/** Lagos is UTC+1 all year (no daylight saving), so 21:59 in Lagos is 20:59Z. */
function lagos(isoLocal: string): Date {
  return new Date(`${isoLocal}+01:00`);
}

const status = (isoLocal: string) => describeStatus(getOpenStatus(site.hours, lagos(isoLocal), LAGOS));

// 2026-10-13 is a Tuesday: lunch 12–3pm, dinner 6–10pm.
describe("open/closed at the 10pm boundary", () => {
  const originalTz = process.env.TZ;
  afterAll(() => {
    process.env.TZ = originalTz;
  });

  // The visitor's device time zone must not matter. Node re-reads TZ when it changes.
  for (const visitorTz of ["Africa/Lagos", "America/Los_Angeles", "Asia/Tokyo", "Pacific/Kiritimati", "UTC"]) {
    it(`is right for a visitor in ${visitorTz}`, () => {
      process.env.TZ = visitorTz;
      expect(status("2026-10-13T21:59")).toEqual({ headline: "Open now", detail: "Closes at 10pm" });
      expect(status("2026-10-13T22:00")).toEqual({ headline: "Closed", detail: "Opens tomorrow at 12pm" });
    });
  }
});

describe("next opening", () => {
  it("between lunch and dinner points to dinner today", () => {
    expect(status("2026-10-13T15:30")).toEqual({ headline: "Closed", detail: "Opens at 6pm" });
  });

  it("opens at exactly the opening minute", () => {
    expect(status("2026-10-13T18:00")).toEqual({ headline: "Open now", detail: "Closes at 10pm" });
    expect(status("2026-10-13T17:59").headline).toBe("Closed");
  });

  it("skips Monday, when we're closed all day", () => {
    // Sunday 2026-10-11, after the 9pm close → next service is Tuesday lunch.
    expect(status("2026-10-11T21:00")).toEqual({ headline: "Closed", detail: "Opens Tuesday at 12pm" });
    expect(status("2026-10-12T19:00")).toEqual({ headline: "Closed", detail: "Opens tomorrow at 12pm" });
  });

  it("handles just after midnight using the Lagos date, not UTC's", () => {
    // 00:30 Saturday in Lagos is still 23:30 Friday in UTC.
    expect(status("2026-10-17T00:30")).toEqual({ headline: "Closed", detail: "Opens at 12pm" });
  });

  it("reports no next opening for an empty schedule", () => {
    const closed = getOpenStatus([[], [], [], [], [], [], []], lagos("2026-10-13T12:00"), LAGOS);
    expect(closed).toEqual({ isOpen: false, next: null });
  });
});

describe("formatClock", () => {
  it.each([
    [0, "12am"],
    [720, "12pm"],
    [1110, "6:30pm"],
    [1320, "10pm"],
  ])("%i minutes → %s", (minutes, expected) => {
    expect(formatClock(minutes)).toBe(expected);
  });
});
