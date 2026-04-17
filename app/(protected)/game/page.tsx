import Link from "next/link";

import { prisma } from "@/lib/db/prisma";
import { requireAuthenticatedPlayer } from "@/lib/auth/session";
import { getAllChaptersProgressView } from "@/lib/progress/queries";
import { getPlayerInventorySnapshot } from "@/lib/inventory/service";

export default async function GamePage() {
  const player = await requireAuthenticatedPlayer(prisma);
  const [progress, inventory] = await Promise.all([
    getAllChaptersProgressView(prisma, player.playerId),
    getPlayerInventorySnapshot(prisma, player.playerId),
  ]);

  const chapter1 = progress[0];
  const nextPhaseId =
    chapter1.phases.find((phase) => phase.isUnlocked && !phase.isCompleted)
      ?.phaseId ?? chapter1.phases[0].phaseId;

  return (
    <main className="mx-auto flex min-h-[calc(100vh-73px)] w-full max-w-6xl flex-col gap-8 px-6 py-10">
      <section className="relative overflow-hidden rounded-[32px] border border-cyan-300/20 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_30%),radial-gradient(circle_at_top_right,rgba(251,191,36,0.14),transparent_24%),linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,6,23,0.98))] p-8 shadow-[0_24px_80px_rgba(2,6,23,0.42)]">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.04)_32%,transparent_60%)]" />
        <div className="relative grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
              Sessao autenticada
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-white">
              Bem-vindo, {player.displayName}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              Seu progresso, inventario e desbloqueios oficiais ja estao carregados para a campanha atual.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Capitulo ativo
              </p>
              <p className="mt-2 text-xl font-black text-white">{chapter1.chapterTitle}</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Proxima fase
              </p>
              <p className="mt-2 text-xl font-black text-white">
                {chapter1.phases.find((phase) => phase.phaseId === nextPhaseId)?.phaseNumber}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.8fr,1fr]">
        <article className="rounded-[28px] border border-cyan-300/20 bg-cyan-400/5 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.22)]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">Capitulo ativo</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-white">{chapter1.chapterTitle}</h2>
          <div className="mt-6 grid gap-4 text-sm text-slate-300 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/8 bg-slate-950/35 p-4">
              <p className="text-slate-500">Fases concluidas</p>
              <p className="mt-1 text-2xl font-black text-slate-100">
                {chapter1.completedPhaseCount}/{chapter1.totalPhases}
              </p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-slate-950/35 p-4">
              <p className="text-slate-500">Maior fase desbloqueada</p>
              <p className="mt-1 text-2xl font-black text-slate-100">{chapter1.highestUnlockedPhaseNumber}</p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-slate-950/35 p-4">
              <p className="text-slate-500">Pontuacao do capitulo</p>
              <p className="mt-1 text-2xl font-black text-slate-100">{chapter1.chapterScore}</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/chapter/chapter-1" className="rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-slate-950">
              Abrir capítulo
            </Link>
            <Link href={`/phase/${nextPhaseId}`} className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-100">
              Continuar fase atual
            </Link>
          </div>
        </article>

        <article className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.22)]">
          <h2 className="text-xl font-black tracking-tight text-white">Inventario</h2>
          <dl className="mt-4 grid gap-3 text-sm text-slate-300">
            <div className="rounded-2xl border border-white/8 bg-slate-950/35 p-4">
              <dt className="text-slate-500">Carbonos disponiveis</dt>
              <dd className="mt-1 text-lg font-semibold text-slate-100">{inventory.carbonAvailable}</dd>
            </div>
            <div className="rounded-2xl border border-white/8 bg-slate-950/35 p-4">
              <dt className="text-slate-500">Fragmentos desbloqueados</dt>
              <dd className="mt-1 text-slate-100">{inventory.unlockedFragments.join(", ") || "Nenhum"}</dd>
            </div>
            <div className="rounded-2xl border border-white/8 bg-slate-950/35 p-4">
              <dt className="text-slate-500">Moleculas desbloqueadas</dt>
              <dd className="mt-1 text-lg font-semibold text-slate-100">{inventory.unlockedMolecules.length}</dd>
            </div>
          </dl>
        </article>
      </section>
    </main>
  );
}
