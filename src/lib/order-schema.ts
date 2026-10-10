import * as z from "zod/mini";

// Kept in its own module so the browser can load it with import() when a form is submitted,
// instead of shipping it with every page. zod/mini has the same rules as Zod in a tree-shakeable form.
const text = (max: number) => z.string().check(z.trim(), z.maxLength(max));

export const customerSchema = z
  .object({
    name: z.string().check(z.trim(), z.minLength(2, "Please tell us your name"), z.maxLength(80)),
    fulfilment: z.enum(["pickup", "delivery"]),
    address: z.optional(text(240)),
    notes: z.optional(text(400)),
  })
  .check(
    z.refine((c) => c.fulfilment === "pickup" || (c.address?.length ?? 0) >= 6, {
      path: ["address"],
      error: "Add a delivery address",
    }),
  );

export type Customer = z.infer<typeof customerSchema>;
