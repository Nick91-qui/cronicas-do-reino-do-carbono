"use client";

import { blobAssets } from "@/lib/assets/blob";
import { SynthesisLabSvg } from "@/components/phase/synthesis-lab-svg";
import type { BuilderLayout, GraphBuilderBondOrder } from "@/lib/builder/types";

type SynthesisLabVisualProps = {
  layout: BuilderLayout;
  activeCarbonCount: number;
  minimumCarbonCount: number;
  maximumCarbonCount: number;
  normalizedBondOrders: GraphBuilderBondOrder[];
  previewHydrogensByCarbon: number[];
  previewFormulaEstrutural: string;
  previewFormulaMolecular: string;
  hoveredBondIndex: number | null;
  recentlyChangedBondIndex: number | null;
  canUseDoubleBond: boolean;
  canUseClosedRing: boolean;
  isValidatingBuilder: boolean;
  onBondHoverAction: (index: number | null) => void;
  onBondToggleAction: (index: number) => void;
  onSetLayoutAction: (layout: BuilderLayout) => void;
  onCarbonStepAction: (direction: "decrease" | "increase") => void;
  onValidateBuilderAction: () => void;
};

function LayoutGlyph({ layout }: { layout: BuilderLayout }) {
  if (layout === "open_chain") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 44 20"
        className="h-3.5 w-8"
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
      className="h-3.5 w-3.5"
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
      className="h-3.5 w-3.5"
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

function getBondLabel(
  layout: BuilderLayout,
  index: number,
  order: GraphBuilderBondOrder,
  activeCarbonCount: number,
): string {
  const from = index + 1;
  const to =
    layout === "closed_ring" && index === activeCarbonCount - 1
      ? 1
      : index + 2;

  return `C${from} ${order === 2 ? "=" : "-"} C${to}`;
}

export function SynthesisLabVisual({
  layout,
  activeCarbonCount,
  minimumCarbonCount,
  maximumCarbonCount,
  normalizedBondOrders,
  previewHydrogensByCarbon,
  previewFormulaEstrutural,
  previewFormulaMolecular,
  hoveredBondIndex,
  recentlyChangedBondIndex,
  canUseDoubleBond,
  canUseClosedRing,
  isValidatingBuilder,
  onBondHoverAction,
  onBondToggleAction,
  onSetLayoutAction,
  onCarbonStepAction,
  onValidateBuilderAction,
}: SynthesisLabVisualProps) {
  const activeBondIndex = hoveredBondIndex ?? recentlyChangedBondIndex;
  const activeBondLabel =
    activeBondIndex !== null
      ? getBondLabel(
          layout,
          activeBondIndex,
          normalizedBondOrders[activeBondIndex] ?? 1,
          activeCarbonCount,
        )
      : null;

  return (
    <div className="rounded-[24px] border border-cyan-300/14 bg-[linear-gradient(180deg,rgba(9,15,30,0.98),rgba(15,23,42,1))] p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:rounded-[28px] sm:p-4">
      <div
        className="relative overflow-hidden rounded-[20px] border border-cyan-300/10 px-2 pb-3 pt-24 sm:rounded-[24px] sm:px-3 sm:pb-4 sm:pt-4"
        style={{
          backgroundImage: [
            "linear-gradient(180deg, rgba(14,23,42,0.9), rgba(8,13,26,0.96))",
            "radial-gradient(circle at center, rgba(34,211,238,0.08), transparent 42%)",
            `url('${blobAssets.synthesisWorkbench}')`,
          ].join(", "),
          backgroundSize: "cover, cover, cover",
          backgroundPosition: "center, center, center bottom",
          backgroundRepeat: "no-repeat, no-repeat, no-repeat",
        }}
      >
        <div className="absolute inset-x-2 top-2 z-20 flex flex-col items-stretch gap-2 sm:inset-x-3 sm:top-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col items-start gap-1.5">
            <div className="grid w-fit grid-cols-2 gap-1.5 sm:flex sm:items-center">
              <button
                type="button"
                onClick={() => onCarbonStepAction("decrease")}
                disabled={activeCarbonCount <= minimumCarbonCount}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-orange-300/20 bg-[radial-gradient(circle_at_30%_30%,rgba(251,191,36,0.32),transparent_45%),linear-gradient(180deg,rgba(249,115,22,0.18),rgba(127,29,29,0.32))] text-amber-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_18px_rgba(249,115,22,0.16)] transition hover:border-amber-300/35 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_0_24px_rgba(249,115,22,0.24)] disabled:cursor-not-allowed disabled:opacity-35 sm:h-9 sm:w-9"
                aria-label="Diminuir carbonos"
              >
                <FlameGlyph />
              </button>
              <button
                type="button"
                onClick={() => onCarbonStepAction("increase")}
                disabled={activeCarbonCount >= maximumCarbonCount}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-slate-950/78 text-sm font-black text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition hover:bg-white/8 disabled:cursor-not-allowed disabled:opacity-35 sm:h-9 sm:w-9"
                aria-label="Aumentar carbonos"
              >
                C
              </button>
            </div>
            <div className="grid w-fit grid-cols-2 gap-1.5 rounded-[14px] bg-transparent p-1.5 backdrop-blur sm:flex sm:w-auto sm:items-center">
              {(["open_chain", "closed_ring"] as const).map((nextLayout) => (
                <button
                  key={nextLayout}
                  type="button"
                  onClick={() => onSetLayoutAction(nextLayout)}
                  disabled={nextLayout === "closed_ring" && !canUseClosedRing}
                  className={`flex h-11 w-11 items-center justify-center rounded-full transition sm:h-9 sm:w-9 ${
                    layout === nextLayout
                      ? "bg-[radial-gradient(circle_at_30%_30%,rgba(34,211,238,0.3),transparent_45%),linear-gradient(180deg,rgba(34,211,238,0.18),rgba(8,47,73,0.34))] text-cyan-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_18px_rgba(34,211,238,0.18)]"
                      : "bg-slate-950/78 text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:bg-white/8"
                  } disabled:cursor-not-allowed disabled:opacity-30`}
                  aria-label={nextLayout === "open_chain" ? "Cadeia aberta" : "Cadeia fechada"}
                >
                  <LayoutGlyph layout={nextLayout} />
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5 sm:flex sm:items-center">
            <div className="rounded-full border border-white/10 bg-slate-950/78 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-slate-300">
              {layout === "closed_ring" ? "Anel ativo" : "Cadeia ativa"}
            </div>
            <div className="rounded-full border border-white/10 bg-slate-950/78 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-slate-300">
              {activeCarbonCount} C
            </div>
          </div>
        </div>

        {activeBondLabel ? (
          <div className="pointer-events-none absolute right-2 top-2 z-10 sm:right-3 sm:top-16">
            <div className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-cyan-100 backdrop-blur">
              {activeBondLabel}
            </div>
          </div>
        ) : null}

        <div className="pointer-events-none absolute inset-x-2 bottom-2 z-10 flex flex-wrap gap-2 sm:inset-x-3 sm:bottom-3">
          <div className="rounded-full border border-white/10 bg-slate-950/78 px-2.5 py-1.5 text-[10px] text-slate-200 backdrop-blur">
            <span className="mr-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-300">
              Estrutural
            </span>
            <span className="font-semibold text-white">{previewFormulaEstrutural}</span>
          </div>
          <div className="rounded-full border border-white/10 bg-slate-950/78 px-2.5 py-1.5 text-[10px] text-slate-200 backdrop-blur">
            <span className="mr-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-300">
              Molecular
            </span>
            <span className="font-semibold text-white">{previewFormulaMolecular}</span>
          </div>
        </div>

        <SynthesisLabSvg
          layout={layout}
          activeCarbonCount={activeCarbonCount}
          normalizedBondOrders={normalizedBondOrders}
          hoveredBondIndex={hoveredBondIndex}
          recentlyChangedBondIndex={recentlyChangedBondIndex}
          canUseDoubleBond={canUseDoubleBond}
          onBondHoverAction={onBondHoverAction}
          onBondToggleAction={onBondToggleAction}
        />

      </div>

      <div className="flex justify-center pt-4">
        <button
          type="button"
          onClick={onValidateBuilderAction}
          disabled={isValidatingBuilder}
          className="rounded-full bg-[linear-gradient(180deg,rgba(250,204,21,0.96),rgba(245,158,11,0.92))] px-6 py-3 text-sm font-black uppercase tracking-[0.16em] text-slate-950 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isValidatingBuilder ? "Realizando sintese..." : "Realizar sintese"}
        </button>
      </div>
    </div>
  );
}
