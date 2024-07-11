import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  BASE_URL: z.string().url().default("http://localhost:3000"),
  FRONT_BASE_URL: z.string().url().default("http://localhost:3001"),
  PORT: z.coerce.number().default(3000),
  SMTP_USERNAME: z.optional(z.string()),
  SMTP_SERVER: z.optional(z.string()),
  SMTP_PORT: z.optional(z.coerce.number().default(587)),
  SMTP_PASSWORD: z.optional(z.string()),
});

export const env = envSchema.parse(process.env);
