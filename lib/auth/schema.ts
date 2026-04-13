import { z } from "zod";

export const classroomCodeSchema = z.string().trim().min(3).max(32);
export const displayNameSchema = z.string().trim().min(2).max(80);
export const usernameSchema = z
  .string()
  .trim()
  .min(3)
  .max(32)
  .regex(/^[a-zA-Z0-9_.-]+$/, "Use apenas letras, números, ponto, traço e underscore.");
export const passwordSchema = z.string().min(8).max(128);

export const registerInputSchema = z.object({
  classroomCode: classroomCodeSchema,
  displayName: displayNameSchema,
  username: usernameSchema,
  password: passwordSchema,
});

export const loginInputSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
});

export type RegisterInput = z.infer<typeof registerInputSchema>;
export type LoginInput = z.infer<typeof loginInputSchema>;
