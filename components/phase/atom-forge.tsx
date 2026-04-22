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

function MinusGlyph() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4" fill="none">
      <path d="M4 10h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function PlusGlyph() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4" fill="none">
      <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
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
    <section className="overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.68),rgba(2,6,23,0.8))] p-4 shadow-[0_16px_50px_rgba(15,23,42,0.2)] backdrop-blur-xl sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200/80">
            Oficina molecular
          </p>
          <h3 className="mt-2 text-2xl font-black tracking-tight text-white">
            Forja estrutural
          </h3>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
            A montagem fica isolada na mesa. Controles auxiliares aparecem apenas quando voce precisa ajustar a cadeia ou revisar ligacoes.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-slate-400">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur">
            Fragmentos:{" "}
            {availableBondTypes
              .map((availableBondType) => bondTypeLabels[availableBondType])
              .join(" · ")}
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur">
            Toque direto nas ligacoes
          </span>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr),320px] xl:items-start">
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

          <div className="grid gap-3">
            <details open className="rounded-[24px] border border-white/10 bg-white/5 px-4 py-4 backdrop-blur">
              <summary className="cursor-pointer list-none text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Configurar cadeia
              </summary>
              <div className="mt-4 flex flex-col gap-5">
                <div className="flex flex-col gap-3">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Forma
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {(["open_chain", "closed_ring"] as const).map((nextLayout) => (
                      <button
                        key={nextLayout}
                        type="button"
                        onClick={() => onSetLayout(nextLayout)}
                        disabled={nextLayout === "closed_ring" && !canUseClosedRing}
                        className={`flex items-center justify-center rounded-2xl border px-4 py-3 text-sm font-black transition ${
                          layout === nextLayout
                            ? "border-cyan-300/35 bg-cyan-400/12 text-cyan-100"
                            : "border-white/10 bg-slate-950/25 text-slate-300 hover:border-white/20"
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
                  <div className="flex items-center justify-between gap-3 rounded-[22px] border border-white/10 bg-slate-950/25 px-3 py-3">
                    <button
                      type="button"
                      onClick={() => handleCarbonStep("decrease")}
                      disabled={activeCarbonCount <= minimumCarbonCount}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-100 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
                      aria-label="Diminuir carbonos"
                    >
                      <MinusGlyph />
                    </button>
                    <div className="text-center">
                      <p className="text-2xl font-black text-white">{activeCarbonCount}</p>
                      <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                        {layout === "closed_ring" ? "anel ativo" : "cadeia ativa"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCarbonStep("increase")}
                      disabled={activeCarbonCount >= maximumCarbonCount}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-100 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
                      aria-label="Aumentar carbonos"
                    >
                      <PlusGlyph />
                    </button>
                  </div>
                  <span className="text-[11px] leading-5 text-slate-500">
                    {layout === "closed_ring"
                      ? `anel de ${minimumCarbonCount} a ${maximumCarbonCount} carbonos`
                      : `de ${minimumCarbonCount} a ${maximumCarbonCount} carbonos`}
                  </span>
                </div>
              </div>
            </details>

            <details className="rounded-[24px] border border-white/10 bg-white/5 px-4 py-4 backdrop-blur">
              <summary className="cursor-pointer list-none text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Revisar ligacoes
              </summary>
              <p className="mt-2 text-[11px] leading-5 text-slate-500">
                Apoio para teclado e leitura fina das ligacoes. `Enter` alterna e `↑`/`↓` navegam entre elas.
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
                            ? "border-cyan-300/40 bg-cyan-400/10 text-cyan-100"
                            : recentlyChangedBondIndex === index
                              ? "border-amber-300/35 bg-amber-400/10 text-amber-100"
                              : order === 2
                                ? "border-emerald-300/30 bg-emerald-500/10 text-emerald-100"
                                : "border-white/10 bg-slate-950/25 text-slate-300 hover:border-white/20"
                        } disabled:cursor-not-allowed disabled:opacity-60`}
                      >
                        <span className="font-semibold">
                          C{from} {order === 2 ? "=" : "-"} C{to}
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                          {canUseDoubleBond ? (order === 2 ? "Dupla" : "Simples") : "So simples"}
                        </span>
                      </button>
                    );
                  })
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-slate-950/25 px-4 py-3 text-sm text-slate-400">
                    Esta estrutura ainda nao apresenta ligacoes C-C que possam ser alteradas.
                  </div>
                )}
              </div>
            </details>
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

      </div>

      {builderError ? (
        <p className="mt-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {builderError}
        </p>
      ) : null}

      {builderResult ? (
        <article className="mt-6 rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(2,6,23,0.72),rgba(15,23,42,0.72))] p-5 text-sm text-slate-300">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-4">
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
