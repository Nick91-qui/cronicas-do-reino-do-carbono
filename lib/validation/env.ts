import { z } from "zod";

export const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  APP_BASE_URL: z.string().url(),
  AUTH_SECRET: z.string().min(1),
  SESSION_SECRET: z.string().min(1),
});

export type AppEnv = z.infer<typeof envSchema>;

export function getEnv(input: NodeJS.ProcessEnv = process.env): AppEnv {
  return envSchema.parse(input);
}
