import { z } from "zod";

import { bondTypeSchema, phaseIdSchema } from "@/lib/content/schema";

export const builderStateSchema = z.object({
  carbonCount: z.number().int().positive(),
  bondType: bondTypeSchema,
});

export const builderValidationRequestSchema = z.object({
  phaseId: phaseIdSchema,
  builderState: builderStateSchema,
});

export type BuilderStateInput = z.infer<typeof builderStateSchema>;
export type BuilderValidationRequestInput = z.infer<typeof builderValidationRequestSchema>;
