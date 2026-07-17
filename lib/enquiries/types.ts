export type EnquiryInput = {
  submissionId: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  website: string;
  startedAt: number;
};

export type StoredEnquiry = Omit<
  EnquiryInput,
  "website" | "startedAt"
>;

export type EmailStatus = "pending" | "sent" | "failed";

export type PersistResult =
  | {
      kind: "created";
      enquiryId: string;
      emailStatus: "pending";
    }
  | {
      kind: "duplicate";
      enquiryId: string;
      emailStatus: EmailStatus;
    }
  | {
      kind: "rate_limited";
    };

export type EnquiryApiResponse = {
  success: boolean;
  message: string;
  duplicate?: boolean;
};
