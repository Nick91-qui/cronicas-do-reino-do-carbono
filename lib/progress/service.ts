import type { Prisma, PrismaClient } from "@prisma/client";

import { getChapterById, getPhasesByChapterId, getPhaseById } from "@/lib/content/loaders";
import type {
  ChapterId,
  PhaseId,
  PlayerInventory,
  QualitativeResult,
  ValidationResult,
} from "@/lib/content/types";
import { applyPhaseCompletionRewards, ensurePlayerInventorySnapshot } from "@/lib/inventory/service";
import type { EvaluatedPhaseSubmission, PhaseSubmitInput } from "@/lib/gameplay/types";

type DbClient = PrismaClient | Prisma.TransactionClient;

type PhaseSummarySnapshot = {
  phaseId: PhaseId;
  isCompleted: boolean;
  bestQualitativeResult: QualitativeResult | null;
  bestValidationResult: ValidationResult | null;
  bestScore: number;
  attemptCount: number;
  firstCompletedAt: Date | null;
  lastAttemptAt: Date | null;
};

type ChapterProgressSnapshot = {
  chapterId: ChapterId;
  highestUnlockedPhaseNumber: number;
  completedPhaseCount: number;
  chapterScore: number;
};

export type PersistedPhaseEvaluation = {
  attemptId: string;
  phaseSummary: PhaseSummarySnapshot;
  chapterProgress: ChapterProgressSnapshot;
  inventory: PlayerInventory;
  grantedRewards: Array<{
    rewardType: string;
    rewardValue: string;
  }>;
  analyticsEventsRecorded: string[];
};

export type PersistPhaseEvaluationInput = {
  playerId: string;
  submission: PhaseSubmitInput;
  evaluation: EvaluatedPhaseSubmission;
};

function toPhaseSummarySnapshot(summary: {
  phaseId: string;
  isCompleted: boolean;
  bestQualitativeResult: QualitativeResult | null;
  bestValidationResult: ValidationResult | null;
  bestScore: number;
  attemptCount: number;
  firstCompletedAt: Date | null;
  lastAttemptAt: Date | null;
}): PhaseSummarySnapshot {
  return {
    phaseId: summary.phaseId as PhaseId,
    isCompleted: summary.isCompleted,
    bestQualitativeResult: summary.bestQualitativeResult,
    bestValidationResult: summary.bestValidationResult,
    bestScore: summary.bestScore,
    attemptCount: summary.attemptCount,
    firstCompletedAt: summary.firstCompletedAt,
    lastAttemptAt: summary.lastAttemptAt,
  };
}

function computeHighestUnlockedPhaseNumber(chapterId: ChapterId, summaries: PhaseSummarySnapshot[]): number {
  const phases = getPhasesByChapterId(chapterId);
  const phaseSummaries = new Map(summaries.map((summary) => [summary.phaseId, summary]));
  let highestUnlocked = 1;

  for (const phase of phases) {
    const summary = phaseSummaries.get(phase.id);

    if (!summary?.isCompleted) {
      break;
    }

    highestUnlocked = Math.min(phase.number + 1, phases.length);
  }

  return highestUnlocked;
}

async function upsertPhaseSummary(
  db: DbClient,
  input: PersistPhaseEvaluationInput,
  attemptedAt: Date,
): Promise<{
  summary: PhaseSummarySnapshot;
  becameCompletedNow: boolean;
}> {
  const previousSummary = await db.playerPhaseSummary.findUnique({
    where: {
      playerId_phaseId: {
        playerId: input.playerId,
        phaseId: input.evaluation.phaseId,
      },
    },
  });

  const shouldReplaceBest = !previousSummary || input.evaluation.scoreAwarded > previousSummary.bestScore;
  const becameCompletedNow = !previousSummary?.isCompleted && input.evaluation.validationResult === "correct";

  const summary = await db.playerPhaseSummary.upsert({
    where: {
      playerId_phaseId: {
        playerId: input.playerId,
        phaseId: input.evaluation.phaseId,
      },
    },
    create: {
      playerId: input.playerId,
      phaseId: input.evaluation.phaseId,
      isCompleted: input.evaluation.validationResult === "correct",
      bestQualitativeResult: input.evaluation.qualitativeResult,
      bestValidationResult: input.evaluation.validationResult,
      bestScore: input.evaluation.scoreAwarded,
      attemptCount: 1,
      firstCompletedAt: input.evaluation.validationResult === "correct" ? attemptedAt : null,
      lastAttemptAt: attemptedAt,
    },
    update: {
      isCompleted: previousSummary?.isCompleted || input.evaluation.validationResult === "correct",
      bestQualitativeResult: shouldReplaceBest
        ? input.evaluation.qualitativeResult
        : previousSummary?.bestQualitativeResult,
      bestValidationResult: shouldReplaceBest
        ? input.evaluation.validationResult
        : previousSummary?.bestValidationResult,
      bestScore: Math.max(previousSummary?.bestScore ?? 0, input.evaluation.scoreAwarded),
      attemptCount: (previousSummary?.attemptCount ?? 0) + 1,
      firstCompletedAt:
        previousSummary?.firstCompletedAt ??
        (input.evaluation.validationResult === "correct" ? attemptedAt : null),
      lastAttemptAt: attemptedAt,
    },
  });

  return {
    summary: toPhaseSummarySnapshot(summary),
    becameCompletedNow,
  };
}

async function upsertChapterProgress(
  db: DbClient,
  playerId: string,
  chapterId: ChapterId,
): Promise<ChapterProgressSnapshot> {
  const chapter = getChapterById(chapterId);
  const summaries = await db.playerPhaseSummary.findMany({
    where: {
      playerId,
      phaseId: { in: chapter.phaseIds },
    },
    select: {
      phaseId: true,
      isCompleted: true,
      bestQualitativeResult: true,
      bestValidationResult: true,
      bestScore: true,
      attemptCount: true,
      firstCompletedAt: true,
      lastAttemptAt: true,
    },
  });

  const snapshots = summaries.map(toPhaseSummarySnapshot);
  const progress = {
    chapterId,
    highestUnlockedPhaseNumber: computeHighestUnlockedPhaseNumber(chapterId, snapshots),
    completedPhaseCount: snapshots.filter((summary) => summary.isCompleted).length,
    chapterScore: snapshots.reduce((total, summary) => total + summary.bestScore, 0),
  };

  await db.playerChapterProgress.upsert({
    where: {
      playerId_chapterId: {
        playerId,
        chapterId,
      },
    },
    create: {
      playerId,
      chapterId,
      highestUnlockedPhaseNumber: progress.highestUnlockedPhaseNumber,
      completedPhaseCount: progress.completedPhaseCount,
      chapterScore: progress.chapterScore,
    },
    update: {
      highestUnlockedPhaseNumber: progress.highestUnlockedPhaseNumber,
      completedPhaseCount: progress.completedPhaseCount,
      chapterScore: progress.chapterScore,
    },
  });

  return progress;
}

export async function getPlayerChapterProgress(
  db: DbClient,
  playerId: string,
  chapterId: ChapterId,
): Promise<ChapterProgressSnapshot> {
  const progress = await db.playerChapterProgress.findUnique({
    where: {
      playerId_chapterId: {
        playerId,
        chapterId,
      },
    },
  });

  if (!progress) {
    return {
      chapterId,
      highestUnlockedPhaseNumber: 1,
      completedPhaseCount: 0,
      chapterScore: 0,
    };
  }

  return {
    chapterId,
    highestUnlockedPhaseNumber: progress.highestUnlockedPhaseNumber,
    completedPhaseCount: progress.completedPhaseCount,
    chapterScore: progress.chapterScore,
  };
}

export async function persistPhaseEvaluation(
  db: PrismaClient,
  input: PersistPhaseEvaluationInput,
): Promise<PersistedPhaseEvaluation> {
  if (input.submission.phaseId !== input.evaluation.phaseId) {
    throw new Error("Submissão e avaliação precisam referenciar a mesma fase.");
  }

  const phase = getPhaseById(input.evaluation.phaseId);
  const attemptedAt = new Date();

  const result = await db.$transaction(async (tx) => {
    const attempt = await tx.playerPhaseAttempt.create({
      data: {
        playerId: input.playerId,
        phaseId: phase.id,
        phaseType: phase.technicalType,
        builderStateJson: input.submission.builderState,
        constructedMoleculeId: input.evaluation.builderState
          ? input.evaluation.selectedMoleculeId
          : null,
        selectedMoleculeId: input.submission.selectedMoleculeId ?? input.evaluation.selectedMoleculeId,
        selectedPropertiesJson: input.evaluation.selectedProperties,
        qualitativeResult: input.evaluation.qualitativeResult,
        validationResult: input.evaluation.validationResult,
        scoreAwarded: input.evaluation.scoreAwarded,
        createdAt: attemptedAt,
      },
      select: { id: true },
    });

    const { summary, becameCompletedNow } = await upsertPhaseSummary(tx, input, attemptedAt);
    const chapterProgress = await upsertChapterProgress(tx, input.playerId, phase.chapterId);

    let inventory = await ensurePlayerInventorySnapshot(tx, input.playerId);
    let grantedRewards: Array<{ rewardType: string; rewardValue: string }> = [];
    const analyticsEventsRecorded = ["phase_submitted", "phase_evaluated"];

    if (becameCompletedNow) {
      const rewardResult = await applyPhaseCompletionRewards(tx, input.playerId, phase);
      inventory = rewardResult.inventory;
      grantedRewards = rewardResult.grantedRewards;
      analyticsEventsRecorded.push("phase_completed");

      if (grantedRewards.length > 0) {
        analyticsEventsRecorded.push("reward_granted");
      }
    } else if (summary.isCompleted) {
      analyticsEventsRecorded.push("phase_replayed");
    }

    await tx.playerAnalyticsEvent.createMany({
      data: analyticsEventsRecorded.map((eventType) => ({
        playerId: input.playerId,
        phaseId: phase.id,
        eventType,
        payloadJson: {
          chapterId: phase.chapterId,
          qualitativeResult: input.evaluation.qualitativeResult,
          validationResult: input.evaluation.validationResult,
          scoreAwarded: input.evaluation.scoreAwarded,
        },
      })),
    });

    return {
      attemptId: attempt.id,
      phaseSummary: summary,
      chapterProgress,
      inventory,
      grantedRewards,
      analyticsEventsRecorded,
    };
  });

  return result;
}
