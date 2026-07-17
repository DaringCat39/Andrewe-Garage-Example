import { site } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/sections/ContactForm";

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="bg-background py-20 sm:py-28 lg:py-32"
    >
      <Container>
        <div
          data-reveal="up"
          className="grid gap-3 overflow-hidden rounded-[2rem] bg-accent p-3 lg:grid-cols-[0.85fr_1.15fr]"
        >
          <div className="p-6 sm:p-10 lg:p-13">
            <SectionHeading
              id="contact-heading"
              eyebrow="Contact"
              title="Let’s get your vehicle booked in."
              description="Tell us what is happening, what you need and when you are available. We will come back with the clearest next step."
            />

            <address className="mt-10 grid gap-4 not-italic sm:grid-cols-2">
              <a
                href={site.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="group rounded-2xl border border-dark/15 p-5 transition hover:-translate-y-0.5 hover:bg-white/12"
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-dark/55">
                  Workshop
                </span>
                <span className="mt-2 block text-sm font-semibold leading-relaxed text-dark">
                  {site.address}
                </span>
              </a>
              <a
                href={site.phoneHref}
                className="group rounded-2xl border border-dark/15 p-5 transition hover:-translate-y-0.5 hover:bg-white/12"
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-dark/55">
                  Telephone
                </span>
                <span className="mt-2 block text-sm font-semibold text-dark">
                  {site.phone}
                </span>
              </a>
              <a
                href={site.emailHref}
                className="group rounded-2xl border border-dark/15 p-5 transition hover:-translate-y-0.5 hover:bg-white/12"
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-dark/55">
                  Email
                </span>
                <span className="mt-2 block break-all text-sm font-semibold text-dark">
                  {site.email}
                </span>
              </a>
              <div className="rounded-2xl border border-dark/15 p-5">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-dark/55">
                  Opening hours
                </span>
                <span className="mt-2 block text-sm font-semibold leading-relaxed text-dark">
                  {site.hours}
                </span>
              </div>
            </address>
          </div>

          <ContactForm />
        </div>

        <div
          data-reveal="scale"
          className="relative mt-4 h-[22rem] overflow-hidden rounded-[2rem] border border-border bg-surface sm:h-[30rem]"
        >
          <iframe
            title="Map showing Andrew's Garage in Solihull"
            src={site.mapsEmbed}
            className="h-full w-full grayscale-[0.85] contrast-[1.05]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-dark/45 via-transparent to-transparent" />
          <div className="absolute bottom-5 left-5 max-w-xs rounded-2xl bg-dark p-5 text-white shadow-xl sm:bottom-8 sm:left-8 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lime">
              Find the workshop
            </p>
            <p className="mt-2 text-sm leading-relaxed text-dark-muted">
              {site.address}
            </p>
            <a
              href={site.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-lime"
            >
              Open in Google Maps <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
