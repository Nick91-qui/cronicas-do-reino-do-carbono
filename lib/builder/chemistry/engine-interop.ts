import { Molecule } from "openchemlib";

import type {
  BranchedAtomId,
  BranchedBuilderState,
} from "@/lib/builder/state/branched-types";

export type OpenChemLibMoleculeAdapter = {
  molecule: Molecule;
  atomIndexById: Record<BranchedAtomId, number>;
  atomIdByIndex: BranchedAtomId[];
};

export type EngineLayoutAtomCoord = {
  atomId: BranchedAtomId;
  x: number;
  y: number;
};

export type EngineLayoutResult = {
  atomCoords: EngineLayoutAtomCoord[];
};

const TARGET_BOND_LENGTH = 86;

function normalizeCoords(coords: EngineLayoutAtomCoord[]): EngineLayoutAtomCoord[] {
  if (coords.length === 0) {
    return coords;
  }

  const lengths: number[] = [];
  for (let index = 1; index < coords.length; index += 1) {
    const previous = coords[index - 1];
    const current = coords[index];
    const distance = Math.hypot(current.x - previous.x, current.y - previous.y);
    if (distance > 0) {
      lengths.push(distance);
    }
  }

  const minX = Math.min(...coords.map((coord) => coord.x));
  const maxX = Math.max(...coords.map((coord) => coord.x));
  const minY = Math.min(...coords.map((coord) => coord.y));
  const maxY = Math.max(...coords.map((coord) => coord.y));
  const width = maxX - minX || 1;
  const height = maxY - minY || 1;
  const averageBondLength =
    lengths.length > 0
      ? lengths.reduce((sum, value) => sum + value, 0) / lengths.length
      : Math.max(width, height);
  const scale = TARGET_BOND_LENGTH / Math.max(averageBondLength || 1, 1);
  const centerX = minX + width / 2;
  const centerY = minY + height / 2;

  return coords.map((coord) => ({
    atomId: coord.atomId,
    x: (coord.x - centerX) * scale,
    y: (coord.y - centerY) * scale,
  }));
}

export function toOpenChemLibMolecule(
  state: BranchedBuilderState,
): OpenChemLibMoleculeAdapter {
  const molecule = new Molecule(
    Math.max(state.atoms.length, 16),
    Math.max(state.bonds.length * 2, 16),
  );
  const atomIndexById = {} as Record<BranchedAtomId, number>;
  const atomIdByIndex: BranchedAtomId[] = [];

  for (const atom of state.atoms) {
    const atomIndex = molecule.addAtom(6);
    atomIndexById[atom.id] = atomIndex;
    atomIdByIndex[atomIndex] = atom.id;
  }

  for (const bond of state.bonds) {
    const fromIndex = atomIndexById[bond.from];
    const toIndex = atomIndexById[bond.to];
    const bondIndex = molecule.addBond(fromIndex, toIndex);
    molecule.setBondOrder(bondIndex, bond.order);
  }

  return {
    molecule,
    atomIndexById,
    atomIdByIndex,
  };
}

export function layoutBranchedStateWithEngine(
  state: BranchedBuilderState,
): EngineLayoutResult {
  const { molecule, atomIdByIndex } = toOpenChemLibMolecule(state);
  molecule.ensureHelperArrays(Molecule.cHelperNeighbours);
  molecule.inventCoordinates({ seed: 0 });

  const atomCoords = Array.from({ length: molecule.getAllAtoms() }, (_, atomIndex) => ({
    atomId: atomIdByIndex[atomIndex],
    x: molecule.getAtomX(atomIndex),
    y: molecule.getAtomY(atomIndex),
  }));

  return {
    atomCoords: normalizeCoords(atomCoords),
  };
}

export function getCanonicalSignatureFromEngine(state: BranchedBuilderState): string {
  const { molecule } = toOpenChemLibMolecule(state);
  molecule.ensureHelperArrays(Molecule.cHelperNeighbours);
  return molecule.getCanonizedIDCode(0);
}
