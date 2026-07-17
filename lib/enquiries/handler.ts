import type {
  EmailStatus,
  EnquiryApiResponse,
  PersistResult,
  StoredEnquiry,
} from "@/lib/enquiries/types";
import { validateEnquiryPayload } from "@/lib/enquiries/validation";

const MAX_REQUEST_CHARACTERS = 12_000;
const MINIMUM_FORM_TIME_MS = 1_000;
const MAXIMUM_FORM_AGE_MS = 24 * 60 * 60 * 1_000;

export type EnquiryHandlerDependencies = {
  now: () => number;
  persist: (enquiry: StoredEnquiry, request: Request) => Promise<PersistResult>;
  sendEmails: (enquiry: StoredEnquiry, enquiryId: string) => Promise<void>;
  markEmailStatus: (
    enquiryId: string,
    status: Exclude<EmailStatus, "pending">,
  ) => Promise<void>;
  reportError: (context: string, error: unknown) => void;
};

function jsonResponse(
  body: EnquiryApiResponse,
  status: number,
  extraHeaders?: HeadersInit,
) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...extraHeaders,
    },
  });
}

function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

async function updateEmailStatusSafely(
  dependencies: EnquiryHandlerDependencies,
  enquiryId: string,
  status: Exclude<EmailStatus, "pending">,
) {
  try {
    await dependencies.markEmailStatus(enquiryId, status);
  } catch (error) {
    dependencies.reportError("email_status_update", error);
  }
}

export async function handleEnquiryRequest(
  request: Request,
  dependencies: EnquiryHandlerDependencies,
) {
  if (!isSameOrigin(request)) {
    return jsonResponse(
      {
        success: false,
        message: "This enquiry could not be submitted from that website.",
      },
      403,
    );
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return jsonResponse(
      {
        success: false,
        message: "The enquiry was sent in an unsupported format.",
      },
      415,
    );
  }

  try {
    const rawBody = await request.text();
    if (rawBody.length > MAX_REQUEST_CHARACTERS) {
      return jsonResponse(
        {
          success: false,
          message: "The enquiry is too large to send.",
        },
        413,
      );
    }

    let untrustedPayload: unknown;
    try {
      untrustedPayload = JSON.parse(rawBody);
    } catch {
      return jsonResponse(
        {
          success: false,
          message: "The enquiry could not be read. Please try again.",
        },
        400,
      );
    }

    const validation = validateEnquiryPayload(untrustedPayload);
    if (!validation.success) {
      return jsonResponse(
        {
          success: false,
          message:
            validation.error.issues[0]?.message ??
            "Please check the form and try again.",
        },
        400,
      );
    }

    const { website, startedAt, ...enquiry } = validation.data;

    // A hidden honeypot catches common form bots without exposing a challenge
    // to genuine visitors. Return the normal response so bots do not adapt.
    if (website) {
      return jsonResponse(
        {
          success: true,
          message: "Thank you. Your enquiry has been received.",
        },
        200,
      );
    }

    const formAge = dependencies.now() - startedAt;
    if (formAge < MINIMUM_FORM_TIME_MS || formAge > MAXIMUM_FORM_AGE_MS) {
      return jsonResponse(
        {
          success: false,
          message: "Please refresh the page, then complete the form again.",
        },
        400,
      );
    }

    const persisted = await dependencies.persist(enquiry, request);

    if (persisted.kind === "rate_limited") {
      return jsonResponse(
        {
          success: false,
          message:
            "Too many enquiries have been sent from this connection. Please wait an hour or call the workshop.",
        },
        429,
        { "Retry-After": "3600" },
      );
    }

    if (
      persisted.kind === "duplicate" &&
      persisted.emailStatus !== "failed"
    ) {
      return jsonResponse(
        {
          success: true,
          duplicate: true,
          message:
            "We have already received this enquiry. There is no need to send it again.",
        },
        200,
      );
    }

    try {
      await dependencies.sendEmails(enquiry, persisted.enquiryId);
      await updateEmailStatusSafely(
        dependencies,
        persisted.enquiryId,
        "sent",
      );

      return jsonResponse(
        {
          success: true,
          message:
            "Thank you. Your enquiry has been sent and a confirmation email is on its way.",
        },
        persisted.kind === "created" ? 201 : 200,
      );
    } catch (error) {
      dependencies.reportError("email_delivery", error);
      await updateEmailStatusSafely(
        dependencies,
        persisted.enquiryId,
        "failed",
      );

      return jsonResponse(
        {
          success: true,
          message:
            "Your enquiry has been saved safely. Email confirmation is delayed, so please call the workshop if the matter is urgent.",
        },
        202,
      );
    }
  } catch (error) {
    dependencies.reportError("enquiry_submission", error);
    return jsonResponse(
      {
        success: false,
        message:
          "We could not send your enquiry just now. Please try again later or call the workshop.",
      },
      503,
    );
  }
}
