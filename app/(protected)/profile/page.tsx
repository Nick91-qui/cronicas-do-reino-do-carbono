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
    <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
      <section className="relative overflow-hidden rounded-[28px] border border-cyan-300/20 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_30%),radial-gradient(circle_at_top_right,rgba(251,191,36,0.14),transparent_24%),linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,6,23,0.98))] p-5 shadow-[0_24px_80px_rgba(2,6,23,0.42)] sm:rounded-[32px] sm:p-8">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.04)_32%,transparent_60%)]" />
        <div className="relative grid gap-5 lg:grid-cols-[1fr,0.9fr] lg:gap-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300 sm:text-sm">
              Perfil do jogador
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
              {player.displayName}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              Visao geral da identidade, do progresso acumulado e do inventario persistente do jogador.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Pontuacao total
              </p>
              <p className="mt-2 text-2xl font-black text-white">{totalScore}</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Fases concluidas
              </p>
              <p className="mt-2 text-2xl font-black text-white">{totalCompletedPhases}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[1fr,1fr] lg:gap-6">
        <section className="rounded-[24px] border border-white/10 bg-white/5 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.22)] sm:rounded-[28px] sm:p-6">
          <h2 className="text-xl font-black tracking-tight text-white sm:text-2xl">Identidade</h2>
          <dl className="mt-5 grid gap-3 text-sm text-slate-300">
            <div className="rounded-2xl border border-white/8 bg-slate-950/35 p-4">
              <dt className="text-slate-500">Nome</dt>
              <dd className="mt-1 text-slate-100">{player.displayName}</dd>
            </div>
            <div className="rounded-2xl border border-white/8 bg-slate-950/35 p-4">
              <dt className="text-slate-500">Username</dt>
              <dd className="mt-1 text-slate-100">{player.username}</dd>
            </div>
            <div className="rounded-2xl border border-white/8 bg-slate-950/35 p-4">
              <dt className="text-slate-500">Turma</dt>
              <dd className="mt-1 text-slate-100">{player.classroomCode}</dd>
            </div>
            <div className="rounded-2xl border border-white/8 bg-slate-950/35 p-4">
              <dt className="text-slate-500">Sessao expira em</dt>
              <dd className="mt-1 text-slate-100">{player.sessionExpiresAt.toLocaleString("pt-BR")}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-[24px] border border-white/10 bg-white/5 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.22)] sm:rounded-[28px] sm:p-6">
          <h2 className="text-xl font-black tracking-tight text-white sm:text-2xl">Snapshot de inventario</h2>
          <dl className="mt-5 grid gap-3 text-sm text-slate-300">
            <div className="rounded-2xl border border-white/8 bg-slate-950/35 p-4">
              <dt className="text-slate-500">Carbonos disponiveis</dt>
              <dd className="mt-1 text-slate-100">{inventory.carbonAvailable}</dd>
            </div>
            <div className="rounded-2xl border border-white/8 bg-slate-950/35 p-4">
              <dt className="text-slate-500">Modo de hidrogenio</dt>
              <dd className="mt-1 text-slate-100">{inventory.hydrogenMode}</dd>
            </div>
            <div className="rounded-2xl border border-white/8 bg-slate-950/35 p-4">
              <dt className="text-slate-500">Fragmentos</dt>
              <dd className="mt-1 text-slate-100">{inventory.unlockedFragments.join(", ") || "Nenhum"}</dd>
            </div>
            <div className="rounded-2xl border border-white/8 bg-slate-950/35 p-4">
              <dt className="text-slate-500">Titulos</dt>
              <dd className="mt-1 text-slate-100">{inventory.unlockedTitles.join(", ") || "Nenhum"}</dd>
            </div>
          </dl>
        </section>
      </section>
    </main>
  );
}
