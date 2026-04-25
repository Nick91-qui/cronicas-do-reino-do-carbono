import { MoleculeCard } from "@/components/cards/molecule-card";

import type { BuilderValidationResult } from "@/lib/builder/types";
import type { Molecule, MoleculeId } from "@/lib/content/types";

type PhaseSelectPanelProps = {
  builderResult: BuilderValidationResult | null;
  effectiveSelectedMoleculeId: MoleculeId | "";
  focusedMolecule: Molecule | null;
  molecules: Molecule[];
  onSelectMolecule: (moleculeId: MoleculeId) => void;
  supportsMoleculeSelection: boolean;
  synthesizedMolecule: Molecule | null;
};

export function PhaseSelectPanel({
  builderResult,
  effectiveSelectedMoleculeId,
  focusedMolecule,
  molecules,
  onSelectMolecule,
  supportsMoleculeSelection,
  synthesizedMolecule,
}: PhaseSelectPanelProps) {
  return (
    <section className="grid gap-5 xl:grid-cols-[0.82fr,1.18fr] xl:gap-6">
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
                onSelect={supportsMoleculeSelection ? () => onSelectMolecule(focusedMolecule.id) : undefined}
              />
            </div>
          ) : (
            <div className="mt-4 rounded-[24px] border border-dashed border-white/15 bg-slate-950/25 px-5 py-8 text-sm leading-6 text-slate-400">
              Selecione uma carta para abrir a leitura de propriedades.
            </div>
          )}
        </div>

        <div className="game-panel">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Estado da escolha</p>
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
          </div>
        </div>
      </aside>

      <section className="game-panel sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Escolha</p>
            <h3 className="mt-2 text-2xl font-black tracking-tight text-white">Cartas disponiveis</h3>
          </div>
          <div className="rounded-full border border-white/10 bg-slate-950/35 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-slate-300">
            Selecione 1 carta
          </div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {molecules.map((molecule) => {
            const isSelected = effectiveSelectedMoleculeId === molecule.id;
            const isCreated = builderResult?.resolvedMoleculeId === molecule.id;

            return (
              <div
                key={molecule.id}
                className={`rounded-[28px] p-1 transition ${
                  isSelected
                    ? "bg-[linear-gradient(135deg,rgba(34,211,238,0.25),rgba(59,130,246,0.12))]"
                    : isCreated
                      ? "bg-[linear-gradient(135deg,rgba(52,211,153,0.18),rgba(20,184,166,0.1))]"
                      : "bg-transparent"
                }`}
              >
                <MoleculeCard
                  molecule={molecule}
                  isSelected={isSelected}
                  isCreated={isCreated}
                  selectable
                  variant="compact"
                  onSelect={() => onSelectMolecule(molecule.id)}
                />
              </div>
            );
          })}
        </div>
      </section>
    </section>
  );
}
