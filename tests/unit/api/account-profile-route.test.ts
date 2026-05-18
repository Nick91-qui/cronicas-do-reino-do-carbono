import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  requireApiAuthenticatedPlayerMock,
  updatePlayerAccountProfileMock,
  logServerErrorMock,
} = vi.hoisted(() => ({
  requireApiAuthenticatedPlayerMock: vi.fn(),
  updatePlayerAccountProfileMock: vi.fn(),
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

vi.mock("@/lib/privacy/service", () => ({
  updatePlayerAccountProfile: updatePlayerAccountProfileMock,
}));

vi.mock("@/lib/observability/logger", () => ({
  logServerError: logServerErrorMock,
}));

vi.mock("@/lib/db/prisma", () => ({
  prisma: {},
}));

import { PATCH } from "@/app/api/account/profile/route";
import { ApiAuthenticationRequiredError } from "@/lib/auth/session";

describe("api/account/profile", () => {
  beforeEach(() => {
    requireApiAuthenticatedPlayerMock.mockReset();
    updatePlayerAccountProfileMock.mockReset();
    logServerErrorMock.mockReset();
  });

  it("exige autenticacao", async () => {
    requireApiAuthenticatedPlayerMock.mockRejectedValue(
      new ApiAuthenticationRequiredError(),
    );

    const response = await PATCH(
      new Request("http://localhost/api/account/profile"),
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
      new Request("http://localhost/api/account/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          displayName: "A",
          username: "ok",
        }),
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: "Payload de atualização de perfil inválido.",
    });
  });

  it("atualiza os dados da conta autenticada", async () => {
    requireApiAuthenticatedPlayerMock.mockResolvedValue({
      playerId: "player-1",
    });
    updatePlayerAccountProfileMock.mockResolvedValue({
      id: "player-1",
      displayName: "Novo Nome",
      username: "novo-username",
    });

    const response = await PATCH(
      new Request("http://localhost/api/account/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          displayName: "Novo Nome",
          username: "novo-username",
        }),
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      player: {
        id: "player-1",
        displayName: "Novo Nome",
        username: "novo-username",
      },
    });
    expect(updatePlayerAccountProfileMock).toHaveBeenCalledWith(
      {},
      "player-1",
      {
        displayName: "Novo Nome",
        username: "novo-username",
      },
    );
  });

  it("retorna erro de cliente quando o username ja esta em uso", async () => {
    requireApiAuthenticatedPlayerMock.mockResolvedValue({
      playerId: "player-1",
    });
    updatePlayerAccountProfileMock.mockRejectedValue(
      new Error("Username já está em uso."),
    );

    const response = await PATCH(
      new Request("http://localhost/api/account/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          displayName: "Novo Nome",
          username: "novo-username",
        }),
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Username já está em uso.",
    });
  });

  it("registra falha inesperada", async () => {
    requireApiAuthenticatedPlayerMock.mockResolvedValue({
      playerId: "player-1",
    });
    updatePlayerAccountProfileMock.mockRejectedValue(new Error("db down"));

    const response = await PATCH(
      new Request("http://localhost/api/account/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          displayName: "Novo Nome",
          username: "novo-username",
        }),
      }),
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Falha interna ao atualizar os dados da conta.",
    });
    expect(logServerErrorMock).toHaveBeenCalledWith(
      "account.profile.update",
      expect.any(Error),
    );
  });
});
