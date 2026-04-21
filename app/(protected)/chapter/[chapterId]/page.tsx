import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/db/prisma";
import { requireAuthenticatedPlayer } from "@/lib/auth/session";
import { getChapterProgressView } from "@/lib/progress/queries";

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
      summary: "O portao desta prova acaba de se abrir. A forja aguarda sua proxima decisao.",
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

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <section className="relative overflow-hidden rounded-[32px] border border-cyan-300/20 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_30%),radial-gradient(circle_at_top_right,rgba(251,191,36,0.14),transparent_24%),linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,6,23,0.98))] p-8 shadow-[0_24px_80px_rgba(2,6,23,0.42)]">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.04)_32%,transparent_60%)]" />
        <div className="relative grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
              Capitulo I
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-white">
              {progress.chapterTitle}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              Neste dominio, o aprendiz aprende a ler cadeias, reconhecer saturacao e compreender o poder das primeiras estruturas.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Provas vencidas
              </p>
              <p className="mt-2 text-2xl font-black text-white">{completedCount}</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Portoes abertos
              </p>
              <p className="mt-2 text-2xl font-black text-white">{unlockedCount}</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Aprendiz
              </p>
              <p className="mt-2 text-lg font-semibold text-white">{player.displayName}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4">
        {progress.phases.map((phase) => {
          const stateCopy = getPhaseStateCopy(phase);

          return (
            <article
              key={phase.phaseId}
              className={`rounded-[28px] border p-5 shadow-[0_18px_50px_rgba(15,23,42,0.22)] ${
                phase.isCompleted
                  ? "border-emerald-400/20 bg-emerald-500/5"
                  : phase.isUnlocked
                    ? "border-cyan-300/20 bg-cyan-400/5"
                    : "border-white/10 bg-white/5"
              }`}
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-2xl">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">
                    Prova {phase.phaseNumber}
                  </p>
                  <h2 className="mt-2 text-2xl font-black tracking-tight text-white">{phase.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{stateCopy.summary}</p>
                </div>

                <div className="grid gap-3 text-sm text-slate-300 sm:grid-cols-2 lg:min-w-[340px]">
                  <div className="rounded-2xl border border-white/8 bg-slate-950/35 px-4 py-3">
                    <p className="text-slate-500">{stateCopy.meritLabel}</p>
                    <p className="mt-1 font-semibold text-white">
                      {phase.bestScore > 0 ? phase.bestScore : phase.isUnlocked ? "Aguardando seu sinal" : "Sob sigilo"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-slate-950/35 px-4 py-3">
                    <p className="text-slate-500">Passagem pelo dominio</p>
                    <p className="mt-1 font-semibold text-white">
                      {phase.isCompleted ? "Selo conquistado" : phase.isUnlocked ? "Portao respondendo" : "Silencio dos sigilos"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Link
                  href={`/phase/${phase.phaseId}`}
                  className={`inline-flex rounded-2xl px-5 py-3 text-sm font-black uppercase tracking-[0.14em] ${phase.isUnlocked ? "bg-cyan-300 text-slate-950" : "pointer-events-none border border-white/10 text-slate-500"}`}
                >
                  {stateCopy.actionLabel}
                </Link>
                <div className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] ${stateCopy.toneClass}`}>
                  {stateCopy.seal}
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
