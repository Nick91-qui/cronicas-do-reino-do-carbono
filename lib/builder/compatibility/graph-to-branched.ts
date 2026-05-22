import type { GraphBuilderState } from "@/lib/builder/types";
import type { BranchedBuilderState } from "@/lib/builder/state/branched-types";

export function convertGraphBuilderStateToBranched(
  state: GraphBuilderState,
): BranchedBuilderState {
  return {
    kind: "branched_v2",
    atoms: Array.from({ length: state.carbonCount }, (_, index) => ({
      id: `a${index}` as const,
      element: "C" as const,
    })),
    bonds: state.bonds.map((bond, index) => ({
      id: `b${index}` as const,
      from: `a${bond.from}` as const,
      to: `a${bond.to}` as const,
      order: bond.order,
    })),
    selectedAtomId: state.carbonCount > 0 ? ("a0" as const) : null,
    nextAtomIndex: state.carbonCount,
    nextBondIndex: state.bonds.length,
  };
}
