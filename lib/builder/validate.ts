import { getPhaseById } from "@/lib/content/loaders";
import type { BondType, FragmentId, MoleculeId, PhaseId } from "@/lib/content/types";
import {
  getExpectedGraphBonds,
  getGraphBondType,
  getGraphFormulaEstrutural,
  getGraphHydrogensByCarbon,
  getPreviewFormulaMolecular,
  normalizeBondKey,
} from "@/lib/builder/graph-preview";
import type {
  BuilderDerivedStructure,
  BuilderState,
  BuilderValidationResult,
  CanonicalBuilderState,
  GraphBuilderState,
} from "@/lib/builder/types";

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

export function resolveOfficialMoleculeId(builderState: BuilderState): MoleculeId | null {
  return resolveOfficialGraphMoleculeId(builderState);
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

export function validateGraphBuilderStateForPhase(
  phaseId: PhaseId,
  builderState: CanonicalBuilderState,
): BuilderValidationResult {
  const phase = getPhaseById(phaseId);
  const errors: string[] = [];
  const carbonCount = builderState.carbonCount;
  const requiredFragments: FragmentId[] = builderState.bonds.some((bond) => bond.order === 2)
    ? ["ligacao_dupla"]
    : ["ligacao_simples"];

  if (phase.technicalType === "choice") {
    errors.push("Esta fase não suporta construção molecular.");
  }

  if (carbonCount > phase.resources.carbonAvailable) {
    errors.push("A estrutura usa mais carbonos do que a fase permite.");
  }

  for (const fragmentId of requiredFragments) {
    if (!phase.resources.availableFragments.includes(fragmentId)) {
      errors.push("A estrutura usa um tipo de ligação não desbloqueado nesta fase.");
      break;
    }
  }

  const structuralValid = validateGraphStructuralRules(builderState, errors);
  const derivedStructure = structuralValid
    ? deriveGraphStructure(builderState)
    : null;
  const resolvedMoleculeId = structuralValid ? resolveOfficialGraphMoleculeId(builderState) : null;

  if (structuralValid && !resolvedMoleculeId) {
    errors.push("A estrutura é válida, mas ainda não corresponde a uma molécula oficial disponível no MVP.");
  }

  return {
    phaseId,
    structuralValid,
    canCreateMolecule: structuralValid && resolvedMoleculeId !== null && errors.length === 0,
    resolvedMoleculeId,
    errors,
    derivedStructure,
  };
}

export function validateBuilderStateForPhase(
  phaseId: PhaseId,
  builderState: BuilderState,
): BuilderValidationResult {
  return validateGraphBuilderStateForPhase(phaseId, builderState);
}
