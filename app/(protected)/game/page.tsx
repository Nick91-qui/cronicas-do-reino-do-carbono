import Link from "next/link";

import { ProtectedScene } from "@/components/scene/protected-scene";
import { prisma } from "@/lib/db/prisma";
import { requireAuthenticatedPlayer } from "@/lib/auth/session";
import { getAllChaptersProgressView } from "@/lib/progress/queries";
import { getPlayerInventorySnapshot } from "@/lib/inventory/service";
import { blobAssets } from "@/lib/assets/blob";

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
  const nextPhase = chapter1.phases.find((phase) => phase.phaseId === nextPhaseId);
  const completedCount = chapter1.phases.filter((phase) => phase.isCompleted).length;
  const unlockedCount = chapter1.phases.filter((phase) => phase.isUnlocked).length;
  const progressPercent = Math.round((completedCount / chapter1.totalPhases) * 100);

  return (
    <ProtectedScene
      eyebrow="Salao do reino"
      ambientLabel="Conselho central"
      imageSrc={blobAssets.protectedGrandHall}
      imageAlt="Salao central do castelo."
      title={`O salao central chama ${player.displayName} de volta ao circulo das provas.`}
      description="O dominio das primeiras cadeias do carbono segue aberto. Seus selos, recursos e descobertas agora aparecem como sinais de campanha, nao como painel administrativo."
      actions={
        <>
          <Link href="/chapter/chapter-1" className="state-action px-6" data-tone="primary">
            Abrir mapa do dominio
          </Link>
          <Link href={`/phase/${nextPhaseId}`} className="ritual-link min-h-12 rounded-full px-6 py-3 text-sm">
            Retomar prova {nextPhase?.phaseNumber}
          </Link>
        </>
      }
      stats={
        <>
          <div className="game-panel-muted">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Dominio em curso</p>
            <p className="pt-2 font-display text-2xl text-white">{chapter1.chapterTitle}</p>
            <p className="pt-2 text-sm text-slate-300">
              Prova seguinte: {nextPhase?.phaseNumber} · {nextPhase?.title}
            </p>
          </div>
          <div className="game-panel-muted">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Passagem consolidada</p>
            <p className="pt-2 font-display text-3xl text-white">{progressPercent}%</p>
            <p className="pt-2 text-sm text-slate-300">
              {completedCount} de {chapter1.totalPhases} provas com selo conquistado.
            </p>
          </div>
        </>
      }
    >
      <section className="grid gap-4 xl:grid-cols-[1.4fr,0.85fr]">
        <article className="game-panel">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">Trilha de progressao</p>
              <h2 className="pt-2 text-3xl tracking-[0.05em] text-white">Mapa ritual das provas</h2>
            </div>
            <div className="hud-chip">{unlockedCount} portoes respondendo</div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2 2xl:grid-cols-4">
            {chapter1.phases.map((phase) => {
              const stateLabel = phase.isCompleted ? "Dominada" : phase.isUnlocked ? "Ativa" : "Selada";
              const stateClass = phase.isCompleted
                ? "border-emerald-400/24 bg-emerald-500/10"
                : phase.isUnlocked
                  ? "border-sky-300/24 bg-sky-400/10"
                  : "border-white/10 bg-white/5";

              return (
                <Link
                  key={phase.phaseId}
                  href={phase.isUnlocked ? `/phase/${phase.phaseId}` : "/chapter/chapter-1"}
                  className={`state-panel group ${stateClass}`}
                  data-state={phase.isCompleted ? "success" : phase.isUnlocked ? "active" : "locked"}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-display text-3xl text-white">{String(phase.phaseNumber).padStart(2, "0")}</span>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-200">
                      {stateLabel}
                    </span>
                  </div>
                  <h3 className="pt-4 text-lg font-semibold text-white">{phase.title}</h3>
                  <p className="pt-2 text-sm text-slate-300">
                    {phase.isCompleted
                      ? `Melhor pontuacao: ${phase.bestScore}`
                      : phase.isUnlocked
                        ? "O laboratorio desta etapa esta pronto para sua tentativa."
                        : "A prova aguarda a quebra do selo anterior."}
                  </p>
                </Link>
              );
            })}
          </div>
        </article>

        <div className="grid gap-4">
          <article className="game-panel">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">Estado do laboratorio</p>
            <dl className="mt-5 grid gap-3 text-sm text-slate-300">
              <div className="game-panel-muted">
                <dt className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Carbonos na bancada</dt>
                <dd className="pt-2 font-display text-3xl text-white">{inventory.carbonAvailable}</dd>
              </div>
              <div className="game-panel-muted">
                <dt className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Fragmentos dominados</dt>
                <dd className="pt-2 text-slate-100">
                  {inventory.unlockedFragments.join(", ") || "Nenhum vestigio inscrito"}
                </dd>
              </div>
              <div className="game-panel-muted">
                <dt className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Moleculas inscritas</dt>
                <dd className="pt-2 font-display text-2xl text-white">{inventory.unlockedMolecules.length}</dd>
              </div>
            </dl>
          </article>

          <article className="game-panel">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">Leitura estrategica</p>
            <div className="mt-5 space-y-3 text-sm leading-7 text-slate-300">
              <p>
                Portao mais distante alcancado: prova {chapter1.highestUnlockedPhaseNumber}. O dominio responde
                melhor quando voce alterna estudo da fase com consulta ao grimorio.
              </p>
              <p>
                Prestigio acumulado: <span className="font-semibold text-white">{chapter1.chapterScore}</span>.
                Cada selo mantido fortalece a leitura das estruturas futuras.
              </p>
            </div>
          </article>
        </div>
      </section>
    </ProtectedScene>
  );
}
