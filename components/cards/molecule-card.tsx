"use client";

import { useState } from "react";

import type { Molecule, MoleculeAttributes, SelectableProperty } from "@/lib/content/types";

type MoleculeCardProps = {
  molecule: Molecule;
  isSelected?: boolean;
  isCreated?: boolean;
  selectable?: boolean;
  onSelect?: (() => void) | undefined;
  variant?: "compact" | "expanded";
};

const attributeLabels: Record<keyof MoleculeAttributes, string> = {
  polaridade: "Polaridade",
  potencialEnergetico: "Potencial energético",
  reatividade: "Reatividade",
  estabilidade: "Estabilidade",
  caraterAcidoBasico: "Caráter ácido-básico",
  interacaoBiologica: "Interação biológica",
  volatilidade: "Volatilidade",
};

const barClassByPalette: Record<Molecule["visual"]["attributePalette"], string> = {
  hydrocarbon: "from-cyan-400 via-sky-400 to-fuchsia-400",
  alkene: "from-emerald-400 via-lime-400 to-sky-400",
  aromatic: "from-amber-300 via-orange-400 to-rose-400",
};

function getBadgeLabel(props: MoleculeCardProps): string | null {
  if (props.isSelected) {
    return props.molecule.visual.stateVariants?.selected?.badgeLabel ?? "Selecionada";
  }

  if (props.isCreated) {
    return props.molecule.visual.stateVariants?.newly_created?.badgeLabel ?? "Forjada";
  }

  return props.molecule.visual.stateVariants?.unlocked?.badgeLabel ?? null;
}

function formatProperty(property: SelectableProperty): string {
  return property.replaceAll("_", " ");
}

export function MoleculeCard({
  molecule,
  isSelected = false,
  isCreated = false,
  selectable = false,
  onSelect,
  variant = "compact",
}: MoleculeCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const badgeLabel = getBadgeLabel({ molecule, isSelected, isCreated, selectable, onSelect, variant });
  const shellStyle = {
    backgroundImage: [
      molecule.visual.assets.textureAsset
        ? `linear-gradient(180deg, rgba(255,255,255,0.98), rgba(243,244,246,0.95)), url(${molecule.visual.assets.textureAsset})`
        : "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(243,244,246,0.95))",
    ].join(", "),
    borderImage: `linear-gradient(135deg, ${molecule.visual.accentFrom}, ${molecule.visual.accentTo}) 1`,
  } as const;
  const artStyle = {
    backgroundImage: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.85), transparent 18%), radial-gradient(circle at 68% 35%, rgba(255,255,255,0.35), transparent 14%), linear-gradient(135deg, ${molecule.visual.accentFrom}, ${molecule.visual.accentTo}), url(${molecule.visual.assets.artworkAsset})`,
  } as const;
  const cardHeight = variant === "expanded" ? "h-[560px]" : "h-[470px]";

  function handleFlip() {
    setIsFlipped((current) => !current);
  }

  function handleSelect(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    onSelect?.();
  }

  return (
    <div className="[perspective:1600px]">
      <div
        role="button"
        tabIndex={0}
        aria-pressed={isFlipped}
        onClick={handleFlip}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleFlip();
          }
        }}
        className={`group relative w-full cursor-pointer outline-none ${cardHeight}`}
      >
        <div
          className={`relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] ${isFlipped ? "[transform:rotateY(180deg)]" : ""}`}
        >
          <article
            className="absolute inset-0 overflow-hidden rounded-[24px] border-2 p-[3px] shadow-[0_18px_60px_rgba(15,23,42,0.35)] [backface-visibility:hidden]"
            style={shellStyle}
          >
            <div className="h-full rounded-[20px] bg-slate-950/90 p-3 text-slate-950">
              <div className="flex h-full flex-col rounded-[18px] border border-slate-900/80 bg-white/95 px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">{molecule.id}</p>
                    <h3 className="mt-1 text-xl font-black tracking-tight text-slate-950">{molecule.nomeQuimico}</h3>
                    <p className="mt-1 line-clamp-2 text-sm font-medium text-slate-700">{molecule.nomeEpico}</p>
                  </div>
                  <div className="rounded-[16px] border border-slate-900/80 bg-white px-3 py-2 text-right shadow-sm">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Fórmula</p>
                    <p className="mt-1 text-xl font-black text-slate-950">{molecule.formulaMolecular}</p>
                  </div>
                </div>

                <div className="mt-3 relative overflow-hidden rounded-[20px] border-2 border-slate-900/85 bg-slate-950 p-2">
                  <div className="relative flex aspect-[1/1] items-end rounded-[16px] bg-cover bg-center p-3" style={artStyle}>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_55%)]" />
                    <div className="relative flex w-full items-end justify-between gap-2">
                      <div className="rounded-full border border-white/25 bg-slate-950/55 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80">
                        {molecule.classe}
                      </div>
                      {badgeLabel ? (
                        <div className="rounded-full border border-white/25 bg-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                          {badgeLabel}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="mt-3 rounded-[18px] border-2 border-slate-900/80 bg-white px-3 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Estrutura</p>
                      <p className="mt-1 truncate text-base font-bold text-slate-950">{molecule.formulaEstrutural}</p>
                    </div>
                    {selectable ? (
                      <button
                        type="button"
                        onClick={handleSelect}
                        className={`shrink-0 rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] transition ${isSelected ? "bg-slate-950 text-white" : "border border-slate-300 bg-white text-slate-900 hover:border-slate-950"}`}
                      >
                        {isSelected ? "Selecionada" : "Escolher"}
                      </button>
                    ) : null}
                  </div>
                </div>

                <div className="mt-3 rounded-[18px] border-2 border-slate-900/80 bg-white px-3 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Resumo</p>
                  <p className="mt-2 line-clamp-4 text-sm leading-6 text-slate-800">{molecule.descricaoCurta}</p>
                </div>

                <div className="mt-auto pt-3 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Clique para virar a carta
                </div>
              </div>
            </div>
          </article>

          <article
            className="absolute inset-0 overflow-hidden rounded-[24px] border-2 p-[3px] shadow-[0_18px_60px_rgba(15,23,42,0.35)] [backface-visibility:hidden] [transform:rotateY(180deg)]"
            style={shellStyle}
          >
            <div className="h-full rounded-[20px] bg-slate-950/90 p-3 text-slate-950">
              <div className="flex h-full flex-col rounded-[18px] border border-slate-900/80 bg-white/95 px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">Verso</p>
                    <h3 className="mt-1 text-lg font-black tracking-tight text-slate-950">{molecule.nomeQuimico}</h3>
                  </div>
                  {selectable ? (
                    <button
                      type="button"
                      onClick={handleSelect}
                      className={`shrink-0 rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] transition ${isSelected ? "bg-slate-950 text-white" : "border border-slate-300 bg-white text-slate-900 hover:border-slate-950"}`}
                    >
                      {isSelected ? "Selecionada" : "Escolher"}
                    </button>
                  ) : null}
                </div>

                <div className="mt-3 rounded-[18px] border-2 border-slate-900/80 bg-white px-3 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Atributos</p>
                  <div className="mt-3 space-y-2.5">
                    {Object.entries(molecule.atributos).map(([key, value]) => (
                      <div key={key}>
                        <div className="mb-1 flex items-center justify-between gap-3 text-xs font-semibold text-slate-900">
                          <span>{attributeLabels[key as keyof typeof attributeLabels]}</span>
                          <span>{value}</span>
                        </div>
                        <div className="h-2.5 overflow-hidden rounded-full border border-slate-900/70 bg-slate-100">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${barClassByPalette[molecule.visual.attributePalette]}`}
                            style={{ width: `${(value / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-3 rounded-[18px] border-2 border-slate-900/80 bg-white px-3 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Propriedades-chave</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {molecule.propriedades.slice(0, 6).map((property) => (
                      <span
                        key={property}
                        className="rounded-full border border-slate-300 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-700"
                      >
                        {formatProperty(property)}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <div className="rounded-[18px] border-2 border-slate-900/80 bg-white px-3 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Pontos fortes</p>
                    <ul className="mt-2 space-y-1.5 text-xs leading-5 text-slate-800">
                      {molecule.pontosFortes.slice(0, 3).map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-[18px] border-2 border-slate-900/80 bg-white px-3 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Limitações</p>
                    <ul className="mt-2 space-y-1.5 text-xs leading-5 text-slate-800">
                      {molecule.limitacoes.slice(0, 3).map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-auto pt-3 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Clique para voltar à frente
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
