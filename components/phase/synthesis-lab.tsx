"use client";

import { useEffect, useState } from "react";

import { SynthesizedCardOverlay } from "@/components/phase/synthesized-card-overlay";
import { SynthesisLabVisual } from "@/components/phase/synthesis-lab-visual";
import type {
  BuilderLayout,
  BuilderValidationResult,
  GraphBuilderBondOrder,
} from "@/lib/builder/types";
import type { BondType, Molecule } from "@/lib/content/types";

type SynthesisLabProps = {
  objective: string;
  layout: BuilderLayout;
  carbonCount: string;
  activeCarbonCount: number;
  minimumCarbonCount: number;
  maximumCarbonCount: number;
  canUseDoubleBond: boolean;
  canUseClosedRing: boolean;
  availableBondTypes: BondType[];
  normalizedBondOrders: GraphBuilderBondOrder[];
  previewHydrogensByCarbon: number[];
  previewFormulaEstrutural: string;
  previewFormulaMolecular: string;
  isValidatingBuilder: boolean;
  builderError: string | null;
  builderResult: BuilderValidationResult | null;
  synthesizedMolecule: Molecule | null;
  onSetLayout: (layout: BuilderLayout) => void;
  onSetCarbonCount: (value: string) => void;
  onUpdateBondOrder: (index: number) => void;
  onValidateBuilder: () => void;
};

export function SynthesisLab({
  objective,
  layout,
  carbonCount,
  activeCarbonCount,
  minimumCarbonCount,
  maximumCarbonCount,
  canUseDoubleBond,
  canUseClosedRing,
  availableBondTypes: _availableBondTypes,
  normalizedBondOrders,
  previewHydrogensByCarbon,
  previewFormulaEstrutural,
  previewFormulaMolecular,
  isValidatingBuilder,
  builderError,
  builderResult,
  synthesizedMolecule,
  onSetLayout,
  onSetCarbonCount,
  onUpdateBondOrder,
  onValidateBuilder,
}: SynthesisLabProps) {
  const [hoveredBondIndex, setHoveredBondIndex] = useState<number | null>(null);
  const [recentlyChangedBondIndex, setRecentlyChangedBondIndex] = useState<number | null>(null);
  const [isSynthesizedCardOpen, setIsSynthesizedCardOpen] = useState(false);
  const [isSynthesizedCardMinimized, setIsSynthesizedCardMinimized] = useState(false);
  const currentCarbonValue = Number(carbonCount) || activeCarbonCount;

  useEffect(() => {
    if (builderResult?.canCreateMolecule && synthesizedMolecule) {
      setIsSynthesizedCardOpen(true);
      setIsSynthesizedCardMinimized(false);
      return;
    }

    setIsSynthesizedCardOpen(false);
    setIsSynthesizedCardMinimized(false);
  }, [builderResult?.canCreateMolecule, synthesizedMolecule?.id]);

  useEffect(() => {
    if (recentlyChangedBondIndex === null) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setRecentlyChangedBondIndex(null);
    }, 260);

    return () => window.clearTimeout(timeoutId);
  }, [recentlyChangedBondIndex]);

  function handleBondToggle(index: number) {
    onUpdateBondOrder(index);
    setRecentlyChangedBondIndex(index);
  }

  function handleCarbonStep(direction: "decrease" | "increase") {
    const delta = direction === "increase" ? 1 : -1;
    const nextValue = Math.max(
      minimumCarbonCount,
      Math.min(maximumCarbonCount, activeCarbonCount + delta),
    );

    if (nextValue !== currentCarbonValue) {
      onSetCarbonCount(String(nextValue));
    }
  }

  return (
    <section className="game-panel overflow-hidden border-cyan-300/15 bg-[linear-gradient(180deg,rgba(7,12,24,0.98),rgba(3,7,18,0.98))] p-3 sm:p-4">
      <div className="mb-4 grid gap-3 lg:grid-cols-[0.95fr,1.05fr]">
        <article className="game-panel-muted">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Estado da bancada</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">Geometria</p>
              <p className="mt-2 text-sm font-semibold text-white">
                {layout === "closed_ring" ? "Cadeia fechada" : "Cadeia aberta"}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">Carbonos ativos</p>
              <p className="mt-2 text-sm font-semibold text-white">{activeCarbonCount}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">Ligacoes elevadas</p>
              <p className="mt-2 text-sm font-semibold text-white">
                {normalizedBondOrders.filter((order) => order === 2).length}
              </p>
            </div>
          </div>
        </article>

        <article className="game-panel-muted">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Missao</p>
          <p className="mt-3 text-sm leading-6 text-slate-300">{objective}</p>
        </article>
      </div>

      <div className="relative">
        <SynthesisLabVisual
          layout={layout}
          activeCarbonCount={activeCarbonCount}
          minimumCarbonCount={minimumCarbonCount}
          maximumCarbonCount={maximumCarbonCount}
          normalizedBondOrders={normalizedBondOrders}
          previewHydrogensByCarbon={previewHydrogensByCarbon}
          previewFormulaEstrutural={previewFormulaEstrutural}
          previewFormulaMolecular={previewFormulaMolecular}
          hoveredBondIndex={hoveredBondIndex}
          recentlyChangedBondIndex={recentlyChangedBondIndex}
          canUseDoubleBond={canUseDoubleBond}
          canUseClosedRing={canUseClosedRing}
          isValidatingBuilder={isValidatingBuilder}
          onBondHover={setHoveredBondIndex}
          onBondToggle={handleBondToggle}
          onSetLayout={onSetLayout}
          onCarbonStep={handleCarbonStep}
          onValidateBuilder={onValidateBuilder}
        />

        {synthesizedMolecule ? (
          <SynthesizedCardOverlay
            molecule={synthesizedMolecule}
            isVisible={isSynthesizedCardOpen}
            isMinimized={isSynthesizedCardMinimized}
            onExpand={() => setIsSynthesizedCardMinimized(false)}
            onMinimize={() => setIsSynthesizedCardMinimized(true)}
          />
        ) : null}
      </div>

      {builderError ? (
        <p className="mt-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {builderError}
        </p>
      ) : null}

      {builderResult ? (
        <article className="mt-4 rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(2,6,23,0.88),rgba(15,23,42,0.82))] p-4 text-sm text-slate-300 sm:rounded-[24px] sm:p-5">
          <div className={`${synthesizedMolecule ? "grid gap-3 xl:grid-cols-[0.32fr,0.68fr]" : "grid gap-3 sm:grid-cols-2"}`}>
            <div className="rounded-[20px] border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                Estrutural
              </p>
              <p className="mt-2 text-sm font-semibold text-white">
                {builderResult.derivedStructure?.formulaEstrutural ?? previewFormulaEstrutural}
              </p>
            </div>
            <div className="rounded-[20px] border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                Molecular
              </p>
              <p className="mt-2 text-sm font-semibold text-white">
                {builderResult.derivedStructure?.formulaMolecular ?? previewFormulaMolecular}
              </p>
            </div>
          </div>

          {!builderResult.canCreateMolecule ? (
            <div className="mt-4 rounded-[24px] border border-amber-400/20 bg-amber-500/10 p-4 text-sm leading-6 text-amber-100">
              A estrutura ainda nao foi aceita pelo laboratorio de sintese.
            </div>
          ) : null}
        </article>
      ) : null}
    </section>
  );
}
