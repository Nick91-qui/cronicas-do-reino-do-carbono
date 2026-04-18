import type {
  BuilderLayout,
  GraphBuilderBondOrder,
  GraphBuilderState,
} from "@/lib/builder/types";
import type { BondType, Phase } from "@/lib/content/types";

type RingPoint = {
  angle: number;
  x: number;
  y: number;
};

type RingBondSegment = {
  index: number;
  order: GraphBuilderBondOrder;
  line1: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };
  line2: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  } | null;
};

type OpenChainPoint = {
  x: number;
  y: number;
};

type OpenChainBondSegment = {
  index: number;
  order: GraphBuilderBondOrder;
  line1: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };
  line2: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  } | null;
};

export function formatCarbonGroup(hydrogenCount: number): string {
  if (hydrogenCount <= 0) return "C";
  if (hydrogenCount === 1) return "CH";
  return `CH${hydrogenCount}`;
}

export function getBondSlotCount(
  layout: BuilderLayout,
  carbonCount: number,
): number {
  return layout === "closed_ring"
    ? Math.max(0, carbonCount)
    : Math.max(0, carbonCount - 1);
}

export function normalizeBondOrders(
  currentOrders: GraphBuilderBondOrder[],
  layout: BuilderLayout,
  carbonCount: number,
): GraphBuilderBondOrder[] {
  const nextCount = getBondSlotCount(layout, carbonCount);

  return Array.from(
    { length: nextCount },
    (_, index) => currentOrders[index] ?? 1,
  );
}

export function getBuilderBondType(
  layout: BuilderLayout,
  carbonCount: number,
  bondOrders: GraphBuilderBondOrder[],
): BondType {
  if (
    layout === "closed_ring"
    && carbonCount === 6
    && bondOrders.length === 6
    && (
      bondOrders.every((order, index) => order === (index % 2 === 0 ? 2 : 1))
      || bondOrders.every((order, index) => order === (index % 2 === 0 ? 1 : 2))
    )
  ) {
    return "aromatic";
  }

  return bondOrders.some((order) => order === 2) ? "double" : "single";
}

export function normalizeBondKey(from: number, to: number): string {
  return from < to ? `${from}:${to}` : `${to}:${from}`;
}

export function buildGraphBuilderState(
  layout: BuilderLayout,
  carbonCount: number,
  bondOrders: GraphBuilderBondOrder[],
): GraphBuilderState {
  return {
    layout,
    carbonCount,
    bonds: bondOrders.map((order, index) => ({
      from: index,
      to: layout === "closed_ring" ? (index + 1) % carbonCount : index + 1,
      order,
    })),
  };
}

export function getExpectedGraphBonds(
  builderState: GraphBuilderState,
): GraphBuilderState["bonds"] {
  if (builderState.layout === "open_chain") {
    return Array.from(
      { length: Math.max(0, builderState.carbonCount - 1) },
      (_, index) => ({
        from: index,
        to: index + 1,
        order: 1 as GraphBuilderBondOrder,
      }),
    );
  }

  return Array.from({ length: builderState.carbonCount }, (_, index) => ({
    from: index,
    to: (index + 1) % builderState.carbonCount,
    order: 1 as GraphBuilderBondOrder,
  }));
}

export function getHydrogensByCarbon(
  layout: BuilderLayout,
  carbonCount: number,
  bondOrders: GraphBuilderBondOrder[],
): number[] {
  const valenceByCarbon = Array.from({ length: carbonCount }, () => 0);

  bondOrders.forEach((order, index) => {
    const from = index;
    const to = layout === "closed_ring" ? (index + 1) % carbonCount : index + 1;

    if (from < carbonCount) {
      valenceByCarbon[from] += order;
    }

    if (to < carbonCount) {
      valenceByCarbon[to] += order;
    }
  });

  return valenceByCarbon.map((valence) => Math.max(0, 4 - valence));
}

export function getGraphHydrogensByCarbon(
  builderState: GraphBuilderState,
): number[] {
  const bondOrders = getExpectedGraphBonds(builderState).map(
    (expectedBond) =>
      builderState.bonds.find(
        (bond) =>
          normalizeBondKey(bond.from, bond.to)
          === normalizeBondKey(expectedBond.from, expectedBond.to),
      )?.order ?? 0,
  );

  return getHydrogensByCarbon(
    builderState.layout,
    builderState.carbonCount,
    bondOrders,
  );
}

export function isAlternatingAromaticRing(
  builderState: GraphBuilderState,
): boolean {
  if (builderState.layout !== "closed_ring" || builderState.carbonCount !== 6) {
    return false;
  }

  const orderedBonds = getExpectedGraphBonds(builderState).map(
    (expectedBond) =>
      builderState.bonds.find(
        (bond) =>
          normalizeBondKey(bond.from, bond.to)
          === normalizeBondKey(expectedBond.from, expectedBond.to),
      )?.order ?? 0,
  );

  const patternA = [2, 1, 2, 1, 2, 1];
  const patternB = [1, 2, 1, 2, 1, 2];

  return orderedBonds.every((order, index) => order === patternA[index])
    || orderedBonds.every((order, index) => order === patternB[index]);
}

export function getGraphBondType(builderState: GraphBuilderState): BondType {
  if (isAlternatingAromaticRing(builderState)) {
    return "aromatic";
  }

  return builderState.bonds.some((bond) => bond.order === 2)
    ? "double"
    : "single";
}

export function getGraphFormulaEstrutural(
  builderState: GraphBuilderState,
  hydrogensByCarbon: number[],
): string {
  const orderedBonds = getExpectedGraphBonds(builderState).map(
    (expectedBond) =>
      builderState.bonds.find(
        (bond) =>
          normalizeBondKey(bond.from, bond.to)
          === normalizeBondKey(expectedBond.from, expectedBond.to),
      )?.order ?? 1,
  );

  return getPreviewFormulaEstrutural(
    builderState.layout,
    hydrogensByCarbon,
    orderedBonds,
    getGraphBondType(builderState),
  );
}

export function getPreviewFormulaEstrutural(
  layout: BuilderLayout,
  hydrogensByCarbon: number[],
  bondOrders: GraphBuilderBondOrder[],
  bondType: BondType,
): string {
  if (layout === "closed_ring" && bondType === "aromatic") {
    return "anel(CH=CH)3";
  }

  const groups = hydrogensByCarbon.map((hydrogenCount) =>
    formatCarbonGroup(hydrogenCount),
  );

  if (layout === "closed_ring") {
    return `ciclo(${groups.join("-")})`;
  }

  return groups
    .map((group, index) => {
      if (index === groups.length - 1) {
        return group;
      }

      return `${group}${bondOrders[index] === 2 ? "=" : "-"}`;
    })
    .join("");
}

export function getPreviewFormulaMolecular(
  carbonCount: number,
  hydrogensByCarbon: number[],
): string {
  return `C${carbonCount}H${hydrogensByCarbon.reduce(
    (sum, value) => sum + value,
    0,
  )}`;
}

export function getClosedRingCarbonLimit(phase: Phase): number {
  return Math.min(9, phase.resources.carbonAvailable);
}

export function getRingGeometry(carbonCount: number): {
  stageWidth: number;
  stageHeight: number;
  centerX: number;
  centerY: number;
  ringRadius: number;
  carbonRadius: number;
  points: RingPoint[];
} {
  const stageWidth = 340;
  const stageHeight = 280;
  const centerX = stageWidth / 2;
  const centerYOffset =
    carbonCount === 3 ? 8
      : carbonCount === 4 ? 4
      : carbonCount >= 7 ? -4
      : 0;
  const centerY = stageHeight / 2 + centerYOffset;
  const ringRadius =
    carbonCount === 3 ? 72
      : carbonCount === 4 ? 78
      : carbonCount === 5 ? 82
      : carbonCount === 6 ? 84
      : carbonCount === 7 ? 88
      : carbonCount === 8 ? 92
      : 96;
  const carbonRadius = 24;
  const points = Array.from({ length: carbonCount }, (_, index) => {
    const angle = ((Math.PI * 2) / carbonCount) * index - Math.PI / 2;

    return {
      angle,
      x: centerX + Math.cos(angle) * ringRadius,
      y: centerY + Math.sin(angle) * ringRadius,
    };
  });

  return {
    stageWidth,
    stageHeight,
    centerX,
    centerY,
    ringRadius,
    carbonRadius,
    points,
  };
}

export function getRingBondSegments(
  points: RingPoint[],
  carbonRadius: number,
  bondOrders: GraphBuilderBondOrder[],
): RingBondSegment[] {
  return bondOrders.map((order, index) => {
    const start = points[index];
    const end = points[(index + 1) % points.length];
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.hypot(dx, dy) || 1;
    const normalX = -dy / length;
    const normalY = dx / length;
    const offset = 4.5;
    const trim = carbonRadius - 2;
    const trimX = (dx / length) * trim;
    const trimY = (dy / length) * trim;

    const line1 = {
      x1: start.x + trimX + (order === 2 ? normalX * offset : 0),
      y1: start.y + trimY + (order === 2 ? normalY * offset : 0),
      x2: end.x - trimX + (order === 2 ? normalX * offset : 0),
      y2: end.y - trimY + (order === 2 ? normalY * offset : 0),
    };

    return {
      index,
      order,
      line1,
      line2: order === 2
        ? {
            x1: start.x + trimX - normalX * offset,
            y1: start.y + trimY - normalY * offset,
            x2: end.x - trimX - normalX * offset,
            y2: end.y - trimY - normalY * offset,
          }
        : null,
    };
  });
}

export function getOpenChainGeometry(
  carbonCount: number,
  bondOrders: GraphBuilderBondOrder[],
): {
  stageWidth: number;
  stageHeight: number;
  carbonRadius: number;
  points: OpenChainPoint[];
} {
  const carbonRadius = 24;
  const startX = 60;
  const stepX = 88;
  const stageHeight = 240;
  const baseY = 118;
  const zigzagOffset = 42;
  const points: OpenChainPoint[] = [{ x: startX, y: baseY + zigzagOffset }];
  let nextDirection: -1 | 1 = -1;

  for (let index = 1; index < carbonCount; index += 1) {
    const previousPoint = points[index - 1];
    const previousOrder = bondOrders[index - 1] ?? 1;
    const nextY =
      previousOrder === 2
        ? previousPoint.y
        : baseY + zigzagOffset * nextDirection;

    points.push({
      x: startX + stepX * index,
      y: nextY,
    });

    if (previousOrder === 1) {
      nextDirection = nextDirection === 1 ? -1 : 1;
    }
  }

  return {
    stageWidth: Math.max(320, startX * 2 + stepX * Math.max(0, carbonCount - 1)),
    stageHeight,
    carbonRadius,
    points,
  };
}

export function getOpenChainBondSegments(
  points: OpenChainPoint[],
  carbonRadius: number,
  bondOrders: GraphBuilderBondOrder[],
): OpenChainBondSegment[] {
  return bondOrders.map((order, index) => {
    const start = points[index];
    const end = points[index + 1];
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.hypot(dx, dy) || 1;
    const normalX = -dy / length;
    const normalY = dx / length;
    const offset = 4.5;
    const trim = carbonRadius - 2;
    const trimX = (dx / length) * trim;
    const trimY = (dy / length) * trim;

    const line1 = {
      x1: start.x + trimX + (order === 2 ? normalX * offset : 0),
      y1: start.y + trimY + (order === 2 ? normalY * offset : 0),
      x2: end.x - trimX + (order === 2 ? normalX * offset : 0),
      y2: end.y - trimY + (order === 2 ? normalY * offset : 0),
    };

    return {
      index,
      order,
      line1,
      line2: order === 2
        ? {
            x1: start.x + trimX - normalX * offset,
            y1: start.y + trimY - normalY * offset,
            x2: end.x - trimX - normalX * offset,
            y2: end.y - trimY - normalY * offset,
          }
        : null,
    };
  });
}
