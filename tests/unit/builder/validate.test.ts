import { describe, expect, it } from "vitest";

import {
  addCarbonToAtom,
  connectAtomsWithBond,
  createBranchedBuilderState,
  cycleBondOrder,
} from "@/lib/builder/state/branched-operations";
import { validateBuilderStateForPhase } from "@/lib/builder/validate";

describe("builder/validate", () => {
  it("aceita metano em fase de construção inicial", () => {
    const result = validateBuilderStateForPhase(
      "chapter-1-phase-1",
      createBranchedBuilderState(),
    );

    expect(result.structuralValid).toBe(true);
    expect(result.canCreateMolecule).toBe(true);
    expect(result.resolvedMoleculeId).toBe("metano");
    expect(result.errors).toEqual([]);
    expect(result.derivedStructure?.formulaMolecular).toBe("CH4");
  });

  it("rejeita construção em fase do tipo choice", () => {
    const methane = createBranchedBuilderState();
    const result = validateBuilderStateForPhase(
      "chapter-1-phase-4",
      methane,
    );

    expect(result.structuralValid).toBe(false);
    expect(result.canCreateMolecule).toBe(false);
    expect(result.resolvedMoleculeId).toBeNull();
    expect(result.errors).toContain("Esta fase não suporta construção molecular.");
  });

  it("rejeita estrutura com mais carbonos do que a fase permite", () => {
    const methane = createBranchedBuilderState();
    const ethane = addCarbonToAtom(methane, "a1");
    const result = validateBuilderStateForPhase(
      "chapter-1-phase-1",
      ethane,
    );

    expect(result.structuralValid).toBe(false);
    expect(result.resolvedMoleculeId).toBeNull();
    expect(result.canCreateMolecule).toBe(false);
    expect(result.errors).toContain("A estrutura usa mais carbonos do que a fase permite.");
  });

  it("rejeita uso de ligação não desbloqueada na fase", () => {
    const methane = createBranchedBuilderState();
    const ethane = addCarbonToAtom(methane, "a1");
    const ethene = cycleBondOrder(ethane, "b1", 2);
    const result = validateBuilderStateForPhase(
      "chapter-1-phase-3",
      ethene,
    );

    expect(result.structuralValid).toBe(false);
    expect(result.resolvedMoleculeId).toBeNull();
    expect(result.canCreateMolecule).toBe(false);
    expect(result.errors).toContain("A estrutura usa um tipo de ligação não desbloqueado nesta fase.");
  });

  it("rejeita estrutura desconectada", () => {
    const result = validateBuilderStateForPhase("chapter-1-phase-6", {
      kind: "branched_v2",
      atoms: [
        { id: "a1", element: "C" },
        { id: "a2", element: "C" },
        { id: "a3", element: "C" },
      ],
      bonds: [{ id: "b1", from: "a1", to: "a2", order: 1 }],
      selectedAtomId: "a1",
      nextAtomIndex: 4,
      nextBondIndex: 2,
    });

    expect(result.structuralValid).toBe(false);
    expect(result.canCreateMolecule).toBe(false);
    expect(result.resolvedMoleculeId).toBeNull();
    expect(result.errors).toContain("A estrutura precisa formar uma única molécula conectada.");
  });

  it("resolve benzeno a partir de anel aromático alternado em fase 8", () => {
    const methane = createBranchedBuilderState();
    const ethane = addCarbonToAtom(methane, "a1");
    const propane = addCarbonToAtom(ethane, "a2");
    const butane = addCarbonToAtom(propane, "a3");
    const pentane = addCarbonToAtom(butane, "a4");
    const hexane = addCarbonToAtom(pentane, "a5");
    const cyclohexane = connectAtomsWithBond(hexane, "a1", "a6");
    const bond2 = cycleBondOrder(cyclohexane, "b2", 2);
    const bond4 = cycleBondOrder(bond2, "b4", 2);
    const benzene = cycleBondOrder(bond4, "b6", 2);

    const result = validateBuilderStateForPhase("chapter-1-phase-8", benzene);

    expect(result.structuralValid).toBe(true);
    expect(result.canCreateMolecule).toBe(true);
    expect(result.resolvedMoleculeId).toBe("benzeno");
    expect(result.derivedStructure?.bondType).toBe("aromatic");
    expect(result.errors).toEqual([]);
  });

  it("aceita etano no formato ramificado v2", () => {
    const result = validateBuilderStateForPhase("chapter-1-phase-2", {
      kind: "branched_v2",
      atoms: [
        { id: "a1", element: "C" },
        { id: "a2", element: "C" },
      ],
      bonds: [{ id: "b1", from: "a1", to: "a2", order: 1 }],
      selectedAtomId: "a1",
      nextAtomIndex: 3,
      nextBondIndex: 2,
    });

    expect(result.structuralValid).toBe(true);
    expect(result.canCreateMolecule).toBe(true);
    expect(result.resolvedMoleculeId).toBe("etano");
    expect(result.derivedStructure?.formulaMolecular).toBe("C2H6");
    expect(result.errors).toEqual([]);
  });

  it("resolve isômero de posição do buteno no formato ramificado v2", () => {
    const result = validateBuilderStateForPhase("chapter-1-phase-8", {
      kind: "branched_v2",
      atoms: [
        { id: "a1", element: "C" },
        { id: "a2", element: "C" },
        { id: "a3", element: "C" },
        { id: "a4", element: "C" },
      ],
      bonds: [
        { id: "b1", from: "a1", to: "a2", order: 1 },
        { id: "b2", from: "a2", to: "a3", order: 2 },
        { id: "b3", from: "a3", to: "a4", order: 1 },
      ],
      selectedAtomId: "a2",
      nextAtomIndex: 5,
      nextBondIndex: 4,
    });

    expect(result.structuralValid).toBe(true);
    expect(result.canCreateMolecule).toBe(true);
    expect(result.resolvedMoleculeId).toBe("buteno");
    expect(result.derivedStructure?.formulaMolecular).toBe("C4H8");
    expect(result.errors).toEqual([]);
  });

  it("rejeita ligação tripla no formato ramificado v2 enquanto a fase não desbloqueia esse fragmento", () => {
    const result = validateBuilderStateForPhase("chapter-1-phase-8", {
      kind: "branched_v2",
      atoms: [
        { id: "a1", element: "C" },
        { id: "a2", element: "C" },
      ],
      bonds: [{ id: "b1", from: "a1", to: "a2", order: 3 }],
      selectedAtomId: "a1",
      nextAtomIndex: 3,
      nextBondIndex: 2,
    });

    expect(result.structuralValid).toBe(false);
    expect(result.canCreateMolecule).toBe(false);
    expect(result.resolvedMoleculeId).toBeNull();
    expect(result.errors).toContain("A estrutura usa um tipo de ligação não desbloqueado nesta fase.");
  });
});
