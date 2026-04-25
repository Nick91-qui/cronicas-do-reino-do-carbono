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
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Conceito central</p>
          <p className="mt-3 text-sm leading-6 text-slate-200">{phase.coreConcept}</p>
        </article>
        {phase.objective ? (
          <article className="game-panel">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Objetivo</p>
            <p className="mt-3 text-sm leading-6 text-slate-200">{phase.objective}</p>
          </article>
        ) : null}
      </div>
    </div>
  );
}
