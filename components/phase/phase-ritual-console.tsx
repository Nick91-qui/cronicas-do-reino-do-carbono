import type { PhaseStep } from "@/components/phase/phase-experience-shared";

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

type PhaseRitualConsoleProps = {
  availableSteps: PhaseStep[];
  canAdvanceFromForge: boolean;
  canAdvanceFromIntro: boolean;
  canAdvanceFromRead: boolean;
  canAdvanceFromSelect: boolean;
  currentStep: PhaseStep;
  displayedStep: PhaseStep;
  effectiveSelectedMoleculeId: string | undefined;
  isSubmitting: boolean;
  onBack: () => void;
  onForward: () => void;
  onSubmit: () => void;
  supportsMoleculeSelection: boolean;
};

export function PhaseRitualConsole({
  availableSteps,
  canAdvanceFromForge,
  canAdvanceFromIntro,
  canAdvanceFromRead,
  canAdvanceFromSelect,
  currentStep,
  displayedStep,
  effectiveSelectedMoleculeId,
  isSubmitting,
  onBack,
  onForward,
  onSubmit,
  supportsMoleculeSelection,
}: PhaseRitualConsoleProps) {
  return (
    <section className="sticky bottom-3 z-10 mt-6 supports-[padding:max(0px)]:pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:static sm:supports-[padding:max(0px)]:pb-0">
      <div className="ritual-console px-3 py-3 sm:px-5 sm:py-4">
        <div className="relative flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onBack}
                className="ritual-console-action h-10 min-w-10 px-3 text-sm font-black sm:h-11 sm:min-w-11"
                data-tone="back"
                aria-label={currentStep === "intro" ? "Voltar para o capitulo" : "Voltar"}
              >
                <Chevron direction="left" />
              </button>

              {currentStep !== "read" ? (
                <button
                  type="button"
                  onClick={onForward}
                  disabled={
                    (currentStep === "intro" && !canAdvanceFromIntro) ||
                    (currentStep === "synthesis" && !canAdvanceFromForge) ||
                    (currentStep === "select" && !canAdvanceFromSelect)
                  }
                  className="ritual-console-action h-10 min-w-10 px-3 text-sm font-black sm:h-11 sm:min-w-11"
                  data-tone="forward"
                  aria-label="Avancar"
                >
                  <Chevron direction="right" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onSubmit}
                  disabled={
                    isSubmitting ||
                    !canAdvanceFromRead ||
                    (supportsMoleculeSelection && !effectiveSelectedMoleculeId)
                  }
                  className="ritual-console-action h-10 min-w-[6.5rem] px-4 text-sm font-black sm:h-11 sm:min-w-[7rem]"
                  data-tone="forward"
                  aria-label="Entregar resposta"
                >
                  {isSubmitting ? "Enviando" : "Entregar"}
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {availableSteps
                .filter((step) => step !== "result")
                .map((step) => (
                  <span
                    key={`console-${step}`}
                    className={`h-2.5 w-2.5 rounded-full ${
                      displayedStep === step
                        ? "bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.55)]"
                        : "bg-white/15"
                    }`}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
