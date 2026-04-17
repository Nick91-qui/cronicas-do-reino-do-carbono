"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { MoleculeCard } from "@/components/cards/molecule-card";

import type { BuilderValidationResult } from "@/lib/builder/types";
import type { ChapterProgressView } from "@/lib/progress/queries";
import type { BuilderState } from "@/lib/builder/types";
import type { BondType, Molecule, MoleculeId, Phase, SelectableProperty } from "@/lib/content/types";

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

const fragmentToBondType = {
  ligacao_simples: "single",
  ligacao_dupla: "double",
  estrutura_aromatica: "aromatic",
} as const satisfies Record<string, BondType>;

const bondTypeLabels: Record<BondType, string> = {
  single: "Ligação simples",
  double: "Ligação dupla",
  aromatic: "Estrutura aromática",
};

function getDefaultBondType(phase: Phase): BondType {
  for (const fragmentId of phase.resources.availableFragments) {
    return fragmentToBondType[fragmentId];
  }

  return "single";
}

function getNextPhaseHref(chapterProgress: ChapterProgressView, currentPhaseNumber: number): string | null {
  const nextPhase = chapterProgress.phases.find((phase) => phase.phaseNumber === currentPhaseNumber + 1);
  return nextPhase?.isUnlocked ? `/phase/${nextPhase.phaseId}` : null;
}

export function PhaseExperience({ phase, molecules, chapterProgress }: PhaseExperienceProps) {
  const router = useRouter();
  const [carbonCount, setCarbonCount] = useState(String(Math.max(1, Math.min(phase.resources.carbonAvailable, 1))));
  const [bondType, setBondType] = useState<BondType>(getDefaultBondType(phase));
  const [builderResult, setBuilderResult] = useState<BuilderValidationResult | null>(null);
  const [selectedMoleculeId, setSelectedMoleculeId] = useState<MoleculeId | "">("");
  const [selectedProperties, setSelectedProperties] = useState<SelectableProperty[]>([]);
  const [submitResult, setSubmitResult] = useState<PersistedResponse | null>(null);
  const [builderError, setBuilderError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isValidatingBuilder, setIsValidatingBuilder] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextPhaseHref = getNextPhaseHref(chapterProgress, phase.number);
  const submitUnlockedNextPhaseHref = submitResult && submitResult.persistence.chapterProgress.highestUnlockedPhaseNumber > phase.number
    ? chapterProgress.phases.find((item) => item.phaseNumber === phase.number + 1)?.phaseId
    : null;
  const supportsBuilder = phase.technicalType !== "choice";
  const supportsMoleculeSelection = phase.technicalType !== "construction";
  const currentPhaseStatus = chapterProgress.phases.find((item) => item.phaseId === phase.id) ?? null;


  const effectiveSelectedMoleculeId = supportsMoleculeSelection
    ? selectedMoleculeId || builderResult?.resolvedMoleculeId || ""
    : undefined;

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

    const json = (await response.json().catch(() => null)) as BuilderValidationResult | { error?: string } | null;

    if (!response.ok) {
      setBuilderError((json as { error?: string } | null)?.error ?? "Falha ao validar a estrutura.");
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

    const json = (await response.json().catch(() => null)) as PersistedResponse | { error?: string } | null;

    if (!response.ok) {
      setSubmitError((json as { error?: string } | null)?.error ?? "Falha ao enviar a fase.");
      setIsSubmitting(false);
      return;
    }

    setSubmitResult(json as PersistedResponse);
    setIsSubmitting(false);
    router.refresh();
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <section className="rounded-2xl border border-white/10 bg-white/5 p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-sky-300">Fase {phase.number} · {phase.displayType}</p>
            <h1 className="mt-2 text-3xl font-semibold">{phase.title}</h1>
            <p className="mt-4 max-w-3xl text-sm text-slate-300">{phase.narrative}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-300">
            <p>Status atual: {currentPhaseStatus?.isCompleted ? "Concluída" : "Em aberto"}</p>
            <p>Tentativas: {currentPhaseStatus?.attemptCount ?? 0}</p>
            <p>Melhor pontuação: {currentPhaseStatus?.bestScore ?? 0}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3 text-sm text-slate-300">
          <article className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
            <p className="text-slate-500">Objetivo</p>
            <p className="mt-2 text-slate-100">{phase.objective}</p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
            <p className="text-slate-500">Recursos</p>
            <p className="mt-2 text-slate-100">{phase.resources.carbonAvailable} carbonos</p>
            <p className="mt-1 text-slate-100">{phase.resources.availableFragments.join(", ")}</p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
            <p className="text-slate-500">Conceito central</p>
            <p className="mt-2 text-slate-100">{phase.coreConcept}</p>
          </article>
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <div className="space-y-6">
          {supportsBuilder ? (
            <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">Oficina molecular</h2>
                  <p className="mt-2 text-sm text-slate-300">
                    Monte a estrutura dentro dos limites oficiais da fase e valide no servidor.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleValidateBuilder}
                  disabled={isValidatingBuilder}
                  className="rounded-xl bg-sky-500 px-4 py-3 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isValidatingBuilder ? "Validando..." : "Criar molécula"}
                </button>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <label className="block text-sm">
                  <span className="mb-2 block text-slate-200">Quantidade de carbonos</span>
                  <input
                    type="number"
                    min={1}
                    max={phase.resources.carbonAvailable}
                    value={carbonCount}
                    onChange={(event) => setCarbonCount(event.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-slate-100 outline-none"
                  />
                </label>

                <label className="block text-sm">
                  <span className="mb-2 block text-slate-200">Tipo de ligação</span>
                  <select
                    value={bondType}
                    onChange={(event) => setBondType(event.target.value as BondType)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-slate-100 outline-none"
                  >
                    {phase.resources.availableFragments.map((fragmentId) => {
                      const availableBondType = fragmentToBondType[fragmentId];

                      return (
                        <option key={fragmentId} value={availableBondType}>
                          {bondTypeLabels[availableBondType]}
                        </option>
                      );
                    })}
                  </select>
                </label>
              </div>

              {builderError ? (
                <p className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                  {builderError}
                </p>
              ) : null}

              {builderResult ? (
                <article className="mt-6 rounded-2xl border border-white/10 bg-slate-950/40 p-5 text-sm text-slate-300">
                  <p className="text-slate-500">Validação estrutural</p>
                  <p className="mt-2 text-slate-100">
                    {builderResult.canCreateMolecule
                      ? "Estrutura válida e reconhecida pelo MVP."
                      : "A estrutura ainda não gerou uma molécula oficial válida."}
                  </p>
                  {builderResult.derivedStructure ? (
                    <dl className="mt-4 grid gap-3 md:grid-cols-2">
                      <div>
                        <dt className="text-slate-500">Fórmula molecular</dt>
                        <dd className="mt-1 text-slate-100">{builderResult.derivedStructure.formulaMolecular}</dd>
                      </div>
                      <div>
                        <dt className="text-slate-500">Fórmula estrutural</dt>
                        <dd className="mt-1 text-slate-100">{builderResult.derivedStructure.formulaEstrutural}</dd>
                      </div>
                    </dl>
                  ) : null}
                  {builderResult.errors.length > 0 ? (
                    <ul className="mt-4 space-y-2 text-amber-200">
                      {builderResult.errors.map((error) => (
                        <li key={error}>- {error}</li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              ) : null}
            </section>
          ) : null}

          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">Cartas disponíveis</h2>
            <p className="mt-2 text-sm text-slate-300">
              Primeira versão da carta híbrida: shell visual guiado por assets e conteúdo vivo em React.
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {molecules.map((molecule) => {
                const isSelected = effectiveSelectedMoleculeId === molecule.id;
                const isCreated = builderResult?.resolvedMoleculeId === molecule.id;

                return (
                  <MoleculeCard
                    key={molecule.id}
                    molecule={molecule}
                    isSelected={isSelected}
                    isCreated={isCreated}
                    selectable={supportsMoleculeSelection}
                    variant="compact"
                    onSelect={supportsMoleculeSelection ? () => setSelectedMoleculeId(molecule.id) : undefined}
                  />
                );
              })}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">Justificativa por propriedades</h2>
            <p className="mt-2 text-sm text-slate-300">
              Selecione de 1 a 3 propriedades oficiais para justificar sua resposta.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {phase.expectedProperties.map((property) => {
                const isSelected = selectedProperties.includes(property);

                return (
                  <button
                    key={property}
                    type="button"
                    onClick={() => toggleProperty(property)}
                    className={`rounded-full border px-4 py-2 text-sm ${isSelected ? "border-sky-400/60 bg-sky-500/10 text-sky-100" : "border-white/10 bg-slate-950/40 text-slate-200"}`}
                  >
                    {property}
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-xs text-slate-500">Selecionadas: {selectedProperties.length}/3</p>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">Submissão</h2>
            <div className="mt-4 space-y-2 text-sm text-slate-300">
              <p>Molécula selecionada: <span className="text-slate-100">{effectiveSelectedMoleculeId || "nenhuma"}</span></p>
              <p>Builder validado: <span className="text-slate-100">{builderResult?.canCreateMolecule ? "sim" : supportsBuilder ? "não" : "não aplicável"}</span></p>
            </div>

            {submitError ? (
              <p className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {submitError}
              </p>
            ) : null}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || selectedProperties.length === 0 || (supportsBuilder && !builderResult?.canCreateMolecule) || (supportsMoleculeSelection && !effectiveSelectedMoleculeId)}
              className="mt-6 w-full rounded-xl bg-sky-500 px-4 py-3 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Enviando..." : "Enviar resposta"}
            </button>
          </section>

          {submitResult ? (
            <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-sky-300">Resultado oficial</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-100">{submitResult.evaluation.qualitativeResult}</h2>
              <p className="mt-3 text-sm text-slate-300">{submitResult.evaluation.feedback}</p>
              <dl className="mt-4 grid gap-3 text-sm text-slate-300 md:grid-cols-2">
                <div>
                  <dt className="text-slate-500">Pontuação</dt>
                  <dd className="mt-1 text-slate-100">{submitResult.evaluation.scoreAwarded}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Validação interna</dt>
                  <dd className="mt-1 text-slate-100">{submitResult.evaluation.validationResult}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Fases concluídas</dt>
                  <dd className="mt-1 text-slate-100">{submitResult.persistence.chapterProgress.completedPhaseCount}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Pontuação do capítulo</dt>
                  <dd className="mt-1 text-slate-100">{submitResult.persistence.chapterProgress.chapterScore}</dd>
                </div>
              </dl>
              {submitResult.persistence.grantedRewards.length > 0 ? (
                <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                  Recompensas: {submitResult.persistence.grantedRewards.map((reward) => `${reward.rewardType}:${reward.rewardValue}`).join(", ")}
                </div>
              ) : null}
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => router.refresh()}
                  className="rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-100"
                >
                  Atualizar progresso
                </button>
                {(submitUnlockedNextPhaseHref ? `/phase/${submitUnlockedNextPhaseHref}` : nextPhaseHref) ? (
                  <Link href={submitUnlockedNextPhaseHref ? `/phase/${submitUnlockedNextPhaseHref}` : nextPhaseHref!} className="rounded-xl bg-sky-500 px-4 py-3 text-sm font-semibold text-slate-950">
                    Ir para próxima fase
                  </Link>
                ) : null}
              </div>
            </section>
          ) : null}
        </div>
      </section>
    </main>
  );
}
