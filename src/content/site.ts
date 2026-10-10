import type { WeeklyHours } from "@/lib/hours";

const hours: WeeklyHours = [
  /* Sun */ [{ open: "13:00", close: "21:00" }],
  /* Mon */ [],
  /* Tue */ [{ open: "12:00", close: "15:00" }, { open: "18:00", close: "22:00" }],
  /* Wed */ [{ open: "12:00", close: "15:00" }, { open: "18:00", close: "22:00" }],
  /* Thu */ [{ open: "12:00", close: "15:00" }, { open: "18:00", close: "22:00" }],
  /* Fri */ [{ open: "12:00", close: "15:00" }, { open: "18:00", close: "23:00" }],
  /* Sat */ [{ open: "12:00", close: "15:00" }, { open: "18:00", close: "23:00" }],
];

export const site = {
  name: "Ẹwà",
  nameAscii: "Ewa",
  tagline: "Plated in Lagos",
  description:
    "Ẹwà is a Lagos dining room where the food of home and the techniques of the world meet on one plate. Lunch and dinner in Ikoyi, Tuesday to Sunday.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  timeZone: "Africa/Lagos",
  hours,
  // Placeholder line for the demo build. In E.164 without the "+", as wa.me expects.
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2349010000000",
  phoneDisplay: "+234 901 000 0000",
  email: "table@ewa.ng",
  address: {
    street: "7 Glover Court, off Bourdillon Road",
    area: "Ikoyi",
    city: "Lagos",
    country: "NG",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Bourdillon+Road+Ikoyi+Lagos",
  },
  serviceNote: "Prices include VAT. A 10% service charge is added for dine-in.",
} as const;

export const NAV = [
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "Our Story" },
  { href: "/visit", label: "Visit" },
  { href: "/contact", label: "Reserve" },
] as const;
