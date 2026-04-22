"use client";

import { useState, type MouseEvent } from "react";

import type {
  Molecule,
  MoleculeAttributes,
  SelectableProperty,
} from "@/lib/content/types";

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

const barClassByPalette: Record<
  Molecule["visual"]["attributePalette"],
  string
> = {
  hydrocarbon: "from-cyan-400 via-sky-400 to-fuchsia-400",
  alkene: "from-emerald-400 via-lime-400 to-sky-400",
  aromatic: "from-amber-300 via-orange-400 to-rose-400",
};

const propertyBadgeClassByPalette: Record<
  Molecule["visual"]["attributePalette"],
  string
> = {
  hydrocarbon:
    "border-cyan-200/60 bg-cyan-50/80 text-cyan-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]",
  alkene:
    "border-emerald-200/60 bg-emerald-50/80 text-emerald-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]",
  aromatic:
    "border-amber-200/70 bg-amber-50/85 text-amber-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]",
};

const trackClassByPalette: Record<
  Molecule["visual"]["attributePalette"],
  string
> = {
  hydrocarbon: "bg-slate-950/80",
  alkene: "bg-slate-950/80",
  aromatic: "bg-slate-950/80",
};

const fillGlowClassByPalette: Record<
  Molecule["visual"]["attributePalette"],
  string
> = {
  hydrocarbon: "shadow-[0_0_8px_rgba(59,130,246,0.18)]",
  alkene: "shadow-[0_0_8px_rgba(16,185,129,0.18)]",
  aromatic: "shadow-[0_0_8px_rgba(251,146,60,0.18)]",
};

const hoverRingClassByPalette: Record<
  Molecule["visual"]["attributePalette"],
  string
> = {
  hydrocarbon: "group-hover:ring-cyan-300/35",
  alkene: "group-hover:ring-emerald-300/35",
  aromatic: "group-hover:ring-amber-300/35",
};

function buildShellStyle(molecule: Molecule) {
  return {
    backgroundImage: molecule.visual.assets.textureAsset
      ? `linear-gradient(180deg, rgba(255,255,255,0.98), rgba(243,244,246,0.95)), url(${molecule.visual.assets.textureAsset})`
      : "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(243,244,246,0.95))",
    borderImage: `linear-gradient(135deg, ${molecule.visual.accentFrom}, ${molecule.visual.accentTo}) 1`,
  } as const;
}

function buildArtStyle(molecule: Molecule) {
  return {
    backgroundImage: [
      "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.82), transparent 18%)",
      "radial-gradient(circle at 68% 35%, rgba(255,255,255,0.35), transparent 14%)",
      `linear-gradient(135deg, ${molecule.visual.accentFrom}, ${molecule.visual.accentTo})`,
    ].join(", "),
  } as const;
}

function getBadgeLabel(props: MoleculeCardProps): string | null {
  if (props.isSelected) {
    return (
      props.molecule.visual.stateVariants?.selected?.badgeLabel ?? "Selecionada"
    );
  }

  if (props.isCreated) {
    return (
      props.molecule.visual.stateVariants?.newly_created?.badgeLabel ??
      "Forjada"
    );
  }

  return null;
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
  const badgeLabel = getBadgeLabel({
    molecule,
    isSelected,
    isCreated,
    selectable,
    onSelect,
    variant,
  });
  const shellStyle = buildShellStyle(molecule);
  const artStyle = buildArtStyle(molecule);
  const artworkFit = molecule.visual.assets.artworkFit ?? "cover";
  const artworkPosition = molecule.visual.assets.artworkPosition ?? "center";
  const artworkScale = molecule.visual.assets.artworkScale ?? 1;
  const cardHeight = variant === "expanded" ? "h-[520px] sm:h-[560px]" : "h-[440px] sm:h-[500px]";
  const visibleProperties = variant === "expanded" ? 6 : 5;
  const hoverRingClass =
    hoverRingClassByPalette[molecule.visual.attributePalette];

  function handleFlip() {
    setIsFlipped((current) => !current);
  }

  function handleSelect(event: MouseEvent<HTMLButtonElement>) {
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
        className={`group relative w-full cursor-pointer outline-none transition-transform duration-300 hover:scale-[1.02] ${cardHeight}`}
      >
        <div
          className={`relative h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] [transform-style:preserve-3d] ${isFlipped ? "[transform:rotateY(180deg)]" : ""}`}
        >
          <article
            className={`absolute inset-0 overflow-hidden rounded-[24px] border-2 p-[3px] shadow-[0_18px_60px_rgba(15,23,42,0.35)] transition-all duration-300 group-hover:ring-2 [backface-visibility:hidden] ${hoverRingClass}`}
            style={shellStyle}
          >
            <div className="h-full rounded-[20px] bg-slate-950/90 p-3 text-slate-950">
              <div className="flex h-full flex-col rounded-[18px] border border-slate-900/80 bg-white px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="mt-1 text-lg font-black tracking-tight text-slate-950 sm:text-xl">
                      {molecule.nomeQuimico}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm font-medium text-slate-500">
                      {molecule.nomeEpico}
                    </p>
                  </div>
                </div>

                <div className="relative mt-3 min-h-0 flex-1 overflow-hidden rounded-[20px] border border-slate-900/70 bg-slate-950 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                  <div
                    className="relative flex h-full min-h-[180px] items-center justify-center rounded-[16px] border border-white/10 bg-cover bg-center p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] sm:min-h-[220px]"
                    style={artStyle}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_55%)]" />

                    <img
                      src={molecule.visual.assets.artworkAsset}
                      alt={molecule.nomeQuimico}
                      className={`relative z-10 h-full w-full min-h-0 min-w-0 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] ${artworkFit === "contain" ? "object-contain" : "object-cover"}`}
                      style={{
                        objectPosition: artworkPosition,
                        transform: `scale(${artworkScale})`,
                        transformOrigin: "center",
                      }}
                    />

                    <div className="absolute bottom-3 left-3 right-3 z-20 flex flex-wrap items-end justify-between gap-2">
                      <div className="rounded-full border border-white/25 bg-slate-950/55 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/80 sm:text-[10px]">
                        {molecule.classe}
                      </div>
                      {badgeLabel ? (
                        <div className="rounded-full border border-white/25 bg-white/15 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-white sm:text-[10px]">
                          {badgeLabel}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="mt-3 rounded-[18px] border border-slate-900/70 bg-slate-50 px-3 py-2.5">
                  <div className="flex flex-wrap gap-2">
                    {molecule.propriedades.slice(0, visibleProperties).map((property) => (
                      <span
                        key={property}
                        className={`rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.08em] ${propertyBadgeClassByPalette[molecule.visual.attributePalette]}`}
                      >
                        {formatProperty(property)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </article>

          <article
            className={`absolute inset-0 overflow-hidden rounded-[24px] border-2 p-[3px] shadow-[0_18px_60px_rgba(15,23,42,0.35)] transition-all duration-300 group-hover:ring-2 [backface-visibility:hidden] [transform:rotateY(180deg)] ${hoverRingClass}`}
            style={shellStyle}
          >
            <div className="h-full rounded-[20px] bg-slate-950/90 p-3 text-slate-950">
              <div className="flex h-full flex-col rounded-[18px] border border-slate-900/80 bg-white px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                <div className="flex items-start justify-end gap-3">
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

                <div className="mt-3 rounded-[18px] border border-slate-900/70 bg-white px-3 py-3">
                  <div className="space-y-2">
                    {Object.entries(molecule.atributos).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2.5">
                        <span className="shrink-0 text-xs font-semibold text-slate-900">
                          {attributeLabels[key as keyof typeof attributeLabels]}
                        </span>
                        <div className="relative h-3 min-w-0 flex-1 overflow-hidden rounded-full border border-slate-200 bg-slate-100/70">
                          <div className="absolute inset-0 grid grid-cols-5 overflow-hidden rounded-full">
                            {Array.from({ length: 5 }, (_, index) => (
                              <div
                                key={`${key}-tick-${index}`}
                                className="border-r border-slate-200 last:border-r-0"
                              />
                            ))}
                          </div>
                          <div
                            className={`relative h-full rounded-full bg-gradient-to-r ${barClassByPalette[molecule.visual.attributePalette]} ${fillGlowClassByPalette[molecule.visual.attributePalette]}`}
                            style={{ width: `${(value / 5) * 100}%` }}
                          />
                        </div>
                        <span className="w-6 shrink-0 text-right text-xs font-semibold text-slate-900">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-3 grid gap-3">
                  <div className="rounded-[18px] border border-emerald-200 bg-emerald-50 px-3 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Pontos fortes
                    </p>
                    <ul className="mt-2 space-y-2 text-xs leading-6 text-slate-800">
                      {molecule.pontosFortes.slice(0, 3).map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 rounded-2xl border border-emerald-200/80 bg-white/65 px-2.5 py-2"
                        >
                          <span className="mt-0.5 shrink-0 text-[11px] font-black text-emerald-700">
                            +
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-[18px] border border-rose-200 bg-rose-50 px-3 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Limitações
                    </p>
                    <ul className="mt-2 space-y-2 text-xs leading-6 text-slate-800">
                      {molecule.limitacoes.slice(0, 3).map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 rounded-2xl border border-rose-200/80 bg-white/65 px-2.5 py-2"
                        >
                          <span className="mt-0.5 shrink-0 text-[11px] font-black text-rose-700">
                            -
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
