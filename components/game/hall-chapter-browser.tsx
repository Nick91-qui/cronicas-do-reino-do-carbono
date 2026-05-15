"use client";

import { useMemo, useState } from "react";

import { HallPhaseViewer } from "@/components/game/hall-phase-viewer";

import type { ChapterProgressView } from "@/lib/progress/queries";

type HallChapterBrowserProps = {
  chapters: ChapterProgressView[];
  initialChapterId: ChapterProgressView["chapterId"];
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

export function HallChapterBrowser({
  chapters,
  initialChapterId,
}: HallChapterBrowserProps) {
  const initialIndex = useMemo(() => {
    const foundIndex = chapters.findIndex(
      (chapter) => chapter.chapterId === initialChapterId,
    );
    return foundIndex >= 0 ? foundIndex : 0;
  }, [chapters, initialChapterId]);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [selectedChapterId, setSelectedChapterId] = useState<
    ChapterProgressView["chapterId"] | null
  >(null);

  const activeChapter = chapters[currentIndex];
  const selectedChapter =
    chapters.find((chapter) => chapter.chapterId === selectedChapterId) ?? null;
  const isFirstChapter = currentIndex === 0;
  const isLastChapter = currentIndex === chapters.length - 1;
  const completedCount = activeChapter.phases.filter((phase) => phase.isCompleted).length;
  const unlockedCount = activeChapter.phases.filter((phase) => phase.isUnlocked).length;
  const nextPhase =
    activeChapter.phases.find((phase) => phase.isUnlocked && !phase.isCompleted) ??
    activeChapter.phases[0];

  function goToPreviousChapter() {
    setCurrentIndex((value) => Math.max(0, value - 1));
  }

  function goToNextChapter() {
    setCurrentIndex((value) => Math.min(chapters.length - 1, value + 1));
  }

  if (selectedChapter) {
    const selectedNextPhase =
      selectedChapter.phases.find((phase) => phase.isUnlocked && !phase.isCompleted) ??
      selectedChapter.phases[0];

    return (
      <div className="mt-6 grid gap-4">
        <div className="rounded-[24px] border border-white/10 bg-slate-950/35 px-4 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Capitulo escolhido
          </p>
          <h3 className="mt-2 text-2xl text-white">{selectedChapter.chapterTitle}</h3>
          <p className="mt-2 text-sm leading-7 text-slate-300">
            Escolha uma prova de cada vez e avance pelo capitulo no seu ritmo.
          </p>
        </div>

        <HallPhaseViewer
          chapterId={selectedChapter.chapterId}
          initialPhaseId={selectedNextPhase.phaseId}
          phases={selectedChapter.phases}
          onBack={() => setSelectedChapterId(null)}
        />
      </div>
    );
  }

  return (
    <div className="mt-6 grid gap-4">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={goToPreviousChapter}
          disabled={isFirstChapter}
          className={`ritual-link px-4 py-2 text-sm ${isFirstChapter ? "pointer-events-none opacity-40" : ""}`}
          aria-label="Capitulo anterior"
        >
          <span className="inline-flex items-center gap-2">
            <Chevron direction="left" />
            Voltar
          </span>
        </button>

        <div className="rounded-full border border-white/10 bg-slate-950/50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-200">
          Capitulo {currentIndex + 1} de {chapters.length}
        </div>

        <button
          type="button"
          onClick={goToNextChapter}
          disabled={isLastChapter}
          className={`ritual-link px-4 py-2 text-sm ${isLastChapter ? "pointer-events-none opacity-40" : ""}`}
          aria-label="Proximo capitulo"
        >
          <span className="inline-flex items-center gap-2">
            Avancar
            <Chevron direction="right" />
          </span>
        </button>
      </div>

      <article className="state-panel group min-h-[18rem] border-white/10 bg-white/5">
        <div className="flex items-center justify-between gap-3">
          <span className="font-display text-xl text-white sm:text-2xl">
            Capitulo
          </span>
          <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-200">
            {completedCount} concluidas
          </span>
        </div>

        <h3 className="pt-5 text-2xl font-semibold text-white">
          {activeChapter.chapterTitle}
        </h3>
        <p className="pt-3 text-sm leading-7 text-slate-300">
          {unlockedCount} provas abertas neste capitulo. Sua proxima prova e a{" "}
          {nextPhase.phaseNumber} {nextPhase.title ? `· ${nextPhase.title}` : ""}.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="game-panel-muted">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Progresso
            </p>
            <p className="mt-2 font-display text-2xl text-white">
              {activeChapter.completedPhaseCount}/{activeChapter.totalPhases}
            </p>
          </div>
          <div className="game-panel-muted">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Pontuacao
            </p>
            <p className="mt-2 font-display text-2xl text-white">
              {activeChapter.chapterScore}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {chapters.map((chapter, index) => {
            const isActive = index === currentIndex;

            return (
              <button
                key={chapter.chapterId}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={`h-2.5 rounded-full transition ${
                  isActive
                    ? "w-10 bg-cyan-200"
                    : "w-2.5 bg-white/25 hover:bg-white/45"
                }`}
                aria-label={`Ir para ${chapter.chapterTitle}`}
              />
            );
          })}
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={() => setSelectedChapterId(activeChapter.chapterId)}
            className="state-action"
            data-tone="primary"
          >
            Ver provas do capitulo
          </button>
        </div>
      </article>
    </div>
  );
}
