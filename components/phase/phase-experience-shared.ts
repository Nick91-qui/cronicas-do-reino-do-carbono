import type { BondType, MoleculeId, SelectableProperty } from "@/lib/content/types";

export type PersistedResponse = {
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

export type PhaseStep = "intro" | "synthesis" | "select" | "read" | "result";

export const fragmentToBondType = {
  ligacao_simples: "single",
  ligacao_dupla: "double",
  estrutura_aromatica: "aromatic",
} as const satisfies Record<string, BondType>;

export const bondTypeLabels: Record<BondType, string> = {
  single: "Ligacao simples",
  double: "Ligacao dupla",
  aromatic: "Estrutura aromatica",
};

export const resultToneClass: Record<PersistedResponse["evaluation"]["qualitativeResult"], string> = {
  excellent: "border-emerald-400/35 bg-emerald-500/12 text-emerald-100",
  adequate: "border-amber-400/35 bg-amber-500/12 text-amber-100",
  inadequate: "border-rose-400/35 bg-rose-500/12 text-rose-100",
};

export const resultTitleByKind: Record<PersistedResponse["evaluation"]["qualitativeResult"], string> = {
  excellent: "Sintese exemplar",
  adequate: "Passagem promissora",
  inadequate: "Sintese instavel",
};

export const stepCopy: Record<
  Exclude<PhaseStep, "result">,
  { eyebrow: string; title: string; description: string }
> = {
  intro: {
    eyebrow: "Prova",
    title: "Prova do rito",
    description:
      "A prova apresenta apenas a narrativa, a missao e o conceito central antes de abrir a acao.",
  },
  synthesis: {
    eyebrow: "Rito da sintese",
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

export function getSceneImageByStep(step: PhaseStep): {
  src: string;
  alt: string;
  ambient: string;
} {
  if (step === "intro") {
    return {
      src: "/visual/protected/camara-cristalizacao.png",
      alt: "Camara ritual do castelo.",
      ambient: "Camara ritual",
    };
  }

  if (step === "result") {
    return {
      src: "/visual/protected/salao-cristalizacao.png",
      alt: "Salao de julgamento do castelo.",
      ambient: "Salao de julgamento",
    };
  }

  return {
    src: "/visual/auth/laboratorio-da-sintese.png",
    alt: "Laboratorio de sintese do castelo.",
    ambient: "Laboratorio de sintese",
  };
}

export function formatSelectableProperty(property: SelectableProperty): string {
  return property.replaceAll("_", " ");
}
