"use client";

import { createBranchedRenderModel } from "@/lib/builder/layout/branched-render-model";
import { convertGraphBuilderStateToBranched } from "@/lib/builder/compatibility/graph-to-branched";
import { buildGraphBuilderState } from "@/lib/builder/graph-preview";
import type { BuilderLayout, GraphBuilderBondOrder } from "@/lib/builder/types";
import type { BranchedAtomId, BranchedBuilderState, BranchedBondId } from "@/lib/builder/state/branched-types";

type SynthesisLabSvgProps = {
  builderState: BranchedBuilderState;
  layoutMode?: BuilderLayout;
  hoveredBondId: BranchedBondId | null;
  recentlyChangedBondId: BranchedBondId | null;
  canUseDoubleBond: boolean;
  selectedAtomId?: BranchedAtomId | null;
  onAtomSelectAction?: (atomId: BranchedAtomId) => void;
  onBondHoverAction: (bondId: BranchedBondId | null) => void;
  onBondToggleAction: (bondId: BranchedBondId) => void;
};

type Point = {
  x: number;
  y: number;
};

function getBondColor(options: {
  kind: "carbon" | "hydrogen";
  order: 1 | 2 | 3;
  isHovered: boolean;
  isRecentlyChanged: boolean;
}): string {
  if (options.kind === "hydrogen") {
    return "rgba(226, 232, 240, 0.74)";
  }

  if (options.isHovered) {
    return "rgba(103, 232, 249, 0.96)";
  }

  if (options.isRecentlyChanged) {
    return "rgba(252, 211, 77, 0.98)";
  }

  if (options.order === 3) {
    return "rgba(251, 191, 36, 0.88)";
  }

  if (options.order === 2) {
    return "rgba(240, 171, 252, 0.84)";
  }

  return "rgba(125, 211, 252, 0.76)";
}

function getCarbonStyle(isUnsaturated: boolean) {
  return isUnsaturated
    ? {
        fill: "rgba(217, 70, 239, 0.16)",
        stroke: "rgba(240, 171, 252, 0.52)",
        text: "rgb(250 232 255)",
        glow: "rgba(217, 70, 239, 0.22)",
      }
    : {
        fill: "rgba(34, 211, 238, 0.16)",
        stroke: "rgba(103, 232, 249, 0.52)",
        text: "rgb(224 247 255)",
        glow: "rgba(34, 211, 238, 0.2)",
      };
}

function getBounds(points: Point[]) {
  const minX = Math.min(...points.map((point) => point.x));
  const maxX = Math.max(...points.map((point) => point.x));
  const minY = Math.min(...points.map((point) => point.y));
  const maxY = Math.max(...points.map((point) => point.y));

  return { minX, maxX, minY, maxY };
}

function offsetLine(from: Point, to: Point, offset: number) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy) || 1;
  const normalX = -dy / length;
  const normalY = dx / length;

  return {
    from: {
      x: from.x + normalX * offset,
      y: from.y + normalY * offset,
    },
    to: {
      x: to.x + normalX * offset,
      y: to.y + normalY * offset,
    },
  };
}

function getParallelOffsets(order: 1 | 2 | 3) {
  if (order === 3) {
    return [-6, 0, 6];
  }

  if (order === 2) {
    return [-4.5, 4.5];
  }

  return [0];
}

function carbonHasUnsaturatedBond(
  atomId: string,
  bonds: ReturnType<typeof createBranchedRenderModel>["bonds"],
) {
  return bonds.some(
    (bond) =>
      bond.kind === "carbon" &&
      bond.order > 1 &&
      (bond.from === atomId || bond.to === atomId),
  );
}

export function SynthesisLabSvg({
  builderState,
  layoutMode = "open_chain",
  hoveredBondId,
  recentlyChangedBondId,
  canUseDoubleBond,
  selectedAtomId,
  onAtomSelectAction,
  onBondHoverAction,
  onBondToggleAction,
}: SynthesisLabSvgProps) {
  const renderModel = createBranchedRenderModel(builderState);
  const atomMap = Object.fromEntries(renderModel.atoms.map((atom) => [atom.id, atom]));
  const bounds = getBounds(renderModel.atoms.map((atom) => ({ x: atom.x, y: atom.y })));
  const padding = 56;
  const width = bounds.maxX - bounds.minX + padding * 2;
  const height = bounds.maxY - bounds.minY + padding * 2;
  const viewBox = `${bounds.minX - padding} ${bounds.minY - padding} ${width} ${height}`;
  const svgClassName =
    layoutMode === "closed_ring"
      ? "h-[260px] w-full max-w-[380px] sm:h-[290px]"
      : "h-[240px] w-auto min-w-full sm:h-[260px]";

  return (
    <div className={layoutMode === "closed_ring" ? "mx-auto flex justify-center py-6" : "mt-4 overflow-x-auto pb-12 pt-6 sm:pb-14"}>
      <div className={layoutMode === "closed_ring" ? "w-full" : "mx-auto min-w-max px-2"}>
        <svg viewBox={viewBox} className={svgClassName} aria-hidden="true">
          <defs>
            {renderModel.atoms
              .filter((atom) => atom.label === "C")
              .map((atom) => {
                const style = getCarbonStyle(
                  carbonHasUnsaturatedBond(atom.id, renderModel.bonds),
                );

                return (
                  <filter
                    key={`carbon-glow-${atom.id}`}
                    id={`carbon-glow-${atom.id}`}
                    x="-120%"
                    y="-120%"
                    width="340%"
                    height="340%"
                  >
                    <feDropShadow
                      dx="0"
                      dy="0"
                      stdDeviation="10"
                      floodColor={style.glow}
                    />
                  </filter>
                );
              })}
          </defs>

          {renderModel.bonds.map((bond) => {
            const from = atomMap[bond.from];
            const to = atomMap[bond.to];

            if (!from || !to) {
              return null;
            }

            const bondId = bond.kind === "carbon" ? (bond.id as BranchedBondId) : null;
            const isInteractive = bond.kind === "carbon" && bondId !== null;
            const isHovered = bondId !== null && hoveredBondId === bondId;
            const isRecentlyChanged =
              bondId !== null && recentlyChangedBondId === bondId;
            const stroke = getBondColor({
              kind: bond.kind,
              order: bond.order,
              isHovered,
              isRecentlyChanged,
            });
            const strokeWidth =
              bond.kind === "hydrogen" ? 1.6 : isHovered ? 3.2 : isRecentlyChanged ? 2.8 : 2;
            const ghostDouble =
              canUseDoubleBond && isInteractive && isHovered && bond.order === 1;

            return (
              <g key={bond.id}>
                {isInteractive ? (
                  <line
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke="transparent"
                    strokeWidth="18"
                    strokeLinecap="round"
                    className={canUseDoubleBond ? "cursor-pointer" : "cursor-not-allowed"}
                    onMouseEnter={() => onBondHoverAction(bondId)}
                    onMouseLeave={() => onBondHoverAction(null)}
                    onClick={() => {
                      if (canUseDoubleBond && bondId !== null) {
                        onBondToggleAction(bondId);
                      }
                    }}
                  />
                ) : null}

                {ghostDouble ? (
                  <line
                    x1={offsetLine(from, to, 4.5).from.x}
                    y1={offsetLine(from, to, 4.5).from.y}
                    x2={offsetLine(from, to, 4.5).to.x}
                    y2={offsetLine(from, to, 4.5).to.y}
                    stroke="rgba(103, 232, 249, 0.45)"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeDasharray="4 3"
                    pointerEvents="none"
                  />
                ) : null}

                {getParallelOffsets(bond.order).map((offset) => {
                  const line = offsetLine(from, to, offset);

                  return (
                    <line
                      key={`${bond.id}-${offset}`}
                      x1={line.from.x}
                      y1={line.from.y}
                      x2={line.to.x}
                      y2={line.to.y}
                      stroke={stroke}
                      strokeWidth={strokeWidth}
                      strokeLinecap="round"
                      pointerEvents="none"
                      className={`origin-center transition-all duration-200 ${
                        isRecentlyChanged ? "animate-pulse" : ""
                      }`}
                    />
                  );
                })}
              </g>
            );
          })}

          {renderModel.atoms.map((atom) => {
            if (atom.label === "H") {
              return (
                <g key={atom.id}>
                  <text
                    x={atom.x}
                    y={atom.y + 1}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="rgb(226 232 240)"
                    fontSize="15"
                    fontWeight="700"
                    style={{ userSelect: "none" }}
                  >
                    H
                  </text>
                </g>
              );
            }

            const style = getCarbonStyle(
              carbonHasUnsaturatedBond(atom.id, renderModel.bonds),
            );
            const isSelected = selectedAtomId === atom.id;

            return (
              <g
                key={atom.id}
                className={onAtomSelectAction ? "cursor-pointer" : undefined}
                onClick={() => onAtomSelectAction?.(atom.id as BranchedAtomId)}
              >
                <circle
                  cx={atom.x}
                  cy={atom.y}
                  r={isSelected ? "21" : "18"}
                  fill={style.fill}
                  stroke={isSelected ? "rgba(250, 204, 21, 0.92)" : style.stroke}
                  strokeWidth={isSelected ? "2.2" : "1.35"}
                  filter={`url(#carbon-glow-${atom.id})`}
                />
                <text
                  x={atom.x}
                  y={atom.y + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={style.text}
                  fontSize="14"
                  fontWeight="800"
                  letterSpacing="0.01em"
                  style={{ userSelect: "none" }}
                >
                  C
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

export function createGraphBackedSynthesisLabSvgProps(options: {
  layout: BuilderLayout;
  activeCarbonCount: number;
  normalizedBondOrders: GraphBuilderBondOrder[];
}) {
  const graphState = buildGraphBuilderState(
    options.layout,
    options.activeCarbonCount,
    options.normalizedBondOrders,
  );

  return {
    builderState: convertGraphBuilderStateToBranched(graphState),
    layoutMode: options.layout,
  };
}
