import "server-only";
import { z } from "zod";

const senderPattern = /^(?:[^<>\r\n]+\s<)?[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+>?$/;

const serverEnvironmentSchema = z.object({
  DATABASE_URL: z
    .string()
    .min(1)
    .refine(
      (value) => value.startsWith("postgres://") || value.startsWith("postgresql://"),
      "DATABASE_URL must be a PostgreSQL connection string.",
    ),
  RESEND_API_KEY: z.string().min(10),
  ENQUIRY_TO_EMAIL: z.string().email(),
  ENQUIRY_FROM_EMAIL: z.string().regex(senderPattern),
  RATE_LIMIT_SALT: z.string().min(32),
});

export type ServerEnvironment = z.infer<typeof serverEnvironmentSchema>;

let cachedEnvironment: ServerEnvironment | undefined;

export function getServerEnvironment() {
  if (cachedEnvironment) return cachedEnvironment;

  const result = serverEnvironmentSchema.safeParse({
    DATABASE_URL: process.env.DATABASE_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    ENQUIRY_TO_EMAIL: process.env.ENQUIRY_TO_EMAIL,
    ENQUIRY_FROM_EMAIL: process.env.ENQUIRY_FROM_EMAIL,
    RATE_LIMIT_SALT: process.env.RATE_LIMIT_SALT,
  });

  if (!result.success) {
    throw new Error("The enquiry service is not configured correctly.");
  }

  cachedEnvironment = result.data;
  return cachedEnvironment;
}
