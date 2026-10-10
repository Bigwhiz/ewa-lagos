import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink, SectionIntro } from "@/components/ui";
import { photos } from "@/content/photos";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Ẹwà began as Sunday lunches in a family kitchen in Surulere. Today it is a forty-two seat dining room in Ikoyi cooking Nigerian food with fine-dining care.",
  alternates: { canonical: "/about" },
};

const principles = [
  {
    title: "Sourced close to home",
    body: "Peppers and leaves from two family farms in Epe, catfish and croaker from Makoko and Badagry at dawn, rice from Ofada growers we've bought from since the beginning.",
  },
  {
    title: "Slow where it matters",
    body: "Our ata dindin is fried down for four hours. Stocks are built overnight. The jollof is smoked over firewood, the way it tastes at the best parties.",
  },
  {
    title: "Served like an occasion",
    body: "Linen, real glassware and a team that knows every plate. Whether you're here for a quiet lunch or ordering dinner home, it should feel looked after.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="container-page grid gap-14 pt-36 pb-24 md:grid-cols-12 md:pt-48 md:pb-32">
        <div className="md:col-span-6">
          <p className="eyebrow text-brass">Our story</p>
          <h1 className="mt-6 text-[clamp(3rem,7vw,6rem)] leading-[0.95] font-light">
            It started with <em className="text-brass">Sunday lunch</em>
          </h1>
        </div>
        <div className="space-y-6 text-[15px] leading-[1.85] text-stone md:col-span-5 md:col-start-8 md:pt-24">
          <p>
            For years, Sunday lunch at our family home in Surulere ran from two in the afternoon until
            the generator went off. There was always egusi, always a pot of jollof that someone had
            stayed up to smoke, and always one more guest than chairs.
          </p>
          <p>
            Head chef Ìfẹ́olúwa Adébáyọ̀ trained in London and Lyon and spent nine years cooking
            French and Japanese food. She came home in 2019 wanting to give the food she grew up on
            the same care. Ẹwà is that idea: Nigerian recipes treated as fine dining, served next to
            the international dishes Lagos loves.
          </p>
        </div>
      </section>

      <div className="relative h-[60svh] min-h-[22rem] md:h-[80svh]">
        <Image src={photos.pass.src} alt={photos.pass.alt} fill sizes="100vw" className="object-cover" />
      </div>

      <section className="container-page py-28 md:py-36">
        <SectionIntro eyebrow="How we cook" title="Three things we won't compromise on" className="reveal max-w-2xl" />
        <ol className="mt-16 grid gap-12 md:grid-cols-3 md:gap-10">
          {principles.map((p, i) => (
            <li key={p.title} className="reveal border-t border-line pt-8">
              <span className="font-display text-xl text-brass">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-4 text-3xl leading-tight">{p.title}</h3>
              <p className="mt-4 text-[15px] leading-[1.8] text-stone">{p.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="grid bg-ink-2 md:grid-cols-2">
        <div className="relative min-h-[26rem] md:order-2 md:min-h-[40rem]">
          <Image src={photos.chef.src} alt={photos.chef.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        </div>
        <div className="flex items-center">
          <div className="reveal px-[clamp(1rem,6vw,6rem)] py-20">
            <SectionIntro eyebrow="Private dining" title="A room of your own">
              <p>
                The private room seats up to twenty-four at one long table. Chef designs a menu with
                you, from a six-course tasting to a family-style feast, and our team looks after
                everything from flowers to the playlist.
              </p>
            </SectionIntro>
            <div className="mt-10">
              <ButtonLink href="/contact">Enquire about an event</ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
