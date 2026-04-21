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

type PhaseStep = "intro" | "forge" | "choice" | "justify" | "result";

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

const stepOrder: PhaseStep[] = [
  "intro",
  "forge",
  "choice",
  "justify",
  "result",
];

const minimumForgeFeedbackMs = 900;

const stepCopy: Record<Exclude<PhaseStep, "result">, { eyebrow: string; title: string; description: string }> = {
  intro: {
    eyebrow: "Chamado",
    title: "Contexto da prova",
    description: "Leia o chamado do reino, entenda a missao e avance quando estiver pronto para agir.",
  },
  forge: {
    eyebrow: "Rito da forja",
    title: "Moldar a estrutura",
    description: "Molde a estrutura pedida pela prova e confirme se a mesa reconhece sua leitura.",
  },
  choice: {
    eyebrow: "Rito da escolha",
    title: "Definir a molecula",
    description: "Compare as cartas disponiveis e decida qual delas melhor responde ao chamado da prova.",
  },
  justify: {
    eyebrow: "Rito da leitura",
    title: "Sustentar a resposta",
    description: "Escolha ate 3 propriedades para demonstrar por que sua resposta merece ser aceita.",
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
  return value === "intro" || value === "forge" || value === "choice" || value === "justify" || value === "result";
}

function getInitialStep(supportsBuilder: boolean, supportsMoleculeSelection: boolean): PhaseStep {
  if (supportsBuilder) {
    return "forge";
  }

  if (supportsMoleculeSelection) {
    return "choice";
  }

  return "justify";
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
    steps.push("choice");
  }

  steps.push("justify");

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
  const activeCarbonCount = Math.min(
    clampedCarbonValue,
    maximumCarbonCount,
  );
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
  const unlockedPhaseCount = chapterProgress.phases.filter(
    (item) => item.isUnlocked,
  ).length;
  const completedPhaseCount = chapterProgress.phases.filter(
    (item) => item.isCompleted,
  ).length;
  const unlockedNextPhaseId =
    submitResult &&
    submitResult.persistence.chapterProgress.highestUnlockedPhaseNumber >
      phase.number
      ? chapterProgress.phases.find(
          (item) => item.phaseNumber === phase.number + 1,
        )?.phaseId ?? null
      : null;
  const nextPhaseActionHref = unlockedNextPhaseId
    ? `/phase/${unlockedNextPhaseId}`
    : nextPhaseHref;

  const canAdvanceFromIntro = true;
  const canAdvanceFromForge = supportsBuilder
    ? Boolean(builderResult?.canCreateMolecule)
    : true;
  const canAdvanceFromChoice = supportsMoleculeSelection
    ? Boolean(effectiveSelectedMoleculeId)
    : true;
  const canAdvanceFromJustify = selectedProperties.length > 0;
  const displayedStep = renderedStep;
  const createdMolecule =
    molecules.find((molecule) => molecule.id === builderResult?.resolvedMoleculeId) ??
    null;
  const availableSteps = getAvailablePhaseSteps(
    supportsBuilder,
    supportsMoleculeSelection,
    Boolean(submitResult),
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

      return current.length === next.length
        && current.every((value, index) => value === next[index])
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
        await new Promise((resolve) => window.setTimeout(resolve, remainingDelay));
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
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      navigateToStep(stepOrder[currentIndex - 1], "backward");
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
      navigateToStep(
        supportsMoleculeSelection ? "choice" : "justify",
        "forward",
      );
      return;
    }

    if (currentStep === "choice") {
      navigateToStep("justify", "forward");
    }
  }

  function updateBondOrder(index: number) {
    setBondOrders((current) => {
      const normalized = normalizeBondOrders(current, layout, activeCarbonCount);
      const nextOrder =
        normalized[index] === 2 || !canUseDoubleBond ? 1 : 2;

      return normalized.map((order, bondIndex) =>
        bondIndex === index ? nextOrder : order,
      );
    });
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <section className="relative overflow-hidden rounded-[32px] border border-cyan-300/20 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_32%),radial-gradient(circle_at_top_right,rgba(251,191,36,0.16),transparent_28%),linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,6,23,0.98))] p-8 shadow-[0_24px_80px_rgba(2,6,23,0.45)]">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.04)_32%,transparent_60%)]" />
        <div className="relative flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
              Capitulo I · Prova {phase.number}
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-white">
              {phase.title}
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-300">
              {phase.narrative}
            </p>
          </div>

          <div className="grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-slate-500">Estado da prova</p>
              <p className="mt-1 font-semibold text-white">
                {currentPhaseStatus?.isCompleted ? "Ja dominada" : "Aguardando sua leitura"}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-slate-500">Passagem pelo dominio</p>
              <p className="mt-1 font-semibold text-white">
                {completedPhaseCount}/{chapterProgress.phases.length} provas vencidas
              </p>
              <p className="text-slate-400">{unlockedPhaseCount} portoes respondendo</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.22)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
              {displayedStep === "result"
                ? "Desfecho"
                : stepCopy[displayedStep].eyebrow}
            </p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-white">
              {displayedStep === "result"
                ? "Desfecho da prova"
                : stepCopy[displayedStep].title}
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              {displayedStep === "result"
                ? "Revise o julgamento do reino, os sinais recebidos e o proximo destino."
                : stepCopy[displayedStep].description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {stepOrder
              .filter((step) => availableSteps.includes(step))
              .map((step, index) => {
                const isActive = currentStep === step;
                const isDone =
                  step === "intro"
                    ? true
                    : step === "forge"
                      ? canAdvanceFromForge
                      : step === "choice"
                        ? canAdvanceFromChoice
                        : step === "justify"
                          ? canAdvanceFromJustify
                          : Boolean(submitResult);

                return (
                  <div
                    key={step}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
                      isActive
                        ? "border-cyan-300/50 bg-cyan-400/15 text-cyan-100"
                        : isDone
                          ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-100"
                          : "border-white/10 bg-slate-950/35 text-slate-400"
                    }`}
                  >
                    {displayedStep === "result" && step === "result"
                      ? `${index + 1}. desfecho`
                      : step === "intro"
                        ? `${index + 1}. chamado`
                        : step === "forge"
                          ? `${index + 1}. forja`
                          : step === "choice"
                            ? `${index + 1}. escolha`
                            : `${index + 1}. leitura`}
                  </div>
                );
              })}
          </div>
        </div>
      </section>

      <section
        className={`mt-6 transition-all duration-200 ${
          isStepVisible
            ? "translate-x-0 opacity-100"
            : stepDirection === "forward"
              ? "translate-x-6 opacity-0"
              : "-translate-x-6 opacity-0"
        }`}
      >
        {displayedStep === "intro" ? (
          <div className="grid gap-6 xl:grid-cols-[1.15fr,0.85fr]">
            <article className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.22)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Chamado do reino
              </p>
              <p className="mt-4 text-base leading-8 text-slate-200">
                {phase.narrative}
              </p>
            </article>

            <div className="grid gap-4">
              <article className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.22)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Missao
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-200">
                  {phase.objective}
                </p>
              </article>
              <article className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.22)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Conceito central
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-200">
                  {phase.coreConcept}
                </p>
              </article>
              <article className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.22)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Recursos da fase
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-200">
                  {phase.resources.carbonAvailable} carbono
                  {phase.resources.carbonAvailable > 1 ? "s" : ""} ·{" "}
                  {phase.resources.availableFragments
                    .map(
                      (fragmentId) =>
                        bondTypeLabels[fragmentToBondType[fragmentId]],
                    )
                    .join(" · ")}
                </p>
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
            previewBondType={previewBondType}
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

        {displayedStep === "choice" ? (
          <section className="rounded-[28px] border border-white/10 bg-white/5 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.22)] sm:p-6">
            <div className="grid gap-4 xl:grid-cols-[0.72fr,1.28fr]">
              <aside className="grid gap-4 self-start">
                <div className="rounded-[24px] border border-cyan-300/20 bg-[linear-gradient(180deg,rgba(14,116,144,0.16),rgba(15,23,42,0.16))] p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
                    {createdMolecule ? "Leitura refinada" : "Leitura da prova"}
                  </p>
                  <h3 className="mt-2 text-2xl font-black tracking-tight text-white">
                    Escolha da molecula
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    {createdMolecule
                      ? "Compare as cartas disponiveis e confirme se a molecula sugerida pela forja continua sendo a melhor resposta."
                      : "Compare as cartas disponiveis e escolha a resposta principal da prova sem depender da mesa de forja."}
                  </p>
                </div>

                {createdMolecule ? (
                  <div className="rounded-[24px] border border-emerald-400/25 bg-emerald-500/10 p-5 text-sm text-emerald-100">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-200">
                      Sinal confirmado
                    </p>
                    <p className="mt-2 text-lg font-black">{createdMolecule.nomeQuimico}</p>
                    <p className="mt-2 leading-6 text-emerald-50/90">
                      A forja ja reconheceu esta molecula. Use esta etapa para confirmar a resposta final comparando a carta sugerida com as demais opcoes.
                    </p>
                  </div>
                ) : null}

                <div className="rounded-[24px] border border-white/10 bg-slate-950/35 p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Leitura atual
                  </p>
                  <div className="mt-3 space-y-3 text-sm text-slate-300">
                    <div className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
                      Molecula em foco:{" "}
                      <span className="font-semibold text-white">
                        {selectedMolecule?.nomeQuimico ?? "nenhuma"}
                      </span>
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
                      Origem do sinal:{" "}
                      <span className="font-semibold text-white">
                        {createdMolecule ? "mesa de forja" : "comparacao direta"}
                      </span>
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3 leading-6">
                      {createdMolecule
                        ? "A carta sugerida ja veio da forja. Aqui o foco e confirmar se ela segue a melhor resposta diante das outras cartas."
                        : "Nesta fase, a decisao nasce da leitura das cartas disponiveis. Compare atributos, propriedades e contexto antes de escolher."}
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3 leading-6">
                      Objetivo da fase:{" "}
                      <span className="font-semibold text-white">
                        {phase.objective}
                      </span>
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3 leading-6">
                      Conceito em foco:{" "}
                      <span className="font-semibold text-white">
                        {phase.coreConcept}
                      </span>
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
                      Estado da leitura:{" "}
                      <span className="font-semibold text-white">
                        {selectedMolecule ? "resposta pronta" : "escolha pendente"}
                      </span>
                    </div>
                  </div>
                </div>
              </aside>

              <div className="grid gap-4 md:grid-cols-2">
                {molecules.map((molecule) => {
                  const isSelected = effectiveSelectedMoleculeId === molecule.id;
                  const isCreated = builderResult?.resolvedMoleculeId === molecule.id;

                  return (
                    <div
                      key={molecule.id}
                      className={`rounded-[28px] p-1 transition ${
                        isSelected
                          ? "bg-[linear-gradient(135deg,rgba(34,211,238,0.4),rgba(59,130,246,0.18))] shadow-[0_16px_40px_rgba(14,165,233,0.18)]"
                          : isCreated
                            ? "bg-[linear-gradient(135deg,rgba(52,211,153,0.28),rgba(20,184,166,0.14))]"
                            : "bg-transparent"
                      }`}
                    >
                      <div className="relative">
                        {isSelected ? (
                          <div className="pointer-events-none absolute left-4 top-4 z-10 rounded-full border border-cyan-300/40 bg-cyan-400/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-cyan-100">
                            Escolhida
                          </div>
                        ) : null}
                        {isCreated && !isSelected ? (
                          <div className="pointer-events-none absolute left-4 top-4 z-10 rounded-full border border-emerald-300/40 bg-emerald-500/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-100">
                            Sugerida
                          </div>
                        ) : null}
                        <MoleculeCard
                          molecule={molecule}
                          isSelected={isSelected}
                          isCreated={isCreated}
                          selectable={supportsMoleculeSelection}
                          variant="compact"
                          onSelect={
                            supportsMoleculeSelection
                              ? () => setSelectedMoleculeId(molecule.id)
                              : undefined
                          }
                        />
                      </div>
                      {supportsMoleculeSelection ? (
                        <div className="mt-3 flex items-center justify-between rounded-[22px] border border-white/10 bg-slate-950/45 px-4 py-3">
                          <div>
                            <p className="text-sm font-black text-white">
                              {molecule.nomeQuimico}
                            </p>
                            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                              {isCreated ? "reconhecida pela forja" : "comparacao direta"}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedMoleculeId(molecule.id)}
                            className={`rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] transition ${
                              isSelected
                                ? "bg-cyan-300 text-slate-950"
                                : "border border-white/15 bg-white/5 text-white hover:border-cyan-300/40 hover:bg-cyan-400/10"
                            }`}
                          >
                            {isSelected ? "Resposta ativa" : "Escolher"}
                          </button>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        ) : null}

        {displayedStep === "justify" ? (
          <div className="grid gap-6 xl:grid-cols-[1fr,0.8fr]">
            <section className="rounded-[28px] border border-white/10 bg-white/5 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.22)] sm:p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Leitura alquimica
              </p>
              <h3 className="mt-2 text-2xl font-black tracking-tight text-white">
                Propriedades em foco
              </h3>
              <div className="mt-5 grid gap-3">
                {phase.expectedProperties.map((property) => (
                  <button
                    key={property}
                    type="button"
                    onClick={() => toggleProperty(property)}
                    className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition ${
                      selectedProperties.includes(property)
                        ? "border-cyan-300/40 bg-cyan-400/10 text-cyan-100"
                        : "border-white/10 bg-slate-950/35 text-slate-200 hover:border-white/20"
                    }`}
                  >
                    <span className="font-semibold">
                      {formatSelectableProperty(property)}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-[0.16em]">
                      {selectedProperties.includes(property) ? "Marcada" : "Marcar"}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-[28px] border border-white/10 bg-white/5 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.22)] sm:p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Julgamento
              </p>
              <h3 className="mt-2 text-2xl font-black tracking-tight text-white">
                Resposta a registrar
              </h3>
              <div className="mt-5 grid gap-3 text-sm text-slate-300">
                <div className="rounded-2xl border border-white/8 bg-slate-950/35 px-4 py-3">
                  Molecula escolhida:{" "}
                  <span className="font-semibold text-slate-100">
                    {selectedMolecule?.nomeQuimico ??
                      effectiveSelectedMoleculeId ??
                      "nenhuma"}
                  </span>
                </div>
                <div className="rounded-2xl border border-white/8 bg-slate-950/35 px-4 py-3">
                  Marcas de leitura:{" "}
                  <span className="font-semibold text-slate-100">
                    {selectedProperties.length}/3
                  </span>
                </div>
              </div>

              {submitError ? (
                <p className="mt-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                  {submitError}
                </p>
              ) : null}

              <p className="mt-6 text-sm text-slate-400">
                Use o botao abaixo para entregar sua leitura ao julgamento do reino.
              </p>
            </section>
          </div>
        ) : null}

        {displayedStep === "result" && submitResult ? (
          <section className="rounded-[28px] border border-white/10 bg-white/5 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.22)] sm:p-6">
            <div className="grid gap-5 xl:grid-cols-[1.1fr,0.9fr]">
              <div
                className={`rounded-[26px] border p-5 sm:p-6 ${resultToneClass[submitResult.evaluation.qualitativeResult]}`}
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] opacity-80">
                  Julgamento do reino
                </p>
                <h3 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                  {resultTitleByKind[submitResult.evaluation.qualitativeResult]}
                </h3>
                <p className="mt-2 text-sm font-semibold uppercase tracking-[0.16em] opacity-90">
                  {submitResult.evaluation.qualitativeResult}
                </p>
                <p className="mt-4 text-sm leading-7 text-white/90">
                  {submitResult.evaluation.feedback}
                </p>
              </div>

              <div className="grid gap-3">
                <div className="rounded-[24px] border border-white/8 bg-slate-950/35 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Leitura rapida
                  </p>
                  <div className="mt-3 grid gap-3 text-sm text-slate-300 sm:grid-cols-2 xl:grid-cols-1">
                    <div className="rounded-2xl border border-white/8 bg-white/5 p-3">
                      <p className="text-slate-500">Forca obtida</p>
                      <p className="mt-1 text-2xl font-black text-white">
                        {submitResult.evaluation.scoreAwarded}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-white/5 p-3">
                      <p className="text-slate-500">Sentenca da prova</p>
                      <p className="mt-1 text-lg font-semibold capitalize text-white">
                        {submitResult.evaluation.validationResult}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-white/5 p-3">
                      <p className="text-slate-500">Molecula apresentada</p>
                      <p className="mt-1 text-lg font-semibold text-white">
                        {selectedMolecule?.nomeQuimico ?? "Nao definida"}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-white/5 p-3">
                      <p className="text-slate-500">Marcas alinhadas</p>
                      <p className="mt-1 text-lg font-semibold text-white">
                        {submitResult.evaluation.expectedPropertiesMatched.length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-3 text-sm text-slate-300 md:grid-cols-2">
              <div className="rounded-2xl border border-white/8 bg-slate-950/35 p-4">
                <p className="text-slate-500">Provas vencidas</p>
                <p className="mt-1 text-lg font-semibold text-slate-100">
                  {submitResult.persistence.chapterProgress.completedPhaseCount}
                </p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-slate-950/35 p-4">
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
            ) : (
              <div className="mt-4 rounded-2xl border border-white/8 bg-slate-950/35 px-4 py-3 text-sm text-slate-300">
                Nenhum novo sinal foi concedido nesta passagem.
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleRetryFromResult}
                className="rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-100"
              >
                Renovar leitura
              </button>
              {nextPhaseActionHref ? (
                <Link
                  href={nextPhaseActionHref}
                  className="rounded-2xl bg-cyan-300 px-4 py-3 text-sm font-black uppercase tracking-[0.14em] text-slate-950"
                >
                  Seguir para a proxima prova
                </Link>
              ) : null}
            </div>
          </section>
        ) : null}
      </section>

      {currentStep !== "result" ? (
        <section className="mt-6 flex flex-col gap-3 rounded-[24px] border border-white/10 bg-slate-950/35 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <button
            type="button"
            onClick={goBack}
            disabled={currentStep === "intro"}
            className="rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Voltar
          </button>

          <p className="text-sm text-slate-400">
            {currentStep === "intro" && "Leia o chamado da prova e avance quando estiver pronto."}
            {currentStep === "forge" &&
              (canAdvanceFromForge
                ? "A mesa reconheceu sua estrutura. Voce ja pode seguir."
                : "Confirme sua estrutura para abrir o proximo rito.")}
            {currentStep === "choice" &&
              (canAdvanceFromChoice
                ? "Sua leitura ja aponta uma molecula. Siga para sustentar a resposta."
                : "Escolha uma molecula antes de prosseguir.")}
            {currentStep === "justify" &&
              "Marque as propriedades e entregue sua leitura ao julgamento do reino."}
          </p>

          {currentStep !== "justify" ? (
            <button
              type="button"
              onClick={goForward}
              disabled={
                (currentStep === "intro" && !canAdvanceFromIntro) ||
                (currentStep === "forge" && !canAdvanceFromForge) ||
                (currentStep === "choice" && !canAdvanceFromChoice)
              }
              className="rounded-2xl bg-cyan-300 px-4 py-3 text-sm font-black uppercase tracking-[0.14em] text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Avancar
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={
                isSubmitting ||
                !canAdvanceFromJustify ||
                (supportsBuilder && !builderResult?.canCreateMolecule) ||
                (supportsMoleculeSelection && !effectiveSelectedMoleculeId)
              }
              className="rounded-2xl bg-cyan-300 px-4 py-3 text-sm font-black uppercase tracking-[0.14em] text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isSubmitting ? "Entregando leitura..." : "Entregar resposta"}
            </button>
          )}
        </section>
      ) : null}
    </main>
  );
}
