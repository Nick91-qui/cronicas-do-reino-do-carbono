import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  requireApiAuthenticatedPlayerMock,
  exportPlayerAccountDataMock,
  logServerErrorMock,
} = vi.hoisted(() => ({
  requireApiAuthenticatedPlayerMock: vi.fn(),
  exportPlayerAccountDataMock: vi.fn(),
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
  exportPlayerAccountData: exportPlayerAccountDataMock,
}));

vi.mock("@/lib/observability/logger", () => ({
  logServerError: logServerErrorMock,
}));

vi.mock("@/lib/db/prisma", () => ({
  prisma: {},
}));

import { GET } from "@/app/api/account/export/route";
import {
  ApiAuthenticationRequiredError,
  ApiLegalAcceptanceRequiredError,
} from "@/lib/auth/session";

describe("api/account/export", () => {
  beforeEach(() => {
    requireApiAuthenticatedPlayerMock.mockReset();
    exportPlayerAccountDataMock.mockReset();
    logServerErrorMock.mockReset();
  });

  it("exige autenticacao", async () => {
    requireApiAuthenticatedPlayerMock.mockRejectedValue(
      new ApiAuthenticationRequiredError(),
    );

    const response = await GET();

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      error: "Autenticação obrigatória.",
    });
  });

  it("exporta os dados da conta autenticada", async () => {
    requireApiAuthenticatedPlayerMock.mockResolvedValue({
      playerId: "player-1",
    });
    exportPlayerAccountDataMock.mockResolvedValue({
      exportedAt: "2026-05-18T00:00:00.000Z",
      player: {
        id: "player-1",
      },
    });

    const response = await GET();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      exportedAt: "2026-05-18T00:00:00.000Z",
      player: {
        id: "player-1",
      },
    });
    expect(exportPlayerAccountDataMock).toHaveBeenCalledWith({}, "player-1");
  });

  it("retorna 428 quando o aceite legal atualizado e obrigatorio", async () => {
    requireApiAuthenticatedPlayerMock.mockRejectedValue(
      new ApiLegalAcceptanceRequiredError(),
    );

    const response = await GET();

    expect(response.status).toBe(428);
    await expect(response.json()).resolves.toEqual({
      error: "Aceite atualizado dos documentos legais é obrigatório.",
    });
  });

  it("registra falha inesperada", async () => {
    requireApiAuthenticatedPlayerMock.mockResolvedValue({
      playerId: "player-1",
    });
    exportPlayerAccountDataMock.mockRejectedValue(new Error("db down"));

    const response = await GET();

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Falha interna ao exportar os dados da conta.",
    });
    expect(logServerErrorMock).toHaveBeenCalledWith(
      "account.export",
      expect.any(Error),
    );
  });
});
