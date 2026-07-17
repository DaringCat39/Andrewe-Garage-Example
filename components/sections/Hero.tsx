import Image from "next/image";
import { site } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function Hero() {
  return (
    <section
      data-hero
      aria-labelledby="hero-heading"
      className="relative isolate flex min-h-[calc(100svh-6.5rem)] items-end overflow-hidden bg-dark text-white"
    >
      <div className="hero-media absolute inset-0 -z-20 will-change-transform">
        <Image
          src="/images/workshop-hero.png"
          alt="Modern independent workshop with mechanics working on a vehicle"
          fill
          loading="eager"
          sizes="100vw"
          className="object-cover object-[66%_center]"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(13,19,17,0.97)_0%,rgba(13,19,17,0.82)_42%,rgba(13,19,17,0.2)_78%,rgba(13,19,17,0.38)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgba(13,19,17,0.88)_0%,transparent_44%)]" />
      <div className="absolute left-[8%] top-20 -z-10 h-64 w-64 rounded-full bg-accent/15 blur-3xl" />

      <Container className="relative flex min-h-[calc(100svh-6.5rem)] flex-col justify-end py-10 sm:py-14 lg:py-16">
        <div className="hero-copy max-w-3xl origin-left will-change-transform">
          <div className="mb-7 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.17em] text-white/72">
            <span className="h-2 w-2 rounded-full bg-lime shadow-[0_0_18px_rgba(216,239,112,0.8)]" />
            Independent garage
            <span className="text-white/25">/</span>
            {site.shortAddress}
          </div>
          <h1
            id="hero-heading"
            className="max-w-3xl text-5xl font-semibold leading-[0.96] tracking-[-0.06em] text-white sm:text-6xl lg:text-[5.5rem]"
          >
            Proper motor care.
            <span className="block font-serif font-normal italic text-lime">
              Straight answers.
            </span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-relaxed text-white/72 sm:text-lg">
            MOT testing, servicing, diagnostics and mechanical repairs from a
            local workshop that keeps the work—and the price—clear from the
            start.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button href="#contact">Book a visit</Button>
            <Button href={site.phoneHref} variant="secondary">
              Call {site.phone}
            </Button>
          </div>
        </div>

        <div
          data-reveal="up"
          className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/12 bg-white/12 backdrop-blur-md sm:grid-cols-3 lg:mt-16 lg:max-w-4xl"
        >
          {[
            ["01", "MOT & servicing", "Routine care, clearly explained"],
            ["02", "Diagnostics & repairs", "Find the fault, then fix it"],
            ["03", "Local workshop", site.shortAddress],
          ].map(([number, title, text]) => (
            <div key={number} className="bg-dark/65 p-5 sm:p-6">
              <span className="text-[10px] font-bold text-lime">{number}</span>
              <p className="mt-3 text-sm font-semibold text-white">{title}</p>
              <p className="mt-1 text-xs leading-relaxed text-white/50">{text}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
