"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { navLinks, site } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span className="relative block h-5 w-6" aria-hidden="true">
      <span
        className={`absolute left-0 top-1 h-0.5 w-6 bg-foreground transition-transform duration-300 ${
          open ? "translate-y-1.5 rotate-45" : ""
        }`}
      />
      <span
        className={`absolute left-0 top-2.5 h-0.5 w-6 bg-foreground transition-opacity duration-300 ${
          open ? "opacity-0" : ""
        }`}
      />
      <span
        className={`absolute left-0 top-4 h-0.5 w-6 bg-foreground transition-transform duration-300 ${
          open ? "-translate-y-1.5 -rotate-45" : ""
        }`}
      />
    </span>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeHref, setActiveHref] = useState("");

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  useEffect(() => {
    const sections = navLinks
      .map((link) => document.querySelector<HTMLElement>(link.href))
      .filter((section): section is HTMLElement => Boolean(section));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) setActiveHref(`#${visible.target.id}`);
      },
      {
        rootMargin: "-30% 0px -58% 0px",
        threshold: 0,
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const closeMenu = () => setOpen(false);

  return (
    <header
      id="top"
      className="sticky top-0 z-50 border-b border-border/75 bg-background/92 backdrop-blur-xl"
    >
      <div className="bg-dark text-white">
        <Container className="flex min-h-8 items-center justify-center text-[10px] font-semibold uppercase tracking-[0.13em] text-white/65 sm:justify-between">
          <p className="hidden sm:block">{site.hours}</p>
          <a
            href={site.phoneHref}
            className="py-2 transition-colors hover:text-lime focus-visible:text-lime"
          >
            Call the workshop · {site.phone}
          </a>
        </Container>
      </div>

      <Container as="nav" ariaLabel="Main navigation">
        <div className="flex h-16 items-center justify-between lg:h-[4.5rem]">
          <Link
            href="#top"
            className="group flex items-center gap-3 leading-none"
            onClick={closeMenu}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-xs font-black tracking-tight text-white transition-transform duration-300 group-hover:-rotate-6">
              AG
            </span>
            <span className="flex flex-col">
              <span className="text-base font-bold tracking-[-0.025em] text-foreground sm:text-lg">
                {site.name}
              </span>
              <span className="mt-1 hidden text-[9px] font-semibold uppercase tracking-[0.18em] text-muted sm:block">
                {site.tagline}
              </span>
            </span>
          </Link>

          <ul className="hidden items-center gap-6 xl:flex">
            {navLinks.map((link) => {
              const active = activeHref === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "location" : undefined}
                    className={`relative py-2 text-sm font-semibold transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:bg-accent after:transition-transform ${
                      active
                        ? "text-foreground after:scale-x-100"
                        : "text-muted after:scale-x-0 hover:text-foreground hover:after:scale-x-100"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="hidden xl:block">
            <Button href="#contact">Book a visit</Button>
          </div>

          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-border bg-surface p-2 transition hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((previous) => !previous)}
          >
            <MenuIcon open={open} />
          </button>
        </div>
      </Container>

      {open && (
        <div
          id="mobile-menu"
          className="animate-menu-in absolute inset-x-0 top-full max-h-[calc(100svh-6rem)] overflow-y-auto border-t border-border bg-background shadow-2xl xl:hidden"
        >
          <Container className="py-6">
            <ul className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center justify-between rounded-xl px-3 py-3 text-lg font-semibold text-foreground transition hover:bg-surface"
                    onClick={closeMenu}
                  >
                    {link.label}
                    <span className="text-accent" aria-hidden="true">
                      ↘
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 grid gap-3 border-t border-border pt-6 sm:grid-cols-2">
              <Button
                href="#contact"
                className="w-full"
                onClick={closeMenu}
              >
                Book a visit
              </Button>
              <Button
                href={site.phoneHref}
                variant="secondary"
                className="w-full"
                onClick={closeMenu}
              >
                Call {site.phone}
              </Button>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
