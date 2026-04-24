import { MoleculeCard } from "@/components/cards/molecule-card";

import { prisma } from "@/lib/db/prisma";
import { requireAuthenticatedPlayer } from "@/lib/auth/session";
import { getPlayerCollection } from "@/lib/collection/service";

export default async function CollectionPage() {
  const player = await requireAuthenticatedPlayer(prisma);
  const collection = await getPlayerCollection(prisma, player.playerId);
  const hasUnlockedMolecules = collection.molecules.length > 0;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
      <section className="game-shell">
        <div className="relative grid gap-6 xl:grid-cols-[1.15fr,0.85fr]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="hud-chip">Grimorio vivo</span>
              <span className="hud-chip border-gold/20 text-gold/90">Biblioteca ritual</span>
            </div>
            <h1 className="pt-5 text-4xl tracking-[0.06em] text-white sm:text-5xl">
              Cartas inscritas por {player.displayName}
            </h1>
            <p className="max-w-3xl pt-4 text-sm leading-7 text-slate-300 sm:text-base">
              Esta sala guarda as moleculas ja reconhecidas pelo laboratorio de sintese. Cada carta funciona como memoria
              de progresso, consulta tecnica e recompensa do capitulo.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <div className="game-panel-muted">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Cartas despertas</p>
              <p className="pt-2 font-display text-3xl text-white">{collection.unlockedCount}</p>
            </div>
            <div className="game-panel-muted">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Estado do grimorio</p>
              <p className="pt-2 text-sm text-slate-100">
                {hasUnlockedMolecules
                  ? "As paginas ativas respondem ao toque e mostram a leitura completa no verso."
                  : "As paginas ainda aguardam o primeiro selo de descoberta."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-[0.82fr,1.18fr]">
        <aside className="game-panel h-fit">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">Leitura do arquivo</p>
          <div className="mt-5 grid gap-3 text-sm text-slate-300">
            <div className="game-panel-muted">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Guardiao do registro</p>
              <p className="pt-2 font-display text-2xl text-white">{player.displayName}</p>
            </div>
            <div className="game-panel-muted">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Estado das descobertas</p>
              <p className="pt-2 text-slate-100">
                {hasUnlockedMolecules
                  ? "Colecao aberta para comparacao, estudo e memoria das fases concluidas."
                  : "Conclua provas do dominio para materializar as primeiras cartas oficiais."}
              </p>
            </div>
            <div className="game-panel-muted">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Regra de leitura</p>
              <p className="pt-2 text-slate-100">
                Toque nas cartas para virar o grimorio e consultar atributos, pontos fortes e limitacoes.
              </p>
            </div>
          </div>
        </aside>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
          {hasUnlockedMolecules ? collection.molecules.map((molecule) => (
            <article
              key={molecule.id}
              className="game-panel relative overflow-hidden p-3"
            >
              <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(245,158,11,0.45),transparent)]" />
              <div className="mb-3 flex items-center justify-between gap-3 px-1 pt-1">
                <span className="hud-chip border-gold/20 text-gold/90">Carta desperta</span>
                <span className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Toque para virar</span>
              </div>
              <MoleculeCard
                molecule={molecule}
                variant="compact"
              />
            </article>
          )) : (
            <article className="game-panel border-dashed text-sm text-slate-300">
              Nenhuma molecula desbloqueada ainda. Conclua fases para liberar cartas oficiais e preencher o grimorio.
            </article>
          )}
        </section>
      </section>
    </main>
  );
}
