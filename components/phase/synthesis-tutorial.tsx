"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";

type SynthesisTutorialControl = {
  description: string;
  icon: ReactNode;
  label: string;
};

type SynthesisTutorialStep = {
  body: string;
  controls?: SynthesisTutorialControl[];
  title: string;
};

type SynthesisTutorialProps = {
  onClose: () => void;
  onComplete: () => void;
};

function LayoutGlyph({ layout }: { layout: "open_chain" | "closed_ring" }) {
  if (layout === "open_chain") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 44 20"
        className="h-4 w-9"
        fill="none"
      >
        <circle cx="6" cy="12.5" r="2.5" fill="currentColor" />
        <circle cx="22" cy="6.5" r="2.5" fill="currentColor" />
        <circle cx="38" cy="12.5" r="2.5" fill="currentColor" />
        <line
          x1="9.2"
          y1="11.3"
          x2="18.6"
          y2="7.7"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <line
          x1="25.4"
          y1="7.7"
          x2="34.8"
          y2="11.3"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className="h-4 w-4"
      fill="none"
    >
      <circle cx="10" cy="10" r="6.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function FlameGlyph() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
    >
      <path
        d="M12.4 3.8c.4 2.1-.4 3.5-1.7 4.9-1.1 1.2-2.3 2.3-2.3 4.2 0 2.1 1.6 3.7 3.7 3.7 2.6 0 4.5-2 4.5-4.8 0-2.4-1.3-4.2-4.2-8z"
        fill="rgb(220 38 38)"
      />
      <path
        d="M12 13.2c-.8 1-1.6 1.7-1.6 2.9 0 1 .8 1.8 1.8 1.8 1.2 0 2.1-.9 2.1-2.3 0-1.1-.6-1.9-2.3-2.4z"
        fill="rgb(250 204 21)"
      />
    </svg>
  );
}

function ControlBadge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex h-10 min-w-10 items-center justify-center rounded-full border border-white/10 bg-slate-950/80 px-3 text-sm font-black text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] ${className ?? ""}`}
    >
      {children}
    </span>
  );
}

const tutorialSteps: SynthesisTutorialStep[] = [
  {
    title: "Geometria da cadeia",
    body: "Esses botoes trocam o formato da estrutura que voce vai montar na bancada.",
    controls: [
      {
        icon: (
          <ControlBadge className="text-cyan-100">
            <LayoutGlyph layout="open_chain" />
          </ControlBadge>
        ),
        label: "Cadeia aberta",
        description: "Monta uma sequencia aberta de carbonos, sem fechar o anel.",
      },
      {
        icon: (
          <ControlBadge className="text-cyan-100">
            <LayoutGlyph layout="closed_ring" />
          </ControlBadge>
        ),
        label: "Cadeia fechada",
        description: "Fecha a estrutura em anel quando a prova libera essa opcao.",
      },
    ],
  },
  {
    title: "Quantidade de carbonos",
    body: "Esses dois botoes ajustam quantos carbonos ficam ativos na estrutura.",
    controls: [
      {
        icon: (
          <ControlBadge>
            <FlameGlyph />
          </ControlBadge>
        ),
        label: "Diminuir carbonos",
        description: "Remove um carbono da estrutura, sem passar do minimo permitido.",
      },
      {
        icon: <ControlBadge>C</ControlBadge>,
        label: "Aumentar carbonos",
        description: "Adiciona um carbono novo, ate o limite liberado na prova.",
      },
    ],
  },
  {
    title: "Ligacoes disponiveis",
    body: "Toque nas ligacoes desenhadas entre os carbonos para alternar o tipo permitido. Algumas fases liberam apenas ligacao simples.",
  },
  {
    title: "Validar estrutura",
    body: "Quando terminar a montagem, valide a estrutura para o laboratorio reconhecer a molecula.",
    controls: [
      {
        icon: (
          <span className="inline-flex h-10 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 text-[10px] font-black uppercase tracking-[0.16em] text-cyan-100">
            Validar estrutura
          </span>
        ),
        label: "Validar estrutura",
        description: "Confere se a bancada montou uma molecula aceita antes de seguir.",
      },
    ],
  },
  {
    title: "Seguir a prova",
    body: "Se a estrutura for aceita, voce segue para escolher a carta ou justificar a resposta, dependendo da fase. Se travar em conceitos basicos de organica, a Biblioteca Pedagogica fica aberta desde o inicio para consulta livre.",
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
          {isLastStep ? (
            <div className="mt-5 rounded-[20px] border border-cyan-300/20 bg-cyan-400/10 px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-100">
                Apoio extra
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-100">
                Se voce ficar com duvida sobre cadeias, nomenclatura ou funcoes organicas,
                pode consultar os livros da Biblioteca antes de continuar.
              </p>
              <div className="mt-4">
                <Link
                  href="/library"
                  onClick={onClose}
                  className="ritual-link inline-flex px-4 py-2 text-sm"
                >
                  Abrir biblioteca
                </Link>
              </div>
            </div>
          ) : null}
          {step.controls?.length ? (
            <div className="mt-5 grid gap-3">
              {step.controls.map((control) => (
                <div
                  key={control.label}
                  className="flex items-start gap-3 rounded-[20px] border border-white/10 bg-white/5 px-4 py-3"
                >
                  <div className="shrink-0">{control.icon}</div>
                  <div>
                    <p className="text-sm font-black text-white">{control.label}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-300">
                      {control.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
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
