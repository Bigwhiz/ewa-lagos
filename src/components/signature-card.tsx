import Image from "next/image";
import type { Dish } from "@/content/menu";
import { formatNaira } from "@/lib/money";
import { QuantityControl } from "./order/quantity-control";
import { DietaryTags } from "./ui";

export function SignatureCard({ dish }: { dish: Dish }) {
  return (
    <article className="group">
      {dish.image && (
        <div className="relative aspect-[4/5] overflow-hidden bg-ink-3">
          <Image
            src={dish.image.src}
            alt={dish.image.alt}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
            className="object-cover transition-transform duration-[1.4s] ease-out-expo group-hover:scale-[1.04] motion-reduce:transition-none"
          />
        </div>
      )}
      <div className="mt-5 flex items-start justify-between gap-4">
        <h3 className="text-[1.65rem] leading-tight">{dish.name}</h3>
        <p className="shrink-0 pt-1.5 text-sm text-brass tabular-nums">{formatNaira(dish.price)}</p>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-stone">{dish.description}</p>
      <div className="mt-5 flex items-center justify-between gap-4">
        <DietaryTags tags={dish.tags} />
        <QuantityControl dishId={dish.id} dishName={dish.name} />
      </div>
    </article>
  );
}
