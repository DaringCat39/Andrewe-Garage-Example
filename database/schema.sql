-- Run this file once in the Neon SQL Editor before enabling the enquiry form.

CREATE TABLE IF NOT EXISTS enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid NOT NULL UNIQUE,
  customer_name varchar(80) NOT NULL,
  email varchar(254) NOT NULL,
  email_normalized varchar(254) NOT NULL,
  phone varchar(30),
  service varchar(100) NOT NULL,
  message text NOT NULL CHECK (char_length(message) BETWEEN 15 AND 3000),
  status varchar(20) NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'in_progress', 'closed')),
  email_status varchar(20) NOT NULL DEFAULT 'pending'
    CHECK (email_status IN ('pending', 'sent', 'failed')),
  content_hash char(64) NOT NULL,
  request_fingerprint char(64) NOT NULL,
  email_sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS enquiries_created_at_idx
  ON enquiries (created_at DESC);

CREATE INDEX IF NOT EXISTS enquiries_status_idx
  ON enquiries (status, created_at DESC);

CREATE INDEX IF NOT EXISTS enquiries_duplicate_check_idx
  ON enquiries (email_normalized, content_hash, created_at DESC);

CREATE TABLE IF NOT EXISTS enquiry_rate_limits (
  fingerprint char(64) NOT NULL,
  window_start timestamptz NOT NULL,
  request_count integer NOT NULL DEFAULT 1 CHECK (request_count > 0),
  PRIMARY KEY (fingerprint, window_start)
);

COMMENT ON TABLE enquiries IS
  'Website enquiries. Access only through the private Neon connection string.';

COMMENT ON COLUMN enquiries.request_fingerprint IS
  'One-way HMAC used for rate limiting; the visitor IP address is never stored.';
