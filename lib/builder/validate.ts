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
  GraphBuilderBond,
  GraphBuilderState,
  LegacyBuilderState,
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

const blueprintDefinitions: Record<BuilderBlueprintId, { bondType: BondType; slots: Array<{ slotId: string; bondOrder: 1 | 2 | 3 }> }> = {
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

function isLegacyBuilderState(builderState: BuilderState): builderState is LegacyBuilderState {
  return "bondType" in builderState && "carbonCount" in builderState;
}

function isGraphBuilderState(builderState: BuilderState): builderState is GraphBuilderState {
  return "layout" in builderState;
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
  const definition = blueprintDefinitions[builderState.blueprintId];
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
  const definition = blueprintDefinitions[builderState.blueprintId];
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
  const definition = blueprintDefinitions[builderState.blueprintId];
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

function getExpectedGraphBonds(builderState: GraphBuilderState): GraphBuilderBond[] {
  if (builderState.layout === "open_chain") {
    return Array.from({ length: Math.max(0, builderState.carbonCount - 1) }, (_, index) => ({
      from: index,
      to: index + 1,
      order: 1,
    }));
  }

  return Array.from({ length: builderState.carbonCount }, (_, index) => ({
    from: index,
    to: (index + 1) % builderState.carbonCount,
    order: 1,
  }));
}

function normalizeBondKey(from: number, to: number): string {
  return from < to ? `${from}:${to}` : `${to}:${from}`;
}

function getGraphHydrogensByCarbon(builderState: GraphBuilderState): number[] {
  const valenceLoads = Array.from({ length: builderState.carbonCount }, () => 0);

  for (const bond of builderState.bonds) {
    valenceLoads[bond.from] += bond.order;
    valenceLoads[bond.to] += bond.order;
  }

  return valenceLoads.map((load) => 4 - load);
}

function isAlternatingAromaticRing(builderState: GraphBuilderState): boolean {
  if (builderState.layout !== "closed_ring" || builderState.carbonCount !== 6) {
    return false;
  }

  const orderedBonds = getExpectedGraphBonds(builderState).map((expectedBond) =>
    builderState.bonds.find(
      (bond) => normalizeBondKey(bond.from, bond.to) === normalizeBondKey(expectedBond.from, expectedBond.to),
    )?.order ?? 0,
  );

  const patternA = [2, 1, 2, 1, 2, 1];
  const patternB = [1, 2, 1, 2, 1, 2];

  return orderedBonds.every((order, index) => order === patternA[index])
    || orderedBonds.every((order, index) => order === patternB[index]);
}

function getGraphBondType(builderState: GraphBuilderState): BondType {
  if (isAlternatingAromaticRing(builderState)) {
    return "aromatic";
  }

  return builderState.bonds.some((bond) => bond.order === 2) ? "double" : "single";
}

function formatCarbonGroup(hydrogenCount: number): string {
  if (hydrogenCount <= 0) return "C";
  if (hydrogenCount === 1) return "CH";
  return `CH${hydrogenCount}`;
}

function getGraphFormulaEstrutural(
  builderState: GraphBuilderState,
  hydrogensByCarbon: number[],
): string {
  if (builderState.layout === "closed_ring" && isAlternatingAromaticRing(builderState)) {
    return "anel(CH=CH)3";
  }

  const orderedGroups = hydrogensByCarbon.map((hydrogenCount) => formatCarbonGroup(hydrogenCount));

  if (builderState.layout === "closed_ring") {
    return `ciclo(${orderedGroups.join("-")})`;
  }

  return orderedGroups
    .map((group, index) => {
      if (index === orderedGroups.length - 1) {
        return group;
      }

      const bond = builderState.bonds.find(
        (item) => normalizeBondKey(item.from, item.to) === normalizeBondKey(index, index + 1),
      );

      return `${group}${bond?.order === 2 ? "=" : "-"}`
    })
    .join("");
}

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
    formulaMolecular: `C${builderState.carbonCount}H${hydrogenCount}`,
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
  if (isLegacyBuilderState(builderState)) {
    return officialMoleculeMap[builderState.bondType][builderState.carbonCount] ?? null;
  }

  if (isGraphBuilderState(builderState)) {
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

export function validateBuilderStateForPhase(
  phaseId: PhaseId,
  builderState: BuilderState,
): BuilderValidationResult {
  const phase = getPhaseById(phaseId);
  const errors: string[] = [];

  if (phase.technicalType === "choice") {
    errors.push("Esta fase não suporta construção molecular.");
  }

  let bondType: BondType;
  let carbonCount: number;
  let requiredFragments: FragmentId[];

  if (isLegacyBuilderState(builderState)) {
    bondType = builderState.bondType;
    carbonCount = builderState.carbonCount;
    requiredFragments = [getRequiredFragmentId(bondType)];
  } else if (isGraphBuilderState(builderState)) {
    bondType = getGraphBondType(builderState);
    carbonCount = builderState.carbonCount;
    requiredFragments = builderState.bonds.some((bond) => bond.order === 2)
      ? ["ligacao_dupla"]
      : ["ligacao_simples"];
  } else {
    bondType = blueprintDefinitions[builderState.blueprintId].bondType;
    carbonCount = 1 + builderState.slots.filter((slot: BuilderFilledSlot) => slot.element === "C").length;
    requiredFragments = [getRequiredFragmentId(bondType)];
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
    : isGraphBuilderState(builderState)
      ? validateGraphStructuralRules(builderState, errors)
      : validateBlueprintStructuralRules(builderState, errors);
  const derivedStructure = structuralValid
    ? (
      isLegacyBuilderState(builderState)
        ? deriveLegacyStructure(builderState)
        : isGraphBuilderState(builderState)
          ? deriveGraphStructure(builderState)
          : deriveBlueprintStructure(builderState)
    )
    : null;
  const resolvedMoleculeId = structuralValid ? resolveOfficialMoleculeId(builderState) : null;

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
