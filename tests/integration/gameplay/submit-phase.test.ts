import { beforeEach, describe, expect, it, vi } from "vitest";

const persistPhaseEvaluationMock = vi.fn();

vi.mock("@/lib/progress/service", () => ({
  persistPhaseEvaluation: persistPhaseEvaluationMock,
}));

import { submitPhaseForPlayer } from "@/lib/gameplay/submit-phase";

describe("integration/gameplay/submit-phase", () => {
  beforeEach(() => {
    persistPhaseEvaluationMock.mockReset();
  });

  it("orquestra avaliação e persistência para uma resposta correta", async () => {
    const persistenceResult = {
      attemptId: "attempt-1",
      phaseSummary: {
        phaseId: "chapter-1-phase-4",
        isCompleted: true,
        bestQualitativeResult: "excellent",
        bestValidationResult: "correct",
        bestScore: 3,
        attemptCount: 1,
        firstCompletedAt: null,
        lastAttemptAt: null,
      },
      chapterProgress: {
        chapterId: "chapter-1",
        highestUnlockedPhaseNumber: 5,
        completedPhaseCount: 4,
        chapterScore: 11,
      },
      inventory: {
        carbonAvailable: 4,
        hydrogenMode: "implicit_infinite" as const,
        unlockedFragments: ["ligacao_simples", "ligacao_dupla"],
        unlockedMolecules: ["metano"],
        unlockedTitles: ["O Volátil"],
      },
      grantedRewards: [
        { rewardType: "fragment", rewardValue: "ligacao_dupla" },
        { rewardType: "title", rewardValue: "O Volátil" },
      ],
      analyticsEventsRecorded: ["phase_submitted", "phase_evaluated", "phase_completed", "reward_granted"],
    };

    persistPhaseEvaluationMock.mockResolvedValue(persistenceResult);

    const db = {} as never;
    const playerId = "player-1";
    const submission = {
      phaseId: "chapter-1-phase-4" as const,
      selectedMoleculeId: "metano" as const,
      selectedProperties: ["cadeia_curta", "alta_volatilidade"] as const,
    };

    const result = await submitPhaseForPlayer(db, playerId, submission);

    expect(result.evaluation.qualitativeResult).toBe("excellent");
    expect(result.evaluation.validationResult).toBe("correct");
    expect(result.evaluation.scoreAwarded).toBe(3);
    expect(result.persistence).toEqual(persistenceResult);

    expect(persistPhaseEvaluationMock).toHaveBeenCalledTimes(1);
    expect(persistPhaseEvaluationMock).toHaveBeenCalledWith(db, {
      playerId,
      submission,
      evaluation: expect.objectContaining({
        phaseId: "chapter-1-phase-4",
        qualitativeResult: "excellent",
        validationResult: "correct",
        scoreAwarded: 3,
      }),
    });
  });

  it("preserva falha de avaliação inadequada antes da persistência", async () => {
    persistPhaseEvaluationMock.mockResolvedValue({
      attemptId: "attempt-2",
      phaseSummary: {
        phaseId: "chapter-1-phase-6",
        isCompleted: false,
        bestQualitativeResult: "inadequate",
        bestValidationResult: "incorrect",
        bestScore: 0,
        attemptCount: 1,
        firstCompletedAt: null,
        lastAttemptAt: null,
      },
      chapterProgress: {
        chapterId: "chapter-1",
        highestUnlockedPhaseNumber: 6,
        completedPhaseCount: 5,
        chapterScore: 14,
      },
      inventory: {
        carbonAvailable: 5,
        hydrogenMode: "implicit_infinite" as const,
        unlockedFragments: ["ligacao_simples", "ligacao_dupla"],
        unlockedMolecules: ["metano", "etano", "propano", "eteno"],
        unlockedTitles: [],
      },
      grantedRewards: [],
      analyticsEventsRecorded: ["phase_submitted", "phase_evaluated"],
    });

    const result = await submitPhaseForPlayer({} as never, "player-1", {
      phaseId: "chapter-1-phase-6",
      selectedMoleculeId: "propano",
      selectedProperties: ["baixa_polaridade"],
    });

    expect(result.evaluation.qualitativeResult).toBe("inadequate");
    expect(result.evaluation.validationResult).toBe("incorrect");
    expect(result.evaluation.scoreAwarded).toBe(0);
    expect(persistPhaseEvaluationMock).toHaveBeenCalledTimes(1);
  });
});
