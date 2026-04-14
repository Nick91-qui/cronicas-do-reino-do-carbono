-- CreateEnum
CREATE TYPE "PhaseType" AS ENUM ('construction', 'choice', 'construction_choice');

-- CreateEnum
CREATE TYPE "QualitativeResult" AS ENUM ('excellent', 'adequate', 'inadequate');

-- CreateEnum
CREATE TYPE "ValidationResult" AS ENUM ('correct', 'incorrect');

-- CreateTable
CREATE TABLE "Classroom" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Classroom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "classroomId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerPhaseAttempt" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "phaseId" TEXT NOT NULL,
    "phaseType" "PhaseType" NOT NULL,
    "builderStateJson" JSONB,
    "constructedMoleculeId" TEXT,
    "selectedMoleculeId" TEXT,
    "selectedPropertiesJson" JSONB,
    "qualitativeResult" "QualitativeResult" NOT NULL,
    "validationResult" "ValidationResult" NOT NULL,
    "scoreAwarded" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlayerPhaseAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerPhaseSummary" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "phaseId" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "bestQualitativeResult" "QualitativeResult",
    "bestValidationResult" "ValidationResult",
    "bestScore" INTEGER NOT NULL DEFAULT 0,
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "firstCompletedAt" TIMESTAMP(3),
    "lastAttemptAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlayerPhaseSummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerChapterProgress" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "highestUnlockedPhaseNumber" INTEGER NOT NULL,
    "completedPhaseCount" INTEGER NOT NULL DEFAULT 0,
    "chapterScore" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlayerChapterProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerInventory" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "carbonAvailable" INTEGER NOT NULL,
    "hydrogenMode" TEXT NOT NULL,
    "unlockedFragmentsJson" JSONB NOT NULL,
    "unlockedMoleculesJson" JSONB NOT NULL,
    "unlockedTitlesJson" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlayerInventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerRewardEvent" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "phaseId" TEXT,
    "rewardType" TEXT NOT NULL,
    "rewardValue" TEXT NOT NULL,
    "metadataJson" JSONB,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlayerRewardEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerAnalyticsEvent" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "phaseId" TEXT,
    "payloadJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlayerAnalyticsEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Classroom_code_key" ON "Classroom"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Player_username_key" ON "Player"("username");

-- CreateIndex
CREATE INDEX "PlayerPhaseAttempt_playerId_phaseId_idx" ON "PlayerPhaseAttempt"("playerId", "phaseId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerPhaseSummary_playerId_phaseId_key" ON "PlayerPhaseSummary"("playerId", "phaseId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerChapterProgress_playerId_chapterId_key" ON "PlayerChapterProgress"("playerId", "chapterId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerInventory_playerId_key" ON "PlayerInventory"("playerId");

-- CreateIndex
CREATE INDEX "PlayerRewardEvent_playerId_phaseId_idx" ON "PlayerRewardEvent"("playerId", "phaseId");

-- CreateIndex
CREATE INDEX "PlayerAnalyticsEvent_playerId_phaseId_idx" ON "PlayerAnalyticsEvent"("playerId", "phaseId");

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerPhaseAttempt" ADD CONSTRAINT "PlayerPhaseAttempt_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerPhaseSummary" ADD CONSTRAINT "PlayerPhaseSummary_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerChapterProgress" ADD CONSTRAINT "PlayerChapterProgress_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerInventory" ADD CONSTRAINT "PlayerInventory_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerRewardEvent" ADD CONSTRAINT "PlayerRewardEvent_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerAnalyticsEvent" ADD CONSTRAINT "PlayerAnalyticsEvent_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
