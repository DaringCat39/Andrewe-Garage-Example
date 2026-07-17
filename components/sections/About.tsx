import Image from "next/image";
import { site } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="overflow-hidden border-y border-border bg-surface py-20 sm:py-28 lg:py-32"
    >
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          <div data-reveal="scale" className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-dark">
              <Image
                src="/images/workshop-team.png"
                alt="Two mechanics reviewing a vehicle inspection in the workshop"
                fill
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="object-cover transition duration-700 hover:scale-[1.025]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/55 via-transparent to-transparent" />
            </div>
            <div className="absolute -bottom-6 right-4 max-w-64 rounded-2xl bg-lime p-5 text-dark shadow-xl sm:right-8 sm:p-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em]">
                Our approach
              </p>
              <p className="mt-2 text-sm font-semibold leading-relaxed">
                Inspect carefully. Explain clearly. Agree the work before we
                begin.
              </p>
            </div>
          </div>

          <div data-reveal="up">
            <SectionHeading
              id="about-heading"
              eyebrow="About Andrew's Garage"
              title="An independent workshop that keeps things straightforward."
              description="Vehicle problems are stressful enough without vague answers or unexpected work. We built our approach around making every stage easier to understand."
            />

            <div className="mt-9 space-y-5 text-base leading-relaxed text-muted sm:text-lg">
              <p>
                At {site.name}, we look after everyday cars and light commercial
                vehicles with the same methodical care—whether they are in for a
                routine service or a fault that has been difficult to pin down.
              </p>
              <p>
                We start by listening, inspect the vehicle properly and explain
                the findings in plain English. If more work is needed, we agree
                it with you first. That honest, no-drama approach is why drivers
                choose to come back.
              </p>
              <p>
                Good garage work is in the detail: using the right process,
                keeping the workshop organised and never rushing the final
                checks before a vehicle goes back on the road.
              </p>
            </div>

            <div className="mt-9 grid gap-3 sm:grid-cols-2">
              {[
                "Clear advice before repairs",
                "Careful checks after the work",
                "Direct contact with the workshop",
                "Practical options for your vehicle",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground"
                >
                  <span
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/10 text-xs text-accent"
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-9">
              <Button href="#contact" variant="secondary">
                Talk to the workshop
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
