import { z } from "zod";

import { passwordSchema } from "@/lib/auth/schema";

export const DELETE_ACCOUNT_CONFIRMATION = "EXCLUIR MINHA CONTA";

export const deleteAccountInputSchema = z.object({
  password: passwordSchema,
  confirmation: z.literal(DELETE_ACCOUNT_CONFIRMATION),
});

export type DeleteAccountInput = z.infer<typeof deleteAccountInputSchema>;
