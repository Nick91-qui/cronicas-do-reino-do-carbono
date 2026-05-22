import { z } from "zod";

import { futureBuilderStateSchema } from "@/lib/builder/schema";
import { moleculeIdSchema, phaseIdSchema, selectablePropertySchema } from "@/lib/content/schema";

export const phaseSubmitSchema = z.object({
  phaseId: phaseIdSchema,
  builderState: futureBuilderStateSchema.optional(),
  selectedMoleculeId: moleculeIdSchema.optional(),
  selectedProperties: z.array(selectablePropertySchema).min(1).max(3),
});

export type PhaseSubmitSchemaInput = z.infer<typeof phaseSubmitSchema>;
