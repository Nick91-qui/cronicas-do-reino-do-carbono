import {
  getExpectedGraphBonds,
  getGraphBondType,
  getGraphFormulaEstrutural,
  getGraphHydrogensByCarbon,
  getPreviewFormulaMolecular,
  normalizeBondKey,
} from "@/lib/builder/graph-preview";
import { getCanonicalSignatureFromEngine } from "@/lib/builder/chemistry/engine-interop";
import { getHydrogenCountForAtom, getTotalHydrogenCount } from "@/lib/builder/chemistry/branched-hydrogens";
import { getBranchedFormula } from "@/lib/builder/chemistry/branched-signature";
import { getAtomAvailableValence } from "@/lib/builder/chemistry/branched-valence";
import { isBranchedBuilderState, isGraphBuilderState } from "@/lib/builder/compatibility/builder-union";
import { getMoleculeById, getPhaseById } from "@/lib/content/loaders";
import type { BondType, FragmentId, MoleculeId, PhaseId } from "@/lib/content/types";
import type {
  BuilderDerivedStructure,
  BuilderState,
  BuilderValidationResult,
  CanonicalBuilderState,
  GraphBuilderState,
} from "@/lib/builder/types";
import type { BranchedAtomId, BranchedBuilderState } from "@/lib/builder/state/branched-types";

const officialMoleculeMap: Record<BondType, Partial<Record<number, MoleculeId>>> = {
  single: {
    1: "metano",
    2: "etano",
    3: "propano",
  },
  double: {
    2: "eteno",
    3: "propeno",
    4: "buteno",
  },
  aromatic: {
    6: "benzeno",
  },
};

function createReferenceBranchedState(
  atomCount: number,
  bonds: Array<[number, number, 1 | 2 | 3]>,
): BranchedBuilderState {
  return {
    kind: "branched_v2",
    atoms: Array.from({ length: atomCount }, (_, index) => ({
      id: `a${index}` as BranchedAtomId,
      element: "C" as const,
    })),
    bonds: bonds.map(([from, to, order], index) => ({
      id: `b${index}` as const,
      from: `a${from}` as BranchedAtomId,
      to: `a${to}` as BranchedAtomId,
      order,
    })),
    selectedAtomId: atomCount > 0 ? ("a0" as BranchedAtomId) : null,
    nextAtomIndex: atomCount,
    nextBondIndex: bonds.length,
  };
}

function buildOfficialBranchedSignatureMap(): Map<string, MoleculeId> {
  const signatures = new Map<string, MoleculeId>();
  const entries: Array<[MoleculeId, BranchedBuilderState[]]> = [
    ["metano", [createReferenceBranchedState(1, [])]],
    ["etano", [createReferenceBranchedState(2, [[0, 1, 1]])]],
    ["propano", [createReferenceBranchedState(3, [[0, 1, 1], [1, 2, 1]])]],
    ["eteno", [createReferenceBranchedState(2, [[0, 1, 2]])]],
    ["propeno", [createReferenceBranchedState(3, [[0, 1, 2], [1, 2, 1]])]],
    [
      "buteno",
      [
        createReferenceBranchedState(4, [[0, 1, 2], [1, 2, 1], [2, 3, 1]]),
        createReferenceBranchedState(4, [[0, 1, 1], [1, 2, 2], [2, 3, 1]]),
      ],
    ],
    [
      "benzeno",
      [
        createReferenceBranchedState(6, [
          [0, 1, 2],
          [1, 2, 1],
          [2, 3, 2],
          [3, 4, 1],
          [4, 5, 2],
          [5, 0, 1],
        ]),
      ],
    ],
  ];

  for (const [moleculeId, states] of entries) {
    for (const state of states) {
      signatures.set(getCanonicalSignatureFromEngine(state), moleculeId);
    }
  }

  return signatures;
}

const officialBranchedSignatureMap = buildOfficialBranchedSignatureMap();

function deriveGraphStructure(builderState: GraphBuilderState): BuilderDerivedStructure {
  const hydrogensByCarbon = getGraphHydrogensByCarbon(builderState);
  const hydrogenCount = hydrogensByCarbon.reduce((sum, value) => sum + value, 0);
  const bondType = getGraphBondType(builderState);

  return {
    layout: builderState.layout,
    carbonCount: builderState.carbonCount,
    hydrogenCount,
    hydrogensByCarbon,
    bondType,
    bonds: builderState.bonds,
    formulaMolecular: getPreviewFormulaMolecular(
      builderState.carbonCount,
      hydrogensByCarbon,
    ),
    formulaEstrutural: getGraphFormulaEstrutural(builderState, hydrogensByCarbon),
  };
}

function getBranchedHydrogensByCarbon(builderState: BranchedBuilderState): number[] {
  return builderState.atoms.map((atom) => getHydrogenCountForAtom(builderState, atom.id));
}

function deriveBranchedStructure(
  builderState: BranchedBuilderState,
  resolvedMoleculeId: MoleculeId | null,
): BuilderDerivedStructure {
  const hydrogensByCarbon = getBranchedHydrogensByCarbon(builderState);
  const molecule = resolvedMoleculeId ? getMoleculeById(resolvedMoleculeId) : null;
  const bondType = resolvedMoleculeId === "benzeno"
    ? "aromatic"
    : builderState.bonds.some((bond) => bond.order > 1)
      ? "double"
      : "single";

  return {
    carbonCount: builderState.atoms.length,
    hydrogenCount: getTotalHydrogenCount(builderState),
    hydrogensByCarbon,
    bondType,
    formulaMolecular: molecule?.formulaMolecular ?? getBranchedFormula(builderState),
    formulaEstrutural: molecule?.formulaEstrutural ?? getBranchedFormula(builderState),
  };
}

function validateGraphStructuralRules(builderState: GraphBuilderState, errors: string[]): boolean {
  if (builderState.layout === "open_chain" && builderState.carbonCount < 1) {
    errors.push("Cadeias abertas precisam ter pelo menos 1 carbono.");
  }

  if (builderState.layout === "closed_ring" && builderState.carbonCount < 3) {
    errors.push("Cadeias fechadas precisam ter pelo menos 3 carbonos.");
  }

  const expectedBonds = getExpectedGraphBonds(builderState);
  const expectedBondKeys = new Set(
    expectedBonds.map((bond) => normalizeBondKey(bond.from, bond.to)),
  );
  const receivedBondKeys = new Set<string>();

  for (const bond of builderState.bonds) {
    if (bond.from === bond.to) {
      errors.push("Uma ligação não pode conectar um carbono a ele mesmo.");
      continue;
    }

    if (
      bond.from < 0
      || bond.to < 0
      || bond.from >= builderState.carbonCount
      || bond.to >= builderState.carbonCount
    ) {
      errors.push("A estrutura usa um índice de carbono inválido.");
      continue;
    }

    const bondKey = normalizeBondKey(bond.from, bond.to);

    if (receivedBondKeys.has(bondKey)) {
      errors.push("A mesma ligação entre carbonos foi informada mais de uma vez.");
      continue;
    }

    receivedBondKeys.add(bondKey);

    if (!expectedBondKeys.has(bondKey)) {
      errors.push("A estrutura contém uma ligação fora da geometria permitida.");
    }
  }

  for (const expectedBond of expectedBonds) {
    const bondKey = normalizeBondKey(expectedBond.from, expectedBond.to);
    if (!receivedBondKeys.has(bondKey)) {
      errors.push("A estrutura não informou todas as ligações obrigatórias entre carbonos.");
      break;
    }
  }

  const hydrogensByCarbon = getGraphHydrogensByCarbon(builderState);

  for (const hydrogenCount of hydrogensByCarbon) {
    if (hydrogenCount < 0) {
      errors.push("A estrutura excede a valência permitida do carbono.");
      break;
    }
  }

  return errors.length === 0;
}

function validateBranchedStructuralRules(
  builderState: BranchedBuilderState,
  errors: string[],
): boolean {
  if (builderState.atoms.length < 1) {
    errors.push("A estrutura precisa ter pelo menos 1 carbono.");
    return false;
  }

  const atomIds = new Set<BranchedAtomId>();
  const bondKeys = new Set<string>();

  for (const atom of builderState.atoms) {
    if (atom.element !== "C") {
      errors.push("O builder atual só aceita átomos de carbono no esqueleto editável.");
      continue;
    }

    if (atomIds.has(atom.id)) {
      errors.push("A estrutura contém um átomo duplicado.");
      continue;
    }

    atomIds.add(atom.id);
  }

  for (const bond of builderState.bonds) {
    if (!atomIds.has(bond.from) || !atomIds.has(bond.to)) {
      errors.push("A estrutura usa uma ligação com átomo inexistente.");
      continue;
    }

    if (bond.from === bond.to) {
      errors.push("Uma ligação não pode conectar um carbono a ele mesmo.");
      continue;
    }

    const bondKey = normalizeBondKey(
      Number(bond.from.slice(1)),
      Number(bond.to.slice(1)),
    );

    if (bondKeys.has(bondKey)) {
      errors.push("A mesma ligação entre carbonos foi informada mais de uma vez.");
      continue;
    }

    bondKeys.add(bondKey);
  }

  for (const atom of builderState.atoms) {
    if (getAtomAvailableValence(builderState, atom.id) < 0) {
      errors.push("A estrutura excede a valência permitida do carbono.");
      break;
    }
  }

  if (builderState.atoms.length > 1) {
    const visited = new Set<BranchedAtomId>();
    const pending: BranchedAtomId[] = [builderState.atoms[0].id];

    while (pending.length > 0) {
      const atomId = pending.pop()!;
      if (visited.has(atomId)) {
        continue;
      }

      visited.add(atomId);

      for (const bond of builderState.bonds) {
        if (bond.from === atomId && !visited.has(bond.to)) {
          pending.push(bond.to);
        }
        if (bond.to === atomId && !visited.has(bond.from)) {
          pending.push(bond.from);
        }
      }
    }

    if (visited.size !== builderState.atoms.length) {
      errors.push("A estrutura precisa formar uma única molécula conectada.");
    }
  }

  return errors.length === 0;
}

function resolveOfficialGraphMoleculeId(builderState: CanonicalBuilderState): MoleculeId | null {
  const bondType = getGraphBondType(builderState);

  if (bondType === "aromatic" && builderState.layout === "closed_ring" && builderState.carbonCount === 6) {
    return "benzeno";
  }

  if (builderState.layout !== "open_chain") {
    return null;
  }

  const doubleBondCount = builderState.bonds.filter((bond) => bond.order === 2).length;

  if (doubleBondCount > 1) {
    return null;
  }

  if (doubleBondCount === 0) {
    return officialMoleculeMap.single[builderState.carbonCount] ?? null;
  }

  return officialMoleculeMap.double[builderState.carbonCount] ?? null;
}

function resolveOfficialBranchedMoleculeId(builderState: BranchedBuilderState): MoleculeId | null {
  return officialBranchedSignatureMap.get(getCanonicalSignatureFromEngine(builderState)) ?? null;
}

function getRequiredFragmentsForBuilderState(
  builderState: BuilderState,
  resolvedMoleculeId: MoleculeId | null,
): FragmentId[] | null {
  if (resolvedMoleculeId === "benzeno") {
    return ["estrutura_aromatica"];
  }

  if (isGraphBuilderState(builderState)) {
    return builderState.bonds.some((bond) => bond.order === 2)
      ? ["ligacao_dupla"]
      : ["ligacao_simples"];
  }

  if (builderState.bonds.some((bond) => bond.order === 3)) {
    return null;
  }

  return builderState.bonds.some((bond) => bond.order === 2)
    ? ["ligacao_dupla"]
    : ["ligacao_simples"];
}

export function resolveOfficialMoleculeId(builderState: BuilderState): MoleculeId | null {
  if (isBranchedBuilderState(builderState)) {
    return resolveOfficialBranchedMoleculeId(builderState);
  }

  return resolveOfficialGraphMoleculeId(builderState);
}

function validateGraphBuilderStateForPhase(
  phaseId: PhaseId,
  builderState: CanonicalBuilderState,
): BuilderValidationResult {
  const phase = getPhaseById(phaseId);
  const errors: string[] = [];
  const carbonCount = builderState.carbonCount;
  const baseStructuralValid = validateGraphStructuralRules(builderState, errors);
  const resolvedMoleculeId = baseStructuralValid ? resolveOfficialGraphMoleculeId(builderState) : null;
  const requiredFragments = getRequiredFragmentsForBuilderState(builderState, resolvedMoleculeId);

  if (phase.technicalType === "choice") {
    errors.push("Esta fase não suporta construção molecular.");
  }

  if (carbonCount > phase.resources.carbonAvailable) {
    errors.push("A estrutura usa mais carbonos do que a fase permite.");
  }

  if (!requiredFragments) {
    errors.push("A estrutura usa um tipo de ligação não desbloqueado nesta fase.");
  } else {
    for (const fragmentId of requiredFragments) {
      if (!phase.resources.availableFragments.includes(fragmentId)) {
        errors.push("A estrutura usa um tipo de ligação não desbloqueado nesta fase.");
        break;
      }
    }
  }

  const structuralValid = baseStructuralValid && errors.length === 0;
  const derivedStructure = baseStructuralValid
    ? deriveGraphStructure(builderState)
    : null;

  if (baseStructuralValid && !resolvedMoleculeId) {
    errors.push("A estrutura é válida, mas ainda não corresponde a uma molécula oficial disponível no MVP.");
  }

  return {
    phaseId,
    structuralValid,
    canCreateMolecule: structuralValid && resolvedMoleculeId !== null && errors.length === 0,
    resolvedMoleculeId: structuralValid ? resolvedMoleculeId : null,
    errors,
    derivedStructure,
  };
}

function validateBranchedBuilderStateForPhase(
  phaseId: PhaseId,
  builderState: BranchedBuilderState,
): BuilderValidationResult {
  const phase = getPhaseById(phaseId);
  const errors: string[] = [];
  const baseStructuralValid = validateBranchedStructuralRules(builderState, errors);
  const resolvedMoleculeId = baseStructuralValid ? resolveOfficialBranchedMoleculeId(builderState) : null;
  const requiredFragments = getRequiredFragmentsForBuilderState(builderState, resolvedMoleculeId);

  if (phase.technicalType === "choice") {
    errors.push("Esta fase não suporta construção molecular.");
  }

  if (builderState.atoms.length > phase.resources.carbonAvailable) {
    errors.push("A estrutura usa mais carbonos do que a fase permite.");
  }

  if (!requiredFragments) {
    errors.push("A estrutura usa um tipo de ligação não desbloqueado nesta fase.");
  } else {
    for (const fragmentId of requiredFragments) {
      if (!phase.resources.availableFragments.includes(fragmentId)) {
        errors.push("A estrutura usa um tipo de ligação não desbloqueado nesta fase.");
        break;
      }
    }
  }

  const structuralValid = baseStructuralValid && errors.length === 0;
  const derivedStructure = baseStructuralValid
    ? deriveBranchedStructure(builderState, resolvedMoleculeId)
    : null;

  if (baseStructuralValid && !resolvedMoleculeId) {
    errors.push("A estrutura é válida, mas ainda não corresponde a uma molécula oficial disponível no MVP.");
  }

  return {
    phaseId,
    structuralValid,
    canCreateMolecule: structuralValid && resolvedMoleculeId !== null && errors.length === 0,
    resolvedMoleculeId: structuralValid ? resolvedMoleculeId : null,
    errors,
    derivedStructure,
  };
}

export function validateBuilderStateForPhase(
  phaseId: PhaseId,
  builderState: BuilderState,
): BuilderValidationResult {
  if (isBranchedBuilderState(builderState)) {
    return validateBranchedBuilderStateForPhase(phaseId, builderState);
  }

  return validateGraphBuilderStateForPhase(phaseId, builderState);
}
