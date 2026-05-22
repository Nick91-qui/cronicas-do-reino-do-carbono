import type {
  BranchedAtomId,
  BranchedBuilderAtom,
  BranchedBuilderBond,
  BranchedBuilderState,
} from "@/lib/builder/state/branched-types";

export function getBranchedAtomById(
  state: BranchedBuilderState,
  atomId: BranchedAtomId,
): BranchedBuilderAtom | null {
  return state.atoms.find((atom) => atom.id === atomId) ?? null;
}

export function getBranchedBondById(
  state: BranchedBuilderState,
  bondId: BranchedBuilderBond["id"],
): BranchedBuilderBond | null {
  return state.bonds.find((bond) => bond.id === bondId) ?? null;
}

export function getBondsForAtom(
  state: BranchedBuilderState,
  atomId: BranchedAtomId,
): BranchedBuilderBond[] {
  return state.bonds.filter((bond) => bond.from === atomId || bond.to === atomId);
}

export function getNeighbourAtomIds(
  state: BranchedBuilderState,
  atomId: BranchedAtomId,
): BranchedAtomId[] {
  return getBondsForAtom(state, atomId).map((bond) =>
    bond.from === atomId ? bond.to : bond.from,
  );
}

export function selectAtom(
  state: BranchedBuilderState,
  atomId: BranchedAtomId | null,
): BranchedBuilderState {
  if (atomId !== null && !getBranchedAtomById(state, atomId)) {
    return state;
  }

  return {
    ...state,
    selectedAtomId: atomId,
  };
}
