import { z } from "zod";

import { BRANCHED_BUILDER_KIND } from "@/lib/builder/state/branched-types";

export const branchedBuilderAtomIdSchema = z
  .string()
  .regex(/^a\d+$/)
  .transform((value) => value as `a${number}`);

export const branchedBuilderBondIdSchema = z
  .string()
  .regex(/^b\d+$/)
  .transform((value) => value as `b${number}`);

export const branchedBuilderAtomSchema = z.object({
  id: branchedBuilderAtomIdSchema,
  element: z.literal("C"),
});

export const branchedBuilderBondSchema = z.object({
  id: branchedBuilderBondIdSchema,
  from: branchedBuilderAtomIdSchema,
  to: branchedBuilderAtomIdSchema,
  order: z.union([z.literal(1), z.literal(2), z.literal(3)]),
});

export const branchedBuilderStateSchema = z.object({
  kind: z.literal(BRANCHED_BUILDER_KIND),
  atoms: z.array(branchedBuilderAtomSchema).min(1),
  bonds: z.array(branchedBuilderBondSchema),
  selectedAtomId: branchedBuilderAtomIdSchema.nullable(),
  nextAtomIndex: z.number().int().positive(),
  nextBondIndex: z.number().int().positive(),
});

export type BranchedBuilderStateInput = z.infer<typeof branchedBuilderStateSchema>;
