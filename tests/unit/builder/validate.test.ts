import { describe, expect, it } from "vitest";

import { buildGraphBuilderState } from "@/lib/builder/graph-preview";
import { validateBuilderStateForPhase } from "@/lib/builder/validate";

describe("builder/validate", () => {
  it("aceita metano em fase de construção inicial usando estado legado", () => {
    const result = validateBuilderStateForPhase("chapter-1-phase-1", {
      carbonCount: 1,
      bondType: "single",
    });

    expect(result.structuralValid).toBe(true);
    expect(result.canCreateMolecule).toBe(true);
    expect(result.resolvedMoleculeId).toBe("metano");
    expect(result.errors).toEqual([]);
    expect(result.derivedStructure?.formulaMolecular).toBe("C1H4");
  });

  it("aceita metano em blueprint tetraédrico com quatro hidrogênios", () => {
    const result = validateBuilderStateForPhase("chapter-1-phase-1", {
      blueprintId: "tetra_single",
      slots: [
        { slotId: "s1", element: "H" },
        { slotId: "s2", element: "H" },
        { slotId: "s3", element: "H" },
        { slotId: "s4", element: "H" },
      ],
    });

    expect(result.structuralValid).toBe(true);
    expect(result.canCreateMolecule).toBe(true);
    expect(result.resolvedMoleculeId).toBe("metano");
  });

  it("rejeita construção em fase do tipo choice", () => {
    const result = validateBuilderStateForPhase("chapter-1-phase-4", {
      carbonCount: 1,
      bondType: "single",
    });

    expect(result.structuralValid).toBe(true);
    expect(result.canCreateMolecule).toBe(false);
    expect(result.errors).toContain("Esta fase não suporta construção molecular.");
  });

  it("rejeita estrutura com mais carbonos do que a fase permite", () => {
    const result = validateBuilderStateForPhase("chapter-1-phase-1", {
      carbonCount: 2,
      bondType: "single",
    });

    expect(result.structuralValid).toBe(true);
    expect(result.resolvedMoleculeId).toBe("etano");
    expect(result.canCreateMolecule).toBe(false);
    expect(result.errors).toContain("A estrutura usa mais carbonos do que a fase permite.");
  });

  it("rejeita uso de ligação não desbloqueada na fase", () => {
    const result = validateBuilderStateForPhase("chapter-1-phase-3", {
      carbonCount: 2,
      bondType: "double",
    });

    expect(result.structuralValid).toBe(true);
    expect(result.resolvedMoleculeId).toBe("eteno");
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
});
