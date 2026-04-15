import { z } from "zod";

import { bondTypeSchema, phaseIdSchema } from "@/lib/content/schema";

export const builderBlueprintIdSchema = z.enum([
  "tetra_single",
  "trigonal_double",
  "linear_triple",
  "linear_two_doubles",
  "aromatic_ring",
]);

export const builderElementSchema = z.enum(["H", "C", "O"]);

export const builderFilledSlotSchema = z.object({
  slotId: z.string().min(1),
  element: builderElementSchema.nullable(),
});

export const blueprintBuilderStateSchema = z.object({
  blueprintId: builderBlueprintIdSchema,
  slots: z.array(builderFilledSlotSchema),
});

export const legacyBuilderStateSchema = z.object({
  carbonCount: z.number().int().positive(),
  bondType: bondTypeSchema,
});

export const builderStateSchema = z.union([
  blueprintBuilderStateSchema,
  legacyBuilderStateSchema,
]);

export const builderValidationRequestSchema = z.object({
  phaseId: phaseIdSchema,
  builderState: builderStateSchema,
});

export type BuilderStateInput = z.infer<typeof builderStateSchema>;
export type BuilderValidationRequestInput = z.infer<typeof builderValidationRequestSchema>;
