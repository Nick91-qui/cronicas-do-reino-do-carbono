import { beforeEach, describe, expect, it, vi } from "vitest";
import type { BranchedBuilderState } from "@/lib/builder/state/branched-types";

const {
  getPhaseByIdMock,
  getChapterByIdMock,
  getPhasesByChapterIdMock,
  ensurePlayerInventorySnapshotMock,
  applyPhaseCompletionRewardsMock,
} = vi.hoisted(() => ({
  getPhaseByIdMock: vi.fn(),
  getChapterByIdMock: vi.fn(),
  getPhasesByChapterIdMock: vi.fn(),
  ensurePlayerInventorySnapshotMock: vi.fn(),
  applyPhaseCompletionRewardsMock: vi.fn(),
}));

vi.mock("@/lib/content/loaders", () => ({
  getPhaseById: getPhaseByIdMock,
  getChapterById: getChapterByIdMock,
  getPhasesByChapterId: getPhasesByChapterIdMock,
}));

vi.mock("@/lib/inventory/service", () => ({
  ensurePlayerInventorySnapshot: ensurePlayerInventorySnapshotMock,
  applyPhaseCompletionRewards: applyPhaseCompletionRewardsMock,
}));

import { persistPhaseEvaluation } from "@/lib/progress/service";

const branchedMethaneState: BranchedBuilderState = {
  kind: "branched_v2" as const,
  atoms: [{ id: "a1", element: "C" }],
  bonds: [],
  selectedAtomId: "a1",
  nextAtomIndex: 2,
  nextBondIndex: 1,
};

type SummaryRecord = {
  playerId: string;
  phaseId: string;
  isCompleted: boolean;
  bestQualitativeResult: "excellent" | "adequate" | "inadequate" | null;
  bestValidationResult: "correct" | "incorrect" | null;
  bestScore: number;
  attemptCount: number;
  firstCompletedAt: Date | null;
  lastAttemptAt: Date | null;
};

function createProgressDb(options?: {
  failOnAnalytics?: boolean;
  previousSummary?: SummaryRecord | null;
  summariesByChapter?: SummaryRecord[];
}) {
  const previousSummary = options?.previousSummary ?? null;
  let committedSummary: SummaryRecord | null = null;
  let committedChapterProgress: Record<string, unknown> | null = null;
  const committedAttempts: Array<Record<string, unknown>> = [];
  const committedAnalyticsEvents: Array<Record<string, unknown>> = [];

  return {
    db: {
      $transaction: async (
        callback: (
          client: {
            playerPhaseAttempt: {
              create: ReturnType<typeof vi.fn>;
            };
            playerPhaseSummary: {
              findUnique: ReturnType<typeof vi.fn>;
              upsert: ReturnType<typeof vi.fn>;
              findMany: ReturnType<typeof vi.fn>;
            };
            playerChapterProgress: {
              upsert: ReturnType<typeof vi.fn>;
            };
            playerAnalyticsEvent: {
              createMany: ReturnType<typeof vi.fn>;
            };
          },
        ) => Promise<unknown>,
      ) => {
        let stagedSummary = committedSummary;
        let stagedChapterProgress = committedChapterProgress;
        const stagedAttempts: Array<Record<string, unknown>> = [];
        const stagedAnalyticsEvents: Array<Record<string, unknown>> = [];

        const tx = {
          playerPhaseAttempt: {
            create: vi.fn(async ({ data }: { data: Record<string, unknown> }) => {
              stagedAttempts.push(data);
              return { id: "attempt-1" };
            }),
          },
          playerPhaseSummary: {
            findUnique: vi.fn(async () => previousSummary),
            upsert: vi.fn(
              async ({ create, update }: { create: SummaryRecord; update: Partial<SummaryRecord> }) => {
                stagedSummary = previousSummary ? { ...previousSummary, ...update } : create;
                return stagedSummary;
              },
            ),
            findMany: vi.fn(async () => {
              if (options?.summariesByChapter) {
                return options.summariesByChapter;
              }

              return stagedSummary ? [stagedSummary] : [];
            }),
          },
          playerChapterProgress: {
            upsert: vi.fn(
              async ({ create, update }: { create: Record<string, unknown>; update: Record<string, unknown> }) => {
                stagedChapterProgress = previousSummary ? update : create;
                return stagedChapterProgress;
              },
            ),
          },
          playerAnalyticsEvent: {
            createMany: vi.fn(async ({ data }: { data: Array<Record<string, unknown>> }) => {
              if (options?.failOnAnalytics) {
                throw new Error("analytics failed");
              }

              stagedAnalyticsEvents.push(...data);
              return { count: data.length };
            }),
          },
        };

        const result = await callback(tx);
        committedSummary = stagedSummary;
        committedChapterProgress = stagedChapterProgress;
        committedAttempts.push(...stagedAttempts);
        committedAnalyticsEvents.push(...stagedAnalyticsEvents);
        return result;
      },
    } as never,
    createdAttempts: committedAttempts,
    createdAnalyticsEvents: committedAnalyticsEvents,
    getSummary: () => committedSummary,
    getChapterProgress: () => committedChapterProgress,
  };
}

describe("progress/service", () => {
  beforeEach(() => {
    getPhaseByIdMock.mockReset();
    getChapterByIdMock.mockReset();
    getPhasesByChapterIdMock.mockReset();
    ensurePlayerInventorySnapshotMock.mockReset();
    applyPhaseCompletionRewardsMock.mockReset();

    getPhaseByIdMock.mockReturnValue({
      id: "chapter-1-phase-1",
      chapterId: "chapter-1",
      number: 1,
      technicalType: "construction",
    });
    getChapterByIdMock.mockReturnValue({
      id: "chapter-1",
      phaseIds: ["chapter-1-phase-1", "chapter-1-phase-2"],
    });
    getPhasesByChapterIdMock.mockReturnValue([
      { id: "chapter-1-phase-1", number: 1 },
      { id: "chapter-1-phase-2", number: 2 },
    ]);
    ensurePlayerInventorySnapshotMock.mockResolvedValue({
      carbonAvailable: 1,
      hydrogenMode: "implicit_infinite",
      unlockedFragments: ["ligacao_simples"],
      unlockedMolecules: [],
      unlockedTitles: [],
    });
    applyPhaseCompletionRewardsMock.mockResolvedValue({
      inventory: {
        carbonAvailable: 2,
        hydrogenMode: "implicit_infinite",
        unlockedFragments: ["ligacao_simples"],
        unlockedMolecules: ["metano"],
        unlockedTitles: ["Centelha de Carbono"],
      },
      grantedRewards: [
        { rewardType: "carbon", rewardValue: "1" },
        { rewardType: "molecule", rewardValue: "metano" },
      ],
    });
  });

  it("aplica recompensas apenas na primeira conclusão correta", async () => {
    const { db, createdAnalyticsEvents } = createProgressDb();

    const result = await persistPhaseEvaluation(db, {
      playerId: "player-1",
      submission: {
        phaseId: "chapter-1-phase-1",
        builderState: {
          layout: "open_chain",
          carbonCount: 1,
          bonds: [],
        },
        selectedProperties: ["cadeia_curta"],
      },
      evaluation: {
        phaseId: "chapter-1-phase-1",
        selectedMoleculeId: "metano",
        selectedProperties: ["cadeia_curta"],
        builderState: {
          layout: "open_chain",
          carbonCount: 1,
          bonds: [],
        },
        qualitativeResult: "excellent",
        validationResult: "correct",
        scoreAwarded: 3,
        expectedPropertiesMatched: ["cadeia_curta"],
        feedback: "ok",
      },
    });

    expect(applyPhaseCompletionRewardsMock).toHaveBeenCalledTimes(1);
    expect(result.grantedRewards).toEqual([
      { rewardType: "carbon", rewardValue: "1" },
      { rewardType: "molecule", rewardValue: "metano" },
    ]);
    expect(result.phaseSummary.isCompleted).toBe(true);
    expect(result.chapterProgress.highestUnlockedPhaseNumber).toBe(2);
    expect(createdAnalyticsEvents.map((event) => event.eventType)).toEqual([
      "phase_submitted",
      "phase_evaluated",
      "phase_completed",
      "reward_granted",
    ]);
  });

  it("não duplica recompensa em replay de fase já concluída e preserva bestScore", async () => {
    const previousSummary: SummaryRecord = {
      playerId: "player-1",
      phaseId: "chapter-1-phase-1",
      isCompleted: true,
      bestQualitativeResult: "excellent",
      bestValidationResult: "correct",
      bestScore: 3,
      attemptCount: 1,
      firstCompletedAt: new Date("2026-01-01T00:00:00.000Z"),
      lastAttemptAt: new Date("2026-01-01T00:00:00.000Z"),
    };
    const { db, createdAnalyticsEvents, getSummary } = createProgressDb({
      previousSummary,
      summariesByChapter: [previousSummary],
    });

    const result = await persistPhaseEvaluation(db, {
      playerId: "player-1",
      submission: {
        phaseId: "chapter-1-phase-1",
        builderState: {
          layout: "open_chain",
          carbonCount: 1,
          bonds: [],
        },
        selectedProperties: ["cadeia_curta"],
      },
      evaluation: {
        phaseId: "chapter-1-phase-1",
        selectedMoleculeId: "metano",
        selectedProperties: ["cadeia_curta"],
        builderState: {
          layout: "open_chain",
          carbonCount: 1,
          bonds: [],
        },
        qualitativeResult: "adequate",
        validationResult: "correct",
        scoreAwarded: 2,
        expectedPropertiesMatched: ["cadeia_curta"],
        feedback: "ok",
      },
    });

    expect(applyPhaseCompletionRewardsMock).not.toHaveBeenCalled();
    expect(result.grantedRewards).toEqual([]);
    expect(getSummary()).toMatchObject({
      bestScore: 3,
      attemptCount: 2,
      bestQualitativeResult: "excellent",
    });
    expect(createdAnalyticsEvents.map((event) => event.eventType)).toEqual([
      "phase_submitted",
      "phase_evaluated",
      "phase_replayed",
    ]);
  });

  it("não comita estado parcial quando uma etapa tardia da transação falha", async () => {
    const { db, createdAttempts, createdAnalyticsEvents, getSummary, getChapterProgress } =
      createProgressDb({
        failOnAnalytics: true,
      });

    await expect(
      persistPhaseEvaluation(db, {
        playerId: "player-1",
        submission: {
          phaseId: "chapter-1-phase-1",
          builderState: {
            layout: "open_chain",
            carbonCount: 1,
            bonds: [],
          },
          selectedProperties: ["cadeia_curta"],
        },
        evaluation: {
          phaseId: "chapter-1-phase-1",
          selectedMoleculeId: "metano",
          selectedProperties: ["cadeia_curta"],
          builderState: {
            layout: "open_chain",
            carbonCount: 1,
            bonds: [],
          },
          qualitativeResult: "excellent",
          validationResult: "correct",
          scoreAwarded: 3,
          expectedPropertiesMatched: ["cadeia_curta"],
          feedback: "ok",
        },
      }),
    ).rejects.toThrow("analytics failed");

    expect(createdAttempts).toEqual([]);
    expect(createdAnalyticsEvents).toEqual([]);
    expect(getSummary()).toBeNull();
    expect(getChapterProgress()).toBeNull();
  });

  it("não comita estado parcial quando a aplicação de recompensas falha", async () => {
    applyPhaseCompletionRewardsMock.mockRejectedValue(new Error("reward persistence failed"));

    const { db, createdAttempts, createdAnalyticsEvents, getSummary, getChapterProgress } =
      createProgressDb();

    await expect(
      persistPhaseEvaluation(db, {
        playerId: "player-1",
        submission: {
          phaseId: "chapter-1-phase-1",
          builderState: {
            layout: "open_chain",
            carbonCount: 1,
            bonds: [],
          },
          selectedProperties: ["cadeia_curta"],
        },
        evaluation: {
          phaseId: "chapter-1-phase-1",
          selectedMoleculeId: "metano",
          selectedProperties: ["cadeia_curta"],
          builderState: {
            layout: "open_chain",
            carbonCount: 1,
            bonds: [],
          },
          qualitativeResult: "excellent",
          validationResult: "correct",
          scoreAwarded: 3,
          expectedPropertiesMatched: ["cadeia_curta"],
          feedback: "ok",
        },
      }),
    ).rejects.toThrow("reward persistence failed");

    expect(createdAttempts).toEqual([]);
    expect(createdAnalyticsEvents).toEqual([]);
    expect(getSummary()).toBeNull();
    expect(getChapterProgress()).toBeNull();
  });

  it("persiste builderStateJson branched_v2 e molécula construída oficial", async () => {
    const { db, createdAttempts } = createProgressDb();

    await persistPhaseEvaluation(db, {
      playerId: "player-1",
      submission: {
        phaseId: "chapter-1-phase-1",
        builderState: branchedMethaneState,
        selectedProperties: ["cadeia_curta"],
      },
      evaluation: {
        phaseId: "chapter-1-phase-1",
        selectedMoleculeId: "metano",
        selectedProperties: ["cadeia_curta"],
        builderState: branchedMethaneState,
        qualitativeResult: "excellent",
        validationResult: "correct",
        scoreAwarded: 3,
        expectedPropertiesMatched: ["cadeia_curta"],
        feedback: "ok",
      },
    });

    expect(createdAttempts).toHaveLength(1);
    expect(createdAttempts[0]).toMatchObject({
      builderStateJson: branchedMethaneState,
      constructedMoleculeId: "metano",
      selectedMoleculeId: "metano",
    });
  });
});
