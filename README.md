# Ẹwà — Plated in Lagos

A website for Ẹwà, a fictional fine-dining restaurant in Ikoyi, Lagos, that serves Nigerian recipes and international dishes. Guests browse the menu, build an order, and send it to the restaurant on WhatsApp, pre-written. They can also request a table the same way.

**Stack:** Next.js 16 (App Router, Cache Components), TypeScript (strict), Tailwind CSS v4, Zod, Vitest.

## Run it

```bash
npm install
npm run dev        # http://localhost:4310
npm test           # unit tests (Vitest)
npm run typecheck
npm run lint
npm run build && npx next start -p 4310
```

Optional environment variables (see `.env.example`):

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Absolute URL for canonical links, the sitemap and Open Graph tags |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | The restaurant's WhatsApp number, digits only (for example `2348012345678`) |

## How it's built

```
src/
  content/      menu.ts, site.ts (hours, address), photos.ts — the only files a menu change touches
                validate.ts — full Zod checks of that content, run on the server at build time
  lib/          plain TypeScript, no React: pricing, the WhatsApp message, open/closed logic, reservations
                *-schema.ts — form validation (zod/mini), loaded on demand
  components/   header, footer, open-status, order/ (cart store, sheet, controls), reservation form
  app/          one folder per page, plus opengraph-image, sitemap, robots, icon
```

### WhatsApp ordering

1. The cart is a small external store (`components/order/cart-store.ts`), read with React's `useSyncExternalStore`. It keeps **only dish ids and quantities** in `localStorage`.
2. Every render re-prices those ids from `content/menu.ts` (`priceOrder`). A stale or edited cart can't produce a wrong total: removed dishes and bad quantities are dropped.
3. `buildOrderMessage` writes the order text, and `whatsappUrl` URL-encodes it into a `wa.me` link. Without encoding, newlines, `₦`, `&` and `#` would break the link.

### "Open now · Closes at 10pm"

`getOpenStatus(hours, now, "Africa/Lagos")` reads the weekday and time **in Lagos** through `Intl.DateTimeFormat`, so a visitor in London or Tokyo sees the same status. Opening is inclusive and closing is exclusive: 9:59pm is open, 10:00pm is closed. The pages are static, so the server can't know the current time. `OpenStatus` renders neutral text on the server and fills in the real status in the browser, re-checking every 30 seconds.

## Decisions

- **Static everything.** Every page is pre-rendered at build time. The only thing that depends on the current time (open/closed) runs in the browser.
- **One source of truth for content.** Pages, the cart, the message and the JSON-LD all read from `content/`. Adding a dish is one object in `menu.ts`.
- **Validate where it's cheap.** Content is checked by full Zod on the server during `next build`, so a typo fails the build and never reaches visitors. Form input is checked with `zod/mini`, loaded by `import()` after the page has painted, which keeps it out of the first-load JavaScript.
- **Integers for money.** Prices are whole naira, stored as integers.
- **Native `<dialog>` for the order sheet.** Focus trapping, Esc to close and the backdrop come from the browser.
- **CSS-only motion.** Reveal and header effects use scroll-driven animations. Visitors who prefer reduced motion get no movement.

## Content and imagery

All names, copy, prices and contact details are fictional. Photos are from Unsplash (Unsplash License) and are placeholders for the restaurant's own photography.
