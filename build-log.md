# Build log: Site 1, Ẹwà (restaurant)

| | |
|---|---|
| Started | 2026-10-10 |
| Finished | |
| Hours | |
| Avg `/grade-session` | |

## Session 1 (2026-10-10)

**Built:** scaffold, menu data with build-time validation, open/closed logic (Lagos time), WhatsApp order and reservation messages, five pages, OG image, sitemap, robots, JSON-LD.

**Tests:** 31 unit tests. Covers the 9:59pm/10:00pm boundary for visitors in five time zones, message contents and totals, stale-cart handling, and reservation rules.

**Bugs hit and how they were found**
- Header stayed transparent on scroll. Found by reading computed styles in the browser: the effect was inside a `prefers-reduced-motion: no-preference` block, and this machine has reduced motion on. A colour change isn't motion, so it moved out of that block.
- `next/image` rejected Unsplash URLs. A `URL` remote pattern without `?` only matches URLs with no query string; switched to an object pattern.
- Vitest crashed on start because it resolved a stray `vite` in the home folder. Fixed by installing `vite` locally.

**Performance investigation:** first local Lighthouse mobile run was 70–81. With JS blocked, home scored 97, so the cost was JavaScript before first paint, not CSS (a full style and layout pass measured 9ms). Moved content validation to build time, lazy-loaded form validation, and trimmed fonts. Client JS for our code went from 24KB to 12KB gzipped. Local LCP stayed about 4.4s and scores varied ±10 between runs, so the target is measured on the deployed URL with PageSpeed Insights.

**Harder than expected:** separating code that must run in the browser from code that only needs to run once at build time.

## Sell step

| Business | Date | What they said |
|---|---|---|
| | | |
