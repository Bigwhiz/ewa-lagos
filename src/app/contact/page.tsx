import type { Metadata } from "next";
import { ReservationForm } from "@/components/reservation-form";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Reserve & Contact",
  description: "Book a table at Ẹwà in Ikoyi, Lagos, or get in touch about private dining and events.",
  alternates: { canonical: "/contact" },
};

const contacts = [
  { label: "WhatsApp & phone", value: site.phoneDisplay, href: `https://wa.me/${site.whatsapp}` },
  { label: "Email", value: site.email, href: `mailto:${site.email}` },
  { label: "Private dining & events", value: `events@${site.email.split("@")[1]}`, href: `mailto:events@${site.email.split("@")[1]}` },
];

export default function ContactPage() {
  return (
    <section className="container-page grid gap-16 pt-36 pb-28 md:grid-cols-12 md:pt-48 md:pb-36">
      <div className="md:col-span-5">
        <p className="eyebrow text-brass">Reserve</p>
        <h1 className="mt-6 text-[clamp(3rem,7vw,6rem)] leading-[0.95] font-light">
          Keep a table <em className="text-brass">for you</em>
        </h1>
        <p className="mt-8 max-w-sm text-[15px] leading-[1.75] text-stone">
          Tell us when you&rsquo;d like to come and we&rsquo;ll confirm on WhatsApp. For same-day
          bookings, it&rsquo;s quickest to call.
        </p>

        <dl className="mt-14 divide-y divide-line border-y border-line">
          {contacts.map((c) => (
            <div key={c.label} className="py-5">
              <dt className="eyebrow text-stone">{c.label}</dt>
              <dd className="mt-2">
                <a href={c.href} className="font-display text-2xl transition-colors hover:text-brass">
                  {c.value}
                </a>
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="md:col-span-6 md:col-start-7 md:pt-20">
        <div className="border border-line bg-ink-2 p-[clamp(1.5rem,4vw,3rem)]">
          <h2 className="text-4xl">Request a booking</h2>
          <div className="mt-10">
            <ReservationForm />
          </div>
        </div>
      </div>
    </section>
  );
}
