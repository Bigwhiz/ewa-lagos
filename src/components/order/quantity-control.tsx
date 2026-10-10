"use client";

import { MAX_QUANTITY } from "@/lib/order";
import { useOrder } from "./order-provider";

type Props = { dishId: string; dishName: string; tone?: "dark" | "light" };

/** "Add" until the dish is in the order, then a − n + stepper. */
export function QuantityControl({ dishId, dishName, tone = "dark" }: Props) {
  const { quantityOf, add, setQuantity } = useOrder();
  const quantity = quantityOf(dishId);

  const border = tone === "dark" ? "border-line hover:border-brass" : "border-line-dark hover:border-brass-deep";
  const text = tone === "dark" ? "text-ivory" : "text-ink";

  if (quantity === 0) {
    return (
      <button
        type="button"
        onClick={() => add(dishId)}
        className={`eyebrow inline-flex h-10 items-center rounded-full border px-5 transition-colors duration-300 ${border} ${text}`}
      >
        Add<span className="sr-only"> {dishName} to order</span>
      </button>
    );
  }

  return (
    <div
      role="group"
      aria-label={`${dishName} quantity`}
      className={`inline-flex h-10 items-center rounded-full border ${tone === "dark" ? "border-brass/60" : "border-brass-deep/50"} ${text}`}
    >
      <button
        type="button"
        onClick={() => setQuantity(dishId, quantity - 1)}
        className="grid size-10 place-items-center rounded-full text-lg leading-none transition-opacity hover:opacity-70"
        aria-label={quantity === 1 ? `Remove ${dishName}` : `One less ${dishName}`}
      >
        −
      </button>
      <span className="w-6 text-center text-sm tabular-nums" aria-live="polite">
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => add(dishId)}
        disabled={quantity >= MAX_QUANTITY}
        className="grid size-10 place-items-center rounded-full text-lg leading-none transition-opacity hover:opacity-70 disabled:opacity-30"
        aria-label={`One more ${dishName}`}
      >
        +
      </button>
    </div>
  );
}
