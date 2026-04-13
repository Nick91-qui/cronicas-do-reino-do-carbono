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
    <main className="mx-auto w-full max-w-4xl px-6 py-10">
      <section className="rounded-2xl border border-white/10 bg-white/5 p-8">
        <h1 className="text-2xl font-semibold">Perfil do jogador</h1>
        <dl className="mt-6 grid gap-4 text-sm text-slate-300 md:grid-cols-2">
          <div>
            <dt className="text-slate-500">Nome</dt>
            <dd className="mt-1 text-slate-100">{player.displayName}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Username</dt>
            <dd className="mt-1 text-slate-100">{player.username}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Turma</dt>
            <dd className="mt-1 text-slate-100">{player.classroomCode}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Sessão expira em</dt>
            <dd className="mt-1 text-slate-100">{player.sessionExpiresAt.toLocaleString("pt-BR")}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Pontuação total</dt>
            <dd className="mt-1 text-slate-100">{totalScore}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Fases concluídas</dt>
            <dd className="mt-1 text-slate-100">{totalCompletedPhases}</dd>
          </div>
        </dl>
      </section>

      <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-8">
        <h2 className="text-xl font-semibold">Snapshot de inventário</h2>
        <dl className="mt-4 grid gap-4 text-sm text-slate-300 md:grid-cols-2">
          <div>
            <dt className="text-slate-500">Carbonos disponíveis</dt>
            <dd className="mt-1 text-slate-100">{inventory.carbonAvailable}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Modo de hidrogênio</dt>
            <dd className="mt-1 text-slate-100">{inventory.hydrogenMode}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Fragmentos</dt>
            <dd className="mt-1 text-slate-100">{inventory.unlockedFragments.join(", ") || "Nenhum"}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Títulos</dt>
            <dd className="mt-1 text-slate-100">{inventory.unlockedTitles.join(", ") || "Nenhum"}</dd>
          </div>
        </dl>
      </section>
    </main>
  );
}
