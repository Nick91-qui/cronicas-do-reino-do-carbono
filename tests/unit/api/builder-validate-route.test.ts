import { beforeEach, describe, expect, it, vi } from "vitest";
import type { BranchedBuilderState } from "@/lib/builder/state/branched-types";

const {
  requireApiAuthenticatedPlayerMock,
  validateBuilderStateForPhaseMock,
  logServerErrorMock,
} = vi.hoisted(() => ({
  requireApiAuthenticatedPlayerMock: vi.fn(),
  validateBuilderStateForPhaseMock: vi.fn(),
  logServerErrorMock: vi.fn(),
}));

vi.mock("@/lib/auth/session", () => ({
  ApiAuthenticationRequiredError: class ApiAuthenticationRequiredError extends Error {
    constructor() {
      super("Autenticação obrigatória.");
    }
  },
  requireApiAuthenticatedPlayer: requireApiAuthenticatedPlayerMock,
}));

vi.mock("@/lib/builder/validate", () => ({
  validateBuilderStateForPhase: validateBuilderStateForPhaseMock,
}));

vi.mock("@/lib/observability/logger", () => ({
  logServerError: logServerErrorMock,
}));

vi.mock("@/lib/db/prisma", () => ({
  prisma: {},
}));

import { POST } from "@/app/api/phases/[phaseId]/builder/validate/route";
import { ApiAuthenticationRequiredError } from "@/lib/auth/session";

const branchedMethaneState: BranchedBuilderState = {
  kind: "branched_v2" as const,
  atoms: [{ id: "a1", element: "C" }],
  bonds: [],
  selectedAtomId: "a1",
  nextAtomIndex: 2,
  nextBondIndex: 1,
};

describe("api/phases/[phaseId]/builder/validate", () => {
  beforeEach(() => {
    requireApiAuthenticatedPlayerMock.mockReset();
    validateBuilderStateForPhaseMock.mockReset();
    logServerErrorMock.mockReset();
  });

  it("exige autenticação", async () => {
    requireApiAuthenticatedPlayerMock.mockRejectedValue(
      new ApiAuthenticationRequiredError(),
    );

    const response = await POST(
      new Request("http://localhost/api/phases/chapter-1-phase-1/builder/validate", {
        method: "POST",
        body: JSON.stringify(branchedMethaneState),
        headers: {
          "Content-Type": "application/json",
        },
      }),
      { params: Promise.resolve({ phaseId: "chapter-1-phase-1" }) },
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      error: "Autenticação obrigatória.",
    });
    expect(response.headers.get("Cache-Control")).toBe("no-store");
  });

  it("retorna payload inválido com no-store", async () => {
    requireApiAuthenticatedPlayerMock.mockResolvedValue({
      playerId: "player-1",
    });

    const response = await POST(
      new Request("http://localhost/api/phases/chapter-1-phase-1/builder/validate", {
        method: "POST",
        body: JSON.stringify({
          layout: "open_chain",
          carbonCount: 0,
          bonds: [],
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }),
      { params: Promise.resolve({ phaseId: "chapter-1-phase-1" }) },
    );

    expect(response.status).toBe(400);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    await expect(response.json()).resolves.toMatchObject({
      error: "Payload do builder inválido.",
    });
  });

  it("retorna a validação estruturada quando autenticado", async () => {
    requireApiAuthenticatedPlayerMock.mockResolvedValue({
      playerId: "player-1",
    });
    validateBuilderStateForPhaseMock.mockReturnValue({
      phaseId: "chapter-1-phase-1",
      structuralValid: true,
      canCreateMolecule: true,
      resolvedMoleculeId: "metano",
      errors: [],
      derivedStructure: {
        formulaMolecular: "C1H4",
      },
    });

    const response = await POST(
      new Request("http://localhost/api/phases/chapter-1-phase-1/builder/validate", {
        method: "POST",
        body: JSON.stringify(branchedMethaneState),
        headers: {
          "Content-Type": "application/json",
        },
      }),
      { params: Promise.resolve({ phaseId: "chapter-1-phase-1" }) },
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    await expect(response.json()).resolves.toMatchObject({
      phaseId: "chapter-1-phase-1",
      canCreateMolecule: true,
      resolvedMoleculeId: "metano",
    });
    expect(validateBuilderStateForPhaseMock).toHaveBeenCalledWith(
      "chapter-1-phase-1",
      branchedMethaneState,
    );
  });

  it("encaminha payload branched_v2 para o validador", async () => {
    requireApiAuthenticatedPlayerMock.mockResolvedValue({
      playerId: "player-1",
    });
    validateBuilderStateForPhaseMock.mockReturnValue({
      phaseId: "chapter-1-phase-1",
      structuralValid: true,
      canCreateMolecule: true,
      resolvedMoleculeId: "metano",
      errors: [],
      derivedStructure: {
        formulaMolecular: "C1H4",
      },
    });

    const response = await POST(
      new Request("http://localhost/api/phases/chapter-1-phase-1/builder/validate", {
        method: "POST",
        body: JSON.stringify(branchedMethaneState),
        headers: {
          "Content-Type": "application/json",
        },
      }),
      { params: Promise.resolve({ phaseId: "chapter-1-phase-1" }) },
    );

    expect(response.status).toBe(200);
    expect(validateBuilderStateForPhaseMock).toHaveBeenCalledWith(
      "chapter-1-phase-1",
      branchedMethaneState,
    );
  });

  it("registra falha inesperada do validador", async () => {
    requireApiAuthenticatedPlayerMock.mockResolvedValue({
      playerId: "player-1",
    });
    validateBuilderStateForPhaseMock.mockImplementation(() => {
      throw new Error("kaboom");
    });

    const response = await POST(
      new Request("http://localhost/api/phases/chapter-1-phase-1/builder/validate", {
        method: "POST",
        body: JSON.stringify(branchedMethaneState),
        headers: {
          "Content-Type": "application/json",
        },
      }),
      { params: Promise.resolve({ phaseId: "chapter-1-phase-1" }) },
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Falha interna ao validar estrutura do builder.",
    });
    expect(logServerErrorMock).toHaveBeenCalledWith(
      "phases.builder.validate",
      expect.any(Error),
      { phaseId: "chapter-1-phase-1" },
    );
  });
});
