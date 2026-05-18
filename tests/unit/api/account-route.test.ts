import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  requireApiAuthenticatedPlayerMock,
  clearSessionCookieMock,
  deletePlayerAccountMock,
  logServerErrorMock,
} = vi.hoisted(() => ({
  requireApiAuthenticatedPlayerMock: vi.fn(),
  clearSessionCookieMock: vi.fn(),
  deletePlayerAccountMock: vi.fn(),
  logServerErrorMock: vi.fn(),
}));

vi.mock("@/lib/auth/session", () => ({
  ApiAuthenticationRequiredError: class ApiAuthenticationRequiredError extends Error {
    constructor() {
      super("Autenticação obrigatória.");
    }
  },
  requireApiAuthenticatedPlayer: requireApiAuthenticatedPlayerMock,
  clearSessionCookie: clearSessionCookieMock,
}));

vi.mock("@/lib/privacy/service", () => ({
  deletePlayerAccount: deletePlayerAccountMock,
}));

vi.mock("@/lib/observability/logger", () => ({
  logServerError: logServerErrorMock,
}));

vi.mock("@/lib/db/prisma", () => ({
  prisma: {},
}));

import { DELETE } from "@/app/api/account/route";
import { ApiAuthenticationRequiredError } from "@/lib/auth/session";

describe("api/account", () => {
  beforeEach(() => {
    requireApiAuthenticatedPlayerMock.mockReset();
    clearSessionCookieMock.mockReset();
    deletePlayerAccountMock.mockReset();
    logServerErrorMock.mockReset();
  });

  it("exige autenticacao", async () => {
    requireApiAuthenticatedPlayerMock.mockRejectedValue(
      new ApiAuthenticationRequiredError(),
    );

    const response = await DELETE(new Request("http://localhost/api/account"));

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      error: "Autenticação obrigatória.",
    });
  });

  it("rejeita payload invalido", async () => {
    requireApiAuthenticatedPlayerMock.mockResolvedValue({
      playerId: "player-1",
    });

    const response = await DELETE(
      new Request("http://localhost/api/account", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: "12345678",
          confirmation: "texto errado",
        }),
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: "Payload de exclusão de conta inválido.",
    });
  });

  it("exclui a conta do jogador autenticado e limpa o cookie de sessao", async () => {
    requireApiAuthenticatedPlayerMock.mockResolvedValue({
      playerId: "player-1",
    });
    deletePlayerAccountMock.mockResolvedValue({
      deletedPlayerId: "player-1",
    });

    const response = await DELETE(
      new Request("http://localhost/api/account", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: "12345678",
          confirmation: "EXCLUIR MINHA CONTA",
        }),
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      ok: true,
      deletedPlayerId: "player-1",
    });
    expect(deletePlayerAccountMock).toHaveBeenCalledWith(
      {},
      "player-1",
      {
        password: "12345678",
        confirmation: "EXCLUIR MINHA CONTA",
      },
    );
    expect(clearSessionCookieMock).toHaveBeenCalledTimes(1);
  });

  it("retorna erro de cliente quando a senha atual e invalida", async () => {
    requireApiAuthenticatedPlayerMock.mockResolvedValue({
      playerId: "player-1",
    });
    deletePlayerAccountMock.mockRejectedValue(new Error("Senha atual inválida."));

    const response = await DELETE(
      new Request("http://localhost/api/account", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: "12345678",
          confirmation: "EXCLUIR MINHA CONTA",
        }),
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Senha atual inválida.",
    });
  });

  it("registra falha inesperada", async () => {
    requireApiAuthenticatedPlayerMock.mockResolvedValue({
      playerId: "player-1",
    });
    deletePlayerAccountMock.mockRejectedValue(new Error("db down"));

    const response = await DELETE(
      new Request("http://localhost/api/account", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: "12345678",
          confirmation: "EXCLUIR MINHA CONTA",
        }),
      }),
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Falha interna ao excluir a conta.",
    });
    expect(logServerErrorMock).toHaveBeenCalledWith(
      "account.delete",
      expect.any(Error),
    );
  });
});
