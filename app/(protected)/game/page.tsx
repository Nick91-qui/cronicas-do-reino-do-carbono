import Link from "next/link";
import { notFound } from "next/navigation";

import { HallPhaseViewer } from "@/components/game/hall-phase-viewer";
import { ProtectedScene } from "@/components/scene/protected-scene";
import { prisma } from "@/lib/db/prisma";
import { requireAuthenticatedPlayer } from "@/lib/auth/session";
import { getPrimaryChapter } from "@/lib/content/loaders";
import { getAllChaptersProgressView } from "@/lib/progress/queries";
import { getPlayerInventorySnapshot } from "@/lib/inventory/service";
import { blobAssets } from "@/lib/assets/blob";

export default async function GamePage() {
  const player = await requireAuthenticatedPlayer(prisma);
  const [progress, inventory] = await Promise.all([
    getAllChaptersProgressView(prisma, player.playerId),
    getPlayerInventorySnapshot(prisma, player.playerId),
  ]);

  const primaryChapter = getPrimaryChapter();
  const chapterProgress = progress.find(
    (chapter) => chapter.chapterId === primaryChapter.id,
  );

  if (!chapterProgress || chapterProgress.phases.length === 0) {
    notFound();
  }

  const nextPhaseId =
    chapterProgress.phases.find((phase) => phase.isUnlocked && !phase.isCompleted)
      ?.phaseId ?? chapterProgress.phases[0].phaseId;
  const nextPhase = chapterProgress.phases.find(
    (phase) => phase.phaseId === nextPhaseId,
  );
  const completedCount = chapterProgress.phases.filter(
    (phase) => phase.isCompleted,
  ).length;
  const unlockedCount = chapterProgress.phases.filter(
    (phase) => phase.isUnlocked,
  ).length;
  const progressPercent = Math.round(
    (completedCount / chapterProgress.totalPhases) * 100,
  );

  return (
    <>
      <section className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 sm:pt-8">
        <div className="rounded-[28px] border border-white/10 bg-[rgba(5,8,18,0.78)] px-5 py-5 shadow-[0_20px_60px_rgba(2,6,23,0.28)] backdrop-blur-xl sm:px-8">
          <Link
            href="/game"
            className="font-display text-2xl tracking-[0.08em] text-white sm:text-3xl"
          >
            Cronicas do Reino do Carbono
          </Link>
          <p className="truncate pt-1 text-sm text-slate-300">
            {player.displayName} · turma {player.classroomCode}
          </p>
        </div>
      </section>

      <ProtectedScene
        eyebrow="Salao do reino"
        ambientLabel="Conselho central"
        imageSrc={blobAssets.protectedGrandHall}
        imageAlt="Salao central do castelo."
        title={`Seu proximo passo no reino, ${player.displayName}.`}
        description="Retome seus estudos, veja qual prova vem a seguir e acompanhe o que voce ja conquistou no reino."
        actions={
          <>
            <Link
              href={`/chapter/${chapterProgress.chapterId}`}
              className="state-action px-6"
              data-tone="primary"
            >
              Ver mapa do capitulo
            </Link>
            <Link
              href={`/phase/${nextPhaseId}`}
              className="ritual-link min-h-12 rounded-full px-6 py-3 text-sm"
            >
              Ir para prova {nextPhase?.phaseNumber}
            </Link>
          </>
        }
        stats={
          <>
            <div className="game-panel-muted">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Dominio em curso
              </p>
              <p className="pt-2 font-display text-2xl text-white">
                {chapterProgress.chapterTitle}
              </p>
              <p className="pt-2 text-sm text-slate-300">
                Proxima prova: {nextPhase?.phaseNumber} · {nextPhase?.title}
              </p>
            </div>
            <div className="game-panel-muted">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Avanco no capitulo
              </p>
              <p className="pt-2 font-display text-3xl text-white">
                {progressPercent}%
              </p>
              <p className="pt-2 text-sm text-slate-300">
                {completedCount} de {chapterProgress.totalPhases} provas concluidas.
              </p>
            </div>
          </>
        }
      >
        <section className="grid gap-4 xl:grid-cols-[1.4fr,0.85fr]">
          <article className="game-panel">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">
                  Seu caminho
                </p>
                <h2 className="pt-2 text-3xl tracking-[0.05em] text-white">
                  Mapa ritual das provas
                </h2>
              </div>
              <div className="hud-chip">
                {unlockedCount} provas abertas
              </div>
            </div>

            <HallPhaseViewer
              chapterId={chapterProgress.chapterId}
              initialPhaseId={nextPhaseId}
              phases={chapterProgress.phases}
            />
          </article>

          <div className="grid gap-4">
            <article className="game-panel">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">
                Seus recursos
              </p>
              <dl className="mt-5 grid gap-3 text-sm text-slate-300">
                <div className="game-panel-muted">
                  <dt className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    Carbonos na bancada
                  </dt>
                  <dd className="pt-2 font-display text-3xl text-white">
                    {inventory.carbonAvailable}
                  </dd>
                </div>
                <div className="game-panel-muted">
                  <dt className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    Fragmentos dominados
                  </dt>
                  <dd className="pt-2 text-slate-100">
                    {inventory.unlockedFragments.join(", ") ||
                      "Nenhum fragmento registrado"}
                  </dd>
                </div>
                <div className="game-panel-muted">
                  <dt className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    Moleculas inscritas
                  </dt>
                  <dd className="pt-2 font-display text-2xl text-white">
                    {inventory.unlockedMolecules.length}
                  </dd>
                </div>
              </dl>
            </article>

            <article className="game-panel">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">
                O que fazer agora
              </p>
              <div className="mt-5 space-y-3 text-sm leading-7 text-slate-300">
                <p>
                  Sua proxima prova e{" "}
                  <span className="font-semibold text-white">
                    prova {nextPhase?.phaseNumber}
                    {nextPhase ? ` · ${nextPhase.title}` : ""}
                  </span>
                  .
                </p>
                <p>
                  Se tiver dificuldade, volte ao mapa do capitulo para rever o que
                  ja foi concluido e escolher com calma o proximo passo.
                </p>
                <p>
                  Sua pontuacao neste capitulo:{" "}
                  <span className="font-semibold text-white">
                    {chapterProgress.chapterScore}
                  </span>
                  .
                </p>
              </div>
            </article>
          </div>
        </section>
      </ProtectedScene>
    </>
  );
}
