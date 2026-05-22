"use client";

import { useMemo, useState } from "react";

import { SynthesisBuilderToolbarV2 } from "@/components/phase/synthesis-builder-toolbar-v2";
import { SynthesisLabSvg } from "@/components/phase/synthesis-lab-svg";
import { getBranchedFormula } from "@/lib/builder/chemistry/branched-signature";
import {
  getHydrogenCountForAtom,
  getTotalHydrogenCount,
} from "@/lib/builder/chemistry/branched-hydrogens";
import { getAtomAvailableValence, isTerminalCarbon } from "@/lib/builder/chemistry/branched-valence";
import {
  addCarbonToAtom,
  connectAtomsWithBond,
  createBranchedBuilderState,
  cycleBondOrder,
  removeTerminalAtom,
} from "@/lib/builder/state/branched-operations";
import type { BranchedAtomId, BranchedBondId, BranchedBuilderState } from "@/lib/builder/state/branched-types";

type SynthesisLabV2Props = {
  title?: string;
};

function cloneState(state: BranchedBuilderState): BranchedBuilderState {
  return {
    ...state,
    atoms: state.atoms.map((atom) => ({ ...atom })),
    bonds: state.bonds.map((bond) => ({ ...bond })),
  };
}

export function SynthesisLabV2({
  title = "Mesa de sintese v2",
}: SynthesisLabV2Props) {
  const [builderState, setBuilderState] = useState<BranchedBuilderState>(
    createBranchedBuilderState,
  );
  const [history, setHistory] = useState<BranchedBuilderState[]>([]);
  const [hoveredBondId, setHoveredBondId] = useState<BranchedBondId | null>(null);
  const [recentlyChangedBondId, setRecentlyChangedBondId] = useState<BranchedBondId | null>(
    null,
  );
  const [ringSourceAtomId, setRingSourceAtomId] = useState<BranchedAtomId | null>(null);

  const selectedAtomId = builderState.selectedAtomId ?? builderState.atoms[0]?.id ?? null;
  const selectedAtomLabel = selectedAtomId
    ? `${selectedAtomId.toUpperCase()} · CH${getHydrogenCountForAtom(builderState, selectedAtomId)}`
    : "nenhum";
  const canAddCarbon = selectedAtomId
    ? getAtomAvailableValence(builderState, selectedAtomId) > 0
    : false;
  const canRemoveSelected = selectedAtomId
    ? isTerminalCarbon(builderState, selectedAtomId) && builderState.atoms.length > 1
    : false;
  const formula = useMemo(() => getBranchedFormula(builderState), [builderState]);
  const ringMode = ringSourceAtomId !== null;

  function applyMutation(nextState: BranchedBuilderState) {
    if (nextState === builderState) {
      return;
    }

    setHistory((current) => [...current, cloneState(builderState)]);
    setBuilderState(nextState);
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

    setBuilderState((current) => ({
      ...current,
      selectedAtomId: atomId,
    }));
  }

  function handleAddCarbonAction() {
    if (!selectedAtomId) {
      return;
    }

    applyMutation(addCarbonToAtom(builderState, selectedAtomId));
  }

  function handleToggleRingModeAction() {
    setRingSourceAtomId((current) => (current ? null : selectedAtomId));
  }

  function handleRemoveTerminalAction() {
    if (!selectedAtomId) {
      return;
    }

    applyMutation(removeTerminalAtom(builderState, selectedAtomId));
  }

  function handleUndoAction() {
    setHistory((current) => {
      const previous = current.at(-1);
      if (!previous) {
        return current;
      }

      setBuilderState(previous);
      setRingSourceAtomId(null);
      return current.slice(0, -1);
    });
  }

  function handleResetAction() {
    setHistory((current) => [...current, cloneState(builderState)]);
    setBuilderState(createBranchedBuilderState());
    setRingSourceAtomId(null);
    setHoveredBondId(null);
    setRecentlyChangedBondId(null);
  }

  function handleBondToggleAction(bondId: BranchedBondId) {
    applyMutation(cycleBondOrder(builderState, bondId));
    setRecentlyChangedBondId(bondId);
    window.setTimeout(() => {
      setRecentlyChangedBondId((current) => (current === bondId ? null : current));
    }, 260);
  }

  return (
    <section className="game-panel overflow-hidden border-cyan-300/15 bg-[linear-gradient(180deg,rgba(7,12,24,0.98),rgba(3,7,18,0.98))] p-3 sm:p-4">
      <div className="grid gap-3 lg:grid-cols-[0.92fr,1.08fr]">
        <article className="game-panel-muted">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-300">{title}</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.16em] text-slate-300">Carbonos</p>
              <p className="mt-2 text-sm font-semibold text-white">{builderState.atoms.length}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.16em] text-slate-300">Hidrogenios</p>
              <p className="mt-2 text-sm font-semibold text-white">{getTotalHydrogenCount(builderState)}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.16em] text-slate-300">Formula</p>
              <p className="mt-2 text-sm font-semibold text-white">{formula}</p>
            </div>
          </div>
        </article>

        <article className="game-panel-muted">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-300">Interacao</p>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Selecione um carbono para expandir a cadeia. Ative o modo de anel e clique em outro carbono
            para fechar uma ligacao C-C entre dois pontos livres.
          </p>
        </article>
      </div>

      <div className="mt-4 rounded-[24px] border border-cyan-300/14 bg-[linear-gradient(180deg,rgba(9,15,30,0.98),rgba(15,23,42,1))] p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:rounded-[28px] sm:p-4">
        <div className="rounded-[20px] border border-cyan-300/10 bg-[linear-gradient(180deg,rgba(14,23,42,0.9),rgba(8,13,26,0.96))] p-4 sm:rounded-[24px]">
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
            canUseDoubleBond={true}
            selectedAtomId={selectedAtomId}
            onAtomSelectAction={handleAtomSelectAction}
            onBondHoverAction={setHoveredBondId}
            onBondToggleAction={handleBondToggleAction}
          />
        </div>
      </div>
    </section>
  );
}
