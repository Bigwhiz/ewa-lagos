import { z } from "zod";

/**
 * The whole menu lives in this file. Adding a dish means adding one object to `dishes`;
 * every page, the order sheet and the WhatsApp message read from here.
 * The schema runs at build time, so a typo (unknown category, duplicate id, bad price) fails the build
 * instead of shipping a broken menu.
 */

export const DIETARY_TAGS = {
  vegetarian: { label: "Vegetarian", short: "V" },
  vegan: { label: "Vegan", short: "VG" },
  pescatarian: { label: "Pescatarian", short: "P" },
  "gluten-free": { label: "Gluten-free", short: "GF" },
  spicy: { label: "Spicy", short: "S" },
  "contains-nuts": { label: "Contains nuts", short: "N" },
} as const;

const tagSchema = z.enum(Object.keys(DIETARY_TAGS) as [keyof typeof DIETARY_TAGS, ...(keyof typeof DIETARY_TAGS)[]]);

const categorySchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  note: z.string().optional(),
});

const dishSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, "ids are lowercase-kebab-case"),
  name: z.string().min(1),
  description: z.string().min(1),
  /** Whole naira */
  price: z.number().int().positive(),
  category: z.string(),
  tags: z.array(tagSchema).default([]),
  signature: z.boolean().default(false),
  image: z.object({ src: z.string(), alt: z.string().min(1) }).optional(),
});

export const menuSchema = z
  .object({ categories: z.array(categorySchema).min(1), dishes: z.array(dishSchema).min(1) })
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

export type DietaryTag = z.infer<typeof tagSchema>;
export type Category = z.infer<typeof categorySchema>;
export type Dish = z.infer<typeof dishSchema>;
export type Menu = z.infer<typeof menuSchema>;

export const menu: Menu = menuSchema.parse({
  categories: [
    { id: "to-begin", name: "To Begin" },
    { id: "from-home", name: "From Home", note: "Recipes from our mothers' kitchens, plated the way we like them now." },
    { id: "the-world-table", name: "The World Table", note: "Classics from further afield, cooked with Nigerian produce." },
    { id: "on-the-side", name: "On the Side" },
    { id: "to-finish", name: "To Finish" },
    { id: "from-the-bar", name: "From the Bar", note: "Alcohol-free. Our wine list is served in the dining room." },
  ],
  dishes: [
    // To Begin
    {
      id: "suya-beef-tartare",
      name: "Suya Beef Tartare",
      description: "Hand-cut beef fillet, house yaji, cured egg yolk, pickled shallot, cassava crisps.",
      price: 18500,
      category: "to-begin",
      tags: ["gluten-free", "spicy", "contains-nuts"],
      signature: true,
    },
    {
      id: "tiger-prawn-pepper-soup",
      name: "Tiger Prawn Pepper Soup",
      description: "Clear broth of uda, uziza and scent leaf, poured at the table over grilled tiger prawns.",
      price: 16000,
      category: "to-begin",
      tags: ["pescatarian", "gluten-free", "spicy"],
    },
    {
      id: "burrata-garden-egg",
      name: "Burrata & Garden Egg",
      description: "Burrata, charred garden egg, ata dindin, basil oil, toasted Agege bread.",
      price: 15500,
      category: "to-begin",
      tags: ["vegetarian"],
    },
    {
      id: "akara-trout-roe",
      name: "Akara & Trout Roe",
      description: "Three crisp bean fritters, whipped crème fraîche, trout roe, chives.",
      price: 14000,
      category: "to-begin",
      tags: ["pescatarian", "gluten-free"],
    },
    {
      id: "plantain-veloute",
      name: "Roasted Plantain Velouté",
      description: "Ripe plantain and coconut, smoked pepper oil, toasted pumpkin seeds.",
      price: 12000,
      category: "to-begin",
      tags: ["vegan", "gluten-free"],
    },

    // From Home
    {
      id: "smoked-party-jollof",
      name: "Smoked Party Jollof",
      description: "Firewood-smoked jollof, charred tiger prawns, caramelised plantain, pepper butter.",
      price: 32000,
      category: "from-home",
      tags: ["pescatarian", "gluten-free", "spicy"],
      signature: true,
    },
    {
      id: "egusi-stone-bass",
      name: "Egusi & Seared Stone Bass",
      description: "Melon-seed sauce with bitter leaf and smoked prawn, crisp-skinned stone bass, pounded yam.",
      price: 38000,
      category: "from-home",
      tags: ["pescatarian", "gluten-free"],
      signature: true,
    },
    {
      id: "ofada-lamb-ayamase",
      name: "Ofada & Lamb Ayamase",
      description: "Slow-cooked lamb shoulder in green pepper and locust-bean sauce, unpolished ofada rice, soft egg.",
      price: 36000,
      category: "from-home",
      tags: ["gluten-free", "spicy"],
    },
    {
      id: "afang-goat-loin",
      name: "Afang & Goat Loin",
      description: "Afang and waterleaf with periwinkle, roasted goat loin, garri crumb.",
      price: 42000,
      category: "from-home",
      tags: ["gluten-free"],
    },
    {
      id: "grilled-croaker",
      name: "Whole Grilled Croaker",
      description: "Charcoal-grilled croaker for two, ata dindin, lime, yam chips.",
      price: 48000,
      category: "from-home",
      tags: ["pescatarian", "gluten-free", "spicy"],
    },
    {
      id: "efo-riro-mushroom",
      name: "Efo Riro & Smoked Mushrooms",
      description: "Spinach stewed in red pepper and palm oil, smoked oyster mushrooms, pounded yam.",
      price: 26000,
      category: "from-home",
      tags: ["vegan", "gluten-free", "spicy"],
    },

    // The World Table
    {
      id: "dry-aged-ribeye",
      name: "Dry-Aged Ribeye, Suya Butter",
      description: "350g ribeye aged for 28 days, suya butter, triple-cooked chips, watercress.",
      price: 65000,
      category: "the-world-table",
      tags: ["gluten-free", "contains-nuts"],
      signature: true,
    },
    {
      id: "lobster-linguine",
      name: "Lagos Lobster Linguine",
      description: "Fresh linguine, half a local lobster, bisque, scotch bonnet, lemon, parsley.",
      price: 58000,
      category: "the-world-table",
      tags: ["pescatarian", "spicy"],
      signature: true,
    },
    {
      id: "miso-salmon",
      name: "Miso-Glazed Salmon",
      description: "Roasted salmon, miso and honey glaze, charred greens, sesame, jasmine rice.",
      price: 44000,
      category: "the-world-table",
      tags: ["pescatarian"],
    },
    {
      id: "mushroom-risotto",
      name: "Wild Mushroom Risotto",
      description: "Carnaroli rice, wild mushrooms, aged parmesan, brown butter, black truffle.",
      price: 30000,
      category: "the-world-table",
      tags: ["vegetarian", "gluten-free"],
    },
    {
      id: "peri-peri-chicken",
      name: "Half Chicken, Peri-Peri",
      description: "Spatchcocked free-range chicken, house peri-peri, charred lemon, herb salad.",
      price: 34000,
      category: "the-world-table",
      tags: ["gluten-free", "spicy"],
    },

    // On the Side
    { id: "dodo", name: "Dodo", description: "Caramelised ripe plantain, flaky salt.", price: 5500, category: "on-the-side", tags: ["vegan", "gluten-free"] },
    { id: "truffle-fries", name: "Truffle Fries", description: "Parmesan, truffle oil, chives.", price: 6500, category: "on-the-side", tags: ["vegetarian", "gluten-free"] },
    { id: "pounded-yam", name: "Pounded Yam", description: "Made to order.", price: 4500, category: "on-the-side", tags: ["vegan", "gluten-free"] },
    { id: "charred-greens", name: "Charred Greens", description: "Seasonal greens, garlic, lemon, chilli.", price: 5000, category: "on-the-side", tags: ["vegan", "gluten-free"] },

    // To Finish
    {
      id: "chocolate-zobo",
      name: "Ondo Chocolate & Zobo",
      description: "70% Ondo cocoa crémeux, hibiscus gel, cocoa nib tuile, crème fraîche.",
      price: 13000,
      category: "to-finish",
      tags: ["vegetarian", "gluten-free"],
      signature: true,
    },
    {
      id: "puff-puff",
      name: "Puff-Puff & Salted Caramel",
      description: "Warm nutmeg doughnuts, salted caramel, vanilla bean ice cream.",
      price: 11000,
      category: "to-finish",
      tags: ["vegetarian"],
    },
    {
      id: "coconut-pavlova",
      name: "Coconut & Pineapple Pavlova",
      description: "Crisp meringue, toasted coconut cream, roasted pineapple, lime zest.",
      price: 12000,
      category: "to-finish",
      tags: ["vegetarian", "gluten-free"],
    },

    // From the Bar
    { id: "zobo-spritz", name: "Zobo Spritz", description: "Hibiscus, ginger, clove, sparkling water.", price: 7000, category: "from-the-bar", tags: ["vegan", "gluten-free"] },
    { id: "chapman", name: "Chapman, Our Way", description: "Grenadine, citrus, bitters, cucumber.", price: 8000, category: "from-the-bar", tags: ["vegan", "gluten-free"] },
    { id: "tiger-nut-date", name: "Tiger Nut & Date", description: "Cold-pressed tiger nut milk, dates, a little nutmeg.", price: 7500, category: "from-the-bar", tags: ["vegan", "gluten-free"] },
    { id: "pressed-juice", name: "Pressed Juice of the Day", description: "Seasonal fruit, pressed each morning.", price: 6000, category: "from-the-bar", tags: ["vegan", "gluten-free"] },
  ],
});

export function getDish(id: string): Dish | undefined {
  return menu.dishes.find((d) => d.id === id);
}

export function dishesIn(categoryId: string): Dish[] {
  return menu.dishes.filter((d) => d.category === categoryId);
}

export const signatureDishes = menu.dishes.filter((d) => d.signature);
