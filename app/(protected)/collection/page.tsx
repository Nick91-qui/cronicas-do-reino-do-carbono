import { MoleculeCard } from "@/components/cards/molecule-card";

import { prisma } from "@/lib/db/prisma";
import { requireAuthenticatedPlayer } from "@/lib/auth/session";
import { getPlayerCollection } from "@/lib/collection/service";

export default async function CollectionPage() {
  const player = await requireAuthenticatedPlayer(prisma);
  const collection = await getPlayerCollection(prisma, player.playerId);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      <section className="relative overflow-hidden rounded-[28px] border border-cyan-300/20 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_30%),radial-gradient(circle_at_top_right,rgba(251,191,36,0.14),transparent_24%),linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,6,23,0.98))] p-5 shadow-[0_24px_80px_rgba(2,6,23,0.42)] sm:rounded-[32px] sm:p-8">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.04)_32%,transparent_60%)]" />
        <div className="relative grid gap-5 lg:grid-cols-[1.1fr,0.9fr] lg:gap-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300 sm:text-sm">
              Colecao autenticada
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Moleculas desbloqueadas
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              Biblioteca viva do jogador com as cartas oficiais liberadas ao longo do capitulo.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Total desbloqueado
              </p>
              <p className="mt-2 text-2xl font-black text-white">{collection.unlockedCount}</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Alquimista ativo
              </p>
              <p className="mt-2 text-lg font-semibold text-white">{player.displayName}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {collection.molecules.length > 0 ? collection.molecules.map((molecule) => (
          <div key={molecule.id} className="rounded-[24px] border border-white/8 bg-white/5 p-2 shadow-[0_18px_40px_rgba(15,23,42,0.18)] sm:rounded-[28px]">
            <MoleculeCard
              molecule={molecule}
              variant="compact"
            />
          </div>
        )) : (
          <article className="rounded-[24px] border border-dashed border-white/10 bg-white/5 p-6 text-sm text-slate-300 sm:rounded-[28px] sm:p-8">
            Nenhuma molecula desbloqueada ainda. Conclua fases para liberar cartas oficiais.
          </article>
        )}
      </section>
    </main>
  );
}
