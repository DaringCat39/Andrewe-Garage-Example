"use client";

import { useState, type FormEvent } from "react";
import { services, site } from "@/lib/content";

type FormStatus = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      setStatus("error");
      setMessage("Please complete the required fields before continuing.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const data = new FormData(form);
      const name = String(data.get("name") ?? "");
      const phone = String(data.get("phone") ?? "");
      const email = String(data.get("email") ?? "");
      const service = String(data.get("service") ?? "");
      const enquiry = String(data.get("message") ?? "");

      const subject = encodeURIComponent(
        `Website enquiry from ${name} · ${service}`,
      );
      const body = encodeURIComponent(
        [
          `Name: ${name}`,
          `Telephone: ${phone || "Not supplied"}`,
          `Email: ${email}`,
          `Service: ${service}`,
          "",
          enquiry,
        ].join("\n"),
      );

      await new Promise((resolve) => window.setTimeout(resolve, 350));
      window.location.assign(`${site.emailHref}?subject=${subject}&body=${body}`);
      setStatus("success");
      setMessage(
        "Your email app should now be open with the enquiry ready to send.",
      );
    } catch {
      setStatus("error");
      setMessage(
        `We could not open your email app. Please call ${site.phone} instead.`,
      );
    }
  };

  const inputClasses =
    "mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 text-sm text-white outline-none transition hover:border-white/25 focus:border-lime focus:ring-4 focus:ring-lime/10";

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
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
          We will open a prepared email in your mail app, ready for you to
          review and send.
        </p>
      </div>

      <div className="grid gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-medium" htmlFor="name">
            Name
            <input
              className={inputClasses}
              id="name"
              name="name"
              type="text"
              autoComplete="name"
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
              Preparing email…
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
      </div>
    </form>
  );
}
