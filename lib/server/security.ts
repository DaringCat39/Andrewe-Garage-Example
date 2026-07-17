import "server-only";
import { createHash, createHmac } from "node:crypto";
import type { StoredEnquiry } from "@/lib/enquiries/types";
import { getServerEnvironment } from "@/lib/server/env";

function digest(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function createContentHash(enquiry: StoredEnquiry) {
  return digest(
    [
      enquiry.email.toLowerCase(),
      enquiry.phone,
      enquiry.service,
      enquiry.message.toLowerCase().replace(/\s+/g, " "),
    ].join("\u001f"),
  );
}

export function createRequestFingerprint(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const address =
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "address-unavailable";
  const agent = request.headers.get("user-agent")?.slice(0, 200) ?? "";
  const { RATE_LIMIT_SALT } = getServerEnvironment();

  return createHmac("sha256", RATE_LIMIT_SALT)
    .update(`${address}\u001f${agent}`)
    .digest("hex");
}
