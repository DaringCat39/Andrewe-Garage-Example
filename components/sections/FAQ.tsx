import { faqs } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function FAQ() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="border-y border-border bg-surface-muted py-20 sm:py-28"
    >
      <Container>
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
          <div data-reveal="up" className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading
              id="faq-heading"
              eyebrow="Frequently asked"
              title="A few useful answers before you book."
              description="If your question is not covered, call the workshop. A quick conversation is often the easiest way to point you in the right direction."
            />
          </div>

          <div
            data-reveal="up"
            className="divide-y divide-border border-y border-border"
          >
            {faqs.map((faq, index) => (
              <details
                key={faq.question}
                className="group py-1"
                open={index === 0 ? true : undefined}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-left text-lg font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40">
                  {faq.question}
                  <span className="relative h-8 w-8 shrink-0 rounded-full border border-border bg-surface" aria-hidden="true">
                    <span className="absolute left-1/2 top-1/2 h-px w-3 -translate-x-1/2 -translate-y-1/2 bg-foreground" />
                    <span className="absolute left-1/2 top-1/2 h-3 w-px -translate-x-1/2 -translate-y-1/2 bg-foreground transition-transform group-open:rotate-90 group-open:opacity-0" />
                  </span>
                </summary>
                <div className="faq-answer">
                  <div>
                    <p className="max-w-2xl pb-6 pr-12 text-sm leading-relaxed text-muted sm:text-base">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
