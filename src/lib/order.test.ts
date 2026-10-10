import { describe, expect, it } from "vitest";
import { getDish, menu, menuSchema } from "@/content/menu";
import { buildOrderMessage, customerSchema, priceOrder, whatsappUrl } from "@/lib/order";

const cart = { "smoked-party-jollof": 2, dodo: 3, "chocolate-zobo": 1 };

describe("priceOrder", () => {
  it("prices every line from the menu and totals them", () => {
    const order = priceOrder(cart, getDish);
    expect(order.lines.map((l) => [l.dish.id, l.quantity, l.lineTotal])).toEqual([
      ["smoked-party-jollof", 2, 64000],
      ["dodo", 3, 16500],
      ["chocolate-zobo", 1, 13000],
    ]);
    expect(order.itemCount).toBe(6);
    expect(order.total).toBe(64000 + 16500 + 13000);
  });

  it("drops dishes that are no longer on the menu and nonsense quantities", () => {
    const order = priceOrder({ "retired-dish": 4, dodo: 0, chapman: -2, "truffle-fries": 1.5 }, getDish);
    expect(order.lines).toEqual([]);
    expect(order.total).toBe(0);
  });

  it("caps a single line at 20", () => {
    expect(priceOrder({ dodo: 500 }, getDish).lines[0].quantity).toBe(20);
  });
});

describe("buildOrderMessage", () => {
  const order = priceOrder(cart, getDish);

  it("lists items, quantities and the correct total for pickup", () => {
    const message = buildOrderMessage(order, { name: "Tolu", fulfilment: "pickup" }, "Ẹwà");
    expect(message).toBe(
      [
        "Hello Ẹwà, I'd like to place an order.",
        "",
        "• 2 × Smoked Party Jollof — ₦64,000",
        "• 3 × Dodo — ₦16,500",
        "• 1 × Ondo Chocolate & Zobo — ₦13,000",
        "",
        "Total: ₦93,500",
        "",
        "Name: Tolu",
        "Pickup",
      ].join("\n"),
    );
  });

  it("includes the address, delivery-fee note and notes for delivery", () => {
    const message = buildOrderMessage(
      order,
      { name: "Tolu", fulfilment: "delivery", address: "12 Alexander Avenue, Ikoyi", notes: "Less pepper please" },
      "Ẹwà",
    );
    expect(message).toContain("Delivery to: 12 Alexander Avenue, Ikoyi");
    expect(message).toContain("(Delivery fee to be confirmed)");
    expect(message).toContain("Notes: Less pepper please");
  });
});

describe("whatsappUrl", () => {
  it("strips non-digits from the number and encodes the text so it survives the round trip", () => {
    const text = "1 × Ondo Chocolate & Zobo — ₦13,000\nTotal: ₦13,000 #1";
    const url = new URL(whatsappUrl("+234 901-000-0000", text));
    expect(url.origin + url.pathname).toBe("https://wa.me/2349010000000");
    expect(url.searchParams.get("text")).toBe(text);
  });
});

describe("customerSchema", () => {
  it("needs an address for delivery but not for pickup", () => {
    expect(customerSchema.safeParse({ name: "Tolu", fulfilment: "pickup" }).success).toBe(true);
    expect(customerSchema.safeParse({ name: "Tolu", fulfilment: "delivery" }).success).toBe(false);
  });
});

describe("menu data", () => {
  it("is valid and every category has dishes", () => {
    for (const c of menu.categories) expect(menu.dishes.some((d) => d.category === c.id)).toBe(true);
  });

  it("rejects duplicate ids and unknown categories", () => {
    const dish = { id: "a", name: "A", description: "A", price: 1, category: "x" };
    const result = menuSchema.safeParse({ categories: [{ id: "y", name: "Y" }], dishes: [dish, dish] });
    expect(result.success).toBe(false);
    expect(result.error?.issues.map((i) => i.message)).toEqual([
      'Unknown category "x"',
      'Duplicate dish id "a"',
      'Unknown category "x"',
    ]);
  });
});
