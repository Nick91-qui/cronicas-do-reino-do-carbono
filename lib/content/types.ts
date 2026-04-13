export type ChapterId = "chapter-1";

export type PhaseType = "construction" | "choice" | "construction_choice";

export type QualitativeResult = "excellent" | "adequate" | "inadequate";

export type ValidationResult = "correct" | "incorrect";

export type ChemicalClass = "alcano" | "alceno" | "aromatico";

export type BondType = "single" | "double" | "aromatic";

export type SelectableProperty =
  | "saturada"
  | "insaturada"
  | "aromatica"
  | "aberta"
  | "fechada"
  | "homogenea"
  | "normal"
  | "baixa_polaridade"
  | "alta_volatilidade"
  | "alto_potencial_energetico"
  | "alta_reatividade"
  | "util_como_combustivel"
  | "util_como_precursor_de_transformacao"
  | "util_para_polimeros"
  | "estabilidade_especial"
  | "adequada_para_meio_apolar"
  | "cadeia_curta";

export type MoleculeAttributes = {
  polaridade: 1 | 2 | 3 | 4 | 5;
  potencialEnergetico: 1 | 2 | 3 | 4 | 5;
  reatividade: 1 | 2 | 3 | 4 | 5;
  estabilidade: 1 | 2 | 3 | 4 | 5;
  caraterAcidoBasico: 1 | 2 | 3 | 4 | 5;
  interacaoBiologica: 1 | 2 | 3 | 4 | 5;
  volatilidade: 1 | 2 | 3 | 4 | 5;
};

export type Molecule = {
  id: string;
  nomeQuimico: string;
  nomeEpico: string;
  formulaMolecular: string;
  formulaEstrutural: string;
  classe: ChemicalClass;
  carbonos: number;
  tipoDeLigacao: BondType;
  atributos: MoleculeAttributes;
  propriedades: SelectableProperty[];
  descricaoCurta: string;
  pontosFortes: string[];
  limitacoes: string[];
};

export type PhaseResources = {
  carbonAvailable: number;
  hydrogenMode: "implicit_infinite";
  availableFragments: string[];
  supportCards: string[];
};

export type Reward = {
  carbon?: number;
  fragments?: string[];
  unlockedMolecule?: string;
  unlockedTitle?: string;
};

export type PhaseFeedback = {
  excellent: string;
  adequate?: string;
  inadequate: string;
};

export type Phase = {
  id: string;
  chapterId: ChapterId;
  number: number;
  title: string;
  coreConcept: string;
  technicalType: PhaseType;
  displayType: string;
  narrative: string;
  objective: string;
  resources: PhaseResources;
  availableMolecules: string[];
  excellentAnswer: string;
  adequateAnswers: string[];
  expectedProperties: SelectableProperty[];
  pedagogicalNotes: string[];
  rewards: Reward;
  feedback: PhaseFeedback;
  score: {
    excellent: 3;
    adequate: 2;
    inadequate: 0;
  };
};

export type PhaseSubmission = {
  phaseId: string;
  selectedMoleculeId: string;
  selectedProperties: SelectableProperty[];
};

export type PhaseResult = {
  qualitativeResult: QualitativeResult;
  validationResult: ValidationResult;
  scoreAwarded: 0 | 2 | 3;
};

export type PlayerInventory = {
  carbonAvailable: number;
  hydrogenMode: "implicit_infinite";
  unlockedFragments: string[];
  unlockedMolecules: string[];
  unlockedTitles: string[];
};
