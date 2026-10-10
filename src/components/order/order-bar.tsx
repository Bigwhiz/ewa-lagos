"use client";

import { formatNaira } from "@/lib/money";
import { useOrder } from "./order-provider";

/** On phones the header button is easy to miss, so a bar rises from the bottom once something is in the order. */
export function OrderBar() {
  const { order, sheetOpen, setSheetOpen } = useOrder();
  const visible = order.itemCount > 0 && !sheetOpen;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-30 p-3 transition-transform duration-500 ease-out-expo md:hidden ${
        visible ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
      inert={!visible}
    >
      <button
        type="button"
        onClick={() => setSheetOpen(true)}
        className="flex h-14 w-full items-center justify-between rounded-full bg-brass pr-6 pl-6 text-ink shadow-[0_12px_40px_-12px_rgb(0_0_0/0.6)]"
      >
        <span className="text-sm font-semibold">
          View order · {order.itemCount} {order.itemCount === 1 ? "item" : "items"}
        </span>
        <span className="font-display text-xl tabular-nums">{formatNaira(order.total)}</span>
      </button>
    </div>
  );
}
