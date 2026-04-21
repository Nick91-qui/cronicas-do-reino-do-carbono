const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

function readProjectFile(relativePath) {
  return fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

test("Exemplos de ambiente expõem os segredos e endpoints mínimos do projeto", () => {
  const envExample = readProjectFile(".env.example");
  const envProductionExample = readProjectFile(".env.production.example");

  for (const source of [envExample, envProductionExample]) {
    assert.match(source, /DATABASE_URL=/);
    assert.match(source, /APP_BASE_URL=/);
    assert.match(source, /AUTH_SECRET=/);
    assert.match(source, /SESSION_SECRET=/);
  }
});

test("package.json expõe scripts mínimos de QA", () => {
  const packageJson = JSON.parse(readProjectFile("package.json"));

  assert.equal(packageJson.scripts.typecheck, "tsc --noEmit");
  assert.equal(packageJson.scripts.build, "next build");
  assert.equal(packageJson.scripts.test, "npm run test:qa");
  assert.equal(packageJson.scripts["test:qa"], "node --test tests/qa/*.test.js");
});
