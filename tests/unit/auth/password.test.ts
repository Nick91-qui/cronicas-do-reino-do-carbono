import { describe, expect, it } from "vitest";

import { hashPassword, verifyPassword } from "@/lib/auth/password";

describe("auth/password", () => {
  it("gera hash verificável para a senha correta", () => {
    const password = "senha-super-segura-123";
    const hashed = hashPassword(password);

    expect(hashed).toContain(":");
    expect(verifyPassword(password, hashed)).toBe(true);
  });

  it("rejeita senha incorreta", () => {
    const hashed = hashPassword("senha-correta");

    expect(verifyPassword("senha-incorreta", hashed)).toBe(false);
  });

  it("rejeita hash malformado", () => {
    expect(verifyPassword("qualquer", "hash-invalido")).toBe(false);
  });
});
