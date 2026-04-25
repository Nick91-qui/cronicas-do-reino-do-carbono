import { bondTypeLabels, fragmentToBondType } from "@/components/phase/phase-experience-shared";

import type { Phase } from "@/lib/content/types";
import type { ChapterProgressView } from "@/lib/progress/queries";

type PhaseIntroPanelProps = {
  phase: Phase;
  currentPhaseStatus: ChapterProgressView["phases"][number] | null;
};

export function PhaseIntroPanel({ phase, currentPhaseStatus }: PhaseIntroPanelProps) {
  return (
    <div className="mx-auto grid max-w-6xl gap-4 lg:gap-5 xl:grid-cols-[1.25fr,0.75fr]">
      <article className="game-panel border-cyan-300/15 p-6 sm:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Prova do reino</p>
        <p className="mt-5 text-base leading-8 text-slate-100">{phase.narrative}</p>
      </article>

      <div className="grid gap-4">
        <article className="game-panel">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Missao</p>
          <p className="mt-3 text-sm leading-6 text-slate-200">{phase.objective}</p>
        </article>
        <article className="game-panel">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Conceito central</p>
          <p className="mt-3 text-sm leading-6 text-slate-200">{phase.coreConcept}</p>
        </article>
        <article className="game-panel">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Estado local da prova
          </p>
          <div className="mt-3 grid gap-3 text-sm text-slate-200">
            <div className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3">
              {currentPhaseStatus?.isCompleted ? "Ja dominada" : "Aguardando sua leitura"}
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3">
              {phase.resources.carbonAvailable} carbono
              {phase.resources.carbonAvailable > 1 ? "s" : ""} ·{" "}
              {phase.resources.availableFragments
                .map((fragmentId) => bondTypeLabels[fragmentToBondType[fragmentId]])
                .join(" · ")}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
