"use client";

import { useState } from "react";

type SynthesisTutorialStep = {
  body: string;
  title: string;
};

type SynthesisTutorialProps = {
  onClose: () => void;
  onComplete: () => void;
};

const tutorialSteps: SynthesisTutorialStep[] = [
  {
    title: "Geometria da cadeia",
    body: "Comece escolhendo se a estrutura sera uma cadeia aberta ou fechada. Nem toda prova libera as duas opcoes.",
  },
  {
    title: "Quantidade de carbonos",
    body: "Use os controles de carbono para aumentar ou reduzir a estrutura dentro do limite da prova atual.",
  },
  {
    title: "Ligacoes disponiveis",
    body: "Toque nas ligacoes da estrutura para alternar o tipo permitido. Algumas fases liberam apenas ligacao simples.",
  },
  {
    title: "Validar estrutura",
    body: "Quando a bancada estiver pronta, use Validar estrutura. So depois da validacao o reino reconhece a molecula.",
  },
  {
    title: "Seguir a prova",
    body: "Se a estrutura for aceita, voce avanca para escolher a carta ou justificar a resposta, dependendo da fase.",
  },
];

export function SynthesisTutorial({
  onClose,
  onComplete,
}: SynthesisTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const isLastStep = currentStep === tutorialSteps.length - 1;
  const step = tutorialSteps[currentStep];

  function goBack() {
    setCurrentStep((value) => Math.max(0, value - 1));
  }

  function goForward() {
    if (isLastStep) {
      onComplete();
      return;
    }

    setCurrentStep((value) => Math.min(tutorialSteps.length - 1, value + 1));
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-[radial-gradient(circle_at_center,rgba(8,15,30,0.18),rgba(8,15,30,0.72)_62%,rgba(8,15,30,0.86)_100%)] px-3 py-4 backdrop-blur-[2px] sm:items-center sm:px-6">
      <div className="w-full max-w-2xl rounded-[30px] border border-cyan-300/20 bg-[linear-gradient(180deg,rgba(7,12,24,0.98),rgba(3,7,18,0.98))] p-5 shadow-[0_28px_90px_rgba(2,6,23,0.52)] sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-100">
              Tutorial da bancada
            </p>
            <p className="mt-2 text-sm text-slate-300">
              Passo {currentStep + 1} de {tutorialSteps.length}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 bg-slate-950/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-100 transition hover:border-cyan-200/35"
          >
            Fechar
          </button>
        </div>

        <div className="mt-5 rounded-[24px] border border-white/10 bg-slate-950/35 p-5">
          <h2 className="text-2xl font-black tracking-tight text-white">
            {step.title}
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-200">{step.body}</p>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {tutorialSteps.map((item, index) => (
            <span
              key={item.title}
              className={`h-2.5 flex-1 rounded-full ${
                index === currentStep
                  ? "bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.42)]"
                  : index < currentStep
                    ? "bg-emerald-300/80"
                    : "bg-white/10"
              }`}
            />
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={goBack}
            disabled={currentStep === 0}
            className="ritual-console-action h-11 min-w-[7rem] px-4 text-sm font-black"
            data-tone="back"
          >
            Voltar
          </button>

          <button
            type="button"
            onClick={goForward}
            className="ritual-console-action h-11 min-w-[8rem] px-4 text-sm font-black"
            data-tone="forward"
          >
            {isLastStep ? "Comecar" : "Proximo"}
          </button>
        </div>
      </div>
    </div>
  );
}
