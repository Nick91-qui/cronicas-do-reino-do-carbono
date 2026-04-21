const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

function readProjectFile(relativePath) {
  return fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

test("Rotas críticas usam resposta sem cache", () => {
  const files = [
    "app/api/auth/register/route.ts",
    "app/api/auth/login/route.ts",
    "app/api/auth/logout/route.ts",
    "app/api/phases/[phaseId]/submit/route.ts",
    "app/api/progress/route.ts",
    "app/api/progress/[chapterId]/route.ts",
    "app/api/inventory/route.ts",
    "app/api/collection/route.ts",
  ];

  for (const file of files) {
    const source = readProjectFile(file);
    assert.match(source, /jsonNoStore/);
  }
});

test("Rotas protegidas exigem autenticação no servidor", () => {
  const files = [
    "app/api/phases/[phaseId]/submit/route.ts",
    "app/api/progress/route.ts",
    "app/api/progress/[chapterId]/route.ts",
    "app/api/inventory/route.ts",
    "app/api/collection/route.ts",
  ];

  for (const file of files) {
    const source = readProjectFile(file);
    assert.match(source, /Autenticação obrigatória\./);
    assert.match(source, /getAuthenticatedPlayer/);
  }
});

test("Rotas sensíveis registram erro de servidor quando ocorre falha inesperada", () => {
  const files = [
    "app/api/auth/register/route.ts",
    "app/api/auth/login/route.ts",
    "app/api/auth/logout/route.ts",
    "app/api/phases/[phaseId]/submit/route.ts",
  ];

  for (const file of files) {
    const source = readProjectFile(file);
    assert.match(source, /logServerError/);
  }
});
