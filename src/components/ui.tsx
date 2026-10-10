import Link from "next/link";
import { DIETARY_TAGS, type DietaryTag } from "@/content/menu";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "outline" | "outline-dark";
};

const variants = {
  solid: "bg-brass text-ink hover:bg-ivory",
  outline: "border border-ivory/30 text-ivory hover:border-brass hover:text-brass",
  "outline-dark": "border border-ink/25 text-ink hover:border-brass-deep hover:text-brass-deep",
};

export function ButtonLink({ href, children, variant = "solid" }: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={`eyebrow inline-flex h-12 items-center justify-center rounded-full px-7 transition-colors duration-300 ${variants[variant]}`}
    >
      {children}
    </Link>
  );
}

export function SectionIntro({
  eyebrow,
  title,
  children,
  tone = "dark",
  className = "",
}: {
  eyebrow: string;
  title: React.ReactNode;
  children?: React.ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <div className={className}>
      <p className={`eyebrow ${tone === "dark" ? "text-brass" : "text-brass-deep"}`}>{eyebrow}</p>
      <h2 className="mt-5 text-[clamp(2.4rem,5vw,4.25rem)] leading-[1.02]">{title}</h2>
      {children && (
        <div className={`mt-6 max-w-xl text-[15px] leading-[1.75] ${tone === "dark" ? "text-stone" : "text-stone-dark"}`}>
          {children}
        </div>
      )}
    </div>
  );
}

export function DietaryTags({ tags, tone = "dark" }: { tags: DietaryTag[]; tone?: "dark" | "light" }) {
  if (tags.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Dietary information">
      {tags.map((tag) => (
        <li
          key={tag}
          className={`rounded-full border px-2 py-0.5 text-[0.625rem] font-semibold tracking-[0.12em] ${
            tone === "dark" ? "border-line text-stone" : "border-line-dark text-stone-dark"
          }`}
        >
          <abbr title={DIETARY_TAGS[tag].label} className="no-underline">
            {DIETARY_TAGS[tag].short}
          </abbr>
          <span className="sr-only"> ({DIETARY_TAGS[tag].label})</span>
        </li>
      ))}
    </ul>
  );
}
