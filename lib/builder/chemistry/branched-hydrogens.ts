import { getAtomAvailableValence } from "@/lib/builder/chemistry/branched-valence";
import type { BranchedAtomId, BranchedBuilderState } from "@/lib/builder/state/branched-types";

export type ExplicitHydrogenAtomId = `h-${string}`;
export type ExplicitHydrogenBondId = `hb-${string}`;

export type ExplicitHydrogenAtom = {
  id: ExplicitHydrogenAtomId;
  parentAtomId: BranchedAtomId;
  label: "H";
  indexWithinParent: number;
};

export type ExplicitHydrogenBond = {
  id: ExplicitHydrogenBondId;
  atomId: ExplicitHydrogenAtomId;
  parentAtomId: BranchedAtomId;
};

export function getHydrogenCountForAtom(
  state: BranchedBuilderState,
  atomId: BranchedAtomId,
): number {
  return Math.max(0, getAtomAvailableValence(state, atomId));
}

export function getHydrogensByAtom(
  state: BranchedBuilderState,
): Record<BranchedAtomId, number> {
  return state.atoms.reduce<Record<BranchedAtomId, number>>((acc, atom) => {
    acc[atom.id] = getHydrogenCountForAtom(state, atom.id);
    return acc;
  }, {} as Record<BranchedAtomId, number>);
}

export function getTotalHydrogenCount(state: BranchedBuilderState): number {
  return state.atoms.reduce((sum, atom) => sum + getHydrogenCountForAtom(state, atom.id), 0);
}

export function createExplicitHydrogenProjection(state: BranchedBuilderState): {
  atoms: ExplicitHydrogenAtom[];
  bonds: ExplicitHydrogenBond[];
} {
  const atoms: ExplicitHydrogenAtom[] = [];
  const bonds: ExplicitHydrogenBond[] = [];

  for (const atom of state.atoms) {
    const hydrogenCount = getHydrogenCountForAtom(state, atom.id);
    for (let index = 0; index < hydrogenCount; index += 1) {
      const hydrogenId = `h-${atom.id}-${index + 1}` as ExplicitHydrogenAtomId;
      atoms.push({
        id: hydrogenId,
        parentAtomId: atom.id,
        label: "H",
        indexWithinParent: index,
      });
      bonds.push({
        id: `hb-${atom.id}-${index + 1}` as ExplicitHydrogenBondId,
        atomId: hydrogenId,
        parentAtomId: atom.id,
      });
    }
  }

  return { atoms, bonds };
}
