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

function normalizeCoords(coords: EngineLayoutAtomCoord[]): EngineLayoutAtomCoord[] {
  if (coords.length === 0) {
    return coords;
  }

  const minX = Math.min(...coords.map((coord) => coord.x));
  const maxX = Math.max(...coords.map((coord) => coord.x));
  const minY = Math.min(...coords.map((coord) => coord.y));
  const maxY = Math.max(...coords.map((coord) => coord.y));
  const width = maxX - minX || 1;
  const height = maxY - minY || 1;
  const scale = 100 / Math.max(width, height);
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
