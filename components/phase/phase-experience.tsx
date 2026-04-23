"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { MoleculeCard } from "@/components/cards/molecule-card";
import { AtomForge } from "@/components/phase/atom-forge";

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
  BondType,
  Molecule,
  MoleculeId,
  Phase,
  SelectableProperty,
} from "@/lib/content/types";
import type { ChapterProgressView } from "@/lib/progress/queries";

type PersistedResponse = {
  evaluation: {
    phaseId: string;
    selectedMoleculeId: MoleculeId | null;
    selectedProperties: SelectableProperty[];
    qualitativeResult: "excellent" | "adequate" | "inadequate";
    validationResult: "correct" | "incorrect";
    scoreAwarded: 0 | 2 | 3;
    expectedPropertiesMatched: SelectableProperty[];
    feedback: string;
  };
  persistence: {
    phaseSummary: {
      isCompleted: boolean;
      bestScore: number;
      attemptCount: number;
    };
    chapterProgress: {
      highestUnlockedPhaseNumber: number;
      completedPhaseCount: number;
      chapterScore: number;
    };
    inventory: {
      carbonAvailable: number;
      unlockedFragments: string[];
      unlockedMolecules: string[];
      unlockedTitles: string[];
    };
    grantedRewards: Array<{
      rewardType: string;
      rewardValue: string;
    }>;
  };
};

type PhaseExperienceProps = {
  phase: Phase;
  molecules: Molecule[];
  chapterProgress: ChapterProgressView;
};

type PhaseStep = "intro" | "forge" | "select" | "read" | "result";

const fragmentToBondType = {
  ligacao_simples: "single",
  ligacao_dupla: "double",
  estrutura_aromatica: "aromatic",
} as const satisfies Record<string, BondType>;

const bondTypeLabels: Record<BondType, string> = {
  single: "Ligacao simples",
  double: "Ligacao dupla",
  aromatic: "Estrutura aromatica",
};

const resultToneClass: Record<
  PersistedResponse["evaluation"]["qualitativeResult"],
  string
> = {
  excellent: "border-emerald-400/35 bg-emerald-500/12 text-emerald-100",
  adequate: "border-amber-400/35 bg-amber-500/12 text-amber-100",
  inadequate: "border-rose-400/35 bg-rose-500/12 text-rose-100",
};

const resultTitleByKind: Record<
  PersistedResponse["evaluation"]["qualitativeResult"],
  string
> = {
  excellent: "Forja exemplar",
  adequate: "Passagem promissora",
  inadequate: "Forja instavel",
};

const minimumForgeFeedbackMs = 900;

const stepCopy: Record<
  Exclude<PhaseStep, "result">,
  { eyebrow: string; title: string; description: string }
> = {
  intro: {
    eyebrow: "Chamado",
    title: "Chamado do rito",
    description:
      "A prova apresenta apenas a narrativa, a missao e o conceito central antes de abrir a acao.",
  },
  forge: {
    eyebrow: "Rito da forja",
    title: "Moldar a estrutura",
    description:
      "A montagem ocupa o centro da cena. A prova so avanca quando a mesa confirma a estrutura.",
  },
  select: {
    eyebrow: "Escolha da carta",
    title: "Definir a carta",
    description:
      "A leitura separa primeiro a escolha da carta. So depois voce avanca para classificar suas propriedades.",
  },
  read: {
    eyebrow: "Rito da leitura",
    title: "Classificar e sustentar",
    description:
      "Com a carta ja definida, esta etapa fica dedicada apenas a marcar propriedades e sustentar o julgamento.",
  },
};

function getNextPhaseHref(
  chapterProgress: ChapterProgressView,
  currentPhaseNumber: number,
): string | null {
  const nextPhase = chapterProgress.phases.find(
    (phase) => phase.phaseNumber === currentPhaseNumber + 1,
  );
  return nextPhase?.isUnlocked ? `/phase/${nextPhase.phaseId}` : null;
}

function formatSelectableProperty(property: SelectableProperty): string {
  return property.replaceAll("_", " ");
}

function isPhaseStep(value: string | null): value is PhaseStep {
  return (
    value === "intro" ||
    value === "forge" ||
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
    return "forge";
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
    steps.push("forge");
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
  const createdMolecule =
    molecules.find(
      (molecule) => molecule.id === builderResult?.resolvedMoleculeId,
    ) ?? null;
  const focusedMolecule = selectedMolecule ?? createdMolecule;
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
      const remainingDelay = Math.max(0, minimumForgeFeedbackMs - elapsed);

      if (remainingDelay > 0) {
        await new Promise((resolve) =>
          window.setTimeout(resolve, remainingDelay),
        );
      }

      if (!response.ok) {
        setBuilderError(
          (json as { error?: string } | null)?.error ??
            "A mesa de forja nao conseguiu reconhecer sua estrutura.",
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

    if (currentStep === "forge") {
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

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-5 pb-28 sm:px-6 sm:py-8 sm:pb-8">
      <section className="game-shell">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            <span>Capitulo I · Prova {phase.number}</span>
            <div className="flex flex-wrap items-center gap-2">
              <span className="hud-chip">Rito em curso</span>
              <span className="hud-chip border-gold/20 text-gold/90">
                Passo {visibleProgressStep} de {totalSteps}
              </span>
            </div>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,rgba(250,204,21,0.9),rgba(103,232,249,0.9))] transition-[width] duration-300"
              style={{ width: `${(visibleProgressStep / totalSteps) * 100}%` }}
            />
          </div>

          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200/80">
                {displayedStep === "result"
                  ? "Desfecho"
                  : stepCopy[displayedStep].eyebrow}
              </p>
              <h1 className="mt-2 text-3xl tracking-[0.05em] text-white sm:text-4xl">
                {phase.title}
              </h1>
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
                      : step === "forge"
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
                        ? "Chamado"
                        : step === "forge"
                          ? "Forja"
                          : step === "select"
                            ? "Carta"
                            : "Leitura"}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </section>

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
                Chamado do reino
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

        {displayedStep === "forge" ? (
          <AtomForge
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
            forgedMolecule={createdMolecule}
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
                      {createdMolecule ? "mesa de forja" : "comparacao direta"}
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
                      : "A forja ainda nao gerou uma carta reconhecida para esta etapa."}
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
                      {createdMolecule ? "mesa de forja" : "comparacao direta"}
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
          <section className="game-shell mx-auto max-w-5xl p-4 sm:p-6">
            <div
              className={`rounded-[28px] border p-6 sm:p-8 ${resultToneClass[submitResult.evaluation.qualitativeResult]}`}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] opacity-80">
                Julgamento do reino
              </p>
              <h3 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                {resultTitleByKind[submitResult.evaluation.qualitativeResult]}
              </h3>
              <p className="mt-4 text-sm leading-7 text-white/90">
                {submitResult.evaluation.feedback}
              </p>

              <div className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                  <p className="opacity-70">Forca obtida</p>
                  <p className="mt-1 text-2xl font-black">
                    {submitResult.evaluation.scoreAwarded}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                  <p className="opacity-70">Sentenca</p>
                  <p className="mt-1 text-lg font-semibold capitalize">
                    {submitResult.evaluation.validationResult}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                  <p className="opacity-70">Molecula apresentada</p>
                  <p className="mt-1 text-lg font-semibold">
                    {focusedMolecule?.nomeQuimico ?? "Nao definida"}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                  <p className="opacity-70">Marcas alinhadas</p>
                  <p className="mt-1 text-lg font-semibold">
                    {submitResult.evaluation.expectedPropertiesMatched.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-3 text-sm text-slate-300 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
                <p className="text-slate-500">Provas vencidas</p>
                <p className="mt-1 text-lg font-semibold text-slate-100">
                  {submitResult.persistence.chapterProgress.completedPhaseCount}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
                <p className="text-slate-500">Prestigio no dominio</p>
                <p className="mt-1 text-lg font-semibold text-slate-100">
                  {submitResult.persistence.chapterProgress.chapterScore}
                </p>
              </div>
            </div>

            {submitResult.persistence.grantedRewards.length > 0 ? (
              <div className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                Sinais recebidos:{" "}
                {submitResult.persistence.grantedRewards
                  .map((reward) => `${reward.rewardType}:${reward.rewardValue}`)
                  .join(", ")}
              </div>
            ) : null}

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={handleRetryFromResult}
                className="ritual-link px-5 py-3 text-sm"
              >
                Renovar leitura
              </button>
              <Link
                href={nextPhaseActionHref ?? "/game"}
                className="rounded-full bg-[linear-gradient(180deg,rgba(250,204,21,0.96),rgba(245,158,11,0.92))] px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-slate-950"
              >
                {nextPhaseActionHref
                  ? "Seguir para a proxima prova"
                  : "Voltar ao jogo"}
              </Link>
            </div>
          </section>
        ) : null}
      </section>

      {currentStep !== "result" ? (
        <section className="sticky bottom-3 z-10 mt-6 flex items-center justify-between gap-3 rounded-[24px] border border-white/10 bg-[rgba(4,8,18,0.92)] px-3 py-3 shadow-[0_18px_40px_rgba(2,6,23,0.32)] backdrop-blur supports-[padding:max(0px)]:pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:static sm:bg-[rgba(4,8,18,0.55)] sm:px-5 sm:py-4 sm:supports-[padding:max(0px)]:pb-4">
          <div className="hidden text-xs uppercase tracking-[0.18em] text-slate-400 sm:block">
            {displayedStep === "intro"
              ? "Leia o chamado antes de entrar no rito."
              : displayedStep === "forge"
                ? "A estrutura precisa ser aceita pela mesa."
                : displayedStep === "select"
                  ? "Escolha uma carta antes de seguir."
                  : "Marque propriedades e entregue o julgamento."}
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={goBack}
            className="flex h-9 min-w-[4.5rem] items-center justify-center rounded-full border border-white/10 px-4 text-base font-black text-slate-100 sm:h-11 sm:min-w-[5rem]"
            aria-label={
              currentStep === "intro" ? "Voltar para o capítulo" : "Voltar"
            }
          >
            &lt;
          </button>

          {currentStep !== "read" ? (
            <button
              type="button"
              onClick={goForward}
              disabled={
                (currentStep === "intro" && !canAdvanceFromIntro) ||
                (currentStep === "forge" && !canAdvanceFromForge) ||
                (currentStep === "select" && !canAdvanceFromSelect)
              }
              className="flex h-9 min-w-[4.5rem] items-center justify-center rounded-full bg-[linear-gradient(180deg,rgba(250,204,21,0.96),rgba(245,158,11,0.92))] px-4 text-base font-black text-slate-950 disabled:cursor-not-allowed disabled:opacity-40 sm:h-11 sm:min-w-[5rem]"
              aria-label="Avançar"
            >
              &gt;
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={
                isSubmitting ||
                !canAdvanceFromRead ||
                (supportsMoleculeSelection && !effectiveSelectedMoleculeId)
              }
              className="rounded-full bg-[linear-gradient(180deg,rgba(250,204,21,0.96),rgba(245,158,11,0.92))] px-4 py-2.5 text-xs font-black uppercase tracking-[0.14em] text-slate-950 disabled:cursor-not-allowed disabled:opacity-40 sm:min-w-[11rem] sm:px-4 sm:py-3 sm:text-sm"
            >
              {isSubmitting ? "Entregando leitura..." : "Entregar resposta"}
            </button>
          )}
          </div>
        </section>
      ) : null}
    </main>
  );
}
