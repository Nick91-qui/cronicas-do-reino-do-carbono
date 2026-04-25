import Image from "next/image";

import type { PhaseStep } from "@/components/phase/phase-experience-shared";
import { stepCopy } from "@/components/phase/phase-experience-shared";

type PhaseStepHeaderProps = {
  phaseNumber: number;
  phaseTitle: string;
  displayedStep: PhaseStep;
  availableSteps: PhaseStep[];
  scene: { src: string; alt: string; ambient: string };
  canAdvanceFromForge: boolean;
  canAdvanceFromRead: boolean;
  canAdvanceFromSelect: boolean;
};

export function PhaseStepHeader({
  phaseNumber,
  phaseTitle,
  displayedStep,
  availableSteps,
  scene,
  canAdvanceFromForge,
  canAdvanceFromRead,
  canAdvanceFromSelect,
}: PhaseStepHeaderProps) {
  return (
    <section className="relative isolate overflow-hidden rounded-[34px] border border-white/10 bg-slate-950/55 shadow-[0_30px_120px_rgba(2,6,23,0.46)]">
      <div className="absolute inset-0">
        <Image src={scene.src} alt={scene.alt} fill priority sizes="100vw" className="object-cover object-center" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,7,15,0.92)_0%,rgba(4,7,15,0.76)_56%,rgba(4,7,15,0.88)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(103,232,249,0.16),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.12),transparent_20%)]" />
      </div>

      <div className="relative px-5 py-6 sm:px-8 sm:py-8">
        <div className="flex flex-col gap-4">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            <span>Capitulo I · Prova {phaseNumber}</span>
          </div>

          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <h1 className="text-3xl tracking-[0.05em] text-white sm:text-4xl">{phaseTitle}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                {displayedStep === "result"
                  ? "O resultado fica isolado no centro da tela para leitura imediata, sem competir com o restante da interface."
                  : stepCopy[displayedStep].description}
              </p>
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
                            : "border-white/10 bg-white/5 text-slate-400"
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
