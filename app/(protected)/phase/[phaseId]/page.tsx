import { notFound, redirect } from "next/navigation";

import { PhaseExperience } from "@/components/phase/phase-experience";
import { requireAuthenticatedPlayer } from "@/lib/auth/session";
import { getMoleculesByIds, getPhaseById } from "@/lib/content/loaders";
import { phaseIdSchema } from "@/lib/content/schema";
import { prisma } from "@/lib/db/prisma";
import { getChapterProgressView } from "@/lib/progress/queries";

export default async function PhasePage({
  params,
}: {
  params: Promise<{ phaseId: string }>;
}) {
  const { phaseId } = await params;
  const parsedPhaseId = phaseIdSchema.safeParse(phaseId);

  if (!parsedPhaseId.success) {
    notFound();
  }

  const player = await requireAuthenticatedPlayer(prisma);
  const phase = getPhaseById(parsedPhaseId.data);
  const chapterProgress = await getChapterProgressView(prisma, player.playerId, phase.chapterId);
  const phaseProgress = chapterProgress.phases.find((item) => item.phaseId === phase.id);

  if (!phaseProgress?.isUnlocked) {
    redirect(`/chapter/${phase.chapterId}`);
  }

  const molecules = getMoleculesByIds(phase.availableMolecules);

  return <PhaseExperience phase={phase} molecules={molecules} chapterProgress={chapterProgress} />;
}
