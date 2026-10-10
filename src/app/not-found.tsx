import { ButtonLink } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="container-page flex min-h-[80svh] flex-col items-start justify-center pt-32 pb-20">
      <p className="eyebrow text-brass">404</p>
      <h1 className="mt-6 max-w-2xl text-[clamp(3rem,7vw,6rem)] leading-[0.95] font-light">
        This table <em className="text-brass">isn&rsquo;t set</em>
      </h1>
      <p className="mt-8 max-w-md text-[15px] leading-[1.75] text-stone">
        The page you were looking for has moved or never existed. The menu, at least, is right where
        we left it.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <ButtonLink href="/menu">See the menu</ButtonLink>
        <ButtonLink href="/" variant="outline">
          Back to home
        </ButtonLink>
      </div>
    </section>
  );
}
