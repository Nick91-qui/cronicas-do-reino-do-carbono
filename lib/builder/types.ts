import type { BondType, MoleculeId, PhaseId } from "@/lib/content/types";

/**
 * Formatos antigos mantidos apenas por compatibilidade com versões anteriores
 * do builder. A UI atual da mesa de forja usa GraphBuilderState.
 */
export type BuilderBlueprintId =
  | "tetra_single"
  | "trigonal_double"
  | "linear_triple"
  | "linear_two_doubles"
  | "aromatic_ring";

export type BuilderElement = "H" | "C" | "O";

export type BuilderSlotBondOrder = 1 | 2 | 3;

export type BuilderSlotDefinition = {
  slotId: string;
  bondOrder: BuilderSlotBondOrder;
};

export type BuilderFilledSlot = {
  slotId: string;
  element: BuilderElement | null;
};

/** @deprecated Formato legado. Não deve ser usado pela UI atual da forja. */
export type BlueprintBuilderState = {
  blueprintId: BuilderBlueprintId;
  slots: BuilderFilledSlot[];
};

/** @deprecated Formato legado. Não deve ser usado pela UI atual da forja. */
export type LegacyBuilderState = {
  carbonCount: number;
  bondType: BondType;
};

export type BuilderLayout = "open_chain" | "closed_ring";

export type GraphBuilderBondOrder = 1 | 2;

export type GraphBuilderBond = {
  from: number;
  to: number;
  order: GraphBuilderBondOrder;
};

export type GraphBuilderState = {
  layout: BuilderLayout;
  carbonCount: number;
  bonds: GraphBuilderBond[];
};

/** Formato canônico do builder usado pela UI atual do MVP. */
export type CanonicalBuilderState = GraphBuilderState;

/**
 * União compatível aceita por validadores e rotas para não quebrar payloads
 * históricos. Novos fluxos devem usar GraphBuilderState.
 */
export type BuilderState =
  | GraphBuilderState
  | LegacyBuilderState
  | BlueprintBuilderState;

export type BuilderSignatureEntry = {
  bondOrder: BuilderSlotBondOrder;
  element: BuilderElement;
  count: number;
};

export type BuilderDerivedStructure = {
  blueprintId?: BuilderBlueprintId;
  layout?: BuilderLayout;
  carbonCount: number;
  hydrogenCount: number;
  oxygenCount?: number;
  bondType: BondType;
  formulaMolecular: string;
  formulaEstrutural: string;
  signature?: BuilderSignatureEntry[];
  bonds?: GraphBuilderBond[];
  hydrogensByCarbon?: number[];
};

export type BuilderValidationResult = {
  phaseId: PhaseId;
  structuralValid: boolean;
  canCreateMolecule: boolean;
  resolvedMoleculeId: MoleculeId | null;
  errors: string[];
  derivedStructure: BuilderDerivedStructure | null;
};
