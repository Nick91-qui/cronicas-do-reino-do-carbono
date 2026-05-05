import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  requireApiAuthenticatedPlayerMock,
  markPlayerSynthesisTutorialSeenMock,
  logServerErrorMock,
} = vi.hoisted(() => ({
  requireApiAuthenticatedPlayerMock: vi.fn(),
  markPlayerSynthesisTutorialSeenMock: vi.fn(),
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

vi.mock("@/lib/progress/service", () => ({
  markPlayerSynthesisTutorialSeen: markPlayerSynthesisTutorialSeenMock,
}));

vi.mock("@/lib/observability/logger", () => ({
  logServerError: logServerErrorMock,
}));

vi.mock("@/lib/db/prisma", () => ({
  prisma: {},
}));

import { POST } from "@/app/api/tutorials/synthesis/route";
import { ApiAuthenticationRequiredError } from "@/lib/auth/session";

describe("api/tutorials/synthesis", () => {
  beforeEach(() => {
    requireApiAuthenticatedPlayerMock.mockReset();
    markPlayerSynthesisTutorialSeenMock.mockReset();
    logServerErrorMock.mockReset();
  });

  it("exige autenticação", async () => {
    requireApiAuthenticatedPlayerMock.mockRejectedValue(
      new ApiAuthenticationRequiredError(),
    );

    const response = await POST();

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      error: "Autenticação obrigatória.",
    });
    expect(response.headers.get("Cache-Control")).toBe("no-store");
  });

  it("marca o tutorial como visto para o jogador autenticado", async () => {
    requireApiAuthenticatedPlayerMock.mockResolvedValue({
      playerId: "player-1",
    });
    markPlayerSynthesisTutorialSeenMock.mockResolvedValue(undefined);

    const response = await POST();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true });
    expect(markPlayerSynthesisTutorialSeenMock).toHaveBeenCalledWith(
      {},
      "player-1",
    );
    expect(response.headers.get("Cache-Control")).toBe("no-store");
  });

  it("registra falha inesperada da persistência", async () => {
    requireApiAuthenticatedPlayerMock.mockResolvedValue({
      playerId: "player-1",
    });
    markPlayerSynthesisTutorialSeenMock.mockRejectedValue(new Error("db down"));

    const response = await POST();

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Falha interna ao registrar o tutorial de sintese.",
    });
    expect(logServerErrorMock).toHaveBeenCalledWith(
      "tutorials.synthesis",
      expect.any(Error),
    );
  });
});
