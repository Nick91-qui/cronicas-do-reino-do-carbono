import { z } from "zod";

import { phaseIdSchema } from "@/lib/content/schema";

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

export const builderStateSchema = canonicalBuilderStateSchema;

export const builderValidationRequestSchema = z.object({
  phaseId: phaseIdSchema,
  builderState: builderStateSchema,
});

export type CanonicalBuilderStateInput = z.infer<typeof canonicalBuilderStateSchema>;
export type BuilderStateInput = z.infer<typeof builderStateSchema>;
export type BuilderValidationRequestInput = z.infer<typeof builderValidationRequestSchema>;
