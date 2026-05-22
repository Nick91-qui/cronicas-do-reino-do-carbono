import {
  createExplicitHydrogenProjection,
  type ExplicitHydrogenAtomId,
} from "@/lib/builder/chemistry/branched-hydrogens";
import {
  layoutBranchedStateWithEngine,
  type EngineLayoutAtomCoord,
} from "@/lib/builder/chemistry/engine-interop";
import { getNeighbourAtomIds } from "@/lib/builder/state/branched-selectors";
import type {
  BranchedAtomId,
  BranchedBuilderState,
} from "@/lib/builder/state/branched-types";

type Point = {
  x: number;
  y: number;
};

const HYDROGEN_BOND_LENGTH = 50;

export type RenderAtomNode = {
  id: BranchedAtomId | ExplicitHydrogenAtomId;
  label: "C" | "H";
  x: number;
  y: number;
  parentAtomId?: BranchedAtomId;
};

export type RenderBondEdge = {
  id: string;
  from: BranchedAtomId | ExplicitHydrogenAtomId;
  to: BranchedAtomId | ExplicitHydrogenAtomId;
  order: 1 | 2 | 3;
  kind: "carbon" | "hydrogen";
};

export type BranchedRenderModel = {
  atoms: RenderAtomNode[];
  bonds: RenderBondEdge[];
};

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function normalizeVector(point: Point): Point {
  const length = Math.hypot(point.x, point.y) || 1;
  return { x: point.x / length, y: point.y / length };
}

function rotateVector(vector: Point, degrees: number): Point {
  const radians = toRadians(degrees);
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);

  return normalizeVector({
    x: vector.x * cos - vector.y * sin,
    y: vector.x * sin + vector.y * cos,
  });
}

function invertVector(vector: Point): Point {
  return { x: -vector.x, y: -vector.y };
}

function sumVectors(vectors: Point[]): Point {
  return vectors.reduce(
    (acc, vector) => ({ x: acc.x + vector.x, y: acc.y + vector.y }),
    { x: 0, y: 0 },
  );
}

function getFallbackDirections(count: number): Point[] {
  if (count === 4) {
    return [45, 135, 225, 315].map((degrees) => ({
      x: Math.cos(toRadians(degrees)),
      y: Math.sin(toRadians(degrees)),
    }));
  }

  return Array.from({ length: count }, (_, index) => {
    const angle = -90 + (360 / count) * index;
    return {
      x: Math.cos(toRadians(angle)),
      y: Math.sin(toRadians(angle)),
    };
  });
}

function getPerpendicular(vector: Point): Point {
  return normalizeVector({ x: -vector.y, y: vector.x });
}

function getBestOppositeDirection(neighbourDirections: Point[]): Point {
  if (neighbourDirections.length === 0) {
    return { x: 0, y: -1 };
  }

  const summed = sumVectors(neighbourDirections);
  if (Math.hypot(summed.x, summed.y) > 0.001) {
    return invertVector(normalizeVector(summed));
  }

  return getPerpendicular(neighbourDirections[0]);
}

function getCoordsMap(coords: EngineLayoutAtomCoord[]): Record<BranchedAtomId, Point> {
  return coords.reduce<Record<BranchedAtomId, Point>>((acc, coord) => {
    acc[coord.atomId] = { x: coord.x, y: coord.y };
    return acc;
  }, {} as Record<BranchedAtomId, Point>);
}

function getHydrogenDirections(
  state: BranchedBuilderState,
  atomId: BranchedAtomId,
  hydrogenCount: number,
  coordsMap: Record<BranchedAtomId, Point>,
): Point[] {
  const origin = coordsMap[atomId];
  const neighbourDirections = getNeighbourAtomIds(state, atomId)
    .map((neighbourId) => coordsMap[neighbourId])
    .filter((point): point is Point => Boolean(point))
    .map((point) => normalizeVector({ x: point.x - origin.x, y: point.y - origin.y }));

  if (hydrogenCount === 0) {
    return [];
  }

  if (neighbourDirections.length === 0) {
    return getFallbackDirections(hydrogenCount);
  }

  const away = getBestOppositeDirection(neighbourDirections);

  if (neighbourDirections.length === 1) {
    if (hydrogenCount === 1) {
      return [away];
    }

    if (hydrogenCount === 2) {
      return [rotateVector(away, 34), rotateVector(away, -34)];
    }

    return [away, rotateVector(away, 118), rotateVector(away, -118)];
  }

  if (neighbourDirections.length === 2) {
    if (hydrogenCount === 1) {
      return [away];
    }

    return [rotateVector(away, 32), rotateVector(away, -32)];
  }

  return [away];
}

export function createBranchedRenderModel(
  state: BranchedBuilderState,
): BranchedRenderModel {
  const layout = layoutBranchedStateWithEngine(state);
  const coordsMap = getCoordsMap(layout.atomCoords);
  const hydrogenProjection = createExplicitHydrogenProjection(state);

  const atoms: RenderAtomNode[] = state.atoms.map((atom) => ({
    id: atom.id,
    label: "C",
    x: coordsMap[atom.id]?.x ?? 0,
    y: coordsMap[atom.id]?.y ?? 0,
  }));

  for (const atom of state.atoms) {
    const hydrogenAtoms = hydrogenProjection.atoms.filter(
      (hydrogen) => hydrogen.parentAtomId === atom.id,
    );
    const directions = getHydrogenDirections(
      state,
      atom.id,
      hydrogenAtoms.length,
      coordsMap,
    );

    hydrogenAtoms.forEach((hydrogen, index) => {
      const direction = directions[index] ?? { x: 0, y: -1 };
      atoms.push({
        id: hydrogen.id,
        label: "H",
        parentAtomId: atom.id,
        x: coordsMap[atom.id].x + direction.x * HYDROGEN_BOND_LENGTH,
        y: coordsMap[atom.id].y + direction.y * HYDROGEN_BOND_LENGTH,
      });
    });
  }

  const bonds: RenderBondEdge[] = [
    ...state.bonds.map((bond) => ({
      id: bond.id,
      from: bond.from,
      to: bond.to,
      order: bond.order,
      kind: "carbon" as const,
    })),
    ...hydrogenProjection.bonds.map((bond) => ({
      id: bond.id,
      from: bond.parentAtomId,
      to: bond.atomId,
      order: 1 as const,
      kind: "hydrogen" as const,
    })),
  ];

  return { atoms, bonds };
}
