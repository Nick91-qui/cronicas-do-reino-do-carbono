import type {
  BondType,
  MoleculeId,
  SelectableProperty,
} from "@/lib/content/types";
import { blobAssets } from "@/lib/assets/blob";

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

export const resultToneClass: Record<
  PersistedResponse["evaluation"]["qualitativeResult"],
  string
> = {
  excellent: "border-emerald-400/35 bg-emerald-500/12 text-emerald-100",
  adequate: "border-amber-400/35 bg-amber-500/12 text-amber-100",
  inadequate: "border-rose-400/35 bg-rose-500/12 text-rose-100",
};

export const resultTitleByKind: Record<
  PersistedResponse["evaluation"]["qualitativeResult"],
  string
> = {
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
      "Entenda o desafio antes de comecar. Esta etapa apresenta o objetivo e prepara o que voce vai fazer a seguir.",
  },
  synthesis: {
    eyebrow: "Rito da sintese",
    title: "Moldar a estrutura",
    description: "Monte a estrutura na mesa de sintese e valide a molecula antes de avancar.",
  },
  select: {
    eyebrow: "Escolha da carta",
    title: "Definir a carta",
    description: "Escolha a carta que melhor representa a molecula correta para esta prova.",
  },
  read: {
    eyebrow: "Rito da leitura",
    title: "Classificar e sustentar",
    description:
      "Marque as propriedades que justificam sua resposta antes de entregar a prova.",
  },
};

export function getSceneImageByStep(step: PhaseStep): {
  src: string;
  alt: string;
  ambient: string;
} {
  if (step === "intro") {
    return {
      src: blobAssets.protectedCrystalChamber,
      alt: "Camara ritual do castelo.",
      ambient: "Camara ritual",
    };
  }

  if (step === "result") {
    return {
      src: blobAssets.protectedGrandHall,
      alt: "Salao de julgamento do castelo.",
      ambient: "Salao de julgamento",
    };
  }

  return {
    src: blobAssets.authSynthesisLab,
    alt: "Laboratorio de sintese do castelo.",
    ambient: "Laboratorio de sintese",
  };
}

export function formatSelectableProperty(property: SelectableProperty): string {
  return property.replaceAll("_", " ");
}
