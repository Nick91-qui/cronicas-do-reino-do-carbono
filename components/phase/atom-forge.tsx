"use client";

import type { KeyboardEvent } from "react";
import { useEffect, useState } from "react";

import { AtomForgeVisual } from "@/components/phase/atom-forge-visual";
import type {
  BuilderLayout,
  BuilderValidationResult,
  GraphBuilderBondOrder,
} from "@/lib/builder/types";
import type { BondType } from "@/lib/content/types";

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

const layoutLabels: Record<BuilderLayout, string> = {
  open_chain: "Cadeia aberta",
  closed_ring: "Cadeia fechada",
};

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
  onSetLayout,
  onSetCarbonCount,
  onUpdateBondOrder,
  onValidateBuilder,
}: AtomForgeProps) {
  const [hoveredBondIndex, setHoveredBondIndex] = useState<number | null>(null);
  const [recentlyChangedBondIndex, setRecentlyChangedBondIndex] = useState<number | null>(null);

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
            Escolha a topologia da cadeia, defina onde entram as duplas ligacoes e acompanhe os hidrogenios implicitos em cada carbono.
          </p>
        </div>
        <button
          type="button"
          onClick={onValidateBuilder}
          disabled={isValidatingBuilder}
          className="rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isValidatingBuilder ? "Validando..." : "Validar estrutura"}
        </button>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[0.95fr,1.05fr]">
        <div className="grid gap-4">
          <div className="rounded-[24px] border border-white/10 bg-slate-950/45 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Banco de reagentes
            </p>
            <div className="mt-4 grid gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Topologia
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(["open_chain", "closed_ring"] as const).map((nextLayout) => (
                    <button
                      key={nextLayout}
                      type="button"
                      onClick={() => onSetLayout(nextLayout)}
                      disabled={nextLayout === "closed_ring" && !canUseClosedRing}
                      className={`rounded-xl border px-4 py-3 text-sm font-black transition ${
                        layout === nextLayout
                          ? "border-cyan-300/50 bg-cyan-400/15 text-cyan-100"
                          : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20"
                      } disabled:cursor-not-allowed disabled:opacity-30`}
                    >
                      {layoutLabels[nextLayout]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Carbonos
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {Array.from({ length: maximumCarbonCount }, (_, index) =>
                    String(index + 1),
                  ).map((value) => {
                    const isDisabled =
                      layout === "closed_ring" && Number(value) < 3;

                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => onSetCarbonCount(value)}
                        disabled={isDisabled}
                        className={`flex h-10 w-10 items-center justify-center rounded-xl border text-sm font-black transition ${
                          activeCarbonCount === Number(value)
                            ? "border-cyan-300/50 bg-cyan-400/15 text-cyan-100"
                            : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20"
                        } disabled:cursor-not-allowed disabled:opacity-30`}
                      >
                        {value}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Ligacoes C-C
                </p>
                <div className="mt-2 grid gap-2">
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
                          className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition ${
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
                              <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/90">
                                {hoveredBondIndex === index ? "Ativa" : "Alterada"}
                              </span>
                            ) : null}
                            <span className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
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
                      Esta estrutura ainda nao possui ligacoes C-C editaveis.
                    </div>
                  )}
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Clique em cada ligacao para alternar entre simples e dupla.
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-600">
                  Teclado: use `Tab` para focar, `Enter` ou `Espaco` para alternar, e setas para navegar entre ligacoes.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-slate-950/45 p-4">
            <label className="block text-sm">
              <span className="mb-2 block text-slate-200">
                Quantidade de carbonos
              </span>
              <input
                type="number"
                min={minimumCarbonCount}
                max={maximumCarbonCount}
                value={carbonCount}
                onChange={(event) => onSetCarbonCount(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-300/60"
              />
            </label>
            <p className="mt-3 text-xs leading-5 text-slate-500">
              Fragmentos liberados:{" "}
              {availableBondTypes
                .map((availableBondType) => bondTypeLabels[availableBondType])
                .join(" · ")}
            </p>
            {layout === "closed_ring" ? (
              <p className="mt-2 text-xs leading-5 text-slate-500">
                A cadeia fechada aceita de 3 a 9 carbonos. No MVP atual, o conteudo oficial reconhece o anel de 6 carbonos.
              </p>
            ) : null}
          </div>
        </div>

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
      </div>

      {builderError ? (
        <p className="mt-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {builderError}
        </p>
      ) : null}

      {builderResult ? (
        <article className="mt-6 rounded-[24px] border border-white/10 bg-slate-950/40 p-5 text-sm text-slate-300">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Validacao estrutural
              </p>
              <p className="mt-2 text-base font-semibold text-slate-100">
                {builderResult.canCreateMolecule
                  ? "Estrutura valida e reconhecida pelo MVP."
                  : "A estrutura ainda nao gerou uma molecula oficial valida."}
              </p>
              {builderResult.derivedStructure ? (
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {builderResult.derivedStructure.formulaEstrutural} ·{" "}
                  {builderResult.derivedStructure.formulaMolecular}
                </p>
              ) : null}
            </div>
            <div className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] ${
              builderResult.canCreateMolecule
                ? "border border-emerald-400/30 bg-emerald-500/10 text-emerald-100"
                : "border border-amber-400/30 bg-amber-500/10 text-amber-100"
            }`}>
              {builderResult.canCreateMolecule ? "Forja estavel" : "Estrutura inconclusiva"}
            </div>
          </div>
        </article>
      ) : null}
    </section>
  );
}
