"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { ChapterProgressView } from "@/lib/progress/queries";

type HallPhaseViewerProps = {
  chapterId: ChapterProgressView["chapterId"];
  initialPhaseId: ChapterProgressView["phases"][number]["phaseId"];
  phases: ChapterProgressView["phases"];
  onBackAction?: () => void;
};

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
    >
      <path
        d={
          direction === "left"
            ? "M14.5 5.5 8 12l6.5 6.5"
            : "M9.5 5.5 16 12l-6.5 6.5"
        }
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function getPhaseStateMeta(
  phase: ChapterProgressView["phases"][number],
  chapterId: ChapterProgressView["chapterId"],
) {
  if (phase.isCompleted) {
    return {
      actionHref: `/phase/${phase.phaseId}`,
      actionLabel: "Revisitar prova",
      description: `Melhor pontuacao: ${phase.bestScore}`,
      stateClass: "border-emerald-400/24 bg-emerald-500/10",
      stateLabel: "Dominada",
      toneClass: "border-emerald-400/25 bg-emerald-500/10 text-emerald-100",
    };
  }

  if (phase.isUnlocked) {
    return {
      actionHref: `/phase/${phase.phaseId}`,
      actionLabel: "Enfrentar prova",
      description: "Esta prova ja pode ser iniciada.",
      stateClass: "border-sky-300/24 bg-sky-400/10",
      stateLabel: "Ativa",
      toneClass: "border-cyan-300/25 bg-cyan-400/10 text-cyan-100",
    };
  }

  return {
    actionHref: `/hall?chapterId=${chapterId}`,
    actionLabel: "Prova fechada",
    description: "Conclua a prova anterior para abrir esta prova.",
    stateClass: "border-white/10 bg-white/5",
    stateLabel: "Selada",
    toneClass: "border-white/10 bg-white/5 text-slate-300",
  };
}

export function HallPhaseViewer({
  chapterId,
  initialPhaseId,
  phases,
  onBackAction,
}: HallPhaseViewerProps) {
  const initialIndex = useMemo(() => {
    const foundIndex = phases.findIndex((phase) => phase.phaseId === initialPhaseId);
    return foundIndex >= 0 ? foundIndex : 0;
  }, [initialPhaseId, phases]);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const activePhase = phases[currentIndex];
  const stateMeta = getPhaseStateMeta(activePhase, chapterId);
  const isFirstPhase = currentIndex === 0;
  const isLastPhase = currentIndex === phases.length - 1;

  function goToPrevious() {
    setCurrentIndex((value) => Math.max(0, value - 1));
  }

  function goToNext() {
    setCurrentIndex((value) => Math.min(phases.length - 1, value + 1));
  }

  return (
    <div className="mt-6 grid gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {onBackAction ? (
            <button
              type="button"
              onClick={onBackAction}
              className="ritual-link px-3 py-2 text-sm"
              aria-label="Voltar aos capitulos"
            >
              <Chevron direction="left" />
            </button>
          ) : null}
          <button
            type="button"
            onClick={goToPrevious}
            disabled={isFirstPhase}
            className={`ritual-link px-3 py-2 text-sm ${isFirstPhase ? "pointer-events-none opacity-40" : ""}`}
            aria-label="Prova anterior"
          >
            <Chevron direction="left" />
          </button>
        </div>

        <div className="rounded-full border border-white/10 bg-slate-950/50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-200">
          Prova {activePhase.phaseNumber} de {phases.length}
        </div>

        <button
          type="button"
          onClick={goToNext}
          disabled={isLastPhase}
          className={`ritual-link px-3 py-2 text-sm ${isLastPhase ? "pointer-events-none opacity-40" : ""}`}
          aria-label="Proxima prova"
        >
          <Chevron direction="right" />
        </button>
      </div>

      <article
        className={`state-panel group min-h-[16rem] ${stateMeta.stateClass}`}
        data-state={
          activePhase.isCompleted
            ? "success"
            : activePhase.isUnlocked
              ? "active"
              : "locked"
        }
      >
        <div className="flex items-center justify-between gap-3">
          <span className="font-display text-4xl text-white">
            {String(activePhase.phaseNumber).padStart(2, "0")}
          </span>
          <span
            className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${stateMeta.toneClass}`}
          >
            {stateMeta.stateLabel}
          </span>
        </div>

        <h3 className="pt-5 text-2xl font-semibold text-white">
          {activePhase.title}
        </h3>
        <p className="pt-3 text-sm leading-7 text-slate-300">
          {stateMeta.description}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {phases.map((phase, index) => {
            const isActive = index === currentIndex;

            return (
              <button
                key={phase.phaseId}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={`h-2.5 rounded-full transition ${
                  isActive
                    ? "w-10 bg-cyan-200"
                    : "w-2.5 bg-white/25 hover:bg-white/45"
                }`}
                aria-label={`Ir para prova ${phase.phaseNumber}`}
              />
            );
          })}
        </div>

        <div className="mt-6">
          <Link
            href={stateMeta.actionHref}
            className="state-action"
            data-tone={activePhase.isUnlocked ? "primary" : "secondary"}
            data-state={activePhase.isUnlocked ? "active" : "locked"}
            aria-disabled={!activePhase.isUnlocked}
          >
            {stateMeta.actionLabel}
          </Link>
        </div>
      </article>
    </div>
  );
}
