import { ProtectedScene } from "@/components/scene/protected-scene";
import { requireOperator } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { blobAssets } from "@/lib/assets/blob";

const recentActivityWindowDays = 7;

function formatRelativeWindow(days: number) {
  return `${days} dia${days === 1 ? "" : "s"}`;
}

export default async function OperatorPage() {
  const operator = await requireOperator(prisma);
  const recentActivityThreshold = new Date(
    Date.now() - recentActivityWindowDays * 24 * 60 * 60 * 1000,
  );

  const [
    totalPlayers,
    totalClassrooms,
    completedPlayerRows,
    activePlayerRows,
    latestPlayers,
  ] = await Promise.all([
    prisma.player.count(),
    prisma.classroom.count(),
    prisma.playerPhaseSummary.findMany({
      where: { isCompleted: true },
      distinct: ["playerId"],
      select: { playerId: true },
    }),
    prisma.playerAnalyticsEvent.findMany({
      where: { createdAt: { gte: recentActivityThreshold } },
      distinct: ["playerId"],
      select: { playerId: true },
    }),
    prisma.player.findMany({
      orderBy: { updatedAt: "desc" },
      take: 12,
      include: {
        classroom: true,
        chapterProgress: true,
      },
    }),
  ]);

  return (
    <ProtectedScene
      eyebrow="Observatorio interno"
      ambientLabel="Leitura operacional"
      imageSrc={blobAssets.protectedGrandHall}
      imageAlt="Sala de observacao interna do castelo."
      title="Feedback operacional dos usuarios"
      description={`Area interna somente leitura para ${operator.displayName}. Aqui o reino exibe sinais operacionais de jogadores, turmas e atividade recente sem abrir a superficie administrativa completa.`}
      stats={
        <>
          <div className="game-panel-muted">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Jogadores totais
            </p>
            <p className="pt-2 font-display text-3xl text-white">
              {totalPlayers}
            </p>
          </div>
          <div className="game-panel-muted">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Turmas ativas
            </p>
            <p className="pt-2 font-display text-3xl text-white">
              {totalClassrooms}
            </p>
          </div>
          <div className="game-panel-muted">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Com ao menos 1 fase
            </p>
            <p className="pt-2 font-display text-3xl text-white">
              {completedPlayerRows.length}
            </p>
          </div>
          <div className="game-panel-muted">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Ativos em {formatRelativeWindow(recentActivityWindowDays)}
            </p>
            <p className="pt-2 font-display text-3xl text-white">
              {activePlayerRows.length}
            </p>
          </div>
        </>
      }
    >
      <section className="grid gap-4 xl:grid-cols-[0.88fr,1.12fr]">
        <aside className="game-panel h-fit">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">
            Regras desta area
          </p>
          <div className="mt-5 grid gap-3 text-sm text-slate-300">
            <div className="game-panel-muted">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Papel atual
              </p>
              <p className="pt-2 font-display text-2xl text-white">
                {operator.role}
              </p>
            </div>
            <div className="game-panel-muted">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Superficie
              </p>
              <p className="pt-2 text-slate-100">
                Esta primeira versao e somente leitura e serve para
                observabilidade operacional.
              </p>
            </div>
            <div className="game-panel-muted">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Proximo passo recomendado
              </p>
              <p className="pt-2 text-slate-100">
                Evoluir filtros, busca e detalhamento por jogador antes de
                considerar qualquer acao mutavel.
              </p>
            </div>
          </div>
        </aside>

        <section className="game-panel">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">
                Jogadores recentes
              </p>
              <h2 className="pt-2 text-3xl tracking-[0.05em] text-white">
                Leitura resumida do reino
              </h2>
            </div>
            <div className="hud-chip">
              {latestPlayers.length} registros exibidos
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            {latestPlayers.map((player) => {
              const chapterProgress = player.chapterProgress[0] ?? null;

              return (
                <article key={player.id} className="game-panel-muted">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="font-display text-2xl text-white">
                        {player.displayName}
                      </p>
                      <p className="pt-1 text-sm text-slate-300">
                        @{player.username} · turma {player.classroom.code}
                      </p>
                    </div>

                    <div className="grid gap-3 text-sm text-slate-300 sm:grid-cols-3 lg:min-w-[360px]">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                          Papel
                        </p>
                        <p className="pt-1 font-semibold text-white">
                          {player.role}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                          Fase mais alta
                        </p>
                        <p className="pt-1 font-semibold text-white">
                          {chapterProgress?.highestUnlockedPhaseNumber ?? 1}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                          Pontuacao
                        </p>
                        <p className="pt-1 font-semibold text-white">
                          {chapterProgress?.chapterScore ?? 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </section>
    </ProtectedScene>
  );
}
