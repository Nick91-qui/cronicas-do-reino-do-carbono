import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  requireApiAuthenticatedPlayerMock,
  updatePlayerLegalAcceptanceMock,
  logServerErrorMock,
} = vi.hoisted(() => ({
  requireApiAuthenticatedPlayerMock: vi.fn(),
  updatePlayerLegalAcceptanceMock: vi.fn(),
  logServerErrorMock: vi.fn(),
}));

vi.mock("@/lib/auth/session", () => ({
  ApiAuthenticationRequiredError: class ApiAuthenticationRequiredError extends Error {
    constructor() {
      super("Autenticação obrigatória.");
    }
  },
  ApiLegalAcceptanceRequiredError: class ApiLegalAcceptanceRequiredError extends Error {
    constructor() {
      super("Aceite atualizado dos documentos legais é obrigatório.");
    }
  },
  requireApiAuthenticatedPlayer: requireApiAuthenticatedPlayerMock,
}));

vi.mock("@/lib/privacy/service", () => ({
  updatePlayerLegalAcceptance: updatePlayerLegalAcceptanceMock,
}));

vi.mock("@/lib/observability/logger", () => ({
  logServerError: logServerErrorMock,
}));

vi.mock("@/lib/db/prisma", () => ({
  prisma: {},
}));

import { PATCH } from "@/app/api/account/legal-acceptance/route";
import { ApiAuthenticationRequiredError } from "@/lib/auth/session";

describe("api/account/legal-acceptance", () => {
  beforeEach(() => {
    requireApiAuthenticatedPlayerMock.mockReset();
    updatePlayerLegalAcceptanceMock.mockReset();
    logServerErrorMock.mockReset();
  });

  it("exige autenticacao", async () => {
    requireApiAuthenticatedPlayerMock.mockRejectedValue(
      new ApiAuthenticationRequiredError(),
    );

    const response = await PATCH(
      new Request("http://localhost/api/account/legal-acceptance", {
        method: "PATCH",
      }),
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      error: "Autenticação obrigatória.",
    });
  });

  it("rejeita payload invalido", async () => {
    requireApiAuthenticatedPlayerMock.mockResolvedValue({
      playerId: "player-1",
    });

    const response = await PATCH(
      new Request("http://localhost/api/account/legal-acceptance", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          privacyPolicyAcknowledged: true,
          termsOfUseAccepted: false,
        }),
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: "Payload de aceite legal inválido.",
    });
  });

  it("atualiza o aceite legal do jogador autenticado", async () => {
    requireApiAuthenticatedPlayerMock.mockResolvedValue({
      playerId: "player-1",
    });
    updatePlayerLegalAcceptanceMock.mockResolvedValue({
      id: "player-1",
      privacyPolicyVersion: "2026-05-21.1",
      termsOfUseVersion: "2026-05-21.1",
    });

    const response = await PATCH(
      new Request("http://localhost/api/account/legal-acceptance", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          privacyPolicyAcknowledged: true,
          termsOfUseAccepted: true,
        }),
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      legalAcceptance: {
        id: "player-1",
        privacyPolicyVersion: "2026-05-21.1",
        termsOfUseVersion: "2026-05-21.1",
      },
    });
    expect(updatePlayerLegalAcceptanceMock).toHaveBeenCalledWith(
      {},
      "player-1",
      {
        privacyPolicyAcknowledged: true,
        termsOfUseAccepted: true,
      },
    );
    expect(requireApiAuthenticatedPlayerMock).toHaveBeenCalledWith({}, {
      allowOutdatedLegalAcceptance: true,
    });
  });

  it("registra falha inesperada", async () => {
    requireApiAuthenticatedPlayerMock.mockResolvedValue({
      playerId: "player-1",
    });
    updatePlayerLegalAcceptanceMock.mockRejectedValue(new Error("db down"));

    const response = await PATCH(
      new Request("http://localhost/api/account/legal-acceptance", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          privacyPolicyAcknowledged: true,
          termsOfUseAccepted: true,
        }),
      }),
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Falha interna ao atualizar o aceite legal.",
    });
    expect(logServerErrorMock).toHaveBeenCalledWith(
      "account.legal-acceptance.update",
      expect.any(Error),
    );
  });
});
