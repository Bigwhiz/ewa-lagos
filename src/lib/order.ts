import type { Dish } from "@/content/menu";
import { formatNaira } from "@/lib/money";
import type { Customer } from "@/lib/order-schema";

export const MAX_QUANTITY = 20;

/** What the browser stores: just ids and counts. Names and prices always come from the menu file. */
export type CartLines = Record<string, number>;

export type PricedLine = { dish: Dish; quantity: number; lineTotal: number };
export type PricedOrder = { lines: PricedLine[]; itemCount: number; total: number };

/**
 * Turn stored ids into priced lines using the current menu.
 * Unknown ids (a dish removed since the visitor last came) and bad quantities are dropped,
 * so a stale cart can never produce a wrong total.
 */
export function priceOrder(cart: CartLines, findDish: (id: string) => Dish | undefined): PricedOrder {
  const lines: PricedLine[] = [];
  for (const [id, quantity] of Object.entries(cart)) {
    const dish = findDish(id);
    if (!dish || !Number.isInteger(quantity) || quantity < 1) continue;
    const q = Math.min(quantity, MAX_QUANTITY);
    lines.push({ dish, quantity: q, lineTotal: dish.price * q });
  }
  return {
    lines,
    itemCount: lines.reduce((n, l) => n + l.quantity, 0),
    total: lines.reduce((sum, l) => sum + l.lineTotal, 0),
  };
}

export function buildOrderMessage(order: PricedOrder, customer: Customer, restaurantName: string): string {
  const items = order.lines.map(
    (l) => `• ${l.quantity} × ${l.dish.name} — ${formatNaira(l.lineTotal)}`,
  );
  const fulfilment =
    customer.fulfilment === "pickup" ? "Pickup" : `Delivery to: ${customer.address}`;

  return [
    `Hello ${restaurantName}, I'd like to place an order.`,
    "",
    ...items,
    "",
    `Total: ${formatNaira(order.total)}`,
    customer.fulfilment === "delivery" ? "(Delivery fee to be confirmed)" : null,
    "",
    `Name: ${customer.name}`,
    fulfilment,
    customer.notes ? `Notes: ${customer.notes}` : null,
  ]
    .filter((line) => line !== null)
    .join("\n");
}

/** wa.me wants digits only, and the text must be URL-encoded (newlines, ₦, & and # would break it otherwise). */
export function whatsappUrl(phone: string, text: string): string {
  return `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
}
