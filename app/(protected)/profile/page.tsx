import { prisma } from "@/lib/db/prisma";
import { requireAuthenticatedPlayer } from "@/lib/auth/session";
import { getPlayerInventorySnapshot } from "@/lib/inventory/service";
import { getAllChaptersProgressView } from "@/lib/progress/queries";

export default async function ProfilePage() {
  const player = await requireAuthenticatedPlayer(prisma);
  const [inventory, progress] = await Promise.all([
    getPlayerInventorySnapshot(prisma, player.playerId),
    getAllChaptersProgressView(prisma, player.playerId),
  ]);

  const totalScore = progress.reduce((sum, chapter) => sum + chapter.chapterScore, 0);
  const totalCompletedPhases = progress.reduce((sum, chapter) => sum + chapter.completedPhaseCount, 0);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
      <section className="game-shell">
        <div className="relative grid gap-6 xl:grid-cols-[1.15fr,0.85fr]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="hud-chip">Perfil do aprendiz</span>
              <span className="hud-chip border-gold/20 text-gold/90">Registro persistente</span>
            </div>
            <h1 className="mt-5 text-4xl tracking-[0.06em] text-white sm:text-5xl">
              {player.displayName}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              Visao geral da identidade, do progresso acumulado e do inventario persistente do jogador.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <div className="game-panel-muted">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Pontuacao total</p>
              <p className="pt-2 font-display text-3xl text-white">{totalScore}</p>
            </div>
            <div className="game-panel-muted">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Fases concluidas</p>
              <p className="pt-2 font-display text-3xl text-white">{totalCompletedPhases}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[1fr,1fr] lg:gap-6">
        <section className="game-panel">
          <h2 className="text-2xl tracking-[0.04em] text-white sm:text-3xl">Identidade</h2>
          <dl className="mt-5 grid gap-3 text-sm text-slate-300">
            <div className="game-panel-muted">
              <dt className="text-slate-500">Nome</dt>
              <dd className="mt-1 text-slate-100">{player.displayName}</dd>
            </div>
            <div className="game-panel-muted">
              <dt className="text-slate-500">Username</dt>
              <dd className="mt-1 text-slate-100">{player.username}</dd>
            </div>
            <div className="game-panel-muted">
              <dt className="text-slate-500">Turma</dt>
              <dd className="mt-1 text-slate-100">{player.classroomCode}</dd>
            </div>
            <div className="game-panel-muted">
              <dt className="text-slate-500">Sessao expira em</dt>
              <dd className="mt-1 text-slate-100">{player.sessionExpiresAt.toLocaleString("pt-BR")}</dd>
            </div>
          </dl>
        </section>

        <section className="game-panel">
          <h2 className="text-2xl tracking-[0.04em] text-white sm:text-3xl">Snapshot de inventario</h2>
          <dl className="mt-5 grid gap-3 text-sm text-slate-300">
            <div className="game-panel-muted">
              <dt className="text-slate-500">Carbonos disponiveis</dt>
              <dd className="mt-1 text-slate-100">{inventory.carbonAvailable}</dd>
            </div>
            <div className="game-panel-muted">
              <dt className="text-slate-500">Modo de hidrogenio</dt>
              <dd className="mt-1 text-slate-100">{inventory.hydrogenMode}</dd>
            </div>
            <div className="game-panel-muted">
              <dt className="text-slate-500">Fragmentos</dt>
              <dd className="mt-1 text-slate-100">{inventory.unlockedFragments.join(", ") || "Nenhum"}</dd>
            </div>
            <div className="game-panel-muted">
              <dt className="text-slate-500">Titulos</dt>
              <dd className="mt-1 text-slate-100">{inventory.unlockedTitles.join(", ") || "Nenhum"}</dd>
            </div>
          </dl>
        </section>
      </section>
    </main>
  );
}
