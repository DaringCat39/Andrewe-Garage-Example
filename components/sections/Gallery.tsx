"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { galleryImages } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Gallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const close = () => {
    setOpenIndex(null);
    window.setTimeout(() => returnFocusRef.current?.focus(), 0);
  };

  const move = (direction: number) => {
    setOpenIndex((current) => {
      if (current === null) return 0;
      return (current + direction + galleryImages.length) % galleryImages.length;
    });
  };

  useEffect(() => {
    if (openIndex === null) return;

    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") move(-1);
      if (event.key === "ArrowRight") move(1);
    };

    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [openIndex]);

  const openImage = (index: number, trigger: HTMLElement) => {
    returnFocusRef.current = trigger;
    setOpenIndex(index);
  };

  return (
    <section
      id="gallery"
      aria-labelledby="gallery-heading"
      className="border-t border-border bg-surface-muted py-20 sm:py-28 lg:py-32"
    >
      <Container>
        <div
          data-reveal="up"
          className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
        >
          <SectionHeading
            id="gallery-heading"
            eyebrow="Inside the workshop"
            title="A closer look at how we work."
            description="A clean, organised workshop gives good technicians the space to inspect carefully, diagnose accurately and finish the job properly."
          />
          <p className="max-w-sm text-sm leading-relaxed text-muted">
            Select any image for a closer view. Use the arrow keys to move
            through the gallery.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          {galleryImages.map((image, index) => (
            <button
              key={image.src}
              type="button"
              data-reveal="scale"
              data-delay={String(index)}
              onClick={(event) => openImage(index, event.currentTarget)}
              className={`group relative overflow-hidden rounded-[1.5rem] bg-dark text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/35 ${
                index === 0
                  ? "min-h-[24rem] sm:col-span-2 sm:min-h-[36rem]"
                  : "min-h-[25rem] sm:min-h-[32rem]"
              }`}
              aria-label={`Open image: ${image.title}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes={
                  index === 0
                    ? "(min-width: 1280px) 80rem, 100vw"
                    : "(min-width: 640px) 50vw, 100vw"
                }
                className={`object-cover transition duration-700 ease-out group-hover:scale-[1.035] ${
                  index === 1 ? "object-[center_28%]" : "object-center"
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/5 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lime">
                  Workshop view
                </p>
                <p className="mt-2 max-w-md text-lg font-semibold text-white sm:text-xl">
                  {image.title}
                </p>
              </div>
            </button>
          ))}
        </div>
      </Container>

      {openIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-dark/96 p-4 backdrop-blur-md sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Workshop image gallery"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) close();
          }}
        >
          <button
            ref={closeButtonRef}
            type="button"
            onClick={close}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-dark text-xl text-white transition hover:rotate-90 hover:border-lime hover:text-lime sm:right-8 sm:top-8"
            aria-label="Close gallery"
          >
            ×
          </button>

          <button
            type="button"
            onClick={() => move(-1)}
            className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-dark/80 text-xl text-white transition hover:border-lime hover:text-lime sm:left-8"
            aria-label="Previous image"
          >
            ←
          </button>

          <div className="relative h-[76svh] w-full max-w-6xl">
            <Image
              src={galleryImages[openIndex].src}
              alt={galleryImages[openIndex].alt}
              fill
              sizes="94vw"
              className="object-contain"
            />
            <p className="absolute inset-x-0 -bottom-8 text-center text-sm font-medium text-white/75">
              {galleryImages[openIndex].title}
            </p>
          </div>

          <button
            type="button"
            onClick={() => move(1)}
            className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-dark/80 text-xl text-white transition hover:border-lime hover:text-lime sm:right-8"
            aria-label="Next image"
          >
            →
          </button>
        </div>
      )}
    </section>
  );
}
