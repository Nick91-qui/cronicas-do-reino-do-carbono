import type { PhaseStep } from "@/components/phase/phase-experience-shared";

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
        <div className="relative flex items-center justify-between gap-3">
          <div className="hidden items-center gap-2 lg:flex">
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

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onBack}
              className="ritual-console-action h-10 min-w-[4.5rem] px-4 text-base font-black sm:h-11 sm:min-w-[5rem]"
              data-tone="back"
              aria-label={currentStep === "intro" ? "Voltar para o capítulo" : "Voltar"}
            >
              &lt;
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
                className="ritual-console-action h-10 min-w-[4.5rem] px-4 text-base font-black sm:h-11 sm:min-w-[5rem]"
                data-tone="forward"
                aria-label="Avançar"
              >
                &gt;
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
                className="ritual-console-action h-10 min-w-[4.5rem] px-4 text-base font-black sm:h-11 sm:min-w-[5rem]"
                data-tone="forward"
                aria-label="Entregar resposta"
              >
                {isSubmitting ? "..." : ">"}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
