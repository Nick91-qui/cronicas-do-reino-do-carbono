import type {
  BondType,
  ChemicalClass,
  FragmentId,
  MoleculeId,
  PhaseId,
  PhaseType,
  QualitativeResult,
  SelectableProperty,
  ValidationResult,
} from "@/lib/content/types";

export const CHAPTER_IDS = ["chapter-1"] as const;
export const MOLECULE_IDS = ["metano", "etano", "propano", "eteno", "propeno", "buteno", "benzeno"] as const satisfies readonly MoleculeId[];
export const FRAGMENT_IDS = ["ligacao_simples", "ligacao_dupla", "estrutura_aromatica"] as const satisfies readonly FragmentId[];
export const PHASE_IDS = [
  "chapter-1-phase-1",
  "chapter-1-phase-2",
  "chapter-1-phase-3",
  "chapter-1-phase-4",
  "chapter-1-phase-5",
  "chapter-1-phase-6",
  "chapter-1-phase-7",
  "chapter-1-phase-8",
] as const satisfies readonly PhaseId[];
export const PHASE_TYPES = ["construction", "choice", "construction_choice"] as const satisfies readonly PhaseType[];
export const QUALITATIVE_RESULTS = ["excellent", "adequate", "inadequate"] as const satisfies readonly QualitativeResult[];
export const VALIDATION_RESULTS = ["correct", "incorrect"] as const satisfies readonly ValidationResult[];
export const CHEMICAL_CLASSES = ["alcano", "alceno", "aromatico"] as const satisfies readonly ChemicalClass[];
export const BOND_TYPES = ["single", "double", "aromatic"] as const satisfies readonly BondType[];
export const SELECTABLE_PROPERTIES = [
  "saturada",
  "insaturada",
  "aromatica",
  "aberta",
  "fechada",
  "homogenea",
  "normal",
  "baixa_polaridade",
  "alta_volatilidade",
  "alto_potencial_energetico",
  "alta_reatividade",
  "util_como_combustivel",
  "util_como_precursor_de_transformacao",
  "util_para_polimeros",
  "estabilidade_especial",
  "adequada_para_meio_apolar",
  "cadeia_curta",
] as const satisfies readonly SelectableProperty[];
