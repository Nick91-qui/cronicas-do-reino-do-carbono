"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { MoleculeCard } from "@/components/cards/molecule-card";

import type { BuilderState, BuilderValidationResult } from "@/lib/builder/types";
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
  adequate: "Solucao aceitavel",
  inadequate: "Forja instavel",
};

const stepOrder: PhaseStep[] = [
  "intro",
  "forge",
  "choice",
  "justify",
  "result",
];

const stepCopy: Record<Exclude<PhaseStep, "result">, { eyebrow: string; title: string; description: string }> = {
  intro: {
    eyebrow: "Entrada",
    title: "Historia e objetivo",
    description: "Leia o contexto, entenda a missao e avance quando estiver pronto para agir.",
  },
  forge: {
    eyebrow: "Etapa 1",
    title: "Forja da estrutura",
    description: "Monte a estrutura da fase e valide a forja antes de seguir.",
  },
  choice: {
    eyebrow: "Etapa 2",
    title: "Escolha da molecula",
    description: "Compare as cartas disponiveis e defina a resposta principal.",
  },
  justify: {
    eyebrow: "Etapa 3",
    title: "Justificativa oficial",
    description: "Selecione ate 3 propriedades para sustentar sua resposta.",
  },
};

function getDefaultBondType(phase: Phase): BondType {
  for (const fragmentId of phase.resources.availableFragments) {
    return fragmentToBondType[fragmentId];
  }

  return "single";
}

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
  const [carbonCount, setCarbonCount] = useState(
    String(Math.max(1, Math.min(phase.resources.carbonAvailable, 1))),
  );
  const [bondType, setBondType] = useState<BondType>(getDefaultBondType(phase));
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
  const selectedMolecule =
    molecules.find((molecule) => molecule.id === effectiveSelectedMoleculeId) ??
    null;
  const carbonValue = Math.max(1, Number(carbonCount) || 1);
  const activeCarbonCount = Math.min(carbonValue, phase.resources.carbonAvailable);
  const unlockedPhaseCount = chapterProgress.phases.filter(
    (item) => item.isUnlocked,
  ).length;
  const completedPhaseCount = chapterProgress.phases.filter(
    (item) => item.isCompleted,
  ).length;
  const availableBondTypes = phase.resources.availableFragments.map(
    (fragmentId) => fragmentToBondType[fragmentId],
  );
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

  function navigateToStep(
    nextStep: PhaseStep,
    direction: "forward" | "backward",
  ) {
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
    const requestedStep = new URLSearchParams(searchParamsKey).get("step");

    if (!isPhaseStep(requestedStep) || requestedStep === currentStep) {
      return;
    }

    if (requestedStep === "result" && !submitResult) {
      return;
    }

    setCurrentStep(requestedStep);
  }, [currentStep, searchParamsKey, submitResult]);

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
    setIsValidatingBuilder(true);
    setBuilderError(null);
    setSubmitError(null);
    setSubmitResult(null);

    const response = await fetch(`/api/phases/${phase.id}/builder/validate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        carbonCount: Number(carbonCount),
        bondType,
      }),
    });

    const json = (await response.json().catch(() => null)) as
      | BuilderValidationResult
      | { error?: string }
      | null;

    if (!response.ok) {
      setBuilderError(
        (json as { error?: string } | null)?.error ??
          "Falha ao validar a estrutura.",
      );
      setBuilderResult(null);
      setIsValidatingBuilder(false);
      return;
    }

    const result = json as BuilderValidationResult;
    setBuilderResult(result);

    if (result.resolvedMoleculeId && supportsMoleculeSelection) {
      setSelectedMoleculeId(result.resolvedMoleculeId);
    }

    setIsValidatingBuilder(false);
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
      payload.builderState = {
        carbonCount: Number(carbonCount),
        bondType,
      };
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
          "Falha ao enviar a fase.",
      );
      setIsSubmitting(false);
      return;
    }

    setSubmitResult(json as PersistedResponse);
    setIsSubmitting(false);
    router.refresh();
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

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <section className="relative overflow-hidden rounded-[32px] border border-cyan-300/20 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_32%),radial-gradient(circle_at_top_right,rgba(251,191,36,0.16),transparent_28%),linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,6,23,0.98))] p-8 shadow-[0_24px_80px_rgba(2,6,23,0.45)]">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.04)_32%,transparent_60%)]" />
        <div className="relative flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
              {phase.chapterId} · Fase {phase.number} · {phase.displayType}
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
              <p className="text-slate-500">Status atual</p>
              <p className="mt-1 font-semibold text-white">
                {currentPhaseStatus?.isCompleted ? "Concluida" : "Em aberto"}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-slate-500">Progresso do capitulo</p>
              <p className="mt-1 font-semibold text-white">
                {completedPhaseCount}/{chapterProgress.phases.length} concluidas
              </p>
              <p className="text-slate-400">{unlockedPhaseCount} desbloqueadas</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.22)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
              {displayedStep === "result"
                ? "Resultado"
                : stepCopy[displayedStep].eyebrow}
            </p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-white">
              {displayedStep === "result"
                ? "Desfecho da fase"
                : stepCopy[displayedStep].title}
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              {displayedStep === "result"
                ? "Revise o retorno oficial, as recompensas e o proximo destino."
                : stepCopy[displayedStep].description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {stepOrder
              .filter((step) => step !== "result" || submitResult)
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
                    {index + 1}. {step}
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
                Historia
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
            <section className="overflow-hidden rounded-[28px] border border-cyan-300/15 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(15,23,42,0.72))] p-4 shadow-[0_20px_60px_rgba(15,23,42,0.28)] sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
                  Oficina molecular
                </p>
                <h3 className="mt-2 text-2xl font-black tracking-tight text-white">
                  Forja estrutural
                </h3>
              </div>
              <button
                type="button"
                onClick={handleValidateBuilder}
                disabled={isValidatingBuilder}
                className="rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isValidatingBuilder ? "Validando..." : "Criar molecula"}
              </button>
            </div>

            <div className="mt-6 grid gap-4 xl:grid-cols-[0.95fr,1.05fr]">
              <div className="grid gap-4">
                <div className="rounded-[24px] border border-white/10 bg-slate-950/45 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Banco de reagentes
                  </p>
                  <div className="mt-4 grid gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                        Carbonos
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {Array.from(
                          { length: phase.resources.carbonAvailable },
                          (_, index) => String(index + 1),
                        ).map((value) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setCarbonCount(value)}
                            className={`flex h-10 w-10 items-center justify-center rounded-xl border text-sm font-black transition ${
                              carbonCount === value
                                ? "border-cyan-300/50 bg-cyan-400/15 text-cyan-100"
                                : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20"
                            }`}
                          >
                            {value}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                        Fragmentos
                      </p>
                      <div className="mt-2 grid gap-2">
                        {availableBondTypes.map((availableBondType) => (
                          <button
                            key={availableBondType}
                            type="button"
                            onClick={() => setBondType(availableBondType)}
                            className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition ${
                              bondType === availableBondType
                                ? "border-cyan-300/50 bg-cyan-400/15 text-cyan-100"
                                : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20"
                            }`}
                          >
                            <span className="font-semibold">
                              {bondTypeLabels[availableBondType]}
                            </span>
                            <span className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                              {bondType === availableBondType ? "Ativo" : "Disponivel"}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-slate-950/45 p-4">
                  <label className="block text-sm">
                    <span className="mb-2 block text-slate-200">
                      Quantidade de carbonos
                    </span>
                    <input
                      type="number"
                      min={1}
                      max={phase.resources.carbonAvailable}
                      value={carbonCount}
                      onChange={(event) => setCarbonCount(event.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-300/60"
                    />
                  </label>
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),transparent_44%),linear-gradient(180deg,rgba(2,6,23,0.65),rgba(15,23,42,0.95))] p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Mesa de forja
                </p>
                <div className="mt-4 overflow-hidden rounded-[22px] border border-cyan-300/10 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.1),transparent_40%),linear-gradient(180deg,rgba(15,23,42,0.9),rgba(2,6,23,0.92))] p-4 sm:p-5">
                  <div className="rounded-[20px] border border-white/8 bg-slate-950/35 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.16em] text-slate-500">
                      <span>Estrutura prevista</span>
                      <span>{bondTypeLabels[bondType]}</span>
                    </div>

                    {bondType === "aromatic" && activeCarbonCount >= 6 ? (
                      <div className="relative mx-auto mt-6 h-[270px] w-full max-w-[320px]">
                        <div className="absolute left-1/2 top-1/2 h-[156px] w-[156px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-300/15" />
                        <div className="absolute left-1/2 top-1/2 h-[92px] w-[92px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-300/20" />

                        {[
                          { top: "16%", left: "50%" },
                          { top: "32%", left: "76%" },
                          { top: "67%", left: "76%" },
                          { top: "84%", left: "50%" },
                          { top: "67%", left: "24%" },
                          { top: "32%", left: "24%" },
                        ].map((atom, index) => (
                          <div
                            key={`${atom.top}-${atom.left}`}
                            className="absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-amber-300/45 bg-amber-400/15 text-sm font-black text-amber-100 shadow-[0_0_28px_rgba(251,191,36,0.14)]"
                            style={{ top: atom.top, left: atom.left }}
                          >
                            C
                            <span className="absolute -bottom-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                              {index + 1}
                            </span>
                          </div>
                        ))}

                        <div className="absolute left-1/2 top-[23%] h-px w-[112px] -translate-x-1/2 bg-amber-200/55" />
                        <div className="absolute left-[31%] top-[50%] h-px w-[74px] -rotate-[60deg] bg-amber-200/55" />
                        <div className="absolute right-[31%] top-[50%] h-px w-[74px] rotate-[60deg] bg-amber-200/55" />
                        <div className="absolute left-[31%] top-[50%] h-px w-[74px] rotate-[60deg] bg-amber-200/55" />
                        <div className="absolute right-[31%] top-[50%] h-px w-[74px] -rotate-[60deg] bg-amber-200/55" />
                        <div className="absolute left-1/2 bottom-[22%] h-px w-[112px] -translate-x-1/2 bg-amber-200/55" />
                      </div>
                    ) : (
                      <div className="mt-6 overflow-x-auto pb-2">
                        <div className="mx-auto flex min-w-max items-center justify-center gap-1 px-2 sm:gap-2">
                          {Array.from({ length: activeCarbonCount }, (_, index) => (
                            <div key={`atom-${index}`} className="flex items-center">
                              <div className="flex flex-col items-center gap-2">
                                <div
                                  className={`flex h-12 w-12 items-center justify-center rounded-full border text-sm font-black shadow-[0_0_28px_rgba(34,211,238,0.14)] ${
                                    bondType === "double"
                                      ? "border-fuchsia-300/40 bg-fuchsia-400/15 text-fuchsia-100"
                                      : "border-cyan-300/45 bg-cyan-400/15 text-cyan-100"
                                  }`}
                                >
                                  C
                                </div>
                                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                                  Atom {index + 1}
                                </span>
                              </div>

                              {index < activeCarbonCount - 1 ? (
                                <div className="mx-1 flex w-10 shrink-0 justify-center sm:w-14">
                                  {bondType === "double" ? (
                                    <div className="flex flex-col gap-1">
                                      <div className="h-px w-8 bg-fuchsia-200/70 sm:w-12" />
                                      <div className="h-px w-8 bg-fuchsia-200/70 sm:w-12" />
                                    </div>
                                  ) : (
                                    <div className="h-px w-8 bg-cyan-200/65 sm:w-12" />
                                  )}
                                </div>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-5 grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
                      <div className="rounded-2xl border border-white/8 bg-white/5 p-3">
                        <p className="text-slate-500">Carbonos ativos</p>
                        <p className="mt-1 text-lg font-semibold text-white">
                          {activeCarbonCount}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-white/8 bg-white/5 p-3">
                        <p className="text-slate-500">Assinatura</p>
                        <p className="mt-1 text-lg font-semibold text-white">
                          {bondType}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-white/8 bg-white/5 p-3">
                        <p className="text-slate-500">Leitura</p>
                        <p className="mt-1 text-lg font-semibold text-white">
                          {bondType === "aromatic"
                            ? "anel"
                            : bondType === "double"
                              ? "cadeia insaturada"
                              : "cadeia saturada"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {builderError ? (
              <p className="mt-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {builderError}
              </p>
            ) : null}

            {builderResult ? (
              <article className="mt-6 rounded-[24px] border border-white/10 bg-slate-950/40 p-5 text-sm text-slate-300">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Validacao estrutural
                    </p>
                    <p className="mt-2 text-base font-semibold text-slate-100">
                      {builderResult.canCreateMolecule
                        ? "Estrutura valida e reconhecida pelo MVP."
                        : "A estrutura ainda nao gerou uma molecula oficial valida."}
                    </p>
                  </div>
                  <div className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] ${
                    builderResult.canCreateMolecule
                      ? "border border-emerald-400/30 bg-emerald-500/10 text-emerald-100"
                      : "border border-amber-400/30 bg-amber-500/10 text-amber-100"
                  }`}>
                    {builderResult.canCreateMolecule ? "Forja estavel" : "Estrutura inconclusiva"}
                  </div>
                </div>
              </article>
            ) : null}
          </section>
        ) : null}

        {displayedStep === "choice" ? (
          <section className="rounded-[28px] border border-white/10 bg-white/5 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.22)] sm:p-6">
            <div className="grid gap-4 xl:grid-cols-[0.72fr,1.28fr]">
              <aside className="grid gap-4 self-start">
                <div className="rounded-[24px] border border-cyan-300/20 bg-[linear-gradient(180deg,rgba(14,116,144,0.16),rgba(15,23,42,0.16))] p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
                    Decisao tatica
                  </p>
                  <h3 className="mt-2 text-2xl font-black tracking-tight text-white">
                    Escolha da molecula
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    Compare as cartas disponiveis e confirme a resposta principal da fase.
                  </p>
                </div>

                {createdMolecule ? (
                  <div className="rounded-[24px] border border-emerald-400/25 bg-emerald-500/10 p-5 text-sm text-emerald-100">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-200">
                      Sugerida pela forja
                    </p>
                    <p className="mt-2 text-lg font-black">{createdMolecule.nomeQuimico}</p>
                    <p className="mt-2 leading-6 text-emerald-50/90">
                      A validacao estrutural reconheceu esta molecula como a saida mais coerente da oficina.
                    </p>
                  </div>
                ) : null}

                <div className="rounded-[24px] border border-white/10 bg-slate-950/35 p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Resumo da escolha
                  </p>
                  <div className="mt-3 space-y-3 text-sm text-slate-300">
                    <div className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
                      Molecula ativa:{" "}
                      <span className="font-semibold text-white">
                        {selectedMolecule?.nomeQuimico ?? "nenhuma"}
                      </span>
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
                      Origem da pista:{" "}
                      <span className="font-semibold text-white">
                        {createdMolecule ? "forja validada" : "comparacao manual"}
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
                Justificativa
              </p>
              <h3 className="mt-2 text-2xl font-black tracking-tight text-white">
                Propriedades oficiais
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
                      {selectedProperties.includes(property) ? "Selecionada" : "Selecionar"}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-[28px] border border-white/10 bg-white/5 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.22)] sm:p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Submissao
              </p>
              <h3 className="mt-2 text-2xl font-black tracking-tight text-white">
                Resposta final
              </h3>
              <div className="mt-5 grid gap-3 text-sm text-slate-300">
                <div className="rounded-2xl border border-white/8 bg-slate-950/35 px-4 py-3">
                  Molecula selecionada:{" "}
                  <span className="font-semibold text-slate-100">
                    {selectedMolecule?.nomeQuimico ??
                      effectiveSelectedMoleculeId ??
                      "nenhuma"}
                  </span>
                </div>
                <div className="rounded-2xl border border-white/8 bg-slate-950/35 px-4 py-3">
                  Propriedades escolhidas:{" "}
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
                Use o botao de navegacao abaixo para finalizar a fase.
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
                  Resultado oficial
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
                      <p className="text-slate-500">Pontuacao</p>
                      <p className="mt-1 text-2xl font-black text-white">
                        {submitResult.evaluation.scoreAwarded}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-white/5 p-3">
                      <p className="text-slate-500">Validacao interna</p>
                      <p className="mt-1 text-lg font-semibold capitalize text-white">
                        {submitResult.evaluation.validationResult}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-white/5 p-3">
                      <p className="text-slate-500">Molecula enviada</p>
                      <p className="mt-1 text-lg font-semibold text-white">
                        {selectedMolecule?.nomeQuimico ?? "Nao definida"}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-white/5 p-3">
                      <p className="text-slate-500">Propriedades corretas</p>
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
                <p className="text-slate-500">Fases concluidas</p>
                <p className="mt-1 text-lg font-semibold text-slate-100">
                  {submitResult.persistence.chapterProgress.completedPhaseCount}
                </p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-slate-950/35 p-4">
                <p className="text-slate-500">Pontuacao do capitulo</p>
                <p className="mt-1 text-lg font-semibold text-slate-100">
                  {submitResult.persistence.chapterProgress.chapterScore}
                </p>
              </div>
            </div>

            {submitResult.persistence.grantedRewards.length > 0 ? (
              <div className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                Recompensas:{" "}
                {submitResult.persistence.grantedRewards
                  .map((reward) => `${reward.rewardType}:${reward.rewardValue}`)
                  .join(", ")}
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-white/8 bg-slate-950/35 px-4 py-3 text-sm text-slate-300">
                Nenhuma recompensa adicional foi liberada nesta tentativa.
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => router.refresh()}
                className="rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-100"
              >
                Atualizar progresso
              </button>
              {nextPhaseActionHref ? (
                <Link
                  href={nextPhaseActionHref}
                  className="rounded-2xl bg-cyan-300 px-4 py-3 text-sm font-black uppercase tracking-[0.14em] text-slate-950"
                >
                  Ir para proxima fase
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
            {currentStep === "intro" && "Leia a fase e avance quando estiver pronto."}
            {currentStep === "forge" &&
              (canAdvanceFromForge
                ? "Estrutura validada. Voce ja pode seguir."
                : "Valide a estrutura para liberar a proxima etapa.")}
            {currentStep === "choice" &&
              (canAdvanceFromChoice
                ? "Molecula definida. Siga para a justificativa."
                : "Escolha uma molecula antes de continuar.")}
            {currentStep === "justify" &&
              "Selecione as propriedades e envie a resposta final."}
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
              Continuar
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
              {isSubmitting ? "Enviando..." : "Finalizar fase"}
            </button>
          )}
        </section>
      ) : null}
    </main>
  );
}
