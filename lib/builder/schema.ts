import { z } from "zod";

import { branchedBuilderStateSchema } from "@/lib/builder/state/branched-schema";
import { phaseIdSchema } from "@/lib/content/schema";

export const futureBuilderStateSchema = branchedBuilderStateSchema;
export const builderStateSchema = branchedBuilderStateSchema;

export const builderValidationRequestSchema = z.object({
  phaseId: phaseIdSchema,
  builderState: builderStateSchema,
});

export type BuilderStateInput = z.infer<typeof builderStateSchema>;
export type FutureBuilderStateInput = z.infer<typeof futureBuilderStateSchema>;
export type BuilderValidationRequestInput = z.infer<typeof builderValidationRequestSchema>;
