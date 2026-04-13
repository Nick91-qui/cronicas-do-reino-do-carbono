import type { PrismaClient } from "@prisma/client";

import { evaluatePhaseSubmission } from "@/lib/gameplay/evaluate-phase";
import type { PhaseSubmitInput } from "@/lib/gameplay/types";
import { persistPhaseEvaluation } from "@/lib/progress/service";

export async function submitPhaseForPlayer(
  db: PrismaClient,
  playerId: string,
  submission: PhaseSubmitInput,
) {
  const evaluation = evaluatePhaseSubmission(submission);
  const persistence = await persistPhaseEvaluation(db, {
    playerId,
    submission,
    evaluation,
  });

  return {
    evaluation,
    persistence,
  };
}
