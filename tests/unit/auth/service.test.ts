import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  ensurePlayerInventorySnapshotMock,
  createSessionForPlayerMock,
} = vi.hoisted(() => ({
  ensurePlayerInventorySnapshotMock: vi.fn(),
  createSessionForPlayerMock: vi.fn(),
}));

vi.mock("@/lib/inventory/service", () => ({
  ensurePlayerInventorySnapshot: ensurePlayerInventorySnapshotMock,
}));

vi.mock("@/lib/auth/session", () => ({
  createSessionForPlayer: createSessionForPlayerMock,
}));

import { registerPlayer } from "@/lib/auth/service";

describe("auth/service", () => {
  beforeEach(() => {
    ensurePlayerInventorySnapshotMock.mockReset();
    createSessionForPlayerMock.mockReset();
    ensurePlayerInventorySnapshotMock.mockResolvedValue(undefined);
    createSessionForPlayerMock.mockResolvedValue({
      token: "token-1",
      expiresAt: new Date("2999-01-01T00:00:00.000Z"),
    });
  });

  it("rejeita nome no livro dos aprendizes já existente com comparação case-insensitive", async () => {
    const db = {
      classroom: {
        findUnique: vi.fn().mockResolvedValue({ id: "class-1", code: "ABC123" }),
      },
      player: {
        findUnique: vi.fn().mockResolvedValue(null),
        findFirst: vi.fn().mockResolvedValue({ id: "player-2" }),
      },
    } as never;

    await expect(
      registerPlayer(db, {
        classroomCode: "abc123",
        displayName: "  Nicholas  ",
        username: "nick-login",
        password: "12345678",
        privacyPolicyAcknowledged: true,
        termsOfUseAccepted: true,
      }),
    ).rejects.toThrow("Nome no livro dos aprendizes já está em uso.");
  });

  it("rejeita username já existente antes de criar o jogador", async () => {
    const db = {
      classroom: {
        findUnique: vi.fn().mockResolvedValue({ id: "class-1", code: "ABC123" }),
      },
      player: {
        findUnique: vi.fn().mockResolvedValue({ id: "player-2" }),
      },
    } as never;

    await expect(
      registerPlayer(db, {
        classroomCode: "ABC123",
        displayName: "Nicholas",
        username: "nick-login",
        password: "12345678",
        privacyPolicyAcknowledged: true,
        termsOfUseAccepted: true,
      }),
    ).rejects.toThrow("Username já está em uso.");
  });
});
