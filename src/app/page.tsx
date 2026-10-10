import Image from "next/image";
import { OpenStatus } from "@/components/open-status";
import { SignatureCard } from "@/components/signature-card";
import { HoursList } from "@/components/site-footer";
import { ButtonLink, SectionIntro } from "@/components/ui";
import { signatureDishes } from "@/content/menu";
import { photos } from "@/content/photos";
import { site } from "@/content/site";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden">
        <Image
          src={photos.heroPlate.src}
          alt={photos.heroPlate.alt}
          fill
          preload
          sizes="100vw"
          className="-z-10 object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(18_16_14/0.6)_0%,rgb(18_16_14/0.2)_30%,rgb(18_16_14/0.82)_68%,#12100e_100%),linear-gradient(90deg,rgb(18_16_14/0.55)_0%,transparent_60%)]"
        />
        <div className="container-page pt-40 pb-16 md:pb-24">
          <p className="eyebrow text-brass">Ikoyi · Lagos</p>
          <h1 className="mt-6 max-w-4xl text-[clamp(3.25rem,9vw,8.5rem)] leading-[0.92] font-light">
            The food of home, <em className="text-brass/95">plated</em> with intention.
          </h1>
          <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <p className="max-w-md text-[15px] leading-[1.75] text-ivory/80">
              Nigerian recipes and international technique at one table. Lunch and dinner,
              Tuesday to Sunday, or ordered to your door on WhatsApp.
            </p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/menu">Order from the menu</ButtonLink>
              <ButtonLink href="/contact" variant="outline">
                Reserve a table
              </ButtonLink>
            </div>
          </div>
          <OpenStatus className="mt-12 text-xs tracking-wide text-ivory/70" />
        </div>
      </section>

      {/* Meaning */}
      <section className="container-page grid gap-12 py-28 md:grid-cols-12 md:py-40">
        <p className="reveal font-display text-[clamp(5rem,16vw,13rem)] leading-[0.8] text-brass/90 md:col-span-5">
          {site.name}
        </p>
        <div className="reveal md:col-span-6 md:col-start-7 md:pt-6">
          <p className="eyebrow text-stone">/ɛ̀.wà/ · Yoruba · noun</p>
          <p className="mt-6 font-display text-[clamp(1.75rem,3.2vw,2.6rem)] leading-[1.2]">
            Beauty. The kind you notice in a well-set table, a slow-cooked sauce, a room that
            makes you stay for one more glass.
          </p>
          <p className="mt-8 max-w-lg text-[15px] leading-[1.8] text-stone">
            We cook the dishes we grew up on with the patience of a fine-dining kitchen: peppers
            fried down for hours, stocks built overnight, produce from farms in Epe and Ogun. Then
            we set them beside the classics of the world, so a table can share egusi and a dry-aged
            ribeye without anyone having to choose.
          </p>
          <div className="mt-10">
            <ButtonLink href="/about" variant="outline">
              Read our story
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Signatures */}
      <section className="border-t border-line py-28 md:py-36">
        <div className="container-page">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <SectionIntro eyebrow="Signatures" title={<>Plates we&rsquo;re known for</>} className="reveal">
              Every dish can be ordered for pickup or delivery. Add what you like and we&rsquo;ll
              prepare a WhatsApp message with your order.
            </SectionIntro>
            <ButtonLink href="/menu" variant="outline">
              The full menu
            </ButtonLink>
          </div>
          <div className="mt-16 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {signatureDishes.map((dish) => (
              <div key={dish.id} className="reveal">
                <SignatureCard dish={dish} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The room */}
      <section className="relative isolate overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="relative min-h-[28rem] md:min-h-[44rem]">
            <Image
              src={photos.diningRoom.src}
              alt={photos.diningRoom.alt}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="flex items-center bg-ink-2">
            <div className="reveal px-[clamp(1rem,6vw,6rem)] py-20">
              <SectionIntro eyebrow="The room" title="Forty-two seats, one long evening">
                <p>
                  Low brass light, deep banquettes and a kitchen you can watch from the bar. We take
                  bookings for two to eight, and the private room seats up to twenty-four for
                  birthdays, launches and long family lunches.
                </p>
              </SectionIntro>
              <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-line pt-8">
                {[
                  ["42", "Seats"],
                  ["24", "Private room"],
                  ["6", "Courses, tasting menu"],
                ].map(([value, label]) => (
                  <div key={label}>
                    <dt className="sr-only">{label}</dt>
                    <dd>
                      <span className="block font-display text-5xl text-brass">{value}</span>
                      <span className="mt-2 block text-xs text-stone">{label}</span>
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="mt-12">
                <ButtonLink href="/contact">Reserve a table</ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visit */}
      <section className="container-page grid gap-14 py-28 md:grid-cols-12 md:py-36">
        <SectionIntro eyebrow="Visit" title="Find us in Ikoyi" className="reveal md:col-span-5">
          <address className="not-italic">
            {site.address.street}
            <br />
            {site.address.area}, {site.address.city}
          </address>
          <p className="mt-4">Valet parking from 6pm. Smart casual, please.</p>
        </SectionIntro>
        <div className="reveal md:col-span-6 md:col-start-7">
          <HoursList />
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="/visit" variant="outline">
              Directions &amp; details
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
