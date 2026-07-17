"use client";

import { useEffect, useRef, useState } from "react";
import { services } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [enhanced, setEnhanced] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const progress = progressRef.current;

    if (!section || !sticky || !viewport || !track || !progress) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    if (reducedMotion.matches) return;

    let travelDistance = 0;
    let animationFrame = 0;

    const updatePosition = () => {
      animationFrame = 0;
      const stickyTop = Number.parseFloat(
        window.getComputedStyle(sticky).top,
      );
      const start = section.offsetTop - stickyTop;
      const end = section.offsetTop + section.offsetHeight - window.innerHeight;
      const scrollRange = Math.max(1, end - start);
      const scrollProgress = Math.min(
        1,
        Math.max(0, (window.scrollY - start) / scrollRange),
      );

      track.style.transform = `translate3d(${-travelDistance * scrollProgress}px, 0, 0)`;
      progress.style.transform = `scaleX(${scrollProgress})`;

      const nextIndex = Math.min(
        services.length - 1,
        Math.round(scrollProgress * (services.length - 1)),
      );
      if (nextIndex !== activeIndexRef.current) {
        activeIndexRef.current = nextIndex;
        setActiveIndex(nextIndex);
      }
    };

    const requestPositionUpdate = () => {
      if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(updatePosition);
      }
    };

    const measure = () => {
      travelDistance = Math.max(0, track.scrollWidth - viewport.clientWidth);
      const stickyTop = Number.parseFloat(
        window.getComputedStyle(sticky).top,
      );

      if (
        travelDistance > 0 &&
        !section.classList.contains("is-enhanced")
      ) {
        setEnhanced(true);
        window.requestAnimationFrame(measure);
        return;
      }

      section.style.height = `${Math.max(
        window.innerHeight * 1.2,
        window.innerHeight + travelDistance + stickyTop,
      )}px`;
      requestPositionUpdate();
    };

    measure();
    window.addEventListener("scroll", requestPositionUpdate, { passive: true });
    window.addEventListener("resize", measure);

    return () => {
      window.removeEventListener("scroll", requestPositionUpdate);
      window.removeEventListener("resize", measure);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      section.style.height = "";
      track.style.transform = "";
      progress.style.transform = "";
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      aria-labelledby="services-heading"
      className={`services-scroll-section relative bg-background ${
        enhanced ? "is-enhanced" : ""
      }`}
    >
      <div
        ref={stickyRef}
        className="services-sticky flex min-h-[calc(100svh-6.1rem)] items-center overflow-hidden py-8 sm:py-10"
      >
        <Container>
          <div className="grid items-end gap-6 sm:grid-cols-[1fr_auto]">
            <div data-reveal="up">
              <SectionHeading
                id="services-heading"
                eyebrow="Workshop services"
                title="One workshop for the jobs that keep you moving."
                description="Keep scrolling to move through every service. Scroll back up at any point to move through them in reverse."
              />
            </div>

            <div className="hidden items-center gap-3 pb-1 text-sm font-semibold text-muted sm:flex">
              <span className="text-accent" aria-hidden="true">
                ↓
              </span>
              Scroll to explore
            </div>
          </div>

          <div className="mt-8 sm:mt-10">
            <div
              ref={viewportRef}
              className="services-carousel-viewport -mx-5 overflow-x-auto px-5 pb-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
            >
              <ol
                ref={trackRef}
                aria-label="Garage services"
                className="services-carousel-track flex w-max gap-4 pr-5 sm:gap-5 sm:pr-6 lg:gap-6 lg:pr-8"
              >
                {services.map((service, index) => {
                  const isActive = activeIndex === index;
                  const isDark = index % 3 === 0;

                  return (
                    <li
                      key={service.title}
                      aria-current={isActive ? "step" : undefined}
                      className={`services-card group relative flex min-h-[18rem] w-[82vw] max-w-[22rem] shrink-0 flex-col justify-between overflow-hidden rounded-[1.75rem] border p-6 transition-[transform,border-color,box-shadow] duration-500 sm:w-[26rem] sm:max-w-none sm:p-8 lg:w-[28rem] ${
                        isDark
                          ? "border-dark bg-dark text-white"
                          : "border-border bg-surface text-foreground"
                      } ${
                        isActive
                          ? "-translate-y-2 border-accent shadow-2xl shadow-dark/12"
                          : "translate-y-0"
                      }`}
                    >
                      <div
                        className={`absolute -right-12 -top-12 h-40 w-40 rounded-full transition-transform duration-700 group-hover:scale-125 ${
                          isDark ? "bg-lime/10" : "bg-accent/8"
                        }`}
                        aria-hidden="true"
                      />

                      <div className="relative flex items-start justify-between gap-6">
                        <span
                          className={`flex h-11 w-11 items-center justify-center rounded-full text-xs font-bold ${
                            isDark
                              ? "bg-lime text-dark"
                              : "bg-accent text-white"
                          }`}
                          aria-hidden="true"
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={`text-2xl transition-transform duration-300 group-hover:translate-x-1 ${
                            isDark ? "text-lime" : "text-accent"
                          }`}
                          aria-hidden="true"
                        >
                          ↗
                        </span>
                      </div>

                      <div className="relative mt-12">
                        <p
                          className={`text-xs font-semibold uppercase tracking-[0.18em] ${
                            isDark ? "text-lime" : "text-accent"
                          }`}
                        >
                          Workshop service
                        </p>
                        <h3 className="mt-3 text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
                          {service.title}
                        </h3>
                        <p
                          className={`mt-4 text-sm leading-relaxed sm:text-base ${
                            isDark ? "text-dark-muted" : "text-muted"
                          }`}
                        >
                          {service.description}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>

            <div className="mt-5 flex items-center gap-5 sm:mt-7">
              <div className="h-px flex-1 overflow-hidden bg-border">
                <span
                  ref={progressRef}
                  className="block h-full origin-left scale-x-0 bg-accent"
                />
              </div>
              <p
                className="min-w-16 text-right text-xs font-bold tracking-[0.15em] text-muted"
                aria-live="polite"
              >
                <span className="text-foreground">
                  {String(activeIndex + 1).padStart(2, "0")}
                </span>
                <span className="mx-1 text-border">/</span>
                {String(services.length).padStart(2, "0")}
              </p>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
