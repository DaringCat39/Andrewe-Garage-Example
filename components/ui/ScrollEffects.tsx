"use client";

import { useEffect } from "react";

export function ScrollEffects() {
  useEffect(() => {
    const root = document.documentElement;
    const revealElements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      revealElements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    root.classList.add("motion-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.12,
      },
    );

    revealElements.forEach((element) => observer.observe(element));

    let frame = 0;
    const updateHero = () => {
      frame = 0;
      const hero = document.querySelector<HTMLElement>("[data-hero]");
      if (!hero) return;

      const rect = hero.getBoundingClientRect();
      const progress = Math.min(
        1,
        Math.max(0, -rect.top / Math.max(rect.height, 1)),
      );

      root.style.setProperty("--hero-shift", `${progress * 34}px`);
      root.style.setProperty("--hero-scale", String(1.045 - progress * 0.035));
      root.style.setProperty(
        "--hero-copy-opacity",
        String(1 - progress * 0.42),
      );
      root.style.setProperty("--hero-copy-shift", `${progress * -18}px`);
    };

    const requestHeroUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateHero);
    };

    updateHero();
    window.addEventListener("scroll", requestHeroUpdate, { passive: true });
    window.addEventListener("resize", requestHeroUpdate);

    return () => {
      observer.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestHeroUpdate);
      window.removeEventListener("resize", requestHeroUpdate);
      root.classList.remove("motion-ready");
      root.style.removeProperty("--hero-shift");
      root.style.removeProperty("--hero-scale");
      root.style.removeProperty("--hero-copy-opacity");
      root.style.removeProperty("--hero-copy-shift");
    };
  }, []);

  return null;
}
