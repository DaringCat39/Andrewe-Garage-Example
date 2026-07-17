import Link from "next/link";
import { navLinks, site } from "@/lib/content";
import { Container } from "@/components/ui/Container";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white">
      <Container className="py-14 lg:py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-xs font-black text-white">
                AG
              </span>
              <p className="text-xl font-bold tracking-[-0.025em]">{site.name}</p>
            </div>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-dark-muted">
              {site.description}
            </p>
            <a
              href={site.phoneHref}
              className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-lime"
            >
              {site.phone} <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-lime">
              Quick links
            </h2>
            <ul className="mt-4 space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-dark-muted transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-lime">
              Contact
            </h2>
            <address className="mt-4 space-y-3 not-italic text-sm text-dark-muted">
              <a
                href={site.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="block transition hover:text-white"
              >
                {site.address}
              </a>
              <a
                href={site.emailHref}
                className="block break-all transition hover:text-white"
              >
                {site.email}
              </a>
              <p>{site.hours}</p>
            </address>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-7 text-xs text-dark-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {site.name}. All rights reserved.
          </p>
          <Link
            href="#top"
            className="font-semibold text-white transition-colors hover:text-lime"
          >
            Back to top <span aria-hidden="true">↑</span>
          </Link>
        </div>
      </Container>
    </footer>
  );
}
