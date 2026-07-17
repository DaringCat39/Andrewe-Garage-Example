import { reasons } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function WhyChooseUs() {
  return (
    <section
      id="why-us"
      aria-labelledby="why-us-heading"
      className="bg-background py-20 sm:py-28 lg:py-32"
    >
      <Container>
        <div className="overflow-hidden rounded-[2rem] bg-dark px-6 py-14 sm:px-10 sm:py-20 lg:px-16">
          <div
            data-reveal="up"
            className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
          >
            <SectionHeading
              id="why-us-heading"
              eyebrow="Why choose us"
              title="The standard you should expect from your garage."
              description="Clear decisions, careful work and a workshop that respects your time as much as your vehicle."
              inverted
            />
            <p className="max-w-sm border-l border-lime/40 pl-5 text-sm leading-relaxed text-dark-muted">
              No hard sell. No unexplained extras. Just a sensible route from
              the first inspection to getting you back on the road.
            </p>
          </div>

          <ol className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {reasons.map((reason, index) => (
              <li
                key={reason.title}
                data-reveal="up"
                data-delay={String(index % 3)}
                className="group min-h-64 bg-dark p-7 transition duration-300 hover:bg-white/[0.045] sm:p-8"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-lime">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-sm text-white/40 transition duration-300 group-hover:rotate-45 group-hover:border-lime/50 group-hover:text-lime"
                    aria-hidden="true"
                  >
                    ↗
                  </span>
                </div>
                <h3 className="mt-10 text-xl font-semibold tracking-[-0.025em] text-white">
                  {reason.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-dark-muted">
                  {reason.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
