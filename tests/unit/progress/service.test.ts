import { beforeEach, describe, expect, it, vi } from "vitest";

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
  previousSummary?: SummaryRecord | null;
  summariesByChapter?: SummaryRecord[];
}) {
  const previousSummary = options?.previousSummary ?? null;
  let upsertedSummary: SummaryRecord | null = null;
  let upsertedChapterProgress: Record<string, unknown> | null = null;
  const createdAttempts: Array<Record<string, unknown>> = [];
  const createdAnalyticsEvents: Array<Record<string, unknown>> = [];

  const tx = {
    playerPhaseAttempt: {
      create: vi.fn(async ({ data }: { data: Record<string, unknown> }) => {
        createdAttempts.push(data);
        return { id: "attempt-1" };
      }),
    },
    playerPhaseSummary: {
      findUnique: vi.fn(async () => previousSummary),
      upsert: vi.fn(async ({ create, update }: { create: SummaryRecord; update: Partial<SummaryRecord> }) => {
        upsertedSummary = previousSummary ? { ...previousSummary, ...update } : create;
        return upsertedSummary;
      }),
      findMany: vi.fn(async () => {
        if (options?.summariesByChapter) {
          return options.summariesByChapter;
        }

        return upsertedSummary ? [upsertedSummary] : [];
      }),
    },
    playerChapterProgress: {
      upsert: vi.fn(async ({ create, update }: { create: Record<string, unknown>; update: Record<string, unknown> }) => {
        upsertedChapterProgress = previousSummary ? update : create;
        return upsertedChapterProgress;
      }),
    },
    playerAnalyticsEvent: {
      createMany: vi.fn(async ({ data }: { data: Array<Record<string, unknown>> }) => {
        createdAnalyticsEvents.push(...data);
        return { count: data.length };
      }),
    },
  };

  return {
    db: {
      $transaction: async (
        callback: (client: typeof tx) => Promise<unknown>,
      ) => callback(tx),
    } as never,
    createdAttempts,
    createdAnalyticsEvents,
    getSummary: () => upsertedSummary,
    getChapterProgress: () => upsertedChapterProgress,
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
});
