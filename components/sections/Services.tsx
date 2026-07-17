"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { services } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Services() {
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const activeService = services[activeIndex];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;
        const index = Number((visible.target as HTMLElement).dataset.index);
        if (Number.isFinite(index)) setActiveIndex(index);
      },
      {
        rootMargin: "-28% 0px -48% 0px",
        threshold: [0.15, 0.4, 0.7],
      },
    );

    itemRefs.current.forEach((item) => {
      if (item) observer.observe(item);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="bg-background py-20 sm:py-28 lg:py-32"
    >
      <Container>
        <div data-reveal="up">
          <SectionHeading
            id="services-heading"
            eyebrow="Workshop services"
            title="One workshop for the jobs that keep you moving."
            description="From annual maintenance to difficult faults, we take a methodical approach and keep you informed before any additional work begins."
          />
        </div>

        <div className="mt-14 grid items-start gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
          <div className="lg:sticky lg:top-32">
            <div
              data-reveal="scale"
              className="relative aspect-[5/4] overflow-hidden rounded-[2rem] bg-dark lg:h-[calc(100svh-10rem)] lg:max-h-[44rem] lg:min-h-[34rem] lg:aspect-auto"
            >
              <Image
                key={activeService.image}
                src={activeService.image}
                alt={activeService.imageAlt}
                fill
                sizes="(min-width: 1024px) 48vw, 100vw"
                className="animate-image-in object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/95 via-dark/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7 sm:p-9">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lime">
                  In focus
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">
                  {activeService.title}
                </p>
              </div>
            </div>
          </div>

          <ol className="divide-y divide-border border-y border-border">
            {services.map((service, index) => (
              <li
                key={service.title}
                ref={(element) => {
                  itemRefs.current[index] = element;
                }}
                data-index={index}
                data-reveal="up"
                data-delay={String(index % 4)}
                onMouseEnter={() => setActiveIndex(index)}
                className={`group relative py-7 transition-colors sm:py-9 ${
                  activeIndex === index ? "text-foreground" : "text-muted"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                  aria-label={`Show ${service.title}`}
                  aria-current={activeIndex === index ? "true" : undefined}
                  className="flex w-full items-start gap-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                >
                  <span
                    className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                      activeIndex === index
                        ? "bg-accent text-white"
                        : "border border-border text-muted group-hover:border-accent group-hover:text-accent"
                    }`}
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1">
                    <span className="flex items-center justify-between gap-5">
                      <span className="text-xl font-semibold tracking-[-0.025em] sm:text-2xl">
                        {service.title}
                      </span>
                      <span
                        className={`text-xl transition duration-300 ${
                          activeIndex === index
                            ? "translate-x-0 text-accent"
                            : "-translate-x-2 text-muted/40 group-hover:translate-x-0"
                        }`}
                        aria-hidden="true"
                      >
                        ↗
                      </span>
                    </span>
                    <span className="mt-3 block max-w-xl text-sm leading-relaxed text-muted sm:text-base">
                      {service.description}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
