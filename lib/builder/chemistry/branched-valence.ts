import { BRANCHED_CARBON_VALENCE } from "@/lib/builder/state/branched-types";
import { getBondsForAtom, getNeighbourAtomIds } from "@/lib/builder/state/branched-selectors";
import type { BranchedAtomId, BranchedBuilderState } from "@/lib/builder/state/branched-types";

export function getAtomBondOrderSum(
  state: BranchedBuilderState,
  atomId: BranchedAtomId,
): number {
  return getBondsForAtom(state, atomId).reduce((sum, bond) => sum + bond.order, 0);
}

export function getAtomAvailableValence(
  state: BranchedBuilderState,
  atomId: BranchedAtomId,
): number {
  return BRANCHED_CARBON_VALENCE - getAtomBondOrderSum(state, atomId);
}

export function hasValidCarbonValence(state: BranchedBuilderState): boolean {
  return state.atoms.every((atom) => getAtomAvailableValence(state, atom.id) >= 0);
}

export function getCarbonNeighbourCount(
  state: BranchedBuilderState,
  atomId: BranchedAtomId,
): number {
  return getNeighbourAtomIds(state, atomId).length;
}

export function isTerminalCarbon(
  state: BranchedBuilderState,
  atomId: BranchedAtomId,
): boolean {
  return getCarbonNeighbourCount(state, atomId) <= 1;
}

export function getTerminalCarbonIds(state: BranchedBuilderState): BranchedAtomId[] {
  return state.atoms
    .filter((atom) => isTerminalCarbon(state, atom.id))
    .map((atom) => atom.id);
}
