import { handleEnquiryRequest } from "@/lib/enquiries/handler";
import {
  markEnquiryEmailStatus,
  persistEnquiry,
} from "@/lib/server/database";
import { sendEnquiryEmails } from "@/lib/server/email";

export const runtime = "nodejs";

function reportServerError(context: string, error: unknown) {
  const errorName = error instanceof Error ? error.name : "UnknownError";
  console.error(`Enquiry service error: ${context}`, { errorName });
}

export async function POST(request: Request) {
  return handleEnquiryRequest(request, {
    now: Date.now,
    persist: persistEnquiry,
    sendEmails: sendEnquiryEmails,
    markEmailStatus: markEnquiryEmailStatus,
    reportError: reportServerError,
  });
}
