import type { BondType, MoleculeId, PhaseId } from "@/lib/content/types";

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

export type BuilderState = GraphBuilderState;

export type BuilderDerivedStructure = {
  layout?: BuilderLayout;
  carbonCount: number;
  hydrogenCount: number;
  bondType: BondType;
  formulaMolecular: string;
  formulaEstrutural: string;
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
