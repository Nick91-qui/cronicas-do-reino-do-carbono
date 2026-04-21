import { describe, expect, it } from "vitest";

import { evaluatePhaseSubmission } from "@/lib/gameplay/evaluate-phase";

describe("gameplay/evaluate-phase", () => {
  it("retorna excellent para resposta ideal com justificativa suficiente", () => {
    const result = evaluatePhaseSubmission({
      phaseId: "chapter-1-phase-4",
      selectedMoleculeId: "metano",
      selectedProperties: ["cadeia_curta", "alta_volatilidade"],
    });

    expect(result.qualitativeResult).toBe("excellent");
    expect(result.validationResult).toBe("correct");
    expect(result.scoreAwarded).toBe(3);
    expect(result.expectedPropertiesMatched).toEqual(["cadeia_curta", "alta_volatilidade"]);
  });

  it("retorna adequate para resposta ideal com justificativa fraca", () => {
    const result = evaluatePhaseSubmission({
      phaseId: "chapter-1-phase-4",
      selectedMoleculeId: "metano",
      selectedProperties: ["cadeia_curta"],
    });

    expect(result.qualitativeResult).toBe("adequate");
    expect(result.validationResult).toBe("correct");
    expect(result.scoreAwarded).toBe(2);
  });

  it("retorna adequate para molécula aceitável", () => {
    const result = evaluatePhaseSubmission({
      phaseId: "chapter-1-phase-6",
      selectedMoleculeId: "propeno",
      selectedProperties: ["insaturada", "alta_reatividade"],
    });

    expect(result.qualitativeResult).toBe("adequate");
    expect(result.validationResult).toBe("correct");
    expect(result.scoreAwarded).toBe(2);
  });

  it("retorna inadequate para molécula errada", () => {
    const result = evaluatePhaseSubmission({
      phaseId: "chapter-1-phase-6",
      selectedMoleculeId: "propano",
      selectedProperties: ["baixa_polaridade"],
    });

    expect(result.qualitativeResult).toBe("inadequate");
    expect(result.validationResult).toBe("incorrect");
    expect(result.scoreAwarded).toBe(0);
  });

  it("rejeita propriedades duplicadas", () => {
    expect(() =>
      evaluatePhaseSubmission({
        phaseId: "chapter-1-phase-4",
        selectedMoleculeId: "metano",
        selectedProperties: ["cadeia_curta", "cadeia_curta"],
      }),
    ).toThrow("Propriedades duplicadas não são permitidas na submissão.");
  });
});
