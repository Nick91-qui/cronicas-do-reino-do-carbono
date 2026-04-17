"use client";

import {
  formatCarbonGroup,
  getRingBondSegments,
  getRingGeometry,
} from "@/lib/builder/graph-preview";
import type { BuilderLayout, GraphBuilderBondOrder } from "@/lib/builder/types";
import type { BondType } from "@/lib/content/types";

type AtomForgeVisualProps = {
  layout: BuilderLayout;
  activeCarbonCount: number;
  normalizedBondOrders: GraphBuilderBondOrder[];
  previewBondType: BondType;
  previewHydrogensByCarbon: number[];
  previewFormulaEstrutural: string;
  previewFormulaMolecular: string;
  hoveredBondIndex: number | null;
  recentlyChangedBondIndex: number | null;
  canUseDoubleBond: boolean;
  onBondHover: (index: number | null) => void;
  onBondToggle: (index: number) => void;
};

const layoutLabels: Record<BuilderLayout, string> = {
  open_chain: "Cadeia aberta",
  closed_ring: "Cadeia fechada",
};

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

export function AtomForgeVisual({
  layout,
  activeCarbonCount,
  normalizedBondOrders,
  previewBondType,
  previewHydrogensByCarbon,
  previewFormulaEstrutural,
  previewFormulaMolecular,
  hoveredBondIndex,
  recentlyChangedBondIndex,
  canUseDoubleBond,
  onBondHover,
  onBondToggle,
}: AtomForgeVisualProps) {
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
    <div className="rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),transparent_44%),linear-gradient(180deg,rgba(2,6,23,0.65),rgba(15,23,42,0.95))] p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
        Mesa de forja
      </p>
      <div className="mt-4 overflow-hidden rounded-[22px] border border-cyan-300/10 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.1),transparent_40%),linear-gradient(180deg,rgba(15,23,42,0.9),rgba(2,6,23,0.92))] p-4 sm:p-5">
        <div className="rounded-[20px] border border-white/8 bg-slate-950/35 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.16em] text-slate-500">
            <span>Estrutura prevista</span>
            <span>{previewBondType}</span>
          </div>
          {activeBondLabel ? (
            <div className="mt-3 inline-flex items-center rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-cyan-100">
              Ligacao ativa: {activeBondLabel}
            </div>
          ) : null}

          {layout === "closed_ring" ? (
            <div className="relative mx-auto mt-6 h-[280px] w-full max-w-[340px]">
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
                    </svg>

                    {Array.from({ length: activeCarbonCount }, (_, index) => {
                      const point = points[index];
                      const outwardX = Math.cos(point.angle);
                      const outwardY = Math.sin(point.angle);
                      const tangentX = -Math.sin(point.angle);
                      const tangentY = Math.cos(point.angle);
                      const hydrogenCount = previewHydrogensByCarbon[index] ?? 0;
                      const hydrogenDistance = carbonRadius + 22;
                      const hydrogenSpread = hydrogenCount > 1 ? 12 : 0;

                      return (
                        <div
                          key={`ring-carbon-${index}`}
                          className="absolute -translate-x-1/2 -translate-y-1/2"
                          style={{ top: point.y, left: point.x }}
                        >
                          <div className="relative flex flex-col items-center gap-2">
                            {Array.from(
                              { length: hydrogenCount },
                              (_, hydrogenIndex) => {
                                const lateralOffset =
                                  hydrogenCount === 1
                                    ? 0
                                    : hydrogenIndex === 0
                                      ? -hydrogenSpread
                                      : hydrogenSpread;
                                const hydrogenX =
                                  outwardX * hydrogenDistance
                                  + tangentX * lateralOffset;
                                const hydrogenY =
                                  outwardY * hydrogenDistance
                                  + tangentY * lateralOffset;

                                return (
                                  <div
                                    key={`ring-h-${index}-${hydrogenIndex}`}
                                    className="absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-cyan-300/35 bg-cyan-400/20 text-[10px] font-black text-cyan-100"
                                    style={{
                                      left: `calc(50% + ${hydrogenX}px)`,
                                      top: `calc(50% + ${hydrogenY}px)`,
                                    }}
                                  >
                                    H
                                  </div>
                                );
                              },
                            )}
                            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-amber-300/45 bg-amber-400/15 text-sm font-black text-amber-100 shadow-[0_0_28px_rgba(251,191,36,0.14)]">
                              C
                            </div>
                            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                              {formatCarbonGroup(hydrogenCount)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </>
                );
              })()}
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto pb-2">
              <div className="mx-auto flex min-w-max items-center justify-center gap-1 px-2 sm:gap-2">
                {Array.from({ length: activeCarbonCount }, (_, index) => (
                  <div key={`atom-${index}`} className="flex items-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex min-h-6 items-center justify-center gap-1">
                        {Array.from(
                          {
                            length: Math.min(
                              previewHydrogensByCarbon[index] ?? 0,
                              2,
                            ),
                          },
                          (_, hydrogenIndex) => (
                            <div
                              key={`top-h-${index}-${hydrogenIndex}`}
                              className="flex h-6 w-6 items-center justify-center rounded-full border border-cyan-300/35 bg-cyan-400/20 text-[10px] font-black text-cyan-100"
                            >
                              H
                            </div>
                          ),
                        )}
                      </div>
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-full border text-sm font-black shadow-[0_0_28px_rgba(34,211,238,0.14)] ${
                          normalizedBondOrders[index] === 2
                          || normalizedBondOrders[index - 1] === 2
                            ? "border-fuchsia-300/40 bg-fuchsia-400/15 text-fuchsia-100"
                            : "border-cyan-300/45 bg-cyan-400/15 text-cyan-100"
                        }`}
                      >
                        C
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                        {formatCarbonGroup(previewHydrogensByCarbon[index] ?? 0)}
                      </span>
                      <div className="flex min-h-6 items-center justify-center gap-1">
                        {Array.from(
                          {
                            length: Math.max(
                              0,
                              (previewHydrogensByCarbon[index] ?? 0) - 2,
                            ),
                          },
                          (_, hydrogenIndex) => (
                            <div
                              key={`bottom-h-${index}-${hydrogenIndex}`}
                              className="flex h-6 w-6 items-center justify-center rounded-full border border-cyan-300/35 bg-cyan-400/20 text-[10px] font-black text-cyan-100"
                            >
                              H
                            </div>
                          ),
                        )}
                      </div>
                    </div>

                    {index < activeCarbonCount - 1 ? (
                      <div className="mx-1 flex w-10 shrink-0 justify-center sm:w-14">
                        {normalizedBondOrders[index] === 2 ? (
                          <button
                            type="button"
                            disabled={!canUseDoubleBond}
                            onMouseEnter={() => onBondHover(index)}
                            onMouseLeave={() => onBondHover(null)}
                            onFocus={() => onBondHover(index)}
                            onBlur={() => onBondHover(null)}
                            onClick={() => onBondToggle(index)}
                            className="flex flex-col gap-1 rounded-md p-1 disabled:cursor-not-allowed"
                            aria-label={`Alternar ligacao entre C${index + 1} e C${index + 2}`}
                          >
                            <div
                              className={`h-px w-8 transition-all duration-200 sm:w-12 ${
                                hoveredBondIndex === index
                                  ? "bg-cyan-200"
                                  : recentlyChangedBondIndex === index
                                    ? "bg-amber-200"
                                    : "bg-fuchsia-200/70"
                              } ${recentlyChangedBondIndex === index ? "scale-x-110" : ""}`}
                            />
                            <div
                              className={`h-px w-8 transition-all duration-200 sm:w-12 ${
                                hoveredBondIndex === index
                                  ? "bg-cyan-200"
                                  : recentlyChangedBondIndex === index
                                    ? "bg-amber-200"
                                    : "bg-fuchsia-200/70"
                              } ${recentlyChangedBondIndex === index ? "scale-x-110" : ""}`}
                            />
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={!canUseDoubleBond}
                            onMouseEnter={() => onBondHover(index)}
                            onMouseLeave={() => onBondHover(null)}
                            onFocus={() => onBondHover(index)}
                            onBlur={() => onBondHover(null)}
                            onClick={() => onBondToggle(index)}
                            className="rounded-md p-1 disabled:cursor-not-allowed"
                            aria-label={`Alternar ligacao entre C${index + 1} e C${index + 2}`}
                          >
                            <div
                              className={`h-px w-8 transition-all duration-200 sm:w-12 ${
                                hoveredBondIndex === index
                                  ? "bg-cyan-200"
                                  : recentlyChangedBondIndex === index
                                    ? "bg-amber-200"
                                    : "bg-cyan-200/65"
                              } ${recentlyChangedBondIndex === index ? "scale-x-110" : ""}`}
                            />
                          </button>
                        )}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/8 bg-white/5 p-3">
              <p className="text-slate-500">Topologia</p>
              <p className="mt-1 text-lg font-semibold text-white">
                {layoutLabels[layout]}
              </p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/5 p-3">
              <p className="text-slate-500">Carbonos ativos</p>
              <p className="mt-1 text-lg font-semibold text-white">
                {activeCarbonCount}
              </p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/5 p-3">
              <p className="text-slate-500">Assinatura</p>
              <p className="mt-1 text-lg font-semibold text-white">
                {previewBondType}
              </p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/5 p-3">
              <p className="text-slate-500">Leitura</p>
              <p className="mt-1 text-lg font-semibold text-white">
                {previewBondType === "aromatic"
                  ? "anel aromatico"
                  : previewBondType === "double"
                    ? "cadeia insaturada"
                    : layout === "closed_ring"
                      ? "anel saturado"
                      : "cadeia saturada"}
              </p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/5 p-3 sm:col-span-2">
              <p className="text-slate-500">Formula estrutural</p>
              <p className="mt-1 text-lg font-semibold text-white">
                {previewFormulaEstrutural}
              </p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/5 p-3 sm:col-span-2">
              <p className="text-slate-500">Formula molecular</p>
              <p className="mt-1 text-lg font-semibold text-white">
                {previewFormulaMolecular}
              </p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/5 p-3 sm:col-span-2">
              <p className="text-slate-500">Hidrogenios por carbono</p>
              <p className="mt-1 text-lg font-semibold text-white">
                {previewHydrogensByCarbon
                  .map((count, index) => `C${index + 1}: H${count}`)
                  .join(" · ")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
