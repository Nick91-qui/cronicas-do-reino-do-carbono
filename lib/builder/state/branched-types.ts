export type BranchedBuilderKind = "branched_v2";

export type BranchedAtomId = `a${number}`;
export type BranchedBondId = `b${number}`;

export type BranchedBuilderAtomElement = "C";
export type BranchedBuilderBondOrder = 1 | 2 | 3;

/**
 * O estado editável do builder ramificado mantém apenas o esqueleto carbônico.
 * Hidrogênios explícitos serão derivados na projeção de render.
 */
export type BranchedBuilderAtom = {
  id: BranchedAtomId;
  element: BranchedBuilderAtomElement;
};

export type BranchedBuilderBond = {
  id: BranchedBondId;
  from: BranchedAtomId;
  to: BranchedAtomId;
  order: BranchedBuilderBondOrder;
};

export type BranchedBuilderState = {
  kind: BranchedBuilderKind;
  atoms: BranchedBuilderAtom[];
  bonds: BranchedBuilderBond[];
  selectedAtomId: BranchedAtomId | null;
  nextAtomIndex: number;
  nextBondIndex: number;
};

export const BRANCHED_BUILDER_KIND: BranchedBuilderKind = "branched_v2";
export const BRANCHED_CARBON_VALENCE = 4;
