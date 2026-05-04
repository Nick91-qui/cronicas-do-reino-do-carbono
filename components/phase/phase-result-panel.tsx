import Image from "next/image";
import Link from "next/link";

import type { Molecule } from "@/lib/content/types";
import type { PersistedResponse } from "@/components/phase/phase-experience-shared";
import {
  resultTitleByKind,
  resultToneClass,
} from "@/components/phase/phase-experience-shared";
import { blobAssets } from "@/lib/assets/blob";

type PhaseResultPanelProps = {
  focusedMolecule: Molecule | null;
  nextPhaseActionHref: string | null;
  submitResult: PersistedResponse;
  onRetry: () => void;
};

export function PhaseResultPanel({
  focusedMolecule,
  nextPhaseActionHref,
  submitResult,
  onRetry,
}: PhaseResultPanelProps) {
  const hasRewards = submitResult.persistence.grantedRewards.length > 0;
  const nextActionLabel = nextPhaseActionHref
    ? "A prova seguinte ja esta pronta."
    : "Seu capitulo foi atualizado no mapa principal.";

  function formatRewardLabel(reward: {
    rewardType: string;
    rewardValue: string;
  }) {
    if (reward.rewardType === "carbon") {
      return `Carbono +${reward.rewardValue}`;
    }

    if (reward.rewardType === "fragment") {
      return `Fragmento: ${reward.rewardValue}`;
    }

    if (reward.rewardType === "molecule") {
      return `Molecula: ${reward.rewardValue}`;
    }

    if (reward.rewardType === "title") {
      return `Titulo: ${reward.rewardValue}`;
    }

    return `${reward.rewardType}: ${reward.rewardValue}`;
  }

  return (
    <section className="relative isolate mx-auto max-w-5xl overflow-hidden rounded-[34px] border border-white/10 bg-slate-950/60 p-4 shadow-[0_30px_100px_rgba(2,6,23,0.42)] sm:p-6">
      <div className="absolute inset-0">
        <Image
          src={blobAssets.protectedGrandHall}
          alt="Salao de julgamento do castelo."
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,7,15,0.32),rgba(4,7,15,0.82)_45%,rgba(4,7,15,0.94)_100%)]" />
      </div>

      <div className="relative">
        <div
          className={`rounded-[28px] border p-6 backdrop-blur-md sm:p-8 ${resultToneClass[submitResult.evaluation.qualitativeResult]}`}
        >
          <h3 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            {resultTitleByKind[submitResult.evaluation.qualitativeResult]}
          </h3>
          <p className="mt-4 text-sm leading-7 text-white/90">
            {submitResult.evaluation.feedback}
          </p>

          <div className="mt-4 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white/90">
            {nextActionLabel}
          </div>

          <div className="mt-6 grid gap-3 text-sm sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <p className="opacity-70">Forca obtida</p>
              <p className="mt-1 text-2xl font-black">
                {submitResult.evaluation.scoreAwarded}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <p className="opacity-70">Molecula apresentada</p>
              <p className="mt-1 text-lg font-semibold">
                {focusedMolecule?.nomeQuimico ?? "Nao definida"}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <p className="opacity-70">Propriedades corretas</p>
              <p className="mt-1 text-lg font-semibold">
                {submitResult.evaluation.expectedPropertiesMatched.length}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
            Recompensas desta tentativa
          </p>
          {hasRewards ? (
            <div className="mt-3 flex flex-wrap gap-2 text-sm text-emerald-100">
              {submitResult.persistence.grantedRewards.map((reward) => (
                <span
                  key={`${reward.rewardType}-${reward.rewardValue}`}
                  className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5"
                >
                  {formatRewardLabel(reward)}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-300">
              Nenhuma recompensa nova foi registrada nesta tentativa.
            </p>
          )}
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={onRetry}
            className="ritual-link px-5 py-3 text-sm"
          >
            Tentar novamente
          </button>
          <Link
            href={nextPhaseActionHref ?? "/game"}
            className="rounded-full bg-[linear-gradient(180deg,rgba(250,204,21,0.96),rgba(245,158,11,0.92))] px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-slate-950"
          >
            {nextPhaseActionHref
              ? "Seguir para a proxima prova"
              : "Voltar ao salão"}
          </Link>
        </div>
      </div>
    </section>
  );
}
