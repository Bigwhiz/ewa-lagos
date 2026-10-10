"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { site } from "@/content/site";
import { formatNaira } from "@/lib/money";
import { buildOrderMessage, whatsappUrl } from "@/lib/order";
import type { Customer } from "@/lib/order-schema";
import { openWhatsApp } from "./open-whatsapp";
import { useOrder } from "./order-provider";
import { QuantityControl } from "./quantity-control";

type Errors = Partial<Record<keyof Customer, string>>;

export function OrderSheet() {
  const { order, sheetOpen, setSheetOpen, clear } = useOrder();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [fulfilment, setFulfilment] = useState<Customer["fulfilment"]>("pickup");
  const [errors, setErrors] = useState<Errors>({});
  const id = useId();

  // Fetch the validation code once the page is idle, so it's cached by the time anyone submits.
  useEffect(() => {
    void import("@/lib/order-schema");
  }, []);

  // React state is the source of truth; the native <dialog> gives us focus trapping, Esc and a backdrop for free.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (sheetOpen && !dialog.open) dialog.showModal();
    if (!sheetOpen && dialog.open) dialog.close();
  }, [sheetOpen]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const { customerSchema } = await import("@/lib/order-schema");
    const parsed = customerSchema.safeParse({
      name: form.get("name"),
      fulfilment,
      address: fulfilment === "delivery" ? form.get("address") : undefined,
      notes: form.get("notes") || undefined,
    });

    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) next[issue.path[0] as keyof Customer] ??= issue.message;
      setErrors(next);
      return;
    }

    setErrors({});
    const message = buildOrderMessage(order, parsed.data, site.name);
    openWhatsApp(whatsappUrl(site.whatsapp, message));
  }

  const field =
    "mt-2 w-full rounded-none border-0 border-b border-line bg-transparent px-0 py-2.5 text-[15px] text-ivory placeholder:text-stone/60 focus:border-brass focus:outline-none focus:ring-0";

  return (
    <dialog
      ref={dialogRef}
      onClose={() => setSheetOpen(false)}
      onClick={(e) => e.target === dialogRef.current && setSheetOpen(false)}
      aria-labelledby={`${id}-title`}
      className="sheet fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-full max-w-md bg-ink-2 p-0 text-ivory shadow-2xl"
    >
      <div className="flex h-full flex-col">
        <header className="flex items-center justify-between border-b border-line px-6 py-5">
          <div>
            <p className="eyebrow text-brass">Order for pickup or delivery</p>
            <h2 id={`${id}-title`} className="mt-1 text-3xl">
              Your order
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setSheetOpen(false)}
            className="grid size-10 place-items-center rounded-full border border-line transition-colors hover:border-brass"
            aria-label="Close order"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>

        {order.lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <p className="font-display text-2xl">Nothing here yet</p>
            <p className="text-sm text-stone">Add dishes from the menu and they&rsquo;ll appear here.</p>
            <Link
              href="/menu"
              onClick={() => setSheetOpen(false)}
              className="eyebrow mt-2 rounded-full border border-brass px-6 py-3 text-brass transition-colors hover:bg-brass hover:text-ink"
            >
              Browse the menu
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 overflow-y-auto overscroll-contain px-6">
              <ul className="divide-y divide-line">
                {order.lines.map(({ dish, lineTotal }) => (
                  <li key={dish.id} className="flex items-center justify-between gap-4 py-4">
                    <div className="min-w-0">
                      <p className="font-display text-xl leading-tight">{dish.name}</p>
                      <p className="mt-1 text-sm text-stone tabular-nums">{formatNaira(lineTotal)}</p>
                    </div>
                    <QuantityControl dishId={dish.id} dishName={dish.name} />
                  </li>
                ))}
              </ul>

              <fieldset className="mt-6">
                <legend className="eyebrow text-stone">How would you like it?</legend>
                <div className="mt-3 grid grid-cols-2 rounded-full border border-line p-1">
                  {(["pickup", "delivery"] as const).map((option) => (
                    <label
                      key={option}
                      className="cursor-pointer rounded-full py-2.5 text-center text-sm capitalize transition-colors has-checked:bg-ivory has-checked:text-ink has-focus-visible:outline has-focus-visible:outline-brass"
                    >
                      <input
                        type="radio"
                        name="fulfilment"
                        value={option}
                        checked={fulfilment === option}
                        onChange={() => setFulfilment(option)}
                        className="sr-only"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="mt-6 space-y-5 pb-6">
                <label className="block">
                  <span className="eyebrow text-stone">Your name</span>
                  <input
                    name="name"
                    autoComplete="name"
                    className={field}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? `${id}-name-error` : undefined}
                  />
                  {errors.name && (
                    <span id={`${id}-name-error`} className="mt-1.5 block text-xs text-[#e8a090]">
                      {errors.name}
                    </span>
                  )}
                </label>

                {fulfilment === "delivery" && (
                  <label className="block">
                    <span className="eyebrow text-stone">Delivery address</span>
                    <textarea
                      name="address"
                      rows={2}
                      autoComplete="street-address"
                      className={`${field} resize-none`}
                      aria-invalid={!!errors.address}
                      aria-describedby={errors.address ? `${id}-address-error` : undefined}
                    />
                    {errors.address && (
                      <span id={`${id}-address-error`} className="mt-1.5 block text-xs text-[#e8a090]">
                        {errors.address}
                      </span>
                    )}
                    <span className="mt-1.5 block text-xs text-stone">
                      We deliver within Ikoyi, Victoria Island and Lekki Phase 1.
                    </span>
                  </label>
                )}

                <label className="block">
                  <span className="eyebrow text-stone">Notes for the kitchen</span>
                  <input name="notes" placeholder="Allergies, spice level, timing" className={field} />
                </label>
              </div>
            </div>

            <footer className="border-t border-line px-6 py-5">
              <div className="flex items-baseline justify-between">
                <span className="eyebrow text-stone">
                  Total · {order.itemCount} {order.itemCount === 1 ? "item" : "items"}
                </span>
                <span className="font-display text-3xl tabular-nums">{formatNaira(order.total)}</span>
              </div>
              {fulfilment === "delivery" && (
                <p className="mt-1 text-right text-xs text-stone">Delivery fee confirmed on WhatsApp</p>
              )}
              <button
                type="submit"
                className="mt-5 flex h-13 w-full items-center justify-center gap-3 rounded-full bg-brass text-sm font-semibold tracking-wide text-ink transition-colors duration-300 hover:bg-ivory"
              >
                <WhatsAppIcon />
                Send order on WhatsApp
              </button>
              <button
                type="button"
                onClick={clear}
                className="mt-3 w-full text-center text-xs text-stone underline-offset-4 hover:text-ivory hover:underline"
              >
                Clear order
              </button>
            </footer>
          </form>
        )}
      </div>
    </dialog>
  );
}

export function WhatsAppIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm0 18.15a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24s8.24 3.7 8.24 8.24-3.7 8.24-8.24 8.24Zm4.52-6.17c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07s.88 2.4 1.01 2.56c.12.17 1.74 2.65 4.21 3.72.59.25 1.05.41 1.4.52.59.19 1.13.16 1.55.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.3Z" />
    </svg>
  );
}
