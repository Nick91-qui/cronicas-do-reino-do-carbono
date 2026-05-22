import type { BondType, MoleculeId, PhaseId } from "@/lib/content/types";
import type { BranchedBuilderState } from "@/lib/builder/state/branched-types";

export type FutureBuilderState = BranchedBuilderState;
export type BuilderState = BranchedBuilderState;

export type BuilderDerivedStructure = {
  carbonCount: number;
  hydrogenCount: number;
  bondType: BondType;
  formulaMolecular: string;
  formulaEstrutural: string;
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
