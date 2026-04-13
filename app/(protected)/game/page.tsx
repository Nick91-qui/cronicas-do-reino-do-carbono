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

  return (
    <main className="mx-auto flex min-h-[calc(100vh-73px)] w-full max-w-6xl flex-col gap-8 px-6 py-10">
      <section className="rounded-2xl border border-white/10 bg-white/5 p-8">
        <p className="text-sm text-sky-300">Sessão autenticada</p>
        <h1 className="mt-2 text-3xl font-semibold">Bem-vindo, {player.displayName}</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-300">
          O backend já reconhece seu progresso, inventário e desbloqueios oficiais do capítulo.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-[2fr,1fr]">
        <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-sky-300">Capítulo ativo</p>
          <h2 className="mt-2 text-2xl font-semibold">{chapter1.chapterTitle}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3 text-sm text-slate-300">
            <div>
              <p className="text-slate-500">Fases concluídas</p>
              <p className="mt-1 text-xl text-slate-100">{chapter1.completedPhaseCount}/{chapter1.totalPhases}</p>
            </div>
            <div>
              <p className="text-slate-500">Maior fase desbloqueada</p>
              <p className="mt-1 text-xl text-slate-100">{chapter1.highestUnlockedPhaseNumber}</p>
            </div>
            <div>
              <p className="text-slate-500">Pontuação do capítulo</p>
              <p className="mt-1 text-xl text-slate-100">{chapter1.chapterScore}</p>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <Link href="/chapter/chapter-1" className="rounded-xl bg-sky-500 px-4 py-3 text-sm font-semibold text-slate-950">
              Abrir capítulo
            </Link>
            <Link href={`/phase/${chapter1.phases.find((phase) => phase.isUnlocked && !phase.isCompleted)?.phaseId ?? chapter1.phases[0].phaseId}`} className="rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-100">
              Continuar fase atual
            </Link>
          </div>
        </article>

        <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold">Inventário</h2>
          <dl className="mt-4 space-y-3 text-sm text-slate-300">
            <div>
              <dt className="text-slate-500">Carbonos disponíveis</dt>
              <dd className="mt-1 text-slate-100">{inventory.carbonAvailable}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Fragmentos desbloqueados</dt>
              <dd className="mt-1 text-slate-100">{inventory.unlockedFragments.join(", ") || "Nenhum"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Moléculas desbloqueadas</dt>
              <dd className="mt-1 text-slate-100">{inventory.unlockedMolecules.length}</dd>
            </div>
          </dl>
        </article>
      </section>
    </main>
  );
}
