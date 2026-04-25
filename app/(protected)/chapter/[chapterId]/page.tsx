import Link from "next/link";
import { notFound } from "next/navigation";

import { ProtectedScene } from "@/components/scene/protected-scene";
import { prisma } from "@/lib/db/prisma";
import { requireAuthenticatedPlayer } from "@/lib/auth/session";
import { getChapterProgressView } from "@/lib/progress/queries";
import { blobAssets } from "@/lib/assets/blob";

function getPhaseStateCopy(phase: {
  isCompleted: boolean;
  isUnlocked: boolean;
  bestScore: number;
}) {
  if (phase.isCompleted) {
    return {
      seal: "Dominada",
      toneClass: "border-emerald-400/25 bg-emerald-500/10 text-emerald-100",
      summary: "Esta prova ja reconhece seu nome entre os que dominam suas estruturas.",
      meritLabel: "Forca obtida",
      actionLabel: "Revisitar prova",
    };
  }

  if (phase.isUnlocked) {
    return {
      seal: "Disponivel",
      toneClass: "border-cyan-300/25 bg-cyan-400/10 text-cyan-100",
      summary: "O portao desta prova acaba de se abrir. O laboratorio de sintese aguarda sua proxima decisao.",
      meritLabel: phase.bestScore > 0 ? "Forca obtida" : "Prova a conquistar",
      actionLabel: "Enfrentar prova",
    };
  }

  return {
    seal: "Selada",
    toneClass: "border-white/10 bg-white/5 text-slate-300",
    summary: "Os sigilos desta prova ainda nao responderam ao seu nome.",
    meritLabel: "Portao velado",
    actionLabel: "Portao ainda selado",
  };
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ chapterId: string }>;
}) {
  const { chapterId } = await params;

  if (chapterId !== "chapter-1") {
    notFound();
  }

  const player = await requireAuthenticatedPlayer(prisma);
  const progress = await getChapterProgressView(prisma, player.playerId, "chapter-1");
  const completedCount = progress.phases.filter((phase) => phase.isCompleted).length;
  const unlockedCount = progress.phases.filter((phase) => phase.isUnlocked).length;
  const progressPercent = Math.round((completedCount / progress.totalPhases) * 100);

  return (
    <ProtectedScene
      eyebrow="Mapa do capitulo"
      ambientLabel="Camara de cristalizacao"
      imageSrc={blobAssets.protectedCrystalChamber}
      imageAlt="Camara de cristalizacao do castelo."
      title={progress.chapterTitle}
      description={`O mapa do dominio mostra os portoes ja respondidos, os selos conquistados e a proxima prova que reconhece o nome de ${player.displayName}.`}
      stats={
        <>
          <div className="game-panel-muted">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Selos conquistados</p>
            <p className="pt-2 font-display text-3xl text-white">{completedCount}</p>
          </div>
          <div className="game-panel-muted">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Portoes abertos</p>
            <p className="pt-2 font-display text-3xl text-white">{unlockedCount}</p>
          </div>
          <div className="game-panel-muted">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Aprendiz em campo</p>
            <p className="pt-2 text-sm text-slate-100">{player.displayName}</p>
          </div>
        </>
      }
    >
      <section className="game-shell">
        <div className="h-3 overflow-hidden rounded-full border border-white/10 bg-slate-950/70">
          <div
            className="h-full rounded-full bg-[linear-gradient(90deg,rgba(56,189,248,0.92),rgba(245,158,11,0.92))]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="pt-3 text-sm text-slate-300">
          {completedCount} de {progress.totalPhases} provas dominadas. Portao mais distante: prova{" "}
          {progress.highestUnlockedPhaseNumber}.
        </p>
      </section>

      <section className="grid gap-4">
        {progress.phases.map((phase) => {
          const stateCopy = getPhaseStateCopy(phase);
          const nodeClass = phase.isCompleted
            ? "border-emerald-400/20 bg-emerald-500/10"
            : phase.isUnlocked
              ? "border-sky-300/20 bg-sky-400/10"
              : "border-white/10 bg-white/5";

          return (
            <article
              key={phase.phaseId}
              className={`game-panel relative overflow-hidden ${nodeClass}`}
            >
              <div className="absolute bottom-0 left-7 top-0 hidden w-px bg-[linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0.02))] md:block" />
              <div className="relative flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-2xl md:pl-12">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border text-lg font-black text-white ${nodeClass}`}>
                      {String(phase.phaseNumber).padStart(2, "0")}
                    </div>
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">
                        Prova {phase.phaseNumber}
                      </p>
                      <div className={`mt-2 inline-flex rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] ${stateCopy.toneClass}`}>
                        {stateCopy.seal}
                      </div>
                    </div>
                  </div>
                  <h2 className="mt-5 text-2xl tracking-[0.04em] text-white sm:text-3xl">
                    {phase.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    {stateCopy.summary}
                  </p>
                </div>

                <div className="grid gap-3 text-sm text-slate-300 sm:grid-cols-2 lg:min-w-[360px]">
                  <div className="game-panel-muted">
                    <p className="text-slate-500">{stateCopy.meritLabel}</p>
                    <p className="mt-1 font-semibold text-white">
                      {phase.bestScore > 0 ? phase.bestScore : phase.isUnlocked ? "Aguardando seu sinal" : "Sob sigilo"}
                    </p>
                  </div>
                  <div className="game-panel-muted">
                    <p className="text-slate-500">Passagem pelo dominio</p>
                    <p className="mt-1 font-semibold text-white">
                      {phase.isCompleted ? "Selo conquistado" : phase.isUnlocked ? "Portao respondendo" : "Silencio dos sigilos"}
                    </p>
                  </div>
                  <div className="game-panel-muted sm:col-span-2">
                    <p className="text-slate-500">Ritmo da prova</p>
                    <p className="mt-1 font-semibold text-white">
                      {phase.attemptCount > 0
                        ? `${phase.attemptCount} tentativa(s) registradas`
                        : "Nenhuma tentativa inscrita ainda"}
                    </p>
                    <p className="mt-2 text-xs text-slate-400">
                      {phase.bestQualitativeResult
                        ? `Resultado mais alto: ${phase.bestQualitativeResult}`
                        : "A avaliacao qualitativa aparecera apos sua primeira resposta."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center md:pl-12">
                <Link
                  href={`/phase/${phase.phaseId}`}
                  className="state-action"
                  data-tone={phase.isUnlocked ? "primary" : "secondary"}
                  data-state={phase.isUnlocked ? "active" : "locked"}
                >
                  {stateCopy.actionLabel}
                </Link>
                <Link href="/collection" className="ritual-link px-5 py-3 text-sm">
                  Consultar grimorio
                </Link>
              </div>
            </article>
          );
        })}
      </section>
    </ProtectedScene>
  );
}
