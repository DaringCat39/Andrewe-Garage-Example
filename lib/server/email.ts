import "server-only";
import { Resend } from "resend";
import type { StoredEnquiry } from "@/lib/enquiries/types";
import { site } from "@/lib/content";
import { getServerEnvironment } from "@/lib/server/env";

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    };
    return entities[character] ?? character;
  });
}

function messageHtml(value: string) {
  return escapeHtml(value).replace(/\n/g, "<br />");
}

export async function sendEnquiryEmails(
  enquiry: StoredEnquiry,
  enquiryId: string,
) {
  const environment = getServerEnvironment();
  const resend = new Resend(environment.RESEND_API_KEY);
  const phone = enquiry.phone || "Not supplied";

  const result = await resend.batch.send(
    [
      {
        from: environment.ENQUIRY_FROM_EMAIL,
        to: environment.ENQUIRY_TO_EMAIL,
        replyTo: enquiry.email,
        subject: `Website enquiry: ${enquiry.service} · ${enquiry.name}`,
        text: [
          "A new website enquiry has been received.",
          "",
          `Name: ${enquiry.name}`,
          `Email: ${enquiry.email}`,
          `Telephone: ${phone}`,
          `Service: ${enquiry.service}`,
          "",
          enquiry.message,
        ].join("\n"),
        html: `
          <h1>New website enquiry</h1>
          <p><strong>Name:</strong> ${escapeHtml(enquiry.name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(enquiry.email)}</p>
          <p><strong>Telephone:</strong> ${escapeHtml(phone)}</p>
          <p><strong>Service:</strong> ${escapeHtml(enquiry.service)}</p>
          <p><strong>Message:</strong><br />${messageHtml(enquiry.message)}</p>
        `,
      },
      {
        from: environment.ENQUIRY_FROM_EMAIL,
        to: enquiry.email,
        replyTo: environment.ENQUIRY_TO_EMAIL,
        subject: `We have received your enquiry · ${site.name}`,
        text: [
          `Hello ${enquiry.name},`,
          "",
          `Thank you for contacting ${site.name}. We have received your enquiry about ${enquiry.service} and will respond as soon as we can during workshop hours.`,
          "",
          "Your message:",
          enquiry.message,
          "",
          `If the matter is urgent, please call ${site.phone}.`,
          "",
          site.name,
        ].join("\n"),
        html: `
          <p>Hello ${escapeHtml(enquiry.name)},</p>
          <p>Thank you for contacting ${escapeHtml(site.name)}. We have received your enquiry about <strong>${escapeHtml(enquiry.service)}</strong> and will respond as soon as we can during workshop hours.</p>
          <p><strong>Your message:</strong><br />${messageHtml(enquiry.message)}</p>
          <p>If the matter is urgent, please call ${escapeHtml(site.phone)}.</p>
          <p>${escapeHtml(site.name)}</p>
        `,
      },
    ],
    {
      idempotencyKey: `enquiry-${enquiryId}`,
    },
  );

  if (result.error) {
    throw new Error(`Email provider rejected the batch: ${result.error.name}`);
  }
}
