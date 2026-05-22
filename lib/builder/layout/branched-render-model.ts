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

function getCandidateDirections(): Point[] {
  return [0, 60, 120, 180, 240, 300].map((degrees) => ({
    x: Math.cos(toRadians(degrees)),
    y: Math.sin(toRadians(degrees)),
  }));
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

  const candidates = getCandidateDirections();
  const selected: Point[] = [];

  for (let index = 0; index < hydrogenCount; index += 1) {
    let bestCandidate = candidates[0];
    let bestScore = Number.NEGATIVE_INFINITY;

    for (const candidate of candidates) {
      const occupied = [...neighbourDirections, ...selected];
      const score = occupied.length
        ? Math.min(
            ...occupied.map(
              (direction) => -(candidate.x * direction.x + candidate.y * direction.y),
            ),
          )
        : 1;

      if (score > bestScore) {
        bestScore = score;
        bestCandidate = candidate;
      }
    }

    selected.push(bestCandidate);
  }

  return selected;
}

export function createBranchedRenderModel(
  state: BranchedBuilderState,
): BranchedRenderModel {
  const layout = layoutBranchedStateWithEngine(state);
  const coordsMap = getCoordsMap(layout.atomCoords);
  const hydrogenProjection = createExplicitHydrogenProjection(state);
  const hydrogenBondLength = 42;

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
        x: coordsMap[atom.id].x + direction.x * hydrogenBondLength,
        y: coordsMap[atom.id].y + direction.y * hydrogenBondLength,
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
