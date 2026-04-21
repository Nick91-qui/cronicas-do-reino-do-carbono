import { getPhaseById } from "@/lib/content/loaders";
import type { BondType, FragmentId, MoleculeId, PhaseId } from "@/lib/content/types";
import type {
  BlueprintBuilderState,
  BuilderBlueprintId,
  BuilderDerivedStructure,
  BuilderFilledSlot,
  BuilderSignatureEntry,
  BuilderState,
  BuilderValidationResult,
  LegacyBuilderState,
} from "@/lib/builder/types";

const legacyBlueprintDefinitions: Record<BuilderBlueprintId, { bondType: BondType; slots: Array<{ slotId: string; bondOrder: 1 | 2 | 3 }> }> = {
  tetra_single: {
    bondType: "single",
    slots: [
      { slotId: "s1", bondOrder: 1 },
      { slotId: "s2", bondOrder: 1 },
      { slotId: "s3", bondOrder: 1 },
      { slotId: "s4", bondOrder: 1 },
    ],
  },
  trigonal_double: {
    bondType: "double",
    slots: [
      { slotId: "d1", bondOrder: 2 },
      { slotId: "s1", bondOrder: 1 },
      { slotId: "s2", bondOrder: 1 },
    ],
  },
  linear_triple: {
    bondType: "double",
    slots: [
      { slotId: "t1", bondOrder: 3 },
      { slotId: "s1", bondOrder: 1 },
    ],
  },
  linear_two_doubles: {
    bondType: "double",
    slots: [
      { slotId: "d1", bondOrder: 2 },
      { slotId: "d2", bondOrder: 2 },
    ],
  },
  aromatic_ring: {
    bondType: "aromatic",
    slots: [
      { slotId: "a1", bondOrder: 1 },
      { slotId: "a2", bondOrder: 1 },
      { slotId: "a3", bondOrder: 1 },
      { slotId: "a4", bondOrder: 1 },
      { slotId: "a5", bondOrder: 1 },
      { slotId: "a6", bondOrder: 1 },
    ],
  },
};

const officialLegacyMoleculeMap: Record<BondType, Partial<Record<number, MoleculeId>>> = {
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

export function isLegacyBuilderState(builderState: BuilderState): builderState is LegacyBuilderState {
  return "bondType" in builderState && "carbonCount" in builderState;
}

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
    return "anel C6H6";
  }

  return `C${carbonCount}H${getHydrogenCount(carbonCount, bondType)}`;
}

function deriveLegacyStructure(builderState: LegacyBuilderState): BuilderDerivedStructure {
  const hydrogenCount = getHydrogenCount(builderState.carbonCount, builderState.bondType);

  return {
    carbonCount: builderState.carbonCount,
    hydrogenCount,
    bondType: builderState.bondType,
    formulaMolecular: `C${builderState.carbonCount}H${hydrogenCount}`,
    formulaEstrutural: getFormulaEstrutural(builderState.carbonCount, builderState.bondType),
  };
}

function normalizeBlueprintSignature(builderState: BlueprintBuilderState): BuilderSignatureEntry[] {
  const definition = legacyBlueprintDefinitions[builderState.blueprintId];
  const counts = new Map<string, BuilderSignatureEntry>();

  for (const slot of builderState.slots) {
    if (!slot.element) continue;
    const slotDefinition = definition.slots.find((item) => item.slotId === slot.slotId);
    if (!slotDefinition) continue;

    const key = `${slotDefinition.bondOrder}:${slot.element}`;
    const current = counts.get(key);

    if (current) {
      current.count += 1;
      continue;
    }

    counts.set(key, {
      bondOrder: slotDefinition.bondOrder,
      element: slot.element,
      count: 1,
    });
  }

  return [...counts.values()].sort((left, right) => {
    if (left.bondOrder !== right.bondOrder) {
      return left.bondOrder - right.bondOrder;
    }

    return left.element.localeCompare(right.element);
  });
}

function deriveBlueprintStructure(builderState: BlueprintBuilderState): BuilderDerivedStructure {
  const definition = legacyBlueprintDefinitions[builderState.blueprintId];
  const carbonCount = 1 + builderState.slots.filter((slot) => slot.element === "C").length;
  const hydrogenCount = builderState.slots.filter((slot) => slot.element === "H").length;
  const oxygenCount = builderState.slots.filter((slot) => slot.element === "O").length;
  const signature = normalizeBlueprintSignature(builderState);
  const formulaParts = [`C${carbonCount}`];

  if (hydrogenCount > 0) {
    formulaParts.push(`H${hydrogenCount}`);
  }

  if (oxygenCount > 0) {
    formulaParts.push(`O${oxygenCount}`);
  }

  return {
    blueprintId: builderState.blueprintId,
    carbonCount,
    hydrogenCount,
    oxygenCount: oxygenCount || undefined,
    bondType: definition.bondType,
    formulaMolecular: formulaParts.join(""),
    formulaEstrutural: `${builderState.blueprintId}:${builderState.slots.map((slot) => slot.element ?? "_").join("-")}`,
    signature,
  };
}

function validateLegacyStructuralRules(builderState: LegacyBuilderState, errors: string[]): boolean {
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

function validateBlueprintStructuralRules(builderState: BlueprintBuilderState, errors: string[]): boolean {
  const definition = legacyBlueprintDefinitions[builderState.blueprintId];
  const expectedSlotIds = new Set(definition.slots.map((slot) => slot.slotId));
  const receivedSlotIds = new Set(builderState.slots.map((slot) => slot.slotId));

  if (definition.slots.length !== builderState.slots.length) {
    errors.push("O blueprint exige o preenchimento de todos os slots oficiais.");
  }

  for (const expectedSlotId of expectedSlotIds) {
    if (!receivedSlotIds.has(expectedSlotId)) {
      errors.push("Existem slots obrigatórios não informados no blueprint.");
      break;
    }
  }

  for (const slot of builderState.slots) {
    if (!expectedSlotIds.has(slot.slotId)) {
      errors.push("O blueprint recebeu um slot desconhecido.");
      break;
    }

    if (!slot.element) {
      errors.push("Todos os slots precisam ser preenchidos antes da forja.");
      break;
    }
  }

  return errors.length === 0;
}

export function resolveOfficialLegacyMoleculeId(builderState: LegacyBuilderState | BlueprintBuilderState): MoleculeId | null {
  if (isLegacyBuilderState(builderState)) {
    return officialLegacyMoleculeMap[builderState.bondType][builderState.carbonCount] ?? null;
  }

  const signature = normalizeBlueprintSignature(builderState);

  if (
    builderState.blueprintId === "tetra_single"
    && signature.length === 1
    && signature[0].bondOrder === 1
    && signature[0].element === "H"
    && signature[0].count === 4
  ) {
    return "metano";
  }

  return null;
}

export function validateLegacyOrBlueprintBuilderStateForPhase(
  phaseId: PhaseId,
  builderState: LegacyBuilderState | BlueprintBuilderState,
): BuilderValidationResult {
  const phase = getPhaseById(phaseId);
  const errors: string[] = [];
  let bondType: BondType;
  let carbonCount: number;
  let requiredFragments: FragmentId[];

  if (isLegacyBuilderState(builderState)) {
    bondType = builderState.bondType;
    carbonCount = builderState.carbonCount;
    requiredFragments = [getRequiredFragmentId(bondType)];
  } else {
    bondType = legacyBlueprintDefinitions[builderState.blueprintId].bondType;
    carbonCount = 1 + builderState.slots.filter((slot: BuilderFilledSlot) => slot.element === "C").length;
    requiredFragments = [getRequiredFragmentId(bondType)];
  }

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

  const structuralValid = isLegacyBuilderState(builderState)
    ? validateLegacyStructuralRules(builderState, errors)
    : validateBlueprintStructuralRules(builderState, errors);
  const derivedStructure = structuralValid
    ? (
      isLegacyBuilderState(builderState)
        ? deriveLegacyStructure(builderState)
        : deriveBlueprintStructure(builderState)
    )
    : null;
  const resolvedMoleculeId = structuralValid ? resolveOfficialLegacyMoleculeId(builderState) : null;

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
