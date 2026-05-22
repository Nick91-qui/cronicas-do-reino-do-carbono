import { describe, expect, it } from "vitest";

import { buildGraphBuilderState } from "@/lib/builder/graph-preview";
import { validateBuilderStateForPhase } from "@/lib/builder/validate";

describe("builder/validate", () => {
  it("aceita metano em fase de construção inicial usando o formato canônico em grafo", () => {
    const result = validateBuilderStateForPhase("chapter-1-phase-1", {
      layout: "open_chain",
      carbonCount: 1,
      bonds: [],
    });

    expect(result.structuralValid).toBe(true);
    expect(result.canCreateMolecule).toBe(true);
    expect(result.resolvedMoleculeId).toBe("metano");
    expect(result.errors).toEqual([]);
    expect(result.derivedStructure?.formulaMolecular).toBe("C1H4");
  });

  it("rejeita construção em fase do tipo choice", () => {
    const result = validateBuilderStateForPhase(
      "chapter-1-phase-4",
      buildGraphBuilderState("open_chain", 1, []),
    );

    expect(result.structuralValid).toBe(false);
    expect(result.canCreateMolecule).toBe(false);
    expect(result.resolvedMoleculeId).toBeNull();
    expect(result.errors).toContain("Esta fase não suporta construção molecular.");
  });

  it("rejeita estrutura com mais carbonos do que a fase permite", () => {
    const result = validateBuilderStateForPhase(
      "chapter-1-phase-1",
      buildGraphBuilderState("open_chain", 2, [1]),
    );

    expect(result.structuralValid).toBe(false);
    expect(result.resolvedMoleculeId).toBeNull();
    expect(result.canCreateMolecule).toBe(false);
    expect(result.errors).toContain("A estrutura usa mais carbonos do que a fase permite.");
  });

  it("rejeita uso de ligação não desbloqueada na fase", () => {
    const result = validateBuilderStateForPhase(
      "chapter-1-phase-3",
      buildGraphBuilderState("open_chain", 2, [2]),
    );

    expect(result.structuralValid).toBe(false);
    expect(result.resolvedMoleculeId).toBeNull();
    expect(result.canCreateMolecule).toBe(false);
    expect(result.errors).toContain("A estrutura usa um tipo de ligação não desbloqueado nesta fase.");
  });

  it("rejeita geometria inválida em builder de grafo", () => {
    const result = validateBuilderStateForPhase("chapter-1-phase-6", {
      layout: "open_chain",
      carbonCount: 3,
      bonds: [{ from: 0, to: 1, order: 1 }],
    });

    expect(result.structuralValid).toBe(false);
    expect(result.canCreateMolecule).toBe(false);
    expect(result.resolvedMoleculeId).toBeNull();
    expect(result.errors).toContain("A estrutura não informou todas as ligações obrigatórias entre carbonos.");
  });

  it("resolve benzeno a partir de anel aromático alternado em fase 8", () => {
    const result = validateBuilderStateForPhase(
      "chapter-1-phase-8",
      buildGraphBuilderState("closed_ring", 6, [2, 1, 2, 1, 2, 1]),
    );

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
        { id: "a0", element: "C" },
        { id: "a1", element: "C" },
      ],
      bonds: [{ id: "b0", from: "a0", to: "a1", order: 1 }],
      selectedAtomId: "a0",
      nextAtomIndex: 2,
      nextBondIndex: 1,
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
        { id: "a0", element: "C" },
        { id: "a1", element: "C" },
        { id: "a2", element: "C" },
        { id: "a3", element: "C" },
      ],
      bonds: [
        { id: "b0", from: "a0", to: "a1", order: 1 },
        { id: "b1", from: "a1", to: "a2", order: 2 },
        { id: "b2", from: "a2", to: "a3", order: 1 },
      ],
      selectedAtomId: "a1",
      nextAtomIndex: 4,
      nextBondIndex: 3,
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
        { id: "a0", element: "C" },
        { id: "a1", element: "C" },
      ],
      bonds: [{ id: "b0", from: "a0", to: "a1", order: 3 }],
      selectedAtomId: "a0",
      nextAtomIndex: 2,
      nextBondIndex: 1,
    });

    expect(result.structuralValid).toBe(false);
    expect(result.canCreateMolecule).toBe(false);
    expect(result.resolvedMoleculeId).toBeNull();
    expect(result.errors).toContain("A estrutura usa um tipo de ligação não desbloqueado nesta fase.");
  });
});
