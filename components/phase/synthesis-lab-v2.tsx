"use client";

import { useEffect, useMemo, useState } from "react";

import { SynthesisBuilderToolbarV2 } from "@/components/phase/synthesis-builder-toolbar-v2";
import { SynthesisLabSvg } from "@/components/phase/synthesis-lab-svg";
import { SynthesizedCardOverlay } from "@/components/phase/synthesized-card-overlay";
import {
  getHydrogenCountForAtom,
  getTotalHydrogenCount,
} from "@/lib/builder/chemistry/branched-hydrogens";
import { getBranchedFormula } from "@/lib/builder/chemistry/branched-signature";
import {
  getAtomAvailableValence,
  isTerminalCarbon,
} from "@/lib/builder/chemistry/branched-valence";
import {
  addCarbonToAtom,
  connectAtomsWithBond,
  createBranchedBuilderState,
  cycleBondOrder,
  removeTerminalAtom,
} from "@/lib/builder/state/branched-operations";
import type {
  BranchedAtomId,
  BranchedBondId,
  BranchedBuilderState,
} from "@/lib/builder/state/branched-types";
import type { BuilderValidationResult } from "@/lib/builder/types";
import type { Molecule } from "@/lib/content/types";

type SynthesisLabV2Props = {
  onOpenTutorialAction: () => void;
  objective: string;
  builderState: BranchedBuilderState;
  maximumCarbonCount: number;
  canUseDoubleBond: boolean;
  canUseClosedRing: boolean;
  isValidatingBuilder: boolean;
  builderError: string | null;
  builderResult: BuilderValidationResult | null;
  synthesizedMolecule: Molecule | null;
  onBuilderStateChangeAction: (nextState: BranchedBuilderState) => void;
  onValidateBuilderAction: () => void;
};

function cloneState(state: BranchedBuilderState): BranchedBuilderState {
  return {
    ...state,
    atoms: state.atoms.map((atom) => ({ ...atom })),
    bonds: state.bonds.map((bond) => ({ ...bond })),
  };
}

export function SynthesisLabV2({
  onOpenTutorialAction,
  objective,
  builderState,
  maximumCarbonCount,
  canUseDoubleBond,
  canUseClosedRing,
  isValidatingBuilder,
  builderError,
  builderResult,
  synthesizedMolecule,
  onBuilderStateChangeAction,
  onValidateBuilderAction,
}: SynthesisLabV2Props) {
  const [history, setHistory] = useState<BranchedBuilderState[]>([]);
  const [hoveredBondId, setHoveredBondId] = useState<BranchedBondId | null>(null);
  const [recentlyChangedBondId, setRecentlyChangedBondId] =
    useState<BranchedBondId | null>(null);
  const [ringSourceAtomId, setRingSourceAtomId] =
    useState<BranchedAtomId | null>(null);
  const [isSynthesizedCardOpen, setIsSynthesizedCardOpen] = useState(false);
  const [isSynthesizedCardMinimized, setIsSynthesizedCardMinimized] = useState(false);

  const selectedAtomId = builderState.selectedAtomId ?? builderState.atoms[0]?.id ?? null;
  const selectedAtomLabel = selectedAtomId
    ? `${selectedAtomId.toUpperCase()} · CH${getHydrogenCountForAtom(builderState, selectedAtomId)}`
    : "nenhum";
  const canAddCarbon = selectedAtomId
    ? getAtomAvailableValence(builderState, selectedAtomId) > 0 &&
      builderState.atoms.length < maximumCarbonCount
    : false;
  const canRemoveSelected = selectedAtomId
    ? isTerminalCarbon(builderState, selectedAtomId) && builderState.atoms.length > 1
    : false;
  const formula = useMemo(() => getBranchedFormula(builderState), [builderState]);
  const ringMode = ringSourceAtomId !== null;

  useEffect(() => {
    if (builderResult?.canCreateMolecule && synthesizedMolecule) {
      setIsSynthesizedCardOpen(true);
      setIsSynthesizedCardMinimized(false);
      return;
    }

    setIsSynthesizedCardOpen(false);
    setIsSynthesizedCardMinimized(false);
  }, [builderResult?.canCreateMolecule, synthesizedMolecule]);

  function applyMutation(nextState: BranchedBuilderState) {
    if (nextState === builderState) {
      return;
    }

    setHistory((current) => [...current, cloneState(builderState)]);
    onBuilderStateChangeAction(nextState);
  }

  function handleAtomSelectAction(atomId: BranchedAtomId) {
    if (ringSourceAtomId && ringSourceAtomId !== atomId) {
      const nextState = connectAtomsWithBond(builderState, ringSourceAtomId, atomId, 1);

      if (nextState !== builderState) {
        applyMutation({
          ...nextState,
          selectedAtomId: atomId,
        });
      }

      setRingSourceAtomId(null);
      return;
    }

    onBuilderStateChangeAction({
      ...builderState,
      selectedAtomId: atomId,
    });
  }

  function handleAddCarbonAction() {
    if (!selectedAtomId) {
      return;
    }

    applyMutation(addCarbonToAtom(builderState, selectedAtomId));
  }

  function handleToggleRingModeAction() {
    if (!canUseClosedRing) {
      return;
    }

    setRingSourceAtomId((current) => (current ? null : selectedAtomId));
  }

  function handleRemoveTerminalAction() {
    if (!selectedAtomId) {
      return;
    }

    applyMutation(removeTerminalAtom(builderState, selectedAtomId));
  }

  function handleUndoAction() {
    const previous = history.at(-1);

    if (!previous) {
      return;
    }

    setHistory((current) => current.slice(0, -1));
    onBuilderStateChangeAction(previous);
    setRingSourceAtomId(null);
  }

  function handleResetAction() {
    setHistory((current) => [...current, cloneState(builderState)]);
    onBuilderStateChangeAction(createBranchedBuilderState());
    setRingSourceAtomId(null);
    setHoveredBondId(null);
    setRecentlyChangedBondId(null);
  }

  function handleBondToggleAction(bondId: BranchedBondId) {
    if (!canUseDoubleBond) {
      return;
    }

    applyMutation(cycleBondOrder(builderState, bondId, 2));
    setRecentlyChangedBondId(bondId);
    window.setTimeout(() => {
      setRecentlyChangedBondId((current) => (current === bondId ? null : current));
    }, 260);
  }

  return (
    <section className="game-panel overflow-hidden border-cyan-300/15 bg-[linear-gradient(180deg,rgba(7,12,24,0.98),rgba(3,7,18,0.98))] p-3 sm:p-4">
      <div className="mb-4 grid gap-3 lg:grid-cols-[0.95fr,1.05fr]">
        <article className="game-panel-muted">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-300">
            Estado da bancada
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.16em] text-slate-300">
                Carbonos
              </p>
              <p className="mt-2 text-sm font-semibold text-white">
                {builderState.atoms.length}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.16em] text-slate-300">
                Hidrogenios
              </p>
              <p className="mt-2 text-sm font-semibold text-white">
                {getTotalHydrogenCount(builderState)}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.16em] text-slate-300">
                Formula
              </p>
              <p className="mt-2 text-sm font-semibold text-white">
                {builderResult?.derivedStructure?.formulaMolecular ?? formula}
              </p>
            </div>
          </div>
        </article>

        <article className="game-panel-muted">
          <div className="flex items-start justify-between gap-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-300">
              Desafio
            </p>
            <button
              type="button"
              onClick={onOpenTutorialAction}
              className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-cyan-100 transition hover:border-cyan-200/35"
            >
              Ajuda
            </button>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-300">{objective}</p>
        </article>
      </div>

      <div className="relative mt-4 rounded-[24px] border border-cyan-300/14 bg-[linear-gradient(180deg,rgba(9,15,30,0.98),rgba(15,23,42,1))] p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:rounded-[28px] sm:p-4 lg:p-5">
        <div className="rounded-[20px] border border-cyan-300/10 bg-[linear-gradient(180deg,rgba(14,23,42,0.9),rgba(8,13,26,0.96))] p-4 sm:rounded-[24px] sm:p-5 lg:p-6">
          <SynthesisBuilderToolbarV2
            selectedAtomLabel={selectedAtomLabel}
            canAddCarbon={canAddCarbon}
            canRemoveSelected={canRemoveSelected}
            isRingMode={ringMode}
            canUndo={history.length > 0}
            onAddCarbonAction={handleAddCarbonAction}
            onToggleRingModeAction={handleToggleRingModeAction}
            onRemoveTerminalAction={handleRemoveTerminalAction}
            onUndoAction={handleUndoAction}
            onResetAction={handleResetAction}
          />

          <SynthesisLabSvg
            builderState={builderState}
            hoveredBondId={hoveredBondId}
            recentlyChangedBondId={recentlyChangedBondId}
            canUseDoubleBond={canUseDoubleBond}
            selectedAtomId={selectedAtomId}
            onAtomSelectAction={handleAtomSelectAction}
            onBondHoverAction={setHoveredBondId}
            onBondToggleAction={handleBondToggleAction}
          />
        </div>

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
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-300">
                Estrutural
              </p>
              <p className="mt-2 text-sm font-semibold text-white">
                {builderResult.derivedStructure?.formulaEstrutural ?? formula}
              </p>
            </div>
            <div className="rounded-[20px] border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-300">
                Molecular
              </p>
              <p className="mt-2 text-sm font-semibold text-white">
                {builderResult.derivedStructure?.formulaMolecular ?? formula}
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

      <div className="mt-4 flex justify-center">
        <button
          type="button"
          onClick={onValidateBuilderAction}
          disabled={isValidatingBuilder}
          className="rounded-full bg-[linear-gradient(180deg,rgba(250,204,21,0.96),rgba(245,158,11,0.92))] px-6 py-3 text-sm font-black uppercase tracking-[0.16em] text-slate-950 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isValidatingBuilder ? "Realizando sintese..." : "Realizar sintese"}
        </button>
      </div>
    </section>
  );
}
