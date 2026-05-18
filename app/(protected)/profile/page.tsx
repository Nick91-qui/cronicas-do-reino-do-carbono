import { AccountPrivacyControls } from "@/components/profile/account-privacy-controls";
import { ProtectedScene } from "@/components/scene/protected-scene";
import { prisma } from "@/lib/db/prisma";
import { requireAuthenticatedPlayer } from "@/lib/auth/session";
import { getPlayerInventorySnapshot } from "@/lib/inventory/service";
import { getAllChaptersProgressView } from "@/lib/progress/queries";
import { blobAssets } from "@/lib/assets/blob";

export default async function ProfilePage() {
  const player = await requireAuthenticatedPlayer(prisma);
  const [inventory, progress] = await Promise.all([
    getPlayerInventorySnapshot(prisma, player.playerId),
    getAllChaptersProgressView(prisma, player.playerId),
  ]);

  const totalScore = progress.reduce((sum, chapter) => sum + chapter.chapterScore, 0);
  const totalCompletedPhases = progress.reduce((sum, chapter) => sum + chapter.completedPhaseCount, 0);

  return (
    <ProtectedScene
      eyebrow="Perfil do aprendiz"
      ambientLabel="Aposentos do aprendiz"
      imageSrc={blobAssets.protectedApprenticeRoom}
      imageAlt="Aposentos do aprendiz no castelo."
      title={player.displayName}
      description="Veja aqui sua identidade no reino, o que voce ja concluiu e os recursos reunidos ao longo da jornada."
      stats={
        <>
          <div className="game-panel-muted">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Pontuacao total</p>
            <p className="pt-2 font-display text-3xl text-white">{totalScore}</p>
          </div>
          <div className="game-panel-muted">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Fases concluidas</p>
            <p className="pt-2 font-display text-3xl text-white">{totalCompletedPhases}</p>
          </div>
        </>
      }
    >
      <section className="grid gap-4 lg:grid-cols-[1fr,1fr] lg:gap-6">
        <section className="game-panel">
          <h2 className="text-2xl tracking-[0.04em] text-white sm:text-3xl">Identidade</h2>
          <dl className="mt-5 grid gap-3 text-sm text-slate-300">
            <div className="game-panel-muted">
              <dt className="text-slate-500">Nome</dt>
              <dd className="mt-1 text-slate-100">{player.displayName}</dd>
            </div>
            <div className="game-panel-muted">
              <dt className="text-slate-500">Nome de oficio</dt>
              <dd className="mt-1 text-slate-100">{player.username}</dd>
            </div>
            <div className="game-panel-muted">
              <dt className="text-slate-500">Turma</dt>
              <dd className="mt-1 text-slate-100">{player.classroomCode}</dd>
            </div>
            <div className="game-panel-muted">
              <dt className="text-slate-500">Sessao ativa ate</dt>
              <dd className="mt-1 text-slate-100">{player.sessionExpiresAt.toLocaleString("pt-BR")}</dd>
            </div>
          </dl>
        </section>

        <section className="game-panel">
          <h2 className="text-2xl tracking-[0.04em] text-white sm:text-3xl">Recursos reunidos</h2>
          <dl className="mt-5 grid gap-3 text-sm text-slate-300">
            <div className="game-panel-muted">
              <dt className="text-slate-500">Carbonos disponiveis</dt>
              <dd className="mt-1 text-slate-100">{inventory.carbonAvailable}</dd>
            </div>
            <div className="game-panel-muted">
              <dt className="text-slate-500">Modo do hidrogenio</dt>
              <dd className="mt-1 text-slate-100">{inventory.hydrogenMode}</dd>
            </div>
            <div className="game-panel-muted">
              <dt className="text-slate-500">Fragmentos</dt>
              <dd className="mt-1 text-slate-100">{inventory.unlockedFragments.join(", ") || "Nenhum"}</dd>
            </div>
            <div className="game-panel-muted">
              <dt className="text-slate-500">Titulos conquistados</dt>
              <dd className="mt-1 text-slate-100">{inventory.unlockedTitles.join(", ") || "Nenhum"}</dd>
            </div>
          </dl>
        </section>
      </section>

      <AccountPrivacyControls
        displayName={player.displayName}
        username={player.username}
      />
    </ProtectedScene>
  );
}
