import { z } from "zod";

import {
  displayNameSchema,
  passwordSchema,
  usernameSchema,
} from "@/lib/auth/schema";

export const DELETE_ACCOUNT_CONFIRMATION = "EXCLUIR MINHA CONTA";

export const deleteAccountInputSchema = z.object({
  password: passwordSchema,
  confirmation: z.literal(DELETE_ACCOUNT_CONFIRMATION),
});

export const updateAccountProfileInputSchema = z.object({
  displayName: displayNameSchema,
  username: usernameSchema,
});

export type DeleteAccountInput = z.infer<typeof deleteAccountInputSchema>;
export type UpdateAccountProfileInput = z.infer<typeof updateAccountProfileInputSchema>;
