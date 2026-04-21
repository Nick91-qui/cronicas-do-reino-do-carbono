"use client";

import type { KeyboardEvent } from "react";
import { useEffect, useState } from "react";

import { MoleculeCard } from "@/components/cards/molecule-card";
import { AtomForgeVisual } from "@/components/phase/atom-forge-visual";
import type {
  BuilderLayout,
  BuilderValidationResult,
  GraphBuilderBondOrder,
} from "@/lib/builder/types";
import type { BondType, Molecule } from "@/lib/content/types";

type AtomForgeProps = {
  layout: BuilderLayout;
  carbonCount: string;
  activeCarbonCount: number;
  minimumCarbonCount: number;
  maximumCarbonCount: number;
  canUseDoubleBond: boolean;
  canUseClosedRing: boolean;
  availableBondTypes: BondType[];
  normalizedBondOrders: GraphBuilderBondOrder[];
  previewBondType: BondType;
  previewHydrogensByCarbon: number[];
  previewFormulaEstrutural: string;
  previewFormulaMolecular: string;
  isValidatingBuilder: boolean;
  builderError: string | null;
  builderResult: BuilderValidationResult | null;
  forgedMolecule: Molecule | null;
  onSetLayout: (layout: BuilderLayout) => void;
  onSetCarbonCount: (value: string) => void;
  onUpdateBondOrder: (index: number) => void;
  onValidateBuilder: () => void;
};

const bondTypeLabels: Record<BondType, string> = {
  single: "Ligacao simples",
  double: "Ligacao dupla",
  aromatic: "Estrutura aromatica",
};

function LayoutGlyph({ layout }: { layout: BuilderLayout }) {
  if (layout === "open_chain") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 44 20"
        className="h-5 w-11"
        fill="none"
      >
        <circle cx="6" cy="12.5" r="2.5" fill="currentColor" />
        <circle cx="22" cy="6.5" r="2.5" fill="currentColor" />
        <circle cx="38" cy="12.5" r="2.5" fill="currentColor" />
        <line x1="9.2" y1="11.3" x2="18.6" y2="7.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="25.4" y1="7.7" x2="34.8" y2="11.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className="h-5 w-5"
      fill="none"
    >
      <circle cx="10" cy="10" r="6.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function FlameGlyph() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
    >
      <path
        d="M12.4 3.8c.4 2.1-.4 3.5-1.7 4.9-1.1 1.2-2.3 2.3-2.3 4.2 0 2.1 1.6 3.7 3.7 3.7 2.6 0 4.5-2 4.5-4.8 0-2.4-1.3-4.2-4.2-8z"
        fill="rgb(220 38 38)"
      />
      <path
        d="M12 13.2c-.8 1-1.6 1.7-1.6 2.9 0 1 .8 1.8 1.8 1.8 1.2 0 2.1-.9 2.1-2.3 0-1.1-.6-1.9-2.3-2.4z"
        fill="rgb(250 204 21)"
      />
    </svg>
  );
}

export function AtomForge({
  layout,
  carbonCount,
  activeCarbonCount,
  minimumCarbonCount,
  maximumCarbonCount,
  canUseDoubleBond,
  canUseClosedRing,
  availableBondTypes,
  normalizedBondOrders,
  previewBondType,
  previewHydrogensByCarbon,
  previewFormulaEstrutural,
  previewFormulaMolecular,
  isValidatingBuilder,
  builderError,
  builderResult,
  forgedMolecule,
  onSetLayout,
  onSetCarbonCount,
  onUpdateBondOrder,
  onValidateBuilder,
}: AtomForgeProps) {
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

  function handleBondKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleBondToggle(index);
      return;
    }

    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
      return;
    }

    event.preventDefault();

    const bondButtons = Array.from(
      document.querySelectorAll<HTMLButtonElement>("[data-bond-index]"),
    );
    const currentPosition = bondButtons.findIndex(
      (button) => Number(button.dataset.bondIndex) === index,
    );

    if (currentPosition < 0) {
      return;
    }

    const nextPosition =
      event.key === "ArrowDown"
        ? Math.min(bondButtons.length - 1, currentPosition + 1)
        : Math.max(0, currentPosition - 1);

    bondButtons[nextPosition]?.focus();
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
    <section className="overflow-hidden rounded-[28px] border border-cyan-300/15 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(15,23,42,0.72))] p-4 shadow-[0_20px_60px_rgba(15,23,42,0.28)] sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
            Oficina molecular
          </p>
          <h3 className="mt-2 text-2xl font-black tracking-tight text-white">
            Forja estrutural
          </h3>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
            Centralize a montagem na mesa de forja: ajuste o numero de carbonos e altere as ligacoes direto na estrutura.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        <div className="rounded-[24px] border border-white/10 bg-slate-950/45 p-3 sm:p-4">
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-white/8 pt-3 text-[11px] text-slate-500">
            <span>
              Fragmentos disponiveis:{" "}
              {availableBondTypes
                .map((availableBondType) => bondTypeLabels[availableBondType])
                .join(" · ")}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 uppercase tracking-[0.14em]">
              Toque nas ligacoes direto na estrutura
            </span>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr),280px] xl:items-start">
          <AtomForgeVisual
            layout={layout}
            activeCarbonCount={activeCarbonCount}
            normalizedBondOrders={normalizedBondOrders}
            previewBondType={previewBondType}
            previewHydrogensByCarbon={previewHydrogensByCarbon}
            previewFormulaEstrutural={previewFormulaEstrutural}
            previewFormulaMolecular={previewFormulaMolecular}
            hoveredBondIndex={hoveredBondIndex}
            recentlyChangedBondIndex={recentlyChangedBondIndex}
            canUseDoubleBond={canUseDoubleBond}
            onBondHover={setHoveredBondIndex}
            onBondToggle={handleBondToggle}
          />

          <div className="rounded-[24px] border border-white/10 bg-slate-950/35 px-4 py-4">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-3">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Cadeia
                </span>
                <div className="flex flex-col gap-2">
                  {(["open_chain", "closed_ring"] as const).map((nextLayout) => (
                    <button
                      key={nextLayout}
                      type="button"
                      onClick={() => onSetLayout(nextLayout)}
                      disabled={nextLayout === "closed_ring" && !canUseClosedRing}
                      className={`flex items-center justify-center rounded-2xl border px-4 py-3 text-sm font-black transition ${
                        layout === nextLayout
                          ? "border-cyan-300/50 bg-cyan-400/15 text-cyan-100"
                          : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20"
                      } disabled:cursor-not-allowed disabled:opacity-30`}
                      aria-label={nextLayout === "open_chain" ? "Cadeia aberta" : "Cadeia fechada"}
                    >
                      <LayoutGlyph layout={nextLayout} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Carbonos
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleCarbonStep("decrease")}
                    disabled={activeCarbonCount <= minimumCarbonCount}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-orange-300/20 bg-[radial-gradient(circle_at_30%_30%,rgba(251,191,36,0.32),transparent_45%),linear-gradient(180deg,rgba(249,115,22,0.18),rgba(127,29,29,0.32))] text-amber-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_18px_rgba(249,115,22,0.16)] transition hover:border-amber-300/35 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_0_24px_rgba(249,115,22,0.24)] disabled:cursor-not-allowed disabled:opacity-35"
                    aria-label="Diminuir carbonos"
                  >
                    <FlameGlyph />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCarbonStep("increase")}
                    disabled={activeCarbonCount >= maximumCarbonCount}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-slate-950/70 text-base font-black text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition hover:bg-white/8 disabled:cursor-not-allowed disabled:opacity-35"
                    aria-label="Aumentar carbonos"
                  >
                    C
                  </button>
                </div>
                <span className="text-[11px] leading-5 text-slate-500">
                  {layout === "closed_ring"
                    ? `anel de ${minimumCarbonCount} a ${maximumCarbonCount} carbonos`
                    : `de ${minimumCarbonCount} a ${maximumCarbonCount} carbonos`}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={onValidateBuilder}
            disabled={isValidatingBuilder}
            className="rounded-2xl bg-cyan-300 px-6 py-3 text-sm font-black uppercase tracking-[0.16em] text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isValidatingBuilder ? "Consultando a mesa..." : "Consultar a mesa"}
          </button>
        </div>

        <details className="rounded-[24px] border border-white/10 bg-slate-950/35 p-3 sm:p-4">
          <summary className="cursor-pointer list-none text-sm font-black uppercase tracking-[0.14em] text-slate-200">
            Leitura minuciosa da estrutura
          </summary>
          <p className="mt-2 text-[11px] leading-5 text-slate-500">
            Apoio para teclado e leitura fina das ligacoes. `Enter` alterna e as setas `↑` e `↓` navegam entre elas.
          </p>
          <div className="mt-3 grid max-h-[280px] gap-2 overflow-y-auto pr-1">
            {normalizedBondOrders.length > 0 ? (
              normalizedBondOrders.map((order, index) => {
                const from = index + 1;
                const to =
                  layout === "closed_ring"
                  && index === normalizedBondOrders.length - 1
                    ? 1
                    : index + 2;

                return (
                  <button
                    key={`${from}-${to}`}
                    type="button"
                    data-bond-index={index}
                    onClick={() => handleBondToggle(index)}
                    onMouseEnter={() => setHoveredBondIndex(index)}
                    onMouseLeave={() => setHoveredBondIndex(null)}
                    onFocus={() => setHoveredBondIndex(index)}
                    onBlur={() => setHoveredBondIndex(null)}
                    onKeyDown={(event) => handleBondKeyDown(event, index)}
                    disabled={!canUseDoubleBond}
                    className={`flex items-center justify-between rounded-2xl border px-3 py-2.5 text-left text-sm transition ${
                      hoveredBondIndex === index
                        ? "border-cyan-300/50 bg-cyan-400/12 text-cyan-100"
                        : recentlyChangedBondIndex === index
                          ? "border-amber-300/45 bg-amber-400/12 text-amber-100"
                          : order === 2
                            ? "border-emerald-300/35 bg-emerald-500/10 text-emerald-100"
                            : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20"
                    } disabled:cursor-not-allowed disabled:opacity-60`}
                  >
                    <span className="font-semibold">
                      C{from} {order === 2 ? "=" : "-"} C{to}
                    </span>
                    <div className="flex items-center gap-2">
                      {(hoveredBondIndex === index
                        || recentlyChangedBondIndex === index) ? (
                        <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.16em] text-white/90">
                          {hoveredBondIndex === index ? "Ativa" : "Alterada"}
                        </span>
                      ) : null}
                      <span className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                        {canUseDoubleBond
                          ? order === 2
                            ? "Dupla"
                            : "Simples"
                          : "So simples"}
                      </span>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-400">
                Esta estrutura ainda nao apresenta ligacoes C-C que possam ser alteradas.
              </div>
            )}
          </div>
        </details>
      </div>

      {builderError ? (
        <p className="mt-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {builderError}
        </p>
      ) : null}

      {builderResult ? (
        <article className="mt-6 rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(2,6,23,0.72),rgba(15,23,42,0.72))] p-5 text-sm text-slate-300">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/8 pb-4">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Resposta da mesa
              </p>
              <p className="mt-2 text-xl font-black tracking-tight text-slate-100">
                {builderResult.canCreateMolecule
                  ? "Estrutura reconhecida pela forja."
                  : "A estrutura ainda nao foi aceita pela forja."}
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

          <div className={`mt-4 grid gap-3 ${forgedMolecule ? "xl:grid-cols-[0.32fr,0.68fr]" : "md:grid-cols-2"}`}>
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

          {forgedMolecule ? (
            <div className="mt-5 grid gap-4 xl:grid-cols-[0.32fr,0.68fr] xl:items-start">
              <div className="rounded-[24px] border border-emerald-400/20 bg-[linear-gradient(180deg,rgba(16,185,129,0.08),rgba(15,23,42,0.12))] p-3">
                <MoleculeCard
                  molecule={forgedMolecule}
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
                  {forgedMolecule.nomeQuimico}
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
