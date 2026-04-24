"use client";

import {
  formatCarbonGroup,
  getOpenChainBondSegments,
  getOpenChainGeometry,
  getRingBondSegments,
  getRingGeometry,
} from "@/lib/builder/graph-preview";
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
  onBondHover: (index: number | null) => void;
  onBondToggle: (index: number) => void;
  onSetLayout: (layout: BuilderLayout) => void;
  onCarbonStep: (direction: "decrease" | "increase") => void;
  onValidateBuilder: () => void;
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

function carbonHasDoubleBond(
  index: number,
  normalizedBondOrders: GraphBuilderBondOrder[],
  layout: BuilderLayout,
): boolean {
  if (layout === "open_chain") {
    return normalizedBondOrders[index] === 2 || normalizedBondOrders[index - 1] === 2;
  }

  const previousIndex =
    index === 0 ? normalizedBondOrders.length - 1 : index - 1;

  return normalizedBondOrders[index] === 2 || normalizedBondOrders[previousIndex] === 2;
}

function getCarbonToneClass(isUnsaturated: boolean): string {
  return isUnsaturated
    ? "border-fuchsia-300/45 bg-fuchsia-400/15 text-fuchsia-100 shadow-[0_0_28px_rgba(217,70,239,0.16)]"
    : "border-cyan-300/45 bg-cyan-400/15 text-cyan-100 shadow-[0_0_28px_rgba(34,211,238,0.14)]";
}

function getRingCarbonVisual(activeCarbonCount: number, isUnsaturated: boolean): {
  fill: string;
  stroke: string;
  glow: string;
  labelSize: number;
} {
  return {
    fill: isUnsaturated ? "rgba(217, 70, 239, 0.16)" : "rgba(34, 211, 238, 0.16)",
    stroke: isUnsaturated ? "rgba(240, 171, 252, 0.52)" : "rgba(103, 232, 249, 0.52)",
    glow: isUnsaturated ? "rgba(217, 70, 239, 0.2)" : "rgba(34, 211, 238, 0.18)",
    labelSize: activeCarbonCount <= 4 ? 13 : 14,
  };
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

function getRingStageClass(activeCarbonCount: number): string {
  if (activeCarbonCount === 3) {
    return "min-h-[300px] max-w-[320px] pb-16 pt-14 sm:min-h-[320px] sm:max-w-[340px] sm:pb-14 sm:pt-12";
  }

  if (activeCarbonCount === 4) {
    return "min-h-[308px] max-w-[336px] pb-16 pt-13 sm:min-h-[324px] sm:max-w-[350px] sm:pb-14 sm:pt-11";
  }

  if (activeCarbonCount === 5) {
    return "min-h-[316px] max-w-[348px] pb-16 pt-12 sm:min-h-[328px] sm:max-w-[356px] sm:pb-14 sm:pt-10";
  }

  return "min-h-[320px] max-w-[360px] pb-16 pt-12 sm:pb-14 sm:pt-10";
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
  onBondHover,
  onBondToggle,
  onSetLayout,
  onCarbonStep,
  onValidateBuilder,
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
            "url('/visual/synthesis-lab/mesa-de-sintese.png')",
          ].join(", "),
          backgroundSize: "cover, cover, cover",
          backgroundPosition: "center, center, center bottom",
          backgroundRepeat: "no-repeat, no-repeat, no-repeat",
        }}
      >
        <div className="absolute inset-x-2 top-2 z-20 flex flex-col items-stretch gap-2 sm:inset-x-3 sm:top-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col items-start gap-1.5">
            <div className="grid grid-cols-2 gap-1.5 sm:flex sm:items-center">
              <button
                type="button"
                onClick={() => onCarbonStep("decrease")}
                disabled={activeCarbonCount <= minimumCarbonCount}
                className="flex h-9 w-full items-center justify-center rounded-full border border-orange-300/20 bg-[radial-gradient(circle_at_30%_30%,rgba(251,191,36,0.32),transparent_45%),linear-gradient(180deg,rgba(249,115,22,0.18),rgba(127,29,29,0.32))] text-amber-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_18px_rgba(249,115,22,0.16)] transition hover:border-amber-300/35 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_0_24px_rgba(249,115,22,0.24)] disabled:cursor-not-allowed disabled:opacity-35 sm:h-9 sm:w-9"
                aria-label="Diminuir carbonos"
              >
                <FlameGlyph />
              </button>
              <button
                type="button"
                onClick={() => onCarbonStep("increase")}
                disabled={activeCarbonCount >= maximumCarbonCount}
                className="flex h-9 w-full items-center justify-center rounded-full border border-white/10 bg-slate-950/78 text-sm font-black text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition hover:bg-white/8 disabled:cursor-not-allowed disabled:opacity-35 sm:h-9 sm:w-9"
                aria-label="Aumentar carbonos"
              >
                C
              </button>
            </div>
            <div className="grid w-full grid-cols-2 gap-1.5 rounded-[14px] bg-transparent p-1.5 backdrop-blur sm:flex sm:w-auto sm:items-center">
              {(["open_chain", "closed_ring"] as const).map((nextLayout) => (
                <button
                  key={nextLayout}
                  type="button"
                  onClick={() => onSetLayout(nextLayout)}
                  disabled={nextLayout === "closed_ring" && !canUseClosedRing}
                  className={`flex h-9 w-full items-center justify-center rounded-full transition sm:h-9 sm:w-9 ${
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
            <span className="mr-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Estrutural
            </span>
            <span className="font-semibold text-white">{previewFormulaEstrutural}</span>
          </div>
          <div className="rounded-full border border-white/10 bg-slate-950/78 px-2.5 py-1.5 text-[10px] text-slate-200 backdrop-blur">
            <span className="mr-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Molecular
            </span>
            <span className="font-semibold text-white">{previewFormulaMolecular}</span>
          </div>
        </div>

        {layout === "closed_ring" ? (
          <div className={`relative mx-auto w-full ${getRingStageClass(activeCarbonCount)}`}>
            {(() => {
              const { stageWidth, stageHeight, carbonRadius, points } =
                getRingGeometry(activeCarbonCount);
              const segments = getRingBondSegments(
                points,
                carbonRadius,
                normalizedBondOrders,
              );

              return (
                <>
                  <svg
                    viewBox={`0 0 ${stageWidth} ${stageHeight}`}
                    className="absolute inset-0 h-full w-full"
                    aria-hidden="true"
                  >
                    {segments.map((segment) => {
                      const isHovered = hoveredBondIndex === segment.index;
                      const isRecentlyChanged =
                        recentlyChangedBondIndex === segment.index;
                      const stroke = isHovered
                        ? "rgba(103, 232, 249, 0.95)"
                        : isRecentlyChanged
                          ? "rgba(252, 211, 77, 0.95)"
                          : "rgba(253, 230, 138, 0.78)";
                      const strokeWidth = isHovered ? 2.8 : isRecentlyChanged ? 2.4 : 1.6;
                      const showGhostDouble =
                        canUseDoubleBond && isHovered && segment.order === 1 && segment.line2;

                      return (
                        <g key={`ring-bond-${segment.index}`}>
                          <line
                            x1={segment.line1.x1}
                            y1={segment.line1.y1}
                            x2={segment.line1.x2}
                            y2={segment.line1.y2}
                            stroke="transparent"
                            strokeWidth="16"
                            strokeLinecap="round"
                            className={canUseDoubleBond ? "cursor-pointer" : "cursor-not-allowed"}
                            onMouseEnter={() => onBondHover(segment.index)}
                            onMouseLeave={() => onBondHover(null)}
                            onClick={() => {
                              if (canUseDoubleBond) {
                                onBondToggle(segment.index);
                              }
                            }}
                          />
                          <line
                            x1={segment.line1.x1}
                            y1={segment.line1.y1}
                            x2={segment.line1.x2}
                            y2={segment.line1.y2}
                            stroke={stroke}
                            strokeWidth={strokeWidth}
                            strokeLinecap="round"
                            pointerEvents="none"
                            className={`origin-center transition-all duration-200 ${
                              isRecentlyChanged ? "animate-pulse" : ""
                            }`}
                          />
                          {showGhostDouble ? (
                            <line
                              x1={segment.line2!.x1}
                              y1={segment.line2!.y1}
                              x2={segment.line2!.x2}
                              y2={segment.line2!.y2}
                              stroke="rgba(103, 232, 249, 0.45)"
                              strokeWidth="1.4"
                              strokeLinecap="round"
                              strokeDasharray="4 3"
                              pointerEvents="none"
                            />
                          ) : null}
                          {segment.line2 ? (
                            <line
                              x1={segment.line2.x1}
                              y1={segment.line2.y1}
                              x2={segment.line2.x2}
                              y2={segment.line2.y2}
                              stroke={stroke}
                              strokeWidth={strokeWidth}
                              strokeLinecap="round"
                              pointerEvents="none"
                              className={`origin-center transition-all duration-200 ${
                                isRecentlyChanged ? "animate-pulse" : ""
                              }`}
                            />
                          ) : null}
                        </g>
                      );
                    })}
                    <defs>
                      {Array.from({ length: activeCarbonCount }, (_, index) => {
                        const isUnsaturated = carbonHasDoubleBond(
                          index,
                          normalizedBondOrders,
                          layout,
                        );
                        const visual = getRingCarbonVisual(
                          activeCarbonCount,
                          isUnsaturated,
                        );

                        return (
                          <filter
                            key={`ring-carbon-glow-${index}`}
                            id={`ring-carbon-glow-${index}`}
                            x="-120%"
                            y="-120%"
                            width="340%"
                            height="340%"
                          >
                            <feDropShadow
                              dx="0"
                              dy="0"
                              stdDeviation="10"
                              floodColor={visual.glow}
                            />
                          </filter>
                        );
                      })}
                    </defs>

                    {Array.from({ length: activeCarbonCount }, (_, index) => {
                      const point = points[index];
                      const hydrogenCount = previewHydrogensByCarbon[index] ?? 0;
                      const isUnsaturated = carbonHasDoubleBond(
                        index,
                        normalizedBondOrders,
                        layout,
                      );
                      const visual = getRingCarbonVisual(
                        activeCarbonCount,
                        isUnsaturated,
                      );

                      return (
                        <g key={`ring-carbon-${index}`}>
                          <title>{`Carbono ${index + 1}: ${formatCarbonGroup(hydrogenCount)}`}</title>
                          <circle
                            cx={point.x}
                            cy={point.y}
                            r={carbonRadius}
                            fill={visual.fill}
                            stroke={visual.stroke}
                            strokeWidth="1.35"
                            filter={`url(#ring-carbon-glow-${index})`}
                          />
                          <text
                            x={point.x}
                            y={point.y + 1}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill={isUnsaturated ? "rgb(250 232 255)" : "rgb(224 247 255)"}
                            fontSize={visual.labelSize}
                            fontWeight="800"
                            letterSpacing="0.01em"
                            style={{ userSelect: "none" }}
                          >
                            {formatCarbonGroup(hydrogenCount)}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </>
              );
            })()}
          </div>
        ) : (
          <div className="mt-5 overflow-x-auto pb-12 pt-6 sm:pb-14 sm:pt-6">
            {(() => {
              const { stageWidth, stageHeight, carbonRadius, points } =
                getOpenChainGeometry(activeCarbonCount, normalizedBondOrders);
              const segments = getOpenChainBondSegments(
                points,
                carbonRadius,
                normalizedBondOrders,
              );

              return (
                <div className="mx-auto min-w-max px-2">
                  <svg
                    viewBox={`0 0 ${stageWidth} ${stageHeight}`}
                    className="h-[220px] w-auto min-w-full"
                    aria-hidden="true"
                  >
                    {segments.map((segment) => {
                      const isHovered = hoveredBondIndex === segment.index;
                      const isRecentlyChanged =
                        recentlyChangedBondIndex === segment.index;
                      const stroke = isHovered
                        ? "rgba(103, 232, 249, 0.95)"
                        : isRecentlyChanged
                          ? "rgba(252, 211, 77, 0.95)"
                          : segment.order === 2
                            ? "rgba(240, 171, 252, 0.8)"
                            : "rgba(125, 211, 252, 0.72)";
                      const strokeWidth = isHovered ? 2.8 : isRecentlyChanged ? 2.4 : 1.6;
                      const showGhostDouble =
                        canUseDoubleBond && isHovered && segment.order === 1;

                      return (
                        <g key={`open-bond-${segment.index}`}>
                          <line
                            x1={segment.line1.x1}
                            y1={segment.line1.y1}
                            x2={segment.line1.x2}
                            y2={segment.line1.y2}
                            stroke="transparent"
                            strokeWidth="18"
                            strokeLinecap="round"
                            className={canUseDoubleBond ? "cursor-pointer" : "cursor-not-allowed"}
                            onMouseEnter={() => onBondHover(segment.index)}
                            onMouseLeave={() => onBondHover(null)}
                            onClick={() => {
                              if (canUseDoubleBond) {
                                onBondToggle(segment.index);
                              }
                            }}
                          />
                          <line
                            x1={segment.line1.x1}
                            y1={segment.line1.y1}
                            x2={segment.line1.x2}
                            y2={segment.line1.y2}
                            stroke={stroke}
                            strokeWidth={strokeWidth}
                            strokeLinecap="round"
                            pointerEvents="none"
                            className={`origin-center transition-all duration-200 ${
                              isRecentlyChanged ? "animate-pulse" : ""
                            }`}
                          />
                          {showGhostDouble && segment.line2 ? (
                            <line
                              x1={segment.line2.x1}
                              y1={segment.line2.y1}
                              x2={segment.line2.x2}
                              y2={segment.line2.y2}
                              stroke="rgba(103, 232, 249, 0.45)"
                              strokeWidth="1.4"
                              strokeLinecap="round"
                              strokeDasharray="4 3"
                              pointerEvents="none"
                            />
                          ) : null}
                          {segment.line2 ? (
                            <line
                              x1={segment.line2.x1}
                              y1={segment.line2.y1}
                              x2={segment.line2.x2}
                              y2={segment.line2.y2}
                              stroke={stroke}
                              strokeWidth={strokeWidth}
                              strokeLinecap="round"
                              pointerEvents="none"
                              className={`origin-center transition-all duration-200 ${
                                isRecentlyChanged ? "animate-pulse" : ""
                              }`}
                            />
                          ) : null}
                        </g>
                      );
                    })}

                    {points.map((point, index) => {
                      const hydrogenCount = previewHydrogensByCarbon[index] ?? 0;
                      const isUnsaturated = carbonHasDoubleBond(
                        index,
                        normalizedBondOrders,
                        layout,
                      );
                      const toneClass = getCarbonToneClass(isUnsaturated);

                      return (
                        <g key={`open-carbon-${index}`}>
                          <title>{`Carbono ${index + 1}: ${formatCarbonGroup(hydrogenCount)}`}</title>
                          <foreignObject
                            x={point.x - carbonRadius}
                            y={point.y - carbonRadius}
                            width={carbonRadius * 2}
                            height={carbonRadius * 2}
                          >
                            <div className="flex h-full w-full items-center justify-center">
                              <div
                                className={`flex h-12 min-w-12 items-center justify-center rounded-full border px-2.5 text-xs font-black transition-all duration-200 sm:h-14 sm:min-w-14 sm:px-3 sm:text-sm ${toneClass}`}
                              >
                                {formatCarbonGroup(hydrogenCount)}
                              </div>
                            </div>
                          </foreignObject>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              );
            })()}
          </div>
        )}

      </div>

      <div className="flex justify-center pt-4">
        <button
          type="button"
          onClick={onValidateBuilder}
          disabled={isValidatingBuilder}
          className="rounded-full bg-[linear-gradient(180deg,rgba(250,204,21,0.96),rgba(245,158,11,0.92))] px-6 py-3 text-sm font-black uppercase tracking-[0.16em] text-slate-950 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isValidatingBuilder ? "Consultando a mesa..." : "Consultar a mesa"}
        </button>
      </div>
    </div>
  );
}
