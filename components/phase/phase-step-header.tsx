import Image from "next/image";

import type { PhaseStep } from "@/components/phase/phase-experience-shared";
import { stepCopy } from "@/components/phase/phase-experience-shared";

type PhaseStepHeaderProps = {
  chapterTitle: string;
  currentInstruction: string;
  displayedStepIndex: number;
  phaseNumber: number;
  phaseTitle: string;
  displayedStep: PhaseStep;
  totalSteps: number;
  availableSteps: PhaseStep[];
  scene: { src: string; alt: string; ambient: string };
  canAdvanceFromForge: boolean;
  canAdvanceFromRead: boolean;
  canAdvanceFromSelect: boolean;
};

export function PhaseStepHeader({
  chapterTitle,
  currentInstruction,
  displayedStepIndex,
  phaseNumber,
  phaseTitle,
  displayedStep,
  totalSteps,
  availableSteps,
  scene,
  canAdvanceFromForge,
  canAdvanceFromRead,
  canAdvanceFromSelect,
}: PhaseStepHeaderProps) {
  const isIntroStep = displayedStep === "intro";
  const isResultStep = displayedStep === "result";
  const compactStepLabel =
    displayedStep === "result"
      ? "Resultado"
      : displayedStep === "synthesis"
        ? stepCopy.synthesis.title
        : displayedStep === "select"
          ? stepCopy.select.title
          : displayedStep === "read"
            ? stepCopy.read.title
            : stepCopy.intro.title;

  if (!isIntroStep) {
    return (
      <section className="rounded-[20px] border border-white/10 bg-[rgba(10,14,26,0.82)] shadow-[0_14px_50px_rgba(2,6,23,0.24)] backdrop-blur-xl">
        <div className="px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                {chapterTitle} · Prova {phaseNumber}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <h1 className="text-xl tracking-[0.04em] text-white sm:text-2xl">
                  {phaseTitle}
                </h1>
                <span className="rounded-full border border-white/10 px-3 py-1.5 text-[11px] text-slate-300">
                  {compactStepLabel}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="hud-chip">
                Etapa {displayedStepIndex} de {totalSteps}
              </span>
              <span className="hidden rounded-full border border-white/10 px-3 py-1.5 text-[11px] text-slate-300 lg:inline-flex">
                {currentInstruction}
              </span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`relative isolate overflow-hidden border border-white/10 bg-slate-950/55 ${
        isIntroStep
          ? "rounded-[34px] shadow-[0_30px_120px_rgba(2,6,23,0.46)]"
          : "rounded-[24px] shadow-[0_18px_70px_rgba(2,6,23,0.32)]"
      }`}
    >
      <div className="absolute inset-0">
        <Image
          src={scene.src}
          alt={scene.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,7,15,0.92)_0%,rgba(4,7,15,0.76)_56%,rgba(4,7,15,0.88)_100%)]" />
        <div
          className={`absolute inset-0 ${
            isIntroStep
              ? "bg-[radial-gradient(circle_at_top,rgba(103,232,249,0.16),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.12),transparent_20%)]"
              : "bg-[radial-gradient(circle_at_top,rgba(103,232,249,0.1),transparent_20%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.08),transparent_18%)]"
          }`}
        />
      </div>

      <div
        className={`relative ${
          isIntroStep ? "px-5 py-6 sm:px-8 sm:py-8" : "px-4 py-4 sm:px-6 sm:py-5"
        }`}
      >
        <div className="flex flex-col gap-4">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-300">
            <span>{chapterTitle} · Prova {phaseNumber}</span>
          </div>

          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <h1
                className={`tracking-[0.05em] text-white ${
                  isIntroStep ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl"
                }`}
              >
                {phaseTitle}
              </h1>
              {isIntroStep ? (
                <>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                    {stepCopy.intro.description}
                  </p>
                  <div className="mt-4 flex flex-col gap-2 text-sm text-slate-200 sm:flex-row sm:flex-wrap sm:items-center">
                    <span className="hud-chip">
                      Etapa {displayedStepIndex} de {totalSteps}
                    </span>
                    <span className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-300">
                      {currentInstruction}
                    </span>
                  </div>
                </>
              ) : (
                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-200">
                  <span className="hud-chip">
                    Etapa {displayedStepIndex} de {totalSteps}
                  </span>
                  <span className="rounded-full border border-white/10 px-3 py-1.5 text-[11px] text-slate-300">
                    {compactStepLabel}
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
              {availableSteps
                .filter((step) => step !== "result")
                .map((step) => {
                  const isActive = displayedStep === step;
                  const isDone =
                    step === "intro"
                      ? true
                      : step === "synthesis"
                        ? canAdvanceFromForge
                        : step === "select"
                          ? canAdvanceFromSelect
                          : canAdvanceFromRead;

                  return (
                    <div
                      key={step}
                      className={`rounded-full border px-3 py-1.5 text-center text-[10px] font-black uppercase tracking-[0.16em] backdrop-blur ${
                        isActive
                          ? "border-cyan-300/35 bg-cyan-400/12 text-cyan-100"
                          : isDone
                            ? "border-emerald-300/25 bg-emerald-500/10 text-emerald-100"
                            : "border-white/10 bg-white/5 text-slate-300"
                      }`}
                    >
                      {step === "intro"
                        ? "Prova"
                        : step === "synthesis"
                          ? "Sintese"
                          : step === "select"
                            ? "Carta"
                            : "Leitura"}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
