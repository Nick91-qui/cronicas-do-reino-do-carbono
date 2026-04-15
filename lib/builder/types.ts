import type { BondType, MoleculeId, PhaseId } from "@/lib/content/types";

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

export type BlueprintBuilderState = {
  blueprintId: BuilderBlueprintId;
  slots: BuilderFilledSlot[];
};

export type LegacyBuilderState = {
  carbonCount: number;
  bondType: BondType;
};

export type BuilderState = BlueprintBuilderState | LegacyBuilderState;

export type BuilderSignatureEntry = {
  bondOrder: BuilderSlotBondOrder;
  element: BuilderElement;
  count: number;
};

export type BuilderDerivedStructure = {
  blueprintId?: BuilderBlueprintId;
  carbonCount: number;
  hydrogenCount: number;
  oxygenCount?: number;
  bondType: BondType;
  formulaMolecular: string;
  formulaEstrutural: string;
  signature?: BuilderSignatureEntry[];
};

export type BuilderValidationResult = {
  phaseId: PhaseId;
  structuralValid: boolean;
  canCreateMolecule: boolean;
  resolvedMoleculeId: MoleculeId | null;
  errors: string[];
  derivedStructure: BuilderDerivedStructure | null;
};
