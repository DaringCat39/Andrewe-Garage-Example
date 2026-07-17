import { describe, expect, it } from "vitest";
import { validateEnquiryPayload } from "@/lib/enquiries/validation";

const validPayload = {
  submissionId: "d419ac9c-111b-4ba1-8f7c-77ab5a918bf0",
  name: "  Alex   Morgan  ",
  email: " Alex.Morgan@Customer.co.uk ",
  phone: "+44 7700 900 123",
  service: "Vehicle servicing",
  message: "Please can you book my car in for its annual service next week?",
  website: "",
  startedAt: 1_720_000_000_000,
};

describe("enquiry form validation", () => {
  it("accepts and normalises a genuine enquiry", () => {
    const result = validateEnquiryPayload(validPayload);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Alex Morgan");
      expect(result.data.email).toBe("alex.morgan@customer.co.uk");
    }
  });

  it("rejects invalid and example email addresses", () => {
    const invalidFormat = validateEnquiryPayload({
      ...validPayload,
      email: "not-an-email",
    });
    const fakeDomain = validateEnquiryPayload({
      ...validPayload,
      email: "person@example.com",
    });

    expect(invalidFormat.success).toBe(false);
    expect(fakeDomain.success).toBe(false);
  });

  it("rejects empty-looking and low-effort messages", () => {
    expect(
      validateEnquiryPayload({ ...validPayload, message: "test message" })
        .success,
    ).toBe(false);
    expect(
      validateEnquiryPayload({ ...validPayload, message: "aaaaaaaaaaaaaaaa" })
        .success,
    ).toBe(false);
  });

  it("rejects services that were not offered by the form", () => {
    const result = validateEnquiryPayload({
      ...validPayload,
      service: "Invented service",
    });

    expect(result.success).toBe(false);
  });
});
