"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV, site } from "@/content/site";
import { useOrder } from "./order/order-provider";

export function SiteHeader() {
  const pathname = usePathname();
  const { order, setSheetOpen } = useOrder();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile menu after navigating.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="header-scrolled fixed inset-x-0 top-0 z-40 border-b">
      <div className="container-page flex h-18 items-center justify-between gap-6 md:h-20">
        <Link href="/" className="font-display text-[1.9rem] leading-none tracking-tight" aria-label={`${site.name}, home`}>
          {site.name}
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-10">
            {NAV.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={pathname === href ? "page" : undefined}
                  className="eyebrow relative py-2 text-ivory/80 transition-colors hover:text-ivory aria-[current=page]:text-brass"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="eyebrow inline-flex h-10 items-center gap-2.5 rounded-full border border-ivory/25 pr-2 pl-5 transition-colors duration-300 hover:border-brass"
          >
            Order
            <span
              className={`grid h-6 min-w-6 place-items-center rounded-full px-1.5 text-[0.6875rem] tracking-normal tabular-nums transition-colors ${
                order.itemCount > 0 ? "bg-brass text-ink" : "bg-ivory/10 text-ivory/70"
              }`}
            >
              {order.itemCount}
              <span className="sr-only"> {order.itemCount === 1 ? "item" : "items"} in your order</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            className="grid size-10 place-items-center md:hidden"
          >
            <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
            <span aria-hidden="true" className="relative block h-3 w-6">
              <span className={`absolute left-0 h-px w-6 bg-ivory transition-transform duration-500 ease-out-expo ${menuOpen ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 h-px w-6 bg-ivory transition-transform duration-500 ease-out-expo ${menuOpen ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        hidden={!menuOpen}
        className="fixed inset-x-0 top-18 bottom-0 bg-ink md:hidden"
      >
        <nav aria-label="Mobile" className="container-page flex h-full flex-col justify-between pt-10 pb-12">
          <ul className="space-y-2">
            {NAV.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={pathname === href ? "page" : undefined}
                  className="block py-2 font-display text-5xl aria-[current=page]:text-brass"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="space-y-1 text-sm text-stone">
            <p>{site.address.street}</p>
            <p>
              {site.address.area}, {site.address.city}
            </p>
            <p className="pt-3">{site.phoneDisplay}</p>
          </div>
        </nav>
      </div>
    </header>
  );
}
