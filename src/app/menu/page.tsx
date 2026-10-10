import type { Metadata } from "next";
import { QuantityControl } from "@/components/order/quantity-control";
import { DietaryTags } from "@/components/ui";
import { DIETARY_TAGS, dishesIn, menu } from "@/content/menu";
import { site } from "@/content/site";
import { formatNaira } from "@/lib/money";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Smoked party jollof, egusi with stone bass, dry-aged ribeye with suya butter. Order Ẹwà's full menu for pickup or delivery in Lagos on WhatsApp.",
  alternates: { canonical: "/menu" },
};

export default function MenuPage() {
  return (
    <>
      <section className="container-page pt-36 pb-16 md:pt-48 md:pb-20">
        <p className="eyebrow text-brass">The menu</p>
        <h1 className="mt-6 max-w-3xl text-[clamp(3rem,7vw,6rem)] leading-[0.95] font-light">
          Lunch, dinner, or <em className="text-brass">to your door</em>
        </h1>
        <p className="mt-8 max-w-lg text-[15px] leading-[1.75] text-stone">
          Add dishes as you browse. When you&rsquo;re ready, we&rsquo;ll open WhatsApp with your order
          written out, and our team will confirm timing and payment.
        </p>
      </section>

      <div className="bg-paper text-ink">
        <nav aria-label="Menu sections" className="sticky top-18 z-20 border-b border-line-dark bg-paper/95 backdrop-blur md:top-20">
          <ul className="container-page flex gap-7 overflow-x-auto py-4 [scrollbar-width:none]">
            {menu.categories.map((c) => (
              <li key={c.id} className="shrink-0">
                <a href={`#${c.id}`} className="eyebrow text-stone-dark transition-colors hover:text-ink">
                  {c.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="container-page divide-y divide-line-dark">
          {menu.categories.map((category) => (
            <section
              key={category.id}
              id={category.id}
              aria-labelledby={`${category.id}-title`}
              className="grid scroll-mt-36 gap-8 py-16 md:grid-cols-12 md:gap-8 md:py-24"
            >
              <header className="md:col-span-4">
                <div className="md:sticky md:top-40">
                  <h2 id={`${category.id}-title`} className="text-[clamp(2.25rem,4vw,3.5rem)] leading-none">
                    {category.name}
                  </h2>
                  {category.note && <p className="mt-4 max-w-xs text-sm leading-relaxed text-stone-dark">{category.note}</p>}
                </div>
              </header>

              <ul className="md:col-span-8 md:col-start-5">
                {dishesIn(category.id).map((dish) => (
                  <li key={dish.id} className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-3 border-b border-line-dark py-7 first:pt-0 last:border-0">
                    <div className="flex items-baseline gap-4">
                      <h3 className="text-[1.6rem] leading-tight">{dish.name}</h3>
                      {dish.signature && <span className="eyebrow hidden text-brass-deep sm:inline">Signature</span>}
                    </div>
                    <p className="pt-1 text-right text-[15px] font-medium tabular-nums">{formatNaira(dish.price)}</p>
                    <p className="max-w-lg text-sm leading-relaxed text-stone-dark">{dish.description}</p>
                    <div className="row-span-2 self-end justify-self-end">
                      <QuantityControl dishId={dish.id} dishName={dish.name} tone="light" />
                    </div>
                    <DietaryTags tags={dish.tags} tone="light" />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <aside className="container-page border-t border-line-dark py-12">
          <dl className="flex flex-wrap gap-x-8 gap-y-3 text-xs text-stone-dark">
            {Object.values(DIETARY_TAGS).map((t) => (
              <div key={t.short} className="flex gap-2">
                <dt className="font-semibold text-ink">{t.short}</dt>
                <dd>{t.label}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 max-w-2xl text-xs leading-relaxed text-stone-dark">
            {site.serviceNote} Please tell us about any allergies when you order. Our kitchen handles
            nuts, gluten, shellfish and dairy, so we can&rsquo;t promise any dish is entirely free of them.
          </p>
        </aside>
      </div>
    </>
  );
}
