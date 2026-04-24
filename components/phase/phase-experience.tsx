"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { MoleculeCard } from "@/components/cards/molecule-card";
import {
  bondTypeLabels,
  formatSelectableProperty,
  fragmentToBondType,
  getSceneImageByStep,
  type PersistedResponse,
  type PhaseStep,
} from "@/components/phase/phase-experience-shared";
import { PhaseResultPanel } from "@/components/phase/phase-result-panel";
import { PhaseRitualConsole } from "@/components/phase/phase-ritual-console";
import { PhaseStepHeader } from "@/components/phase/phase-step-header";
import { SynthesisLab } from "@/components/phase/synthesis-lab";

import type {
  BuilderLayout,
  BuilderState,
  BuilderValidationResult,
  GraphBuilderBondOrder,
} from "@/lib/builder/types";
import {
  buildGraphBuilderState,
  getBuilderBondType,
  getClosedRingCarbonLimit,
  getHydrogensByCarbon,
  getPreviewFormulaEstrutural,
  getPreviewFormulaMolecular,
  normalizeBondOrders,
} from "@/lib/builder/graph-preview";
import type {
  Molecule,
  MoleculeId,
  Phase,
  SelectableProperty,
} from "@/lib/content/types";
import type { ChapterProgressView } from "@/lib/progress/queries";

type PhaseExperienceProps = {
  phase: Phase;
  molecules: Molecule[];
  chapterProgress: ChapterProgressView;
};

const minimumSynthesisFeedbackMs = 900;

function getNextPhaseHref(
  chapterProgress: ChapterProgressView,
  currentPhaseNumber: number,
): string | null {
  const nextPhase = chapterProgress.phases.find(
    (phase) => phase.phaseNumber === currentPhaseNumber + 1,
  );
  return nextPhase?.isUnlocked ? `/phase/${nextPhase.phaseId}` : null;
}

function isPhaseStep(value: string | null): value is PhaseStep {
  return (
    value === "intro" ||
    value === "synthesis" ||
    value === "select" ||
    value === "read" ||
    value === "result"
  );
}

function getInitialStep(
  supportsBuilder: boolean,
  supportsMoleculeSelection: boolean,
): PhaseStep {
  if (supportsBuilder) {
    return "synthesis";
  }

  if (supportsMoleculeSelection) {
    return "select";
  }

  return "read";
}

function getAvailablePhaseSteps(
  supportsBuilder: boolean,
  supportsMoleculeSelection: boolean,
  hasResult: boolean,
): PhaseStep[] {
  const steps: PhaseStep[] = ["intro"];

  if (supportsBuilder) {
    steps.push("synthesis");
  }

  if (supportsMoleculeSelection) {
    steps.push("select");
  }

  steps.push("read");

  if (hasResult) {
    steps.push("result");
  }

  return steps;
}

export function PhaseExperience({
  phase,
  molecules,
  chapterProgress,
}: PhaseExperienceProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamsKey = searchParams.toString();
  const [currentStep, setCurrentStep] = useState<PhaseStep>("intro");
  const [renderedStep, setRenderedStep] = useState<PhaseStep>("intro");
  const [isStepVisible, setIsStepVisible] = useState(true);
  const [stepDirection, setStepDirection] = useState<"forward" | "backward">(
    "forward",
  );
  const [layout, setLayout] = useState<BuilderLayout>("open_chain");
  const [carbonCount, setCarbonCount] = useState(
    String(Math.max(1, Math.min(phase.resources.carbonAvailable, 1))),
  );
  const [bondOrders, setBondOrders] = useState<GraphBuilderBondOrder[]>([]);
  const [builderResult, setBuilderResult] =
    useState<BuilderValidationResult | null>(null);
  const [selectedMoleculeId, setSelectedMoleculeId] = useState<MoleculeId | "">(
    "",
  );
  const [selectedProperties, setSelectedProperties] = useState<
    SelectableProperty[]
  >([]);
  const [submitResult, setSubmitResult] = useState<PersistedResponse | null>(
    null,
  );
  const [builderError, setBuilderError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isValidatingBuilder, setIsValidatingBuilder] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextPhaseHref = getNextPhaseHref(chapterProgress, phase.number);
  const supportsBuilder = phase.technicalType !== "choice";
  const supportsMoleculeSelection = phase.technicalType !== "construction";
  const currentPhaseStatus =
    chapterProgress.phases.find((item) => item.phaseId === phase.id) ?? null;
  const effectiveSelectedMoleculeId = supportsMoleculeSelection
    ? selectedMoleculeId || builderResult?.resolvedMoleculeId || ""
    : undefined;
  const availableBondTypes = phase.resources.availableFragments.map(
    (fragmentId) => fragmentToBondType[fragmentId],
  );
  const canUseDoubleBond = availableBondTypes.includes("double");
  const canUseClosedRing = phase.resources.carbonAvailable >= 3;
  const closedRingCarbonLimit = getClosedRingCarbonLimit(phase);
  const minimumCarbonCount = layout === "closed_ring" ? 3 : 1;
  const maximumCarbonCount =
    layout === "closed_ring"
      ? closedRingCarbonLimit
      : phase.resources.carbonAvailable;
  const clampedCarbonValue = Math.max(
    minimumCarbonCount,
    Number(carbonCount) || minimumCarbonCount,
  );
  const activeCarbonCount = Math.min(clampedCarbonValue, maximumCarbonCount);
  const normalizedBondOrders = normalizeBondOrders(
    bondOrders,
    layout,
    activeCarbonCount,
  );
  const previewBondType = getBuilderBondType(
    layout,
    activeCarbonCount,
    normalizedBondOrders,
  );
  const previewBuilderState = buildGraphBuilderState(
    layout,
    activeCarbonCount,
    normalizedBondOrders,
  );
  const previewHydrogensByCarbon = getHydrogensByCarbon(
    layout,
    activeCarbonCount,
    normalizedBondOrders,
  );
  const previewFormulaEstrutural = getPreviewFormulaEstrutural(
    layout,
    previewHydrogensByCarbon,
    normalizedBondOrders,
    previewBondType,
  );
  const previewFormulaMolecular = getPreviewFormulaMolecular(
    activeCarbonCount,
    previewHydrogensByCarbon,
  );
  const bondOrdersKey = normalizedBondOrders.join("-");
  const selectedMolecule =
    molecules.find((molecule) => molecule.id === effectiveSelectedMoleculeId) ??
    null;
  const unlockedNextPhaseId =
    submitResult &&
    submitResult.persistence.chapterProgress.highestUnlockedPhaseNumber >
      phase.number
      ? (chapterProgress.phases.find(
          (item) => item.phaseNumber === phase.number + 1,
        )?.phaseId ?? null)
      : null;
  const nextPhaseActionHref = unlockedNextPhaseId
    ? `/phase/${unlockedNextPhaseId}`
    : nextPhaseHref;

  const canAdvanceFromIntro = true;
  const canAdvanceFromForge = supportsBuilder
    ? Boolean(builderResult?.canCreateMolecule)
    : true;
  const canAdvanceFromSelect = supportsMoleculeSelection
    ? Boolean(effectiveSelectedMoleculeId)
    : true;
  const canAdvanceFromRead = selectedProperties.length > 0;
  const displayedStep = renderedStep;
  const synthesizedMolecule =
    molecules.find(
      (molecule) => molecule.id === builderResult?.resolvedMoleculeId,
    ) ?? null;
  const focusedMolecule = selectedMolecule ?? synthesizedMolecule;
  const availableSteps = getAvailablePhaseSteps(
    supportsBuilder,
    supportsMoleculeSelection,
    Boolean(submitResult),
  );
  const totalSteps = availableSteps.filter((step) => step !== "result").length;
  const visibleProgressStep =
    displayedStep === "result"
      ? totalSteps
      : Math.max(
          1,
          availableSteps
            .filter((step) => step !== "result")
            .indexOf(displayedStep) + 1,
        );

  function navigateToStep(
    nextStep: PhaseStep,
    direction: "forward" | "backward",
  ) {
    if (!availableSteps.includes(nextStep)) {
      return;
    }

    setStepDirection(direction);
    setCurrentStep(nextStep);

    const params = new URLSearchParams(searchParamsKey);
    params.set("step", nextStep);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  useEffect(() => {
    if (submitResult) {
      navigateToStep("result", "forward");
    }
  }, [submitResult]);

  useEffect(() => {
    setBondOrders((current) => {
      const next = normalizeBondOrders(current, layout, activeCarbonCount);

      return current.length === next.length &&
        current.every((value, index) => value === next[index])
        ? current
        : next;
    });
  }, [layout, activeCarbonCount]);

  useEffect(() => {
    if (layout === "closed_ring" && Number(carbonCount) < 3) {
      setCarbonCount("3");
    }
  }, [carbonCount, layout]);

  useEffect(() => {
    setBuilderResult(null);
    setBuilderError(null);
  }, [layout, activeCarbonCount, bondOrdersKey]);

  useEffect(() => {
    const requestedStep = new URLSearchParams(searchParamsKey).get("step");
    const fallbackStep = getInitialStep(
      supportsBuilder,
      supportsMoleculeSelection,
    );

    if (!isPhaseStep(requestedStep)) {
      return;
    }

    if (!availableSteps.includes(requestedStep)) {
      if (requestedStep !== fallbackStep || currentStep !== fallbackStep) {
        navigateToStep(fallbackStep, "forward");
      }
      return;
    }

    if (requestedStep === currentStep) {
      return;
    }

    setCurrentStep(requestedStep);
  }, [
    availableSteps,
    currentStep,
    searchParamsKey,
    submitResult,
    supportsBuilder,
    supportsMoleculeSelection,
  ]);

  useEffect(() => {
    if (availableSteps.includes(currentStep)) {
      return;
    }

    navigateToStep(
      getInitialStep(supportsBuilder, supportsMoleculeSelection),
      "forward",
    );
  }, [availableSteps, currentStep, supportsBuilder, supportsMoleculeSelection]);

  useEffect(() => {
    if (
      currentStep === "read" &&
      supportsMoleculeSelection &&
      !canAdvanceFromSelect
    ) {
      navigateToStep("select", "backward");
    }
  }, [canAdvanceFromSelect, currentStep, supportsMoleculeSelection]);

  useEffect(() => {
    if (currentStep === renderedStep) {
      return;
    }

    setIsStepVisible(false);

    const timeoutId = window.setTimeout(() => {
      setRenderedStep(currentStep);
      setIsStepVisible(true);
    }, 140);

    return () => window.clearTimeout(timeoutId);
  }, [currentStep, renderedStep]);

  async function handleValidateBuilder() {
    const startedAt = Date.now();
    setIsValidatingBuilder(true);
    setBuilderError(null);
    setSubmitError(null);
    setSubmitResult(null);

    try {
      const response = await fetch(`/api/phases/${phase.id}/builder/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(previewBuilderState),
      });

      const json = (await response.json().catch(() => null)) as
        | BuilderValidationResult
        | { error?: string }
        | null;

      const elapsed = Date.now() - startedAt;
      const remainingDelay = Math.max(0, minimumSynthesisFeedbackMs - elapsed);

      if (remainingDelay > 0) {
        await new Promise((resolve) =>
          window.setTimeout(resolve, remainingDelay),
        );
      }

      if (!response.ok) {
        setBuilderError(
          (json as { error?: string } | null)?.error ??
            "A mesa de sintese nao conseguiu reconhecer sua estrutura.",
        );
        setBuilderResult(null);
        return;
      }

      const result = json as BuilderValidationResult;
      setBuilderResult(result);

      if (result.resolvedMoleculeId && supportsMoleculeSelection) {
        setSelectedMoleculeId(result.resolvedMoleculeId);
      }
    } finally {
      setIsValidatingBuilder(false);
    }
  }

  function toggleProperty(property: SelectableProperty) {
    setSubmitError(null);
    setSelectedProperties((current) => {
      if (current.includes(property)) {
        return current.filter((item) => item !== property);
      }

      if (current.length >= 3) {
        return current;
      }

      return [...current, property];
    });
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitResult(null);

    const payload: {
      phaseId: string;
      selectedProperties: SelectableProperty[];
      builderState?: BuilderState;
      selectedMoleculeId?: MoleculeId;
    } = {
      phaseId: phase.id,
      selectedProperties,
    };

    if (supportsBuilder) {
      payload.builderState = previewBuilderState;
    }

    if (supportsMoleculeSelection && effectiveSelectedMoleculeId) {
      payload.selectedMoleculeId = effectiveSelectedMoleculeId;
    }

    const response = await fetch(`/api/phases/${phase.id}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const json = (await response.json().catch(() => null)) as
      | PersistedResponse
      | { error?: string }
      | null;

    if (!response.ok) {
      setSubmitError(
        (json as { error?: string } | null)?.error ??
          "O reino nao conseguiu registrar sua resposta nesta tentativa.",
      );
      setIsSubmitting(false);
      return;
    }

    setSubmitResult(json as PersistedResponse);
    setIsSubmitting(false);
    router.refresh();
  }

  function handleRetryFromResult() {
    setSubmitResult(null);
    setSubmitError(null);
    setIsSubmitting(false);
    navigateToStep(
      getInitialStep(supportsBuilder, supportsMoleculeSelection),
      "backward",
    );
  }

  function goBack() {
    if (currentStep === "intro") {
      router.push(`/chapter/${phase.chapterId}`);
      return;
    }

    const currentIndex = availableSteps.indexOf(currentStep);
    if (currentIndex > 0) {
      navigateToStep(availableSteps[currentIndex - 1], "backward");
    }
  }

  function goForward() {
    if (currentStep === "intro") {
      navigateToStep(
        getInitialStep(supportsBuilder, supportsMoleculeSelection),
        "forward",
      );
      return;
    }

    if (currentStep === "synthesis") {
      navigateToStep(supportsMoleculeSelection ? "select" : "read", "forward");
      return;
    }

    if (currentStep === "select") {
      navigateToStep("read", "forward");
    }
  }

  function updateBondOrder(index: number) {
    setBondOrders((current) => {
      const normalized = normalizeBondOrders(
        current,
        layout,
        activeCarbonCount,
      );
      const nextOrder = normalized[index] === 2 || !canUseDoubleBond ? 1 : 2;

      return normalized.map((order, bondIndex) =>
        bondIndex === index ? nextOrder : order,
      );
    });
  }

  const scene = getSceneImageByStep(displayedStep);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-5 pb-28 sm:px-6 sm:py-8 sm:pb-8">
      <PhaseStepHeader
        phaseNumber={phase.number}
        phaseTitle={phase.title}
        displayedStep={displayedStep}
        availableSteps={availableSteps}
        scene={scene}
        canAdvanceFromForge={canAdvanceFromForge}
        canAdvanceFromRead={canAdvanceFromRead}
        canAdvanceFromSelect={canAdvanceFromSelect}
      />

      <section
        className={`mt-5 transition-all duration-200 sm:mt-6 ${
          isStepVisible
            ? "translate-x-0 opacity-100"
            : stepDirection === "forward"
              ? "translate-x-6 opacity-0"
              : "-translate-x-6 opacity-0"
        }`}
      >
        {displayedStep === "intro" ? (
          <div className="mx-auto grid max-w-6xl gap-4 lg:gap-5 xl:grid-cols-[1.25fr,0.75fr]">
            <article className="game-panel border-cyan-300/15 p-6 sm:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Prova do reino
              </p>
              <p className="mt-5 text-base leading-8 text-slate-100">
                {phase.narrative}
              </p>
            </article>

            <div className="grid gap-4">
              <article className="game-panel">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Missao
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-200">
                  {phase.objective}
                </p>
              </article>
              <article className="game-panel">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Conceito central
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-200">
                  {phase.coreConcept}
                </p>
              </article>
              <article className="game-panel">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Estado local da prova
                </p>
                <div className="mt-3 grid gap-3 text-sm text-slate-200">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3">
                    {currentPhaseStatus?.isCompleted
                      ? "Ja dominada"
                      : "Aguardando sua leitura"}
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3">
                    {phase.resources.carbonAvailable} carbono
                    {phase.resources.carbonAvailable > 1 ? "s" : ""} ·{" "}
                    {phase.resources.availableFragments
                      .map(
                        (fragmentId) =>
                          bondTypeLabels[fragmentToBondType[fragmentId]],
                      )
                      .join(" · ")}
                  </div>
                </div>
              </article>
            </div>
          </div>
        ) : null}

        {displayedStep === "synthesis" ? (
          <SynthesisLab
            objective={phase.objective}
            layout={layout}
            carbonCount={carbonCount}
            activeCarbonCount={activeCarbonCount}
            minimumCarbonCount={minimumCarbonCount}
            maximumCarbonCount={maximumCarbonCount}
            canUseDoubleBond={canUseDoubleBond}
            canUseClosedRing={canUseClosedRing}
            availableBondTypes={availableBondTypes}
            normalizedBondOrders={normalizedBondOrders}
            previewHydrogensByCarbon={previewHydrogensByCarbon}
            previewFormulaEstrutural={previewFormulaEstrutural}
            previewFormulaMolecular={previewFormulaMolecular}
            isValidatingBuilder={isValidatingBuilder}
            builderError={builderError}
            builderResult={builderResult}
            synthesizedMolecule={synthesizedMolecule}
            onSetLayout={setLayout}
            onSetCarbonCount={setCarbonCount}
            onUpdateBondOrder={updateBondOrder}
            onValidateBuilder={handleValidateBuilder}
          />
        ) : null}

        {displayedStep === "select" ? (
          <section className="grid gap-5 xl:grid-cols-[0.82fr,1.18fr] xl:gap-6">
            <aside className="grid gap-4 self-start">
              <div className="game-panel sm:p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Carta em foco
                </p>
                {focusedMolecule ? (
                  <div className="mt-4">
                    <MoleculeCard
                      molecule={focusedMolecule}
                      isSelected
                      isCreated={
                        builderResult?.resolvedMoleculeId === focusedMolecule.id
                      }
                      selectable={supportsMoleculeSelection}
                      variant="compact"
                      onSelect={
                        supportsMoleculeSelection
                          ? () => setSelectedMoleculeId(focusedMolecule.id)
                          : undefined
                      }
                    />
                  </div>
                ) : (
                  <div className="mt-4 rounded-[24px] border border-dashed border-white/15 bg-slate-950/25 px-5 py-8 text-sm leading-6 text-slate-400">
                    Selecione uma carta para abrir a leitura de propriedades.
                  </div>
                )}
              </div>

              <div className="game-panel">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Estado da escolha
                </p>
                <div className="mt-3 grid gap-3 text-sm text-slate-200">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3">
                    Molecula:{" "}
                    <span className="font-semibold text-white">
                      {focusedMolecule?.nomeQuimico ?? "nenhuma"}
                    </span>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3">
                    Origem:{" "}
                    <span className="font-semibold text-white">
                      {synthesizedMolecule ? "laboratorio de sintese" : "comparacao direta"}
                    </span>
                  </div>
                </div>
              </div>
            </aside>

            <section className="game-panel sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Escolha
                  </p>
                  <h3 className="mt-2 text-2xl font-black tracking-tight text-white">
                    Cartas disponiveis
                  </h3>
                </div>
                <div className="rounded-full border border-white/10 bg-slate-950/35 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-slate-300">
                  Selecione 1 carta
                </div>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                {molecules.map((molecule) => {
                  const isSelected =
                    effectiveSelectedMoleculeId === molecule.id;
                  const isCreated =
                    builderResult?.resolvedMoleculeId === molecule.id;

                  return (
                    <div
                      key={molecule.id}
                      className={`rounded-[28px] p-1 transition ${
                        isSelected
                          ? "bg-[linear-gradient(135deg,rgba(34,211,238,0.25),rgba(59,130,246,0.12))]"
                          : isCreated
                            ? "bg-[linear-gradient(135deg,rgba(52,211,153,0.18),rgba(20,184,166,0.1))]"
                            : "bg-transparent"
                      }`}
                    >
                      <MoleculeCard
                        molecule={molecule}
                        isSelected={isSelected}
                        isCreated={isCreated}
                        selectable
                        variant="compact"
                        onSelect={() => setSelectedMoleculeId(molecule.id)}
                      />
                    </div>
                  );
                })}
              </div>
            </section>
          </section>
        ) : null}

        {displayedStep === "read" ? (
          <section className="grid gap-5 xl:grid-cols-[0.86fr,1.14fr] xl:gap-6">
            <aside className="grid gap-4 self-start">
              <div className="game-panel sm:p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Carta em foco
                </p>
                {focusedMolecule ? (
                  <div className="mt-4">
                    <MoleculeCard
                      molecule={focusedMolecule}
                      isSelected
                      isCreated={
                        builderResult?.resolvedMoleculeId === focusedMolecule.id
                      }
                      selectable={supportsMoleculeSelection}
                      variant="compact"
                      onSelect={
                        supportsMoleculeSelection
                          ? () => setSelectedMoleculeId(focusedMolecule.id)
                          : undefined
                      }
                    />
                  </div>
                ) : (
                  <div className="mt-4 rounded-[24px] border border-dashed border-white/15 bg-slate-950/25 px-5 py-8 text-sm leading-6 text-slate-400">
                    {supportsMoleculeSelection
                      ? "Selecione uma carta para comparar com as propriedades exigidas pela prova."
                      : "O laboratorio de sintese ainda nao gerou uma carta reconhecida para esta etapa."}
                  </div>
                )}
              </div>

              <div className="game-panel">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Leitura atual
                </p>
                <div className="mt-3 grid gap-3 text-sm text-slate-200">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3">
                    Molecula:{" "}
                    <span className="font-semibold text-white">
                      {focusedMolecule?.nomeQuimico ?? "nenhuma"}
                    </span>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3">
                    Origem:{" "}
                    <span className="font-semibold text-white">
                      {synthesizedMolecule ? "laboratorio de sintese" : "comparacao direta"}
                    </span>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3">
                    Marcas:{" "}
                    <span className="font-semibold text-white">
                      {selectedProperties.length}/3
                    </span>
                  </div>
                </div>
              </div>
            </aside>

            <div className="grid gap-4">
              <section className="game-panel sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Classificacao
                    </p>
                    <h3 className="mt-2 text-2xl font-black tracking-tight text-white">
                      Propriedades em foco
                    </h3>
                  </div>
                  <div className="rounded-full border border-white/10 bg-slate-950/35 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-slate-300">
                    Escolha ate 3
                  </div>
                </div>

                <div className="mt-5 grid gap-3">
                  {phase.expectedProperties.map((property) => (
                    <button
                      key={property}
                      type="button"
                      onClick={() => toggleProperty(property)}
                      className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition ${
                        selectedProperties.includes(property)
                          ? "border-cyan-300/35 bg-cyan-400/10 text-cyan-100"
                          : "border-white/10 bg-slate-950/25 text-slate-200 hover:border-white/20"
                      }`}
                    >
                      <span className="font-semibold">
                        {formatSelectableProperty(property)}
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-[0.16em]">
                        {selectedProperties.includes(property)
                          ? "Marcada"
                          : "Marcar"}
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              <section className="game-panel">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Julgamento
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {phase.objective}
                </p>

                {submitError ? (
                  <p className="mt-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                    {submitError}
                  </p>
                ) : null}
              </section>
            </div>
          </section>
        ) : null}

        {displayedStep === "result" && submitResult ? (
          <PhaseResultPanel
            focusedMolecule={focusedMolecule}
            nextPhaseActionHref={nextPhaseActionHref}
            submitResult={submitResult}
            onRetry={handleRetryFromResult}
          />
        ) : null}
      </section>

      {currentStep !== "result" ? (
        <PhaseRitualConsole
          availableSteps={availableSteps}
          canAdvanceFromForge={canAdvanceFromForge}
          canAdvanceFromIntro={canAdvanceFromIntro}
          canAdvanceFromRead={canAdvanceFromRead}
          canAdvanceFromSelect={canAdvanceFromSelect}
          currentStep={currentStep}
          displayedStep={displayedStep}
          effectiveSelectedMoleculeId={effectiveSelectedMoleculeId}
          isSubmitting={isSubmitting}
          onBack={goBack}
          onForward={goForward}
          onSubmit={handleSubmit}
          supportsMoleculeSelection={supportsMoleculeSelection}
        />
      ) : null}
    </main>
  );
}
