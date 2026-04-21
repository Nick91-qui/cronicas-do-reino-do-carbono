import { describe, expect, it } from "vitest";

import {
  getAllChapters,
  getAllMolecules,
  getAllPhases,
  getChapterById,
  getMoleculeById,
  getPhaseById,
  getPhasesByChapterId,
  validateContentIntegrity,
} from "@/lib/content/loaders";

describe("content/loaders", () => {
  it("carrega o Capítulo I oficial", () => {
    const chapter = getChapterById("chapter-1");

    expect(chapter.totalPhases).toBe(8);
    expect(chapter.moleculeIds).toEqual([
      "metano",
      "etano",
      "propano",
      "eteno",
      "propeno",
      "buteno",
      "benzeno",
    ]);
  });

  it("retorna as fases do capítulo em ordem", () => {
    const phases = getPhasesByChapterId("chapter-1");

    expect(phases).toHaveLength(8);
    expect(phases.map((phase) => phase.number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it("expõe os registros oficiais de capítulo, fase e molécula", () => {
    expect(getAllChapters()).toHaveLength(1);
    expect(getAllPhases()).toHaveLength(8);
    expect(getAllMolecules()).toHaveLength(7);
    expect(getPhaseById("chapter-1-phase-8").excellentAnswer).toBe("benzeno");
    expect(getMoleculeById("eteno").classe).toBe("alceno");
  });

  it("mantém integridade interna do conteúdo", () => {
    expect(() => validateContentIntegrity()).not.toThrow();
  });
});
