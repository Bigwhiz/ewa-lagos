import { z } from "zod";
import { DIETARY_TAGS, type Menu } from "./menu";
import type { WeeklyHours } from "@/lib/hours";

/**
 * Content checks that run on the server only. The root layout calls validateContent(), so every
 * `next build` (and every dev request) fails loudly on bad content, and none of this code or the
 * full Zod library is sent to visitors' browsers.
 */

const kebab = z.string().regex(/^[a-z0-9-]+$/, "ids are lowercase-kebab-case");
const clock = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use 24-hour HH:MM");
const minutes = (hhmm: string) => Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3));

export const weeklyHoursSchema = z
  .array(
    z.array(
      z.object({ open: clock, close: clock }).refine((s) => minutes(s.open) < minutes(s.close), {
        message: "A service must close after it opens (same day)",
      }),
    ),
  )
  .length(7);

export const menuSchema = z
  .object({
    categories: z.array(z.object({ id: kebab, name: z.string().min(1), note: z.string().optional() })).min(1),
    dishes: z
      .array(
        z.object({
          id: kebab,
          name: z.string().min(1),
          description: z.string().min(1),
          price: z.number().int().positive(),
          category: z.string(),
          tags: z.array(z.enum(Object.keys(DIETARY_TAGS) as [string, ...string[]])),
          signature: z.boolean().optional(),
          image: z.object({ src: z.url(), alt: z.string().min(1) }).optional(),
        }),
      )
      .min(1),
  })
  .superRefine(({ categories, dishes }, ctx) => {
    const categoryIds = new Set(categories.map((c) => c.id));
    const seen = new Set<string>();
    dishes.forEach((dish, i) => {
      if (seen.has(dish.id)) ctx.addIssue({ code: "custom", path: ["dishes", i, "id"], message: `Duplicate dish id "${dish.id}"` });
      seen.add(dish.id);
      if (!categoryIds.has(dish.category))
        ctx.addIssue({ code: "custom", path: ["dishes", i, "category"], message: `Unknown category "${dish.category}"` });
    });
  });

export function validateContent(content: { menu: Menu; hours: WeeklyHours }) {
  menuSchema.parse(content.menu);
  weeklyHoursSchema.parse(content.hours);
}
