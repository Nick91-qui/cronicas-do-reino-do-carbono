import { MoleculeCard } from "@/components/cards/molecule-card";
import { formatSelectableProperty } from "@/components/phase/phase-experience-shared";

import type { BuilderValidationResult } from "@/lib/builder/types";
import type { Molecule, SelectableProperty, Phase } from "@/lib/content/types";

type PhaseReadPanelProps = {
  builderResult: BuilderValidationResult | null;
  focusedMolecule: Molecule | null;
  phase: Phase;
  selectedProperties: SelectableProperty[];
  submitError: string | null;
  supportsMoleculeSelection: boolean;
  synthesizedMolecule: Molecule | null;
  onSelectFocusedMolecule?: () => void;
  onToggleProperty: (property: SelectableProperty) => void;
};

export function PhaseReadPanel({
  builderResult,
  focusedMolecule,
  phase,
  selectedProperties,
  submitError,
  supportsMoleculeSelection,
  synthesizedMolecule,
  onSelectFocusedMolecule,
  onToggleProperty,
}: PhaseReadPanelProps) {
  return (
    <section className="grid gap-5 xl:grid-cols-[0.86fr,1.14fr] xl:gap-6">
      <aside className="grid gap-4 self-start">
        <div className="game-panel sm:p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Carta em foco</p>
          {focusedMolecule ? (
            <div className="mt-4">
              <MoleculeCard
                molecule={focusedMolecule}
                isSelected
                isCreated={builderResult?.resolvedMoleculeId === focusedMolecule.id}
                selectable={supportsMoleculeSelection}
                variant="compact"
                onSelect={onSelectFocusedMolecule}
              />
            </div>
          ) : (
            <div className="mt-4 rounded-[24px] border border-dashed border-white/15 bg-slate-950/25 px-5 py-8 text-sm leading-6 text-slate-400">
              {supportsMoleculeSelection
                ? "Selecione uma carta para comparar com as propriedades exigidas pela prova."
                : "O laboratorio de sintese ainda nao gerou uma carta reconhecida para esta etapa."}
            </div>
          )}
        </div>

        <div className="game-panel">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Leitura atual</p>
          <div className="mt-3 grid gap-3 text-sm text-slate-200">
            <div className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3">
              Molecula: <span className="font-semibold text-white">{focusedMolecule?.nomeQuimico ?? "nenhuma"}</span>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3">
              Origem:{" "}
              <span className="font-semibold text-white">
                {synthesizedMolecule ? "laboratorio de sintese" : "comparacao direta"}
              </span>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3">
              Marcas: <span className="font-semibold text-white">{selectedProperties.length}/3</span>
            </div>
          </div>
        </div>
      </aside>

      <div className="grid gap-4">
        <section className="game-panel sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Classificacao</p>
              <h3 className="mt-2 text-2xl font-black tracking-tight text-white">Propriedades em foco</h3>
            </div>
            <div className="rounded-full border border-white/10 bg-slate-950/35 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-slate-300">
              Escolha ate 3
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            {phase.expectedProperties.map((property) => (
              <button
                key={property}
                type="button"
                onClick={() => onToggleProperty(property)}
                className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition ${
                  selectedProperties.includes(property)
                    ? "border-cyan-300/35 bg-cyan-400/10 text-cyan-100"
                    : "border-white/10 bg-slate-950/25 text-slate-200 hover:border-white/20"
                }`}
              >
                <span className="font-semibold">{formatSelectableProperty(property)}</span>
                <span className="text-xs font-semibold uppercase tracking-[0.16em]">
                  {selectedProperties.includes(property) ? "Marcada" : "Marcar"}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="game-panel">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Julgamento</p>
          <p className="mt-3 text-sm leading-6 text-slate-300">{phase.objective}</p>

          {submitError ? (
            <p className="mt-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {submitError}
            </p>
          ) : null}
        </section>
      </div>
    </section>
  );
}
