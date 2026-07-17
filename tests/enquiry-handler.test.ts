import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  handleEnquiryRequest,
  type EnquiryHandlerDependencies,
} from "@/lib/enquiries/handler";
import type { PersistResult } from "@/lib/enquiries/types";

const now = 1_720_000_010_000;
const validPayload = {
  submissionId: "d419ac9c-111b-4ba1-8f7c-77ab5a918bf0",
  name: "Alex Morgan",
  email: "alex.morgan@customer.co.uk",
  phone: "+44 7700 900 123",
  service: "Diagnostics",
  message: "The engine warning light came on during my journey this morning.",
  website: "",
  startedAt: now - 5_000,
};

function createRequest(payload: unknown, headers?: HeadersInit) {
  return new Request("https://garage.example/api/enquiries", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "https://garage.example",
      ...headers,
    },
    body: JSON.stringify(payload),
  });
}

function createDependencies(
  persisted: PersistResult = {
    kind: "created",
    enquiryId: "93ebbe20-fd82-49f0-9fe1-851eab453a4f",
    emailStatus: "pending",
  },
): EnquiryHandlerDependencies {
  return {
    now: () => now,
    persist: vi.fn().mockResolvedValue(persisted),
    sendEmails: vi.fn().mockResolvedValue(undefined),
    markEmailStatus: vi.fn().mockResolvedValue(undefined),
    reportError: vi.fn(),
  };
}

describe("enquiry API handler", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("saves the enquiry, sends both emails and records delivery", async () => {
    const dependencies = createDependencies();
    const response = await handleEnquiryRequest(
      createRequest(validPayload),
      dependencies,
    );
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.success).toBe(true);
    expect(dependencies.persist).toHaveBeenCalledOnce();
    expect(dependencies.sendEmails).toHaveBeenCalledOnce();
    expect(dependencies.markEmailStatus).toHaveBeenCalledWith(
      "93ebbe20-fd82-49f0-9fe1-851eab453a4f",
      "sent",
    );
  });

  it("silently discards honeypot submissions", async () => {
    const dependencies = createDependencies();
    const response = await handleEnquiryRequest(
      createRequest({ ...validPayload, website: "spam.example" }),
      dependencies,
    );

    expect(response.status).toBe(200);
    expect(dependencies.persist).not.toHaveBeenCalled();
    expect(dependencies.sendEmails).not.toHaveBeenCalled();
  });

  it("prevents an already received enquiry from being sent twice", async () => {
    const dependencies = createDependencies({
      kind: "duplicate",
      enquiryId: "93ebbe20-fd82-49f0-9fe1-851eab453a4f",
      emailStatus: "sent",
    });
    const response = await handleEnquiryRequest(
      createRequest(validPayload),
      dependencies,
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.duplicate).toBe(true);
    expect(dependencies.sendEmails).not.toHaveBeenCalled();
  });

  it("returns a clear rate-limit response", async () => {
    const dependencies = createDependencies({ kind: "rate_limited" });
    const response = await handleEnquiryRequest(
      createRequest(validPayload),
      dependencies,
    );

    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("3600");
    expect(dependencies.sendEmails).not.toHaveBeenCalled();
  });

  it("keeps a saved enquiry when email delivery is temporarily unavailable", async () => {
    const dependencies = createDependencies();
    vi.mocked(dependencies.sendEmails).mockRejectedValue(
      new Error("provider unavailable"),
    );
    const response = await handleEnquiryRequest(
      createRequest(validPayload),
      dependencies,
    );
    const body = await response.json();

    expect(response.status).toBe(202);
    expect(body.success).toBe(true);
    expect(body.message).toContain("saved safely");
    expect(dependencies.markEmailStatus).toHaveBeenCalledWith(
      "93ebbe20-fd82-49f0-9fe1-851eab453a4f",
      "failed",
    );
  });

  it("rejects suspiciously fast submissions", async () => {
    const dependencies = createDependencies();
    const response = await handleEnquiryRequest(
      createRequest({ ...validPayload, startedAt: now - 100 }),
      dependencies,
    );

    expect(response.status).toBe(400);
    expect(dependencies.persist).not.toHaveBeenCalled();
  });

  it("does not expose database errors to the visitor", async () => {
    const dependencies = createDependencies();
    vi.mocked(dependencies.persist).mockRejectedValue(
      new Error("postgresql://user:secret@database.example"),
    );
    const response = await handleEnquiryRequest(
      createRequest(validPayload),
      dependencies,
    );
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(body.message).not.toContain("secret");
    expect(dependencies.reportError).toHaveBeenCalled();
  });
});
