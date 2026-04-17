"use client";

import type { BuilderValidationResult } from "@/lib/builder/types";
import type { BondType } from "@/lib/content/types";

type BuilderLayout = "open_chain" | "closed_ring";
type BuilderBondOrder = 1 | 2;

type AtomForgeProps = {
  layout: BuilderLayout;
  carbonCount: string;
  activeCarbonCount: number;
  minimumCarbonCount: number;
  maximumCarbonCount: number;
  canUseDoubleBond: boolean;
  canUseClosedRing: boolean;
  availableBondTypes: BondType[];
  normalizedBondOrders: BuilderBondOrder[];
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

function formatCarbonGroup(hydrogenCount: number): string {
  if (hydrogenCount <= 0) return "C";
  if (hydrogenCount === 1) return "CH";
  return `CH${hydrogenCount}`;
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
  onSetLayout,
  onSetCarbonCount,
  onUpdateBondOrder,
  onValidateBuilder,
}: AtomForgeProps) {
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
                          onClick={() => onUpdateBondOrder(index)}
                          disabled={!canUseDoubleBond}
                          className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition ${
                            order === 2
                              ? "border-emerald-300/35 bg-emerald-500/10 text-emerald-100"
                              : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20"
                          } disabled:cursor-not-allowed disabled:opacity-60`}
                        >
                          <span className="font-semibold">
                            C{from} {order === 2 ? "=" : "-"} C{to}
                          </span>
                          <span className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                            {canUseDoubleBond
                              ? order === 2
                                ? "Dupla"
                                : "Simples"
                              : "So simples"}
                          </span>
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

        <div className="rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),transparent_44%),linear-gradient(180deg,rgba(2,6,23,0.65),rgba(15,23,42,0.95))] p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Mesa de forja
          </p>
          <div className="mt-4 overflow-hidden rounded-[22px] border border-cyan-300/10 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.1),transparent_40%),linear-gradient(180deg,rgba(15,23,42,0.9),rgba(2,6,23,0.92))] p-4 sm:p-5">
            <div className="rounded-[20px] border border-white/8 bg-slate-950/35 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.16em] text-slate-500">
                <span>Estrutura prevista</span>
                <span>{bondTypeLabels[previewBondType]}</span>
              </div>

              {layout === "closed_ring" ? (
                <div className="relative mx-auto mt-6 h-[280px] w-full max-w-[340px]">
                  {(() => {
                    const stageWidth = 340;
                    const stageHeight = 280;
                    const centerX = stageWidth / 2;
                    const centerY = stageHeight / 2;
                    const ringRadius =
                      activeCarbonCount <= 4 ? 68 : activeCarbonCount >= 8 ? 96 : 84;
                    const carbonRadius = 24;
                    const points = Array.from(
                      { length: activeCarbonCount },
                      (_, index) => {
                        const angle =
                          ((Math.PI * 2) / activeCarbonCount) * index - Math.PI / 2;

                        return {
                          angle,
                          x: centerX + Math.cos(angle) * ringRadius,
                          y: centerY + Math.sin(angle) * ringRadius,
                        };
                      },
                    );

                    return (
                      <>
                        <svg
                          viewBox={`0 0 ${stageWidth} ${stageHeight}`}
                          className="absolute inset-0 h-full w-full"
                          aria-hidden="true"
                        >
                        {normalizedBondOrders.map((order, index) => {
                          const start = points[index];
                          const end = points[(index + 1) % activeCarbonCount];
                          const dx = end.x - start.x;
                          const dy = end.y - start.y;
                          const length = Math.hypot(dx, dy) || 1;
                          const normalX = -dy / length;
                          const normalY = dx / length;
                          const offset = 4.5;
                          const trim = carbonRadius - 2;
                          const trimX = (dx / length) * trim;
                          const trimY = (dy / length) * trim;
                          const line1 = {
                            x1: start.x + trimX + (order === 2 ? normalX * offset : 0),
                            y1: start.y + trimY + (order === 2 ? normalY * offset : 0),
                            x2: end.x - trimX + (order === 2 ? normalX * offset : 0),
                            y2: end.y - trimY + (order === 2 ? normalY * offset : 0),
                          };
                          const line2 = {
                            x1: start.x + trimX - normalX * offset,
                            y1: start.y + trimY - normalY * offset,
                            x2: end.x - trimX - normalX * offset,
                            y2: end.y - trimY - normalY * offset,
                          };

                          return (
                            <g
                              key={`ring-bond-${index}`}
                            >
                              <line
                                x1={line1.x1}
                                y1={line1.y1}
                                x2={line1.x2}
                                y2={line1.y2}
                                stroke="rgba(253, 230, 138, 0.78)"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                              />
                              {order === 2 ? (
                                <line
                                  x1={line2.x1}
                                  y1={line2.y1}
                                  x2={line2.x2}
                                  y2={line2.y2}
                                  stroke="rgba(253, 230, 138, 0.78)"
                                  strokeWidth="1.6"
                                  strokeLinecap="round"
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
                                {Array.from({ length: hydrogenCount }, (_, hydrogenIndex) => {
                                  const lateralOffset =
                                    hydrogenCount === 1
                                      ? 0
                                      : hydrogenIndex === 0
                                        ? -hydrogenSpread
                                        : hydrogenSpread;
                                  const hydrogenX =
                                    outwardX * hydrogenDistance + tangentX * lateralOffset;
                                  const hydrogenY =
                                    outwardY * hydrogenDistance + tangentY * lateralOffset;

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
                                })}
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
                              <div className="flex flex-col gap-1">
                                <div className="h-px w-8 bg-fuchsia-200/70 sm:w-12" />
                                <div className="h-px w-8 bg-fuchsia-200/70 sm:w-12" />
                              </div>
                            ) : (
                              <div className="h-px w-8 bg-cyan-200/65 sm:w-12" />
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
