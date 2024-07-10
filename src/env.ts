import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  BASE_URL: z.string().url().default("http://localhost:3000"),
  FRONT_BASE_URL: z.string().url().default("http://localhost:3001"),
  PORT: z.coerce.number().default(3000),
});

export const env = envSchema.parse(process.env);
