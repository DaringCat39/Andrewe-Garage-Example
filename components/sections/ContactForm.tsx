"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { services, site } from "@/lib/content";
import type { EnquiryApiResponse } from "@/lib/enquiries/types";

type FormStatus = "idle" | "loading" | "success" | "error";

class EnquirySubmissionError extends Error {}

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");
  const startedAt = useRef(0);
  const submissionId = useRef("");
  const submissionInProgress = useRef(false);

  useEffect(() => {
    startedAt.current = Date.now();
    submissionId.current = window.crypto.randomUUID();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (submissionInProgress.current) return;

    if (!form.checkValidity()) {
      form.reportValidity();
      setStatus("error");
      setMessage("Please complete the required fields before continuing.");
      return;
    }

    submissionInProgress.current = true;
    setStatus("loading");
    setMessage("");

    try {
      const data = new FormData(form);
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 15_000);
      const currentSubmissionId =
        submissionId.current || window.crypto.randomUUID();

      let response: Response;
      try {
        response = await fetch("/api/enquiries", {
          method: "POST",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            submissionId: currentSubmissionId,
            name: String(data.get("name") ?? ""),
            phone: String(data.get("phone") ?? ""),
            email: String(data.get("email") ?? ""),
            service: String(data.get("service") ?? ""),
            message: String(data.get("message") ?? ""),
            website: String(data.get("website") ?? ""),
            startedAt: startedAt.current || Date.now() - 1_500,
          }),
        });
      } finally {
        window.clearTimeout(timeout);
      }

      let result: EnquiryApiResponse | undefined;
      try {
        result = (await response.json()) as EnquiryApiResponse;
      } catch {
        // Hosting and proxy failures can return HTML. Keep that detail private.
      }

      if (!response.ok || !result?.success) {
        throw new EnquirySubmissionError(
          result?.message ||
            `We could not send your enquiry just now. Please try again or call ${site.phone}.`,
        );
      }

      form.reset();
      submissionId.current = window.crypto.randomUUID();
      startedAt.current = Date.now();
      setStatus("success");
      setMessage(result.message);
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof EnquirySubmissionError
          ? error.message
          : error instanceof Error && error.name === "AbortError"
            ? `The enquiry took too long to send. Please try again or call ${site.phone}.`
            : `We could not send your enquiry just now. Please try again or call ${site.phone}.`,
      );
    } finally {
      submissionInProgress.current = false;
    }
  };

  const inputClasses =
    "mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 text-sm text-white outline-none transition hover:border-white/25 focus:border-lime focus:ring-4 focus:ring-lime/10";

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-busy={status === "loading"}
      className="rounded-[1.5rem] bg-dark p-7 text-white shadow-2xl shadow-dark/20 sm:p-10 lg:p-12"
      aria-label="Contact Andrew's Garage"
    >
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lime">
          Send an enquiry
        </p>
        <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em]">
          Tell us what your vehicle needs.
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-dark-muted">
          Send the details securely and the workshop will reply as soon as it
          can during opening hours.
        </p>
      </div>

      <div className="grid gap-5">
        <div className="absolute left-[-9999px]" aria-hidden="true">
          <label htmlFor="website">
            Website
            <input
              id="website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </label>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-medium" htmlFor="name">
            Name
            <input
              className={inputClasses}
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              maxLength={80}
              required
            />
          </label>
          <label className="text-sm font-medium" htmlFor="phone">
            Telephone
            <input
              className={inputClasses}
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              maxLength={30}
            />
          </label>
        </div>

        <label className="text-sm font-medium" htmlFor="email">
          Email
          <input
            className={inputClasses}
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            required
          />
        </label>

        <label className="text-sm font-medium" htmlFor="service">
          Service
          <select
            className={`${inputClasses} bg-dark`}
            id="service"
            name="service"
            defaultValue=""
            required
          >
            <option value="" disabled>
              Choose a service
            </option>
            {services.map((service) => (
              <option key={service.title} value={service.title}>
                {service.title}
              </option>
            ))}
            <option value="Something else">Something else</option>
          </select>
        </label>

        <label className="text-sm font-medium" htmlFor="message">
          How can we help?
          <textarea
            className={`${inputClasses} min-h-32 resize-y`}
            id="message"
            name="message"
            maxLength={3000}
            required
          />
        </label>

        <button
          type="submit"
          disabled={status === "loading"}
          className="mt-2 inline-flex min-h-13 items-center justify-center gap-3 rounded-full bg-lime px-6 py-3.5 text-sm font-bold text-dark transition duration-300 hover:-translate-y-0.5 hover:bg-white active:translate-y-0 disabled:cursor-wait disabled:opacity-70"
        >
          {status === "loading" ? (
            <>
              <span
                className="h-4 w-4 animate-spin rounded-full border-2 border-dark/25 border-t-dark"
                aria-hidden="true"
              />
              Sending enquiry…
            </>
          ) : (
            <>
              Get in contact
              <span aria-hidden="true">↗</span>
            </>
          )}
        </button>

        <p
          className={`min-h-5 text-sm ${
            status === "error" ? "text-red-300" : "text-lime"
          }`}
          aria-live="polite"
        >
          {message}
        </p>

        <p className="text-xs leading-relaxed text-white/45">
          Your details are used only to respond to this enquiry and are not
          added to a marketing list.
        </p>
      </div>
    </form>
  );
}
