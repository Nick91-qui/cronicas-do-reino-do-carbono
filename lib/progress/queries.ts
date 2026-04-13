import type { PrismaClient } from "@prisma/client";

import { getAllChapters, getChapterById, getPhasesByChapterId } from "@/lib/content/loaders";
import type {
  ChapterId,
  PhaseId,
  QualitativeResult,
  ValidationResult,
} from "@/lib/content/types";

type PhaseProgressItem = {
  phaseId: PhaseId;
  phaseNumber: number;
  title: string;
  technicalType: string;
  isUnlocked: boolean;
  isCompleted: boolean;
  bestScore: number;
  bestQualitativeResult: QualitativeResult | null;
  bestValidationResult: ValidationResult | null;
  attemptCount: number;
  lastAttemptAt: Date | null;
};

export type ChapterProgressView = {
  chapterId: ChapterId;
  chapterTitle: string;
  highestUnlockedPhaseNumber: number;
  completedPhaseCount: number;
  chapterScore: number;
  totalPhases: number;
  phases: PhaseProgressItem[];
};

export async function getChapterProgressView(
  db: PrismaClient,
  playerId: string,
  chapterId: ChapterId,
): Promise<ChapterProgressView> {
  const chapter = getChapterById(chapterId);
  const phases = getPhasesByChapterId(chapterId);
  const [persistedProgress, phaseSummaries] = await Promise.all([
    db.playerChapterProgress.findUnique({
      where: {
        playerId_chapterId: {
          playerId,
          chapterId,
        },
      },
    }),
    db.playerPhaseSummary.findMany({
      where: {
        playerId,
        phaseId: { in: chapter.phaseIds },
      },
    }),
  ]);

  const summariesByPhaseId = new Map(phaseSummaries.map((summary) => [summary.phaseId, summary]));
  const highestUnlockedPhaseNumber = persistedProgress?.highestUnlockedPhaseNumber ?? 1;

  return {
    chapterId,
    chapterTitle: chapter.title,
    highestUnlockedPhaseNumber,
    completedPhaseCount: persistedProgress?.completedPhaseCount ?? 0,
    chapterScore: persistedProgress?.chapterScore ?? 0,
    totalPhases: chapter.totalPhases,
    phases: phases.map((phase) => {
      const summary = summariesByPhaseId.get(phase.id);

      return {
        phaseId: phase.id,
        phaseNumber: phase.number,
        title: phase.title,
        technicalType: phase.technicalType,
        isUnlocked: phase.number <= highestUnlockedPhaseNumber,
        isCompleted: summary?.isCompleted ?? false,
        bestScore: summary?.bestScore ?? 0,
        bestQualitativeResult: summary?.bestQualitativeResult ?? null,
        bestValidationResult: summary?.bestValidationResult ?? null,
        attemptCount: summary?.attemptCount ?? 0,
        lastAttemptAt: summary?.lastAttemptAt ?? null,
      };
    }),
  };
}

export async function getAllChaptersProgressView(db: PrismaClient, playerId: string) {
  const chapters = getAllChapters();
  return Promise.all(chapters.map((chapter) => getChapterProgressView(db, playerId, chapter.id)));
}
