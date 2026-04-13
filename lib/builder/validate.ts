import { getPhaseById } from "@/lib/content/loaders";
import type { BondType, FragmentId, MoleculeId, PhaseId } from "@/lib/content/types";

import type { BuilderDerivedStructure, BuilderState, BuilderValidationResult } from "@/lib/builder/types";

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

function getRequiredFragmentId(bondType: BondType): FragmentId {
  if (bondType === "single") return "ligacao_simples";
  if (bondType === "double") return "ligacao_dupla";
  return "estrutura_aromatica";
}

function getHydrogenCount(carbonCount: number, bondType: BondType): number {
  if (bondType === "single") {
    return 2 * carbonCount + 2;
  }

  if (bondType === "double") {
    return 2 * carbonCount;
  }

  return 6;
}

function getFormulaEstrutural(carbonCount: number, bondType: BondType): string {
  if (bondType === "single") {
    if (carbonCount === 1) return "CH4";
    if (carbonCount === 2) return "CH3-CH3";
    if (carbonCount === 3) return "CH3-CH2-CH3";
  }

  if (bondType === "double") {
    if (carbonCount === 2) return "CH2=CH2";
    if (carbonCount === 3) return "CH2=CH-CH3";
    if (carbonCount === 4) return "CH2=CH-CH2-CH3";
  }

  if (bondType === "aromatic") {
    return "C6H6 (anel aromático)";
  }

  return `C${carbonCount}H${getHydrogenCount(carbonCount, bondType)}`;
}

function deriveStructure(builderState: BuilderState): BuilderDerivedStructure {
  const hydrogenCount = getHydrogenCount(builderState.carbonCount, builderState.bondType);

  return {
    carbonCount: builderState.carbonCount,
    hydrogenCount,
    bondType: builderState.bondType,
    formulaMolecular: `C${builderState.carbonCount}H${hydrogenCount}`,
    formulaEstrutural: getFormulaEstrutural(builderState.carbonCount, builderState.bondType),
  };
}

function validateStructuralRules(builderState: BuilderState, errors: string[]): boolean {
  if (builderState.bondType === "single" && builderState.carbonCount < 1) {
    errors.push("Estruturas com ligação simples precisam ter pelo menos 1 carbono.");
  }

  if (builderState.bondType === "double" && builderState.carbonCount < 2) {
    errors.push("Estruturas com ligação dupla precisam ter pelo menos 2 carbonos.");
  }

  if (builderState.bondType === "aromatic" && builderState.carbonCount !== 6) {
    errors.push("A estrutura aromática do MVP exige exatamente 6 carbonos.");
  }

  return errors.length === 0;
}

export function resolveOfficialMoleculeId(builderState: BuilderState): MoleculeId | null {
  return officialMoleculeMap[builderState.bondType][builderState.carbonCount] ?? null;
}

export function validateBuilderStateForPhase(
  phaseId: PhaseId,
  builderState: BuilderState,
): BuilderValidationResult {
  const phase = getPhaseById(phaseId);
  const errors: string[] = [];

  if (phase.technicalType === "choice") {
    errors.push("Esta fase não suporta construção molecular.");
  }

  if (builderState.carbonCount > phase.resources.carbonAvailable) {
    errors.push("A estrutura usa mais carbonos do que a fase permite.");
  }

  const requiredFragmentId = getRequiredFragmentId(builderState.bondType);

  if (!phase.resources.availableFragments.includes(requiredFragmentId)) {
    errors.push("O tipo de ligação escolhido não está desbloqueado nesta fase.");
  }

  const structuralValid = validateStructuralRules(builderState, errors);
  const derivedStructure = structuralValid ? deriveStructure(builderState) : null;
  const resolvedMoleculeId = structuralValid ? resolveOfficialMoleculeId(builderState) : null;

  if (structuralValid && !resolvedMoleculeId) {
    errors.push("A estrutura é válida, mas não corresponde a uma molécula oficial disponível no MVP.");
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
