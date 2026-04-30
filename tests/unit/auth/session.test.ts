import { beforeEach, describe, expect, it, vi } from "vitest";

const { cookiesMock } = vi.hoisted(() => ({
  cookiesMock: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: cookiesMock,
}));

import { getAuthenticatedPlayer } from "@/lib/auth/session";

describe("auth/session", () => {
  beforeEach(() => {
    cookiesMock.mockReset();
    process.env.DATABASE_URL = "postgresql://test";
    process.env.APP_BASE_URL = "http://localhost:3000";
    process.env.SESSION_SECRET = "test-session-secret";
  });

  it("remove sessão expirada ao tentar autenticar", async () => {
    cookiesMock.mockResolvedValue({
      get: () => ({ value: "token-1" }),
    });

    const deleteMany = vi.fn().mockResolvedValue({ count: 1 });
    const db = {
      session: {
        findUnique: vi.fn().mockResolvedValue({
          id: "hashed-token",
          expiresAt: new Date("2020-01-01T00:00:00.000Z"),
          player: {
            id: "player-1",
            classroomId: "class-1",
            classroom: { code: "ABC123" },
            displayName: "Jogador",
            username: "jogador",
          },
        }),
        deleteMany,
      },
    } as never;

    const result = await getAuthenticatedPlayer(db);

    expect(result).toBeNull();
    expect(deleteMany).toHaveBeenCalledWith({
      where: { id: "hashed-token" },
    });
  });

  it("retorna o jogador autenticado quando a sessão é válida", async () => {
    cookiesMock.mockResolvedValue({
      get: () => ({ value: "token-1" }),
    });

    const db = {
      session: {
        findUnique: vi.fn().mockResolvedValue({
          id: "hashed-token",
          expiresAt: new Date("2999-01-01T00:00:00.000Z"),
          player: {
            id: "player-1",
            classroomId: "class-1",
            classroom: { code: "ABC123" },
            displayName: "Jogador",
            username: "jogador",
          },
        }),
      },
    } as never;

    const result = await getAuthenticatedPlayer(db);

    expect(result).toMatchObject({
      playerId: "player-1",
      classroomId: "class-1",
      classroomCode: "ABC123",
      displayName: "Jogador",
      username: "jogador",
    });
  });
});
