import { z } from "zod";
import { MAX_QUANTITY, type CartLines } from "@/lib/order";

const STORAGE_KEY = "ewa.order.v1";
const EMPTY: CartLines = Object.freeze({}) as CartLines;
const storedSchema = z.record(z.string(), z.number().int().min(1).max(MAX_QUANTITY));

let lines: CartLines | null = null;
const listeners = new Set<() => void>();

function read(): CartLines {
  try {
    const parsed = storedSchema.safeParse(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}"));
    return parsed.success ? parsed.data : EMPTY;
  } catch {
    return EMPTY; // storage blocked (private mode) or corrupted JSON
  }
}

function commit(next: CartLines) {
  lines = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // The order still works for this visit; it just won't survive a reload.
  }
  listeners.forEach((l) => l());
}

function onStorage(e: StorageEvent) {
  if (e.key !== STORAGE_KEY) return;
  lines = read(); // another tab changed the order
  listeners.forEach((l) => l());
}

/** A tiny store shaped for React's useSyncExternalStore. Snapshots only change identity on a real change. */
export const cartStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    if (listeners.size === 1) window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      if (listeners.size === 0) window.removeEventListener("storage", onStorage);
    };
  },
  getSnapshot(): CartLines {
    return (lines ??= read());
  },
  getServerSnapshot(): CartLines {
    return EMPTY;
  },
  setQuantity(id: string, quantity: number) {
    const next = { ...cartStore.getSnapshot() };
    if (quantity < 1) delete next[id];
    else next[id] = Math.min(Math.floor(quantity), MAX_QUANTITY);
    commit(next);
  },
  add(id: string) {
    cartStore.setQuantity(id, (cartStore.getSnapshot()[id] ?? 0) + 1);
  },
  clear() {
    commit(EMPTY);
  },
};
