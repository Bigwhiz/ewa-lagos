"use client";

import { createContext, use, useMemo, useState, useSyncExternalStore } from "react";
import { getDish } from "@/content/menu";
import { priceOrder, type PricedOrder } from "@/lib/order";
import { cartStore } from "./cart-store";

type OrderContext = {
  order: PricedOrder;
  quantityOf: (id: string) => number;
  add: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  sheetOpen: boolean;
  setSheetOpen: (open: boolean) => void;
};

const Context = createContext<OrderContext | null>(null);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const lines = useSyncExternalStore(cartStore.subscribe, cartStore.getSnapshot, cartStore.getServerSnapshot);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Prices come from the menu file every time, never from what's stored in the browser.
  const value = useMemo<OrderContext>(
    () => ({
      order: priceOrder(lines, getDish),
      quantityOf: (id) => lines[id] ?? 0,
      add: cartStore.add,
      setQuantity: cartStore.setQuantity,
      clear: cartStore.clear,
      sheetOpen,
      setSheetOpen,
    }),
    [lines, sheetOpen],
  );

  return <Context value={value}>{children}</Context>;
}

export function useOrder(): OrderContext {
  const ctx = use(Context);
  if (!ctx) throw new Error("useOrder must be used inside <OrderProvider>");
  return ctx;
}
