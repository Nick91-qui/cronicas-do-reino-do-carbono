import type { BondType, MoleculeId, PhaseId } from "@/lib/content/types";

export type BuilderState = {
  carbonCount: number;
  bondType: BondType;
};

export type BuilderDerivedStructure = {
  carbonCount: number;
  hydrogenCount: number;
  bondType: BondType;
  formulaMolecular: string;
  formulaEstrutural: string;
};

export type BuilderValidationResult = {
  phaseId: PhaseId;
  structuralValid: boolean;
  canCreateMolecule: boolean;
  resolvedMoleculeId: MoleculeId | null;
  errors: string[];
  derivedStructure: BuilderDerivedStructure | null;
};
