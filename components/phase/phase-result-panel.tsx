import Image from "next/image";
import Link from "next/link";

import type { Molecule } from "@/lib/content/types";
import type { PersistedResponse } from "@/components/phase/phase-experience-shared";
import { resultTitleByKind, resultToneClass } from "@/components/phase/phase-experience-shared";
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
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] opacity-80">Julgamento do reino</p>
          <h3 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            {resultTitleByKind[submitResult.evaluation.qualitativeResult]}
          </h3>
          <p className="mt-4 text-sm leading-7 text-white/90">{submitResult.evaluation.feedback}</p>

          <div className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <p className="opacity-70">Forca obtida</p>
              <p className="mt-1 text-2xl font-black">{submitResult.evaluation.scoreAwarded}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <p className="opacity-70">Sentenca</p>
              <p className="mt-1 text-lg font-semibold capitalize">{submitResult.evaluation.validationResult}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <p className="opacity-70">Molecula apresentada</p>
              <p className="mt-1 text-lg font-semibold">{focusedMolecule?.nomeQuimico ?? "Nao definida"}</p>
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
          <button type="button" onClick={onRetry} className="ritual-link px-5 py-3 text-sm">
            Renovar leitura
          </button>
          <Link
            href={nextPhaseActionHref ?? "/game"}
            className="rounded-full bg-[linear-gradient(180deg,rgba(250,204,21,0.96),rgba(245,158,11,0.92))] px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-slate-950"
          >
            {nextPhaseActionHref ? "Seguir para a proxima prova" : "Voltar ao jogo"}
          </Link>
        </div>
      </div>
    </section>
  );
}
