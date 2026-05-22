import { getHydrogenCountForAtom } from "@/lib/builder/chemistry/branched-hydrogens";
import { getAtomBondOrderSum } from "@/lib/builder/chemistry/branched-valence";
import { getNeighbourAtomIds } from "@/lib/builder/state/branched-selectors";
import type { BranchedAtomId, BranchedBuilderState } from "@/lib/builder/state/branched-types";

function buildAtomEnvironmentSignature(
  state: BranchedBuilderState,
  atomId: BranchedAtomId,
): string {
  const neighbours = getNeighbourAtomIds(state, atomId)
    .map((neighbourId) => getAtomBondOrderSum(state, neighbourId))
    .sort((left, right) => left - right);

  return `${getAtomBondOrderSum(state, atomId)}h${getHydrogenCountForAtom(
    state,
    atomId,
  )}:[${neighbours.join(",")}]`;
}

export function getBranchedFormula(state: BranchedBuilderState): string {
  const carbonCount = state.atoms.length;
  const hydrogenCount = state.atoms.reduce((sum, atom) => {
    return sum + getHydrogenCountForAtom(state, atom.id);
  }, 0);

  return `C${carbonCount}H${hydrogenCount}`;
}

export function getLocalTopologySignature(state: BranchedBuilderState): string {
  const atomEnvironments = state.atoms
    .map((atom) => buildAtomEnvironmentSignature(state, atom.id))
    .sort();

  const bondOrders = state.bonds
    .map((bond) => bond.order)
    .sort((left, right) => left - right);

  return `${getBranchedFormula(state)}|atoms:${atomEnvironments.join(";")}|bonds:${bondOrders.join(",")}`;
}
