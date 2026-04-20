export type ChapterId = "chapter-1";

export type MoleculeId =
  | "metano"
  | "etano"
  | "propano"
  | "eteno"
  | "propeno"
  | "buteno"
  | "benzeno";

export type FragmentId =
  | "ligacao_simples"
  | "ligacao_dupla"
  | "estrutura_aromatica";

export type PhaseId =
  | "chapter-1-phase-1"
  | "chapter-1-phase-2"
  | "chapter-1-phase-3"
  | "chapter-1-phase-4"
  | "chapter-1-phase-5"
  | "chapter-1-phase-6"
  | "chapter-1-phase-7"
  | "chapter-1-phase-8";

export type PhaseType = "construction" | "choice" | "construction_choice";

export type QualitativeResult = "excellent" | "adequate" | "inadequate";

export type ValidationResult = "correct" | "incorrect";

export type ChemicalClass = "alcano" | "alceno" | "aromatico";

export type BondType = "single" | "double" | "aromatic";

export type MoleculeVisualState =
  | "default"
  | "locked"
  | "unlocked"
  | "newly_created"
  | "selected"
  | "rewarded";

export type MoleculeAttributePalette = "hydrocarbon" | "alkene" | "aromatic";

export type MoleculeVisualAssets = {
  artworkAsset: string;
  artworkFit?: "cover" | "contain";
  artworkPosition?: string;
  artworkScale?: number;
  frameAsset: string;
  textureAsset?: string;
  iconAsset?: string;
};

export type MoleculeCardVisual = {
  assets: MoleculeVisualAssets;
  accentFrom: string;
  accentTo: string;
  attributePalette: MoleculeAttributePalette;
  preferredLayout: "expanded" | "compact";
  stateVariants?: Partial<Record<MoleculeVisualState, {
    frameAsset?: string;
    textureAsset?: string;
    badgeLabel?: string;
  }>>;
};

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
  id: MoleculeId;
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
  visual: MoleculeCardVisual;
};

export type PhaseResources = {
  carbonAvailable: number;
  hydrogenMode: "implicit_infinite";
  availableFragments: FragmentId[];
  supportCards: string[];
};

export type Reward = {
  carbon?: number;
  fragments?: FragmentId[];
  unlockedMolecule?: MoleculeId;
  unlockedTitle?: string;
};

export type PhaseFeedback = {
  excellent: string;
  adequate?: string;
  inadequate: string;
};

export type Phase = {
  id: PhaseId;
  chapterId: ChapterId;
  number: number;
  title: string;
  coreConcept: string;
  technicalType: PhaseType;
  displayType: string;
  narrative: string;
  objective: string;
  resources: PhaseResources;
  availableMolecules: MoleculeId[];
  excellentAnswer: MoleculeId;
  adequateAnswers: MoleculeId[];
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

export type Chapter = {
  id: ChapterId;
  title: string;
  totalPhases: number;
  moleculeIds: MoleculeId[];
  phaseIds: PhaseId[];
};

export type PhaseSubmission = {
  phaseId: PhaseId;
  selectedMoleculeId: MoleculeId;
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
  unlockedFragments: FragmentId[];
  unlockedMolecules: MoleculeId[];
  unlockedTitles: string[];
};
