import Link from "next/link";
import { NAV, site } from "@/content/site";
import { formatService, WEEKDAY_NAMES } from "@/lib/hours";
import { OpenStatus } from "./open-status";

// Monday first reads more naturally on a printed schedule.
const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0] as const;

export function HoursList({ className = "" }: { className?: string }) {
  return (
    <dl className={`divide-y divide-line ${className}`}>
      {WEEK_ORDER.map((day) => (
        <div key={day} className="flex justify-between gap-6 py-2.5 text-sm">
          <dt className="text-stone">{WEEKDAY_NAMES[day]}</dt>
          <dd className="text-right tabular-nums">
            {site.hours[day].length === 0 ? "Closed" : site.hours[day].map(formatService).join(", ")}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-ink">
      <div className="container-page grid gap-14 py-20 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-4">
          <p className="font-display text-6xl leading-none">{site.name}</p>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-stone">
            The food of home and the techniques of the world, on one plate. Ikoyi, Lagos.
          </p>
          <OpenStatus className="mt-8 text-sm" />
        </div>

        <div className="md:col-span-3 md:col-start-6">
          <p className="eyebrow text-brass">Find us</p>
          <address className="mt-5 space-y-1 text-sm not-italic leading-relaxed">
            <p>{site.address.street}</p>
            <p>
              {site.address.area}, {site.address.city}
            </p>
            <p className="pt-4">
              <a href={`tel:+${site.whatsapp}`} className="hover:text-brass">
                {site.phoneDisplay}
              </a>
            </p>
            <p>
              <a href={`mailto:${site.email}`} className="hover:text-brass">
                {site.email}
              </a>
            </p>
          </address>
        </div>

        <div className="md:col-span-4">
          <p className="eyebrow text-brass">Hours</p>
          <HoursList className="mt-3" />
        </div>
      </div>

      <div className="container-page flex flex-col gap-4 border-t border-line py-7 text-xs text-stone md:flex-row md:items-center md:justify-between">
        <p>© {site.name}, Lagos. Made with care in Ikoyi.</p>
        <nav aria-label="Footer">
          <ul className="flex gap-6">
            {NAV.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="hover:text-ivory">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
