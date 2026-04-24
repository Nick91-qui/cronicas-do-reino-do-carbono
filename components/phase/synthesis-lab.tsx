"use client";

import { useEffect, useState } from "react";

import { MoleculeCard } from "@/components/cards/molecule-card";
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
  const currentCarbonValue = Number(carbonCount) || activeCarbonCount;

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

      {builderError ? (
        <p className="mt-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {builderError}
        </p>
      ) : null}

      {builderResult ? (
        <article className="mt-4 rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(2,6,23,0.88),rgba(15,23,42,0.82))] p-4 text-sm text-slate-300 sm:rounded-[24px] sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-4">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Resposta da mesa
              </p>
              <p className="mt-2 text-lg font-black tracking-tight text-slate-100 sm:text-xl">
                {builderResult.canCreateMolecule
                  ? "Estrutura reconhecida pelo laboratorio de sintese."
                  : "A estrutura ainda nao foi aceita pelo laboratorio de sintese."}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {builderResult.canCreateMolecule
                  ? "A mesa estabilizou sua leitura e a converteu em uma molecula reconhecida neste dominio."
                  : "A estrutura ainda precisa de ajuste antes de se tornar uma carta reconhecida pela prova."}
              </p>
            </div>
            <div className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] ${
              builderResult.canCreateMolecule
                ? "border border-emerald-400/30 bg-emerald-500/10 text-emerald-100"
                : "border border-amber-400/30 bg-amber-500/10 text-amber-100"
            }`}>
              {builderResult.canCreateMolecule ? "Leitura aceita" : "Leitura inconclusiva"}
            </div>
          </div>

          <div className={`mt-4 grid gap-3 ${synthesizedMolecule ? "xl:grid-cols-[0.32fr,0.68fr]" : "sm:grid-cols-2"}`}>
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

          {synthesizedMolecule ? (
            <div className="mt-5 grid gap-4 xl:grid-cols-[0.28fr,0.72fr] xl:items-start">
              <div className="rounded-[24px] border border-emerald-400/20 bg-[linear-gradient(180deg,rgba(16,185,129,0.08),rgba(15,23,42,0.12))] p-3">
                <MoleculeCard
                  molecule={synthesizedMolecule}
                  isCreated
                  selectable={false}
                  variant="compact"
                />
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-200">
                  Molecula reconhecida
                </p>
                <p className="mt-2 text-2xl font-black tracking-tight text-white">
                  {synthesizedMolecule.nomeQuimico}
                </p>
                <p className="mt-3">
                  A mesa reconheceu esta carta como uma leitura coerente. No proximo rito, voce confirma se ela continua sendo a melhor resposta para o contexto da prova.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full border border-emerald-300/25 bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-100">
                    Aceita pela mesa
                  </span>
                  <span className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/80">
                    Pronta para comparacao
                  </span>
                </div>
              </div>
            </div>
          ) : null}
        </article>
      ) : null}
    </section>
  );
}
