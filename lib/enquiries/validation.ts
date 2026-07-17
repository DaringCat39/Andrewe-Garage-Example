import { z } from "zod";
import { services } from "@/lib/content";

const allowedServices = new Set([
  ...services.map((service) => service.title),
  "Something else",
]);

const fakeEmailDomains = new Set([
  "example.com",
  "example.net",
  "example.org",
  "invalid",
  "test.com",
]);

function cleanSingleLine(value: string) {
  return value
    .normalize("NFKC")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanMessage(value: string) {
  return value
    .normalize("NFKC")
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{4,}/g, "\n\n\n")
    .trim();
}

function looksLikeRealMessage(value: string) {
  const lower = value.toLowerCase();
  const words = value.match(/\p{L}{2,}/gu) ?? [];
  const urls = value.match(/https?:\/\/|www\./gi) ?? [];

  if (words.length < 3 || urls.length > 2) return false;
  if (/^(.)\1{7,}$/u.test(value.replace(/\s/g, ""))) return false;
  if (["asdf", "hello", "testing", "test message"].includes(lower)) {
    return false;
  }

  return true;
}

export const enquiryPayloadSchema = z.object({
  submissionId: z.string().uuid("Please refresh the page and try again."),
  name: z
    .string()
    .max(120)
    .transform(cleanSingleLine)
    .pipe(
      z
        .string()
        .min(2, "Please enter your name.")
        .max(80, "Please keep your name under 80 characters.")
        .regex(
          /^[\p{L}\p{M}][\p{L}\p{M} .'’\-]*$/u,
          "Please enter a valid name.",
        ),
    ),
  email: z
    .string()
    .max(254)
    .transform((value) => cleanSingleLine(value).toLowerCase())
    .pipe(z.string().email("Please enter a valid email address."))
    .refine(
      (value) => !fakeEmailDomains.has(value.split("@")[1] ?? ""),
      "Please use a real email address.",
    ),
  phone: z
    .string()
    .max(50)
    .transform(cleanSingleLine)
    .pipe(
      z
        .string()
        .max(30, "Please keep the telephone number under 30 characters.")
        .refine(
          (value) =>
            value === "" ||
            (/^[+\d][\d\s().\-]+$/.test(value) &&
              (value.match(/\d/g) ?? []).length >= 7),
          "Please enter a valid telephone number or leave it blank.",
        ),
    ),
  service: z
    .string()
    .max(100)
    .transform(cleanSingleLine)
    .refine(
      (value) => allowedServices.has(value),
      "Please choose a service from the list.",
    ),
  message: z
    .string()
    .max(5000)
    .transform(cleanMessage)
    .pipe(
      z
        .string()
        .min(15, "Please add a little more detail about your enquiry.")
        .max(3000, "Please keep your message under 3,000 characters.")
        .refine(
          looksLikeRealMessage,
          "Please enter a genuine enquiry with a little more detail.",
        ),
    ),
  website: z.string().max(200).optional().default(""),
  startedAt: z.number().int().positive(),
});

export function validateEnquiryPayload(input: unknown) {
  return enquiryPayloadSchema.safeParse(input);
}
