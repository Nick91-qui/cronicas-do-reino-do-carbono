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

export const builderLayoutSchema = z.enum(["open_chain", "closed_ring"]);

export const graphBuilderBondSchema = z.object({
  from: z.number().int().nonnegative(),
  to: z.number().int().nonnegative(),
  order: z.union([z.literal(1), z.literal(2)]),
});

export const graphBuilderStateSchema = z.object({
  layout: builderLayoutSchema,
  carbonCount: z.number().int().positive(),
  bonds: z.array(graphBuilderBondSchema),
});

/** Schema canônico do builder usado pela UI atual do MVP. */
export const canonicalBuilderStateSchema = graphBuilderStateSchema;

/**
 * Schema compatível com formatos históricos do builder. Mantido para evitar
 * quebra de payloads legados enquanto o projeto converge no formato em grafo.
 */
export const builderStateCompatibilitySchema = z.union([
  graphBuilderStateSchema,
  legacyBuilderStateSchema,
  blueprintBuilderStateSchema,
]);

export const builderStateSchema = builderStateCompatibilitySchema;

export const builderValidationRequestSchema = z.object({
  phaseId: phaseIdSchema,
  builderState: builderStateSchema,
});

export type CanonicalBuilderStateInput = z.infer<typeof canonicalBuilderStateSchema>;
export type BuilderStateInput = z.infer<typeof builderStateSchema>;
export type BuilderValidationRequestInput = z.infer<typeof builderValidationRequestSchema>;
