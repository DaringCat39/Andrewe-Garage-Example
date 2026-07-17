import "server-only";
import { neon } from "@neondatabase/serverless";
import type {
  EmailStatus,
  PersistResult,
  StoredEnquiry,
} from "@/lib/enquiries/types";
import { getServerEnvironment } from "@/lib/server/env";
import {
  createContentHash,
  createRequestFingerprint,
} from "@/lib/server/security";

type PersistRow = {
  request_count: number;
  enquiry_id: string | null;
  is_duplicate: boolean;
  email_status: EmailStatus | null;
};

function getSql() {
  return neon(getServerEnvironment().DATABASE_URL);
}

export async function persistEnquiry(
  enquiry: StoredEnquiry,
  request: Request,
): Promise<PersistResult> {
  const sql = getSql();
  const requestFingerprint = createRequestFingerprint(request);
  const contentHash = createContentHash(enquiry);

  const rows = (await sql`
    WITH cleanup AS (
      DELETE FROM enquiry_rate_limits
      WHERE window_start < now() - interval '48 hours'
    ),
    rate_check AS (
      INSERT INTO enquiry_rate_limits (fingerprint, window_start, request_count)
      VALUES (${requestFingerprint}, date_trunc('hour', now()), 1)
      ON CONFLICT (fingerprint, window_start)
      DO UPDATE SET request_count = enquiry_rate_limits.request_count + 1
      RETURNING request_count
    ),
    duplicate AS (
      SELECT id, email_status
      FROM enquiries
      WHERE submission_id = ${enquiry.submissionId}::uuid
         OR (
           email_normalized = ${enquiry.email.toLowerCase()}
           AND content_hash = ${contentHash}
           AND created_at > now() - interval '10 minutes'
         )
      ORDER BY created_at DESC
      LIMIT 1
    ),
    inserted AS (
      INSERT INTO enquiries (
        submission_id,
        customer_name,
        email,
        email_normalized,
        phone,
        service,
        message,
        status,
        email_status,
        content_hash,
        request_fingerprint
      )
      SELECT
        ${enquiry.submissionId}::uuid,
        ${enquiry.name},
        ${enquiry.email},
        ${enquiry.email.toLowerCase()},
        ${enquiry.phone || null},
        ${enquiry.service},
        ${enquiry.message},
        'new',
        'pending',
        ${contentHash},
        ${requestFingerprint}
      WHERE (SELECT request_count FROM rate_check) <= 5
        AND NOT EXISTS (SELECT 1 FROM duplicate)
      ON CONFLICT (submission_id) DO NOTHING
      RETURNING id, email_status
    )
    SELECT
      (SELECT request_count FROM rate_check)::int AS request_count,
      COALESCE(
        (SELECT id FROM inserted),
        (SELECT id FROM duplicate)
      )::text AS enquiry_id,
      EXISTS (SELECT 1 FROM duplicate) AS is_duplicate,
      COALESCE(
        (SELECT email_status FROM inserted),
        (SELECT email_status FROM duplicate)
      ) AS email_status
  `) as unknown as PersistRow[];

  const result = rows[0];
  if (!result) throw new Error("The database did not return a result.");

  if (result.is_duplicate && result.enquiry_id) {
    return {
      kind: "duplicate",
      enquiryId: result.enquiry_id,
      emailStatus: result.email_status ?? "pending",
    };
  }

  if (result.request_count > 5 || !result.enquiry_id) {
    return { kind: "rate_limited" };
  }

  return {
    kind: "created",
    enquiryId: result.enquiry_id,
    emailStatus: "pending",
  };
}

export async function markEnquiryEmailStatus(
  enquiryId: string,
  status: Exclude<EmailStatus, "pending">,
) {
  const sql = getSql();
  await sql`
    UPDATE enquiries
    SET
      email_status = ${status},
      email_sent_at = CASE WHEN ${status} = 'sent' THEN now() ELSE email_sent_at END,
      updated_at = now()
    WHERE id = ${enquiryId}::uuid
  `;
}
