import { useEffect, useState } from "react";

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
  const [isSelectedCardMinimized, setIsSelectedCardMinimized] = useState(false);

  useEffect(() => {
    if (focusedMolecule) {
      setIsSelectedCardMinimized(false);
    }
  }, [focusedMolecule?.id]);

  return (
    <section className="relative">
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

        <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 2xl:grid-cols-4">
          {molecules.map((molecule) => {
            const isSelected = effectiveSelectedMoleculeId === molecule.id;
            const isCreated = builderResult?.resolvedMoleculeId === molecule.id;
            const artworkFit = molecule.visual.assets.artworkFit ?? "cover";
            const artworkPosition = molecule.visual.assets.artworkPosition ?? "center";
            const artworkScale = molecule.visual.assets.artworkScale ?? 1;

            return (
              <button
                type="button"
                key={molecule.id}
                onClick={() => onSelectMolecule(molecule.id)}
                aria-pressed={isSelected}
                className={`group mx-auto flex w-full max-w-[168px] flex-col rounded-[24px] p-1 text-left transition sm:max-w-[196px] lg:max-w-[208px] sm:rounded-[28px] ${
                  isSelected
                    ? "bg-[linear-gradient(135deg,rgba(34,211,238,0.25),rgba(59,130,246,0.12))]"
                    : isCreated
                      ? "bg-[linear-gradient(135deg,rgba(52,211,153,0.18),rgba(20,184,166,0.1))]"
                      : "bg-transparent"
                }`}
              >
                <div className="overflow-hidden rounded-[20px] border border-white/10 bg-slate-950/70 p-2 shadow-[0_16px_40px_rgba(2,6,23,0.24)] transition duration-300 group-hover:-translate-y-1 group-hover:border-cyan-200/30">
                  <div className="mb-2 min-w-0 px-1">
                    <p className="line-clamp-2 text-sm font-black tracking-tight text-white">
                      {molecule.nomeQuimico}
                    </p>
                  </div>
                  <div
                    className="relative aspect-square overflow-hidden rounded-[16px] border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                    style={{
                      backgroundImage: [
                        "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.82), transparent 18%)",
                        "radial-gradient(circle at 68% 35%, rgba(255,255,255,0.35), transparent 14%)",
                        `linear-gradient(135deg, ${molecule.visual.accentFrom}, ${molecule.visual.accentTo})`,
                      ].join(", "),
                    }}
                  >
                    <img
                      src={molecule.visual.assets.artworkAsset}
                      alt={molecule.nomeQuimico}
                      className={`h-full w-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.45)] ${
                        artworkFit === "contain" ? "object-contain" : "object-cover"
                      }`}
                      style={{
                        objectPosition: artworkPosition,
                        transform: `scale(${artworkScale})`,
                        transformOrigin: "center",
                      }}
                    />

                    <div className="pointer-events-none absolute inset-x-2 bottom-2 flex justify-between gap-2">
                      <span className="rounded-full border border-white/20 bg-slate-950/60 px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.18em] text-white/85">
                        {molecule.classe}
                      </span>
                      {isSelected ? (
                        <span className="rounded-full border border-cyan-200/30 bg-cyan-300/15 px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.18em] text-cyan-100">
                          Ativa
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {focusedMolecule ? (
        <>
          <div
            className={`fixed inset-0 z-40 transition duration-300 ${
              isSelectedCardMinimized ? "opacity-0" : "opacity-100"
            }`}
            onClick={() => setIsSelectedCardMinimized(true)}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(8,15,30,0.12),rgba(8,15,30,0.42)_58%,rgba(8,15,30,0.18)_100%)] backdrop-blur-[2px]" />
          </div>

          <div
            className={`fixed inset-x-3 bottom-6 z-50 flex justify-center transition-all duration-500 sm:inset-x-6 ${
              isSelectedCardMinimized
                ? "translate-y-10 scale-95 opacity-0"
                : "translate-y-0 scale-100 opacity-100"
            }`}
          >
            <div className="pointer-events-auto w-full max-w-sm" onClick={(event) => event.stopPropagation()}>
              <div className="mb-3 flex justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsSelectedCardMinimized(true)}
                  className="rounded-full border border-white/10 bg-slate-950/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-100 backdrop-blur-md transition hover:border-cyan-200/35"
                >
                  Minimizar
                </button>
              </div>
              <div className="rounded-[28px] border border-cyan-300/24 bg-[linear-gradient(180deg,rgba(34,211,238,0.12),rgba(15,23,42,0.18))] p-3 shadow-[0_24px_80px_rgba(2,6,23,0.48)]">
                <MoleculeCard
                  molecule={focusedMolecule}
                  isSelected
                  isCreated={builderResult?.resolvedMoleculeId === focusedMolecule.id}
                  selectable={supportsMoleculeSelection}
                  variant="compact"
                  onSelect={
                    supportsMoleculeSelection
                      ? () => onSelectMolecule(focusedMolecule.id)
                      : undefined
                  }
                />
              </div>
            </div>
          </div>

          <div
            className={`fixed bottom-4 right-4 z-50 transition-all duration-300 sm:bottom-5 sm:right-5 ${
              isSelectedCardMinimized ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0 pointer-events-none"
            }`}
          >
            <button
              type="button"
              onClick={() => setIsSelectedCardMinimized(false)}
              aria-label={`Reabrir carta de ${focusedMolecule.nomeQuimico}`}
              className="group block w-20 overflow-hidden rounded-[20px] border border-cyan-300/24 bg-[linear-gradient(180deg,rgba(34,211,238,0.16),rgba(15,23,42,0.9))] p-1.5 shadow-[0_12px_30px_rgba(2,6,23,0.34)] backdrop-blur-md transition hover:-translate-y-1 hover:border-cyan-200/40 sm:w-24"
            >
              <div
                className="relative aspect-square overflow-hidden rounded-[16px] border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                style={{
                  backgroundImage: [
                    "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.82), transparent 18%)",
                    "radial-gradient(circle at 68% 35%, rgba(255,255,255,0.35), transparent 14%)",
                    `linear-gradient(135deg, ${focusedMolecule.visual.accentFrom}, ${focusedMolecule.visual.accentTo})`,
                  ].join(", "),
                }}
              >
                <img
                  src={focusedMolecule.visual.assets.artworkAsset}
                  alt={focusedMolecule.nomeQuimico}
                  className={`h-full w-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.45)] ${
                    focusedMolecule.visual.assets.artworkFit === "contain" ? "object-contain" : "object-cover"
                  }`}
                  style={{
                    objectPosition: focusedMolecule.visual.assets.artworkPosition ?? "center",
                    transform: `scale(${focusedMolecule.visual.assets.artworkScale ?? 1})`,
                    transformOrigin: "center",
                  }}
                />
              </div>
            </button>
          </div>
        </>
      ) : null}
    </section>
  );
}
