import { describe, expect, it, vi } from "vitest";

import { updatePlayerAccountProfile } from "@/lib/privacy/service";

describe("privacy/profile-service", () => {
  it("rejeita username ja existente em outro jogador", async () => {
    const db = {
      player: {
        findUnique: vi
          .fn()
          .mockResolvedValueOnce({
            id: "player-1",
            displayName: "Jogador Atual",
            username: "jogador-atual",
          })
          .mockResolvedValueOnce({
            id: "player-2",
          }),
      },
    } as never;

    await expect(
      updatePlayerAccountProfile(db, "player-1", {
        displayName: "Novo Nome",
        username: "outro-login",
      }),
    ).rejects.toThrow("Username já está em uso.");
  });

  it("rejeita displayName ja existente em outro jogador com comparacao case-insensitive", async () => {
    const db = {
      player: {
        findUnique: vi
          .fn()
          .mockResolvedValueOnce({
            id: "player-1",
            displayName: "Jogador Atual",
            username: "jogador-atual",
          })
          .mockResolvedValueOnce(null),
        findFirst: vi.fn().mockResolvedValue({
          id: "player-3",
        }),
      },
    } as never;

    await expect(
      updatePlayerAccountProfile(db, "player-1", {
        displayName: "  nome no livro  ",
        username: "mesmo-login",
      }),
    ).rejects.toThrow("Nome no livro dos aprendizes já está em uso.");
  });

  it("normaliza e atualiza displayName e username do proprio jogador", async () => {
    const update = vi.fn().mockResolvedValue({
      id: "player-1",
      displayName: "Novo Nome",
      username: "novo-login",
    });
    const db = {
      player: {
        findUnique: vi
          .fn()
          .mockResolvedValueOnce({
            id: "player-1",
            displayName: "Jogador Atual",
            username: "jogador-atual",
          })
          .mockResolvedValueOnce(null),
        findFirst: vi.fn().mockResolvedValue(null),
        update,
      },
    } as never;

    const updated = await updatePlayerAccountProfile(db, "player-1", {
      displayName: "  Novo Nome  ",
      username: "Novo-Login",
    });

    expect(update).toHaveBeenCalledWith({
      where: { id: "player-1" },
      data: {
        displayName: "Novo Nome",
        username: "novo-login",
      },
      select: {
        id: true,
        displayName: true,
        username: true,
      },
    });
    expect(updated).toEqual({
      id: "player-1",
      displayName: "Novo Nome",
      username: "novo-login",
    });
  });
});
