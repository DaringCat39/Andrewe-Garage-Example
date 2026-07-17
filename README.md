# Andrew's Garage website

A Next.js 16 small-business website with a real enquiry backend. The public
site remains a single, fast page; the backend stores each enquiry in Postgres
and sends transactional email without exposing database or email credentials
to the browser.

## What the backend does

The contact form now sends a `POST` request to `/api/enquiries`. The server:

1. checks the request format and origin;
2. sanitises and validates every field again on the server;
3. rejects invalid, implausibly fast and oversized requests;
4. uses a hidden honeypot to discard common form bots;
5. applies a database-backed limit of five new enquiries per connection per
   hour;
6. prevents repeated submissions with a submission ID and a ten-minute content
   duplicate check;
7. saves the enquiry in Neon Postgres before attempting email;
8. sends one email to the garage and one confirmation to the customer through
   Resend; and
9. records whether email delivery was accepted or failed.

The visitor's raw IP address is never saved. It is converted to a one-way,
salted fingerprint used only for rate limiting. API errors shown to visitors do
not include database, email-provider or secret details.

No admin area was added. A small garage can receive and answer enquiries by
email, while the owner can view or update the underlying records in Neon's
protected dashboard. This avoids maintaining a second login system. There are
no newsletter, account, payment or file-upload features in the current site,
so no unused backend was added for them.

## Services you need

You need two accounts. Both work with Vercel and offer entry-level plans.

### 1. Neon — enquiry database

Neon hosts the Postgres database containing the enquiries.

1. Create an account at [neon.com](https://neon.com/).
2. Create a project for this website.
3. Open **SQL Editor** in the Neon sidebar.
4. Open [`database/schema.sql`](database/schema.sql) in this project, copy all
   of it into the SQL Editor and press **Run**. It is safe to run the file again.
5. In Neon, press **Connect** and choose **Connection string**.
6. Copy the complete value beginning with `postgresql://`. This becomes
   `DATABASE_URL`.

The `enquiries` table contains the customer details, requested service,
message, creation time, enquiry status and email status. The
`enquiry_rate_limits` table contains only one-way fingerprints and hourly
submission counts.

### 2. Resend — owner and customer email

Resend sends the garage notification and customer confirmation.

1. Create an account at [resend.com](https://resend.com/).
2. Open **Domains**, add a domain you control and copy the DNS records shown by
   Resend to the company that manages your domain. Wait until Resend shows the
   domain as verified.
3. Open **API Keys**, choose **Create API Key**, select **Sending access** and,
   if offered, restrict it to the verified domain.
4. Copy the key immediately. Resend shows it only once. This becomes
   `RESEND_API_KEY`.
5. Choose a sender on the verified domain, for example
   `Andrew's Garage <enquiries@yourdomain.co.uk>`. This becomes
   `ENQUIRY_FROM_EMAIL`.

Resend's temporary testing sender is restricted and cannot confirm enquiries
to arbitrary customers. Verify your own domain before testing the complete
visitor journey.

## Environment variables

Copy [`.env.example`](.env.example) to a new file named `.env.local` in the
project root. Never commit `.env.local`.

```bash
cp .env.example .env.local
```

Replace every example value:

| Variable | Where it comes from | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Neon **Connect** panel | Private Postgres connection string |
| `RESEND_API_KEY` | Resend **API Keys** | Authorises transactional email |
| `ENQUIRY_TO_EMAIL` | Chosen by the business owner | Private inbox receiving enquiries |
| `ENQUIRY_FROM_EMAIL` | A sender on the verified Resend domain | Address used to send both emails |
| `RATE_LIMIT_SALT` | Generate it yourself | Makes visitor fingerprints irreversible |

Generate a suitable rate-limit salt on macOS or Linux with:

```bash
openssl rand -hex 32
```

Paste the result after `RATE_LIMIT_SALT=` in `.env.local`. It must remain
private and should stay the same between deployments.

No variable starts with `NEXT_PUBLIC_`, so none of these values is included in
the browser's JavaScript.

## Run and test locally

Use Node.js 20 or newer, then install dependencies:

```bash
npm install
```

Make sure the Neon schema has been run and `.env.local` contains all five real
values. Start the site:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), scroll to **Contact** and
submit a genuine test enquiry using an email inbox you can check.

A successful end-to-end test has all four results:

1. the form shows a green success message and resets;
2. the owner inbox receives the enquiry;
3. the customer inbox receives the confirmation; and
4. Neon **Tables → enquiries** shows one new row with `email_status` set to
   `sent`.

Submitting exactly the same enquiry again within ten minutes should show that
it has already been received and must not create another row or email batch.
If email delivery fails after the database save, the form explains that the
enquiry is saved and the row is marked `failed` for investigation.

Run the automated checks with:

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

The automated tests use fake database and email functions. They never send
email, change Neon data or require secrets.

## Deploy to Vercel

### First deployment through the Vercel website

1. Push this project to a private or public Git repository on GitHub, GitLab or
   Bitbucket.
2. Sign in at [vercel.com](https://vercel.com/) and choose **Add New → Project**.
3. Import the repository. Vercel detects Next.js automatically; keep the
   default build settings.
4. Before deploying, open the project's **Environment Variables** section.
5. Add the five variables listed above one at a time, using the real values
   from `.env.local`. Enable them for **Production**. Add them to **Preview** as
   well only if preview deployments should send real enquiries.
6. Choose **Deploy**.
7. When deployment finishes, open the live URL and repeat the four-part form
   test from the previous section.

If you add or change a Vercel environment variable later, redeploy the project
from the **Deployments** tab so the change is used consistently.

### Optional Vercel CLI deployment

If the project is already linked to Vercel, the equivalent command is:

```bash
npx vercel --prod
```

The Vercel website is easier for a first deployment because it shows the
environment variables and build result together.

## Change the inbox receiving enquiries

Locally, edit only `ENQUIRY_TO_EMAIL` in `.env.local` and restart `npm run dev`.

On Vercel:

1. open the project;
2. go to **Settings → Environment Variables**;
3. edit `ENQUIRY_TO_EMAIL`;
4. save it; and
5. redeploy the latest deployment.

No code change is required. `ENQUIRY_FROM_EMAIL` is different: change that only
to another sender covered by a verified Resend domain.

## Viewing and updating enquiry status

Open the Neon project and choose **Tables → enquiries**. New records start with
`status = new`. The owner can edit a row in the Neon table view to
`in_progress` or `closed`; the database rejects any other value.

Do not share the Neon connection string or give public database access to the
table. The website accesses it only through the server-side API route.

## Main backend files

- [`app/api/enquiries/route.ts`](app/api/enquiries/route.ts) — Vercel-compatible
  POST endpoint.
- [`lib/enquiries/validation.ts`](lib/enquiries/validation.ts) — sanitisation
  and field rules.
- [`lib/enquiries/handler.ts`](lib/enquiries/handler.ts) — safe request and
  response flow.
- [`lib/server/database.ts`](lib/server/database.ts) — parameterised Neon SQL,
  duplicate prevention and rate limiting.
- [`lib/server/email.ts`](lib/server/email.ts) — owner and customer emails.
- [`lib/server/env.ts`](lib/server/env.ts) — server-only environment validation.
- [`database/schema.sql`](database/schema.sql) — database setup.
- [`tests`](tests) — validation and backend behaviour tests.

## Maintenance notes

- CAPTCHA is deliberately not enabled. The honeypot, minimum completion time,
  strict validation, duplicate protection and database-backed rate limit are
  appropriate first-line controls for this small form without adding tracking
  or visitor friction.
- Check Resend's email logs if a row has `email_status = failed`.
- Decide how long customer enquiries must be retained for the business, then
  periodically remove records that are no longer needed from Neon.
- The public address and contact details in [`lib/content.ts`](lib/content.ts)
  are separate from the private receiving inbox. Confirm those public details
  before launching the site.
