import {
  BRANCHED_BUILDER_KIND,
  BRANCHED_CARBON_VALENCE,
  type BranchedAtomId,
  type BranchedBuilderBond,
  type BranchedBuilderBondOrder,
  type BranchedBuilderState,
} from "@/lib/builder/state/branched-types";

function createAtomId(index: number): BranchedAtomId {
  return `a${index}`;
}

function createBondId(index: number): `b${number}` {
  return `b${index}`;
}

export function createBranchedBuilderState(): BranchedBuilderState {
  return {
    kind: BRANCHED_BUILDER_KIND,
    atoms: [{ id: "a1", element: "C" }],
    bonds: [],
    selectedAtomId: "a1",
    nextAtomIndex: 2,
    nextBondIndex: 1,
  };
}

export function getBondOrderSumForAtom(
  state: BranchedBuilderState,
  atomId: BranchedAtomId,
): number {
  return state.bonds.reduce((sum, bond) => {
    if (bond.from !== atomId && bond.to !== atomId) {
      return sum;
    }

    return sum + bond.order;
  }, 0);
}

export function canAtomAcceptAdditionalBondOrder(
  state: BranchedBuilderState,
  atomId: BranchedAtomId,
  bondOrder: BranchedBuilderBondOrder = 1,
): boolean {
  return getBondOrderSumForAtom(state, atomId) + bondOrder <= BRANCHED_CARBON_VALENCE;
}

export function findBondBetweenAtoms(
  state: BranchedBuilderState,
  firstAtomId: BranchedAtomId,
  secondAtomId: BranchedAtomId,
): BranchedBuilderBond | null {
  return (
    state.bonds.find((bond) => {
      const sameDirection = bond.from === firstAtomId && bond.to === secondAtomId;
      const oppositeDirection = bond.from === secondAtomId && bond.to === firstAtomId;

      return sameDirection || oppositeDirection;
    }) ?? null
  );
}

export function addCarbonToAtom(
  state: BranchedBuilderState,
  parentAtomId: BranchedAtomId,
): BranchedBuilderState {
  if (!canAtomAcceptAdditionalBondOrder(state, parentAtomId, 1)) {
    return state;
  }

  const atomId = createAtomId(state.nextAtomIndex);
  const bondId = createBondId(state.nextBondIndex);

  return {
    ...state,
    atoms: [...state.atoms, { id: atomId, element: "C" }],
    bonds: [...state.bonds, { id: bondId, from: parentAtomId, to: atomId, order: 1 }],
    selectedAtomId: atomId,
    nextAtomIndex: state.nextAtomIndex + 1,
    nextBondIndex: state.nextBondIndex + 1,
  };
}

export function removeTerminalAtom(
  state: BranchedBuilderState,
  atomId: BranchedAtomId,
): BranchedBuilderState {
  const connectedBonds = state.bonds.filter(
    (bond) => bond.from === atomId || bond.to === atomId,
  );

  if (connectedBonds.length !== 1) {
    return state;
  }

  if (state.atoms.length === 1) {
    return state;
  }

  const [bondToRemove] = connectedBonds;
  const fallbackSelectedAtomId =
    bondToRemove.from === atomId ? bondToRemove.to : bondToRemove.from;

  return {
    ...state,
    atoms: state.atoms.filter((atom) => atom.id !== atomId),
    bonds: state.bonds.filter((bond) => bond.id !== bondToRemove.id),
    selectedAtomId:
      state.selectedAtomId === atomId ? fallbackSelectedAtomId : state.selectedAtomId,
  };
}

export function cycleBondOrder(
  state: BranchedBuilderState,
  bondId: BranchedBuilderBond["id"],
): BranchedBuilderState {
  const bond = state.bonds.find((candidate) => candidate.id === bondId);
  if (!bond) {
    return state;
  }

  const nextOrder = bond.order === 3 ? 1 : ((bond.order + 1) as BranchedBuilderBondOrder);
  const currentContribution = bond.order;

  const fromWithoutCurrentBond =
    getBondOrderSumForAtom(state, bond.from) - currentContribution + nextOrder;
  const toWithoutCurrentBond =
    getBondOrderSumForAtom(state, bond.to) - currentContribution + nextOrder;

  if (
    fromWithoutCurrentBond > BRANCHED_CARBON_VALENCE ||
    toWithoutCurrentBond > BRANCHED_CARBON_VALENCE
  ) {
    return state;
  }

  return {
    ...state,
    bonds: state.bonds.map((candidate) =>
      candidate.id === bondId ? { ...candidate, order: nextOrder } : candidate,
    ),
  };
}
