import { prisma } from "@/lib/db/prisma";
import { requireAuthenticatedPlayer } from "@/lib/auth/session";
import { getPlayerCollection } from "@/lib/collection/service";

export default async function CollectionPage() {
  const player = await requireAuthenticatedPlayer(prisma);
  const collection = await getPlayerCollection(prisma, player.playerId);

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <section className="rounded-2xl border border-white/10 bg-white/5 p-8">
        <p className="text-sm text-sky-300">Coleção autenticada</p>
        <h1 className="mt-2 text-3xl font-semibold">Moléculas desbloqueadas</h1>
        <p className="mt-2 text-sm text-slate-300">Total desbloqueado: {collection.unlockedCount}</p>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {collection.molecules.length > 0 ? collection.molecules.map((molecule) => (
          <article key={molecule.id} className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-sky-300">{molecule.id}</p>
            <h2 className="mt-1 text-xl font-semibold">{molecule.nomeQuimico}</h2>
            <p className="mt-2 text-sm text-slate-300">{molecule.nomeEpico}</p>
            <dl className="mt-4 space-y-2 text-sm text-slate-300">
              <div>
                <dt className="text-slate-500">Fórmula molecular</dt>
                <dd className="mt-1 text-slate-100">{molecule.formulaMolecular}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Classe</dt>
                <dd className="mt-1 text-slate-100">{molecule.classe}</dd>
              </div>
            </dl>
          </article>
        )) : (
          <article className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-sm text-slate-300">
            Nenhuma molécula desbloqueada ainda. Conclua fases para liberar cartas oficiais.
          </article>
        )}
      </section>
    </main>
  );
}
