import { z } from "zod";

import { canonicalBuilderStateSchema } from "@/lib/builder/schema";
import { moleculeIdSchema, phaseIdSchema, selectablePropertySchema } from "@/lib/content/schema";

export const phaseSubmitSchema = z.object({
  phaseId: phaseIdSchema,
  builderState: canonicalBuilderStateSchema.optional(),
  selectedMoleculeId: moleculeIdSchema.optional(),
  selectedProperties: z.array(selectablePropertySchema).min(1).max(3),
});

export type PhaseSubmitSchemaInput = z.infer<typeof phaseSubmitSchema>;
