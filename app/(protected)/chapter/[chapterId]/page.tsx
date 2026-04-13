import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/db/prisma";
import { requireAuthenticatedPlayer } from "@/lib/auth/session";
import { getChapterProgressView } from "@/lib/progress/queries";

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

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <section className="rounded-2xl border border-white/10 bg-white/5 p-8">
        <p className="text-sm text-sky-300">{progress.chapterId}</p>
        <h1 className="mt-2 text-3xl font-semibold">{progress.chapterTitle}</h1>
        <p className="mt-2 text-sm text-slate-300">
          Progresso oficial autenticado do capítulo, calculado a partir do melhor resultado por fase.
        </p>
      </section>

      <section className="mt-6 space-y-4">
        {progress.phases.map((phase) => (
          <article key={phase.phaseId} className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm text-sky-300">Fase {phase.phaseNumber}</p>
                <h2 className="mt-1 text-xl font-semibold">{phase.title}</h2>
                <p className="mt-2 text-sm text-slate-300">Tipo técnico: {phase.technicalType}</p>
              </div>
              <div className="text-right text-sm text-slate-300">
                <p>Status: {phase.isCompleted ? "Concluída" : phase.isUnlocked ? "Desbloqueada" : "Bloqueada"}</p>
                <p>Pontuação: {phase.bestScore}</p>
                <p>Tentativas: {phase.attemptCount}</p>
              </div>
            </div>
            <div className="mt-4">
              <Link
                href={`/phase/${phase.phaseId}`}
                className={`inline-flex rounded-xl px-4 py-2 text-sm font-semibold ${phase.isUnlocked ? "bg-sky-500 text-slate-950" : "border border-white/10 text-slate-500 pointer-events-none"}`}
              >
                {phase.isUnlocked ? "Abrir fase" : "Aguardando desbloqueio"}
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
