import type { Metadata } from "next";
import Image from "next/image";
import { OpenStatus } from "@/components/open-status";
import { HoursList } from "@/components/site-footer";
import { ButtonLink } from "@/components/ui";
import { photos } from "@/content/photos";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Location & Hours",
  description:
    "Find Ẹwà off Bourdillon Road, Ikoyi. Lunch from 12pm and dinner from 6pm, Tuesday to Saturday, and Sunday lunch until 9pm.",
  alternates: { canonical: "/visit" },
};

const details = [
  { title: "Getting here", body: "Ten minutes from Falomo Bridge. Turn off Bourdillon Road at the second roundabout; we're the low building with the brass door." },
  { title: "Parking", body: "Valet parking from 6pm every evening. At lunch there are bays in the courtyard, first come, first served." },
  { title: "Dress", body: "Smart casual. We'd rather you were comfortable than formal, but we do ask for no sportswear in the evenings." },
  { title: "Children", body: "Very welcome at lunch and on Sundays, with a short menu of their own. Dinner is best for guests aged twelve and over." },
  { title: "Access", body: "Step-free entrance, an accessible restroom and tables with space for wheelchairs. Tell us when you book and we'll keep one for you." },
  { title: "Payment", body: "Cards, bank transfer and Apple Pay. For WhatsApp orders, we'll send payment details when we confirm." },
];

export default function VisitPage() {
  return (
    <>
      <section className="container-page grid gap-14 pt-36 pb-24 md:grid-cols-12 md:pt-48">
        <div className="md:col-span-6">
          <p className="eyebrow text-brass">Location &amp; hours</p>
          <h1 className="mt-6 text-[clamp(3rem,7vw,6rem)] leading-[0.95] font-light">
            Off Bourdillon, <em className="text-brass">in Ikoyi</em>
          </h1>
          <address className="mt-10 text-lg not-italic leading-relaxed">
            {site.address.street}
            <br />
            {site.address.area}, {site.address.city}
          </address>
          <OpenStatus className="mt-6 text-sm text-stone" />
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href={site.address.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="eyebrow inline-flex h-12 items-center rounded-full bg-brass px-7 text-ink transition-colors duration-300 hover:bg-ivory"
            >
              Open in Google Maps
            </a>
            <ButtonLink href="/contact" variant="outline">
              Reserve a table
            </ButtonLink>
          </div>
        </div>
        <div className="md:col-span-5 md:col-start-8 md:pt-4">
          <p className="eyebrow text-stone">Opening hours</p>
          <HoursList className="mt-3" />
          <p className="mt-6 text-xs leading-relaxed text-stone">
            Last orders 45 minutes before closing. All times are Lagos time (WAT).
          </p>
        </div>
      </section>

      <div className="relative h-[50svh] min-h-[20rem]">
        <Image src={photos.bar.src} alt={photos.bar.alt} fill sizes="100vw" className="object-cover" />
      </div>

      <section className="container-page py-28 md:py-36">
        <h2 className="reveal text-[clamp(2.4rem,5vw,4.25rem)] leading-none">Good to know</h2>
        <dl className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {details.map((d) => (
            <div key={d.title} className="reveal border-t border-line pt-6">
              <dt className="eyebrow text-brass">{d.title}</dt>
              <dd className="mt-4 text-[15px] leading-[1.8] text-stone">{d.body}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
