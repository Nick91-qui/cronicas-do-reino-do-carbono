const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

function readProjectFile(relativePath) {
  return fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

function extractIds(source, pattern) {
  return [...source.matchAll(pattern)].map((match) => match[1]);
}

test("Capítulo I declara 8 fases oficiais e 7 moléculas oficiais", () => {
  const chapterSource = readProjectFile("content/chapters/chapter-1.ts");

  assert.match(chapterSource, /totalPhases:\s*8/);

  const phaseIds = extractIds(chapterSource, /"chapter-1-phase-(\d)"/g);
  assert.equal(phaseIds.length, 8);
  assert.deepEqual(phaseIds, ["1", "2", "3", "4", "5", "6", "7", "8"]);

  const moleculeIds = extractIds(
    chapterSource,
    /"(metano|etano|propano|eteno|propeno|buteno|benzeno)"/g,
  );
  assert.deepEqual(
    moleculeIds,
    ["metano", "etano", "propano", "eteno", "propeno", "buteno", "benzeno"],
  );
});

test("As 8 fases oficiais existem e cobrem os 3 tipos técnicos do MVP", () => {
  const phaseSource = readProjectFile("content/phases/chapter-1.ts");

  const ids = extractIds(phaseSource, /id:\s*"((?:chapter-1-phase-\d))"/g);
  assert.equal(ids.length, 8);

  const technicalTypes = extractIds(
    phaseSource,
    /technicalType:\s*"(construction_choice|construction|choice)"/g,
  );
  assert(technicalTypes.includes("construction"));
  assert(technicalTypes.includes("choice"));
  assert(technicalTypes.includes("construction_choice"));
});

test("Moléculas oficiais do capítulo estão materializadas no conteúdo", () => {
  const moleculeSource = readProjectFile("content/molecules/chapter-1.ts");

  const ids = extractIds(
    moleculeSource,
    /id:\s*"(metano|etano|propano|eteno|propeno|buteno|benzeno)"/g,
  );

  assert.deepEqual(ids, ["metano", "etano", "propano", "eteno", "propeno", "buteno", "benzeno"]);
});
