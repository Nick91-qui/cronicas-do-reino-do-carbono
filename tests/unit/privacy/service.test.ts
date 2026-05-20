import { describe, expect, it, vi } from "vitest";

import { hashPassword } from "@/lib/auth/password";
import {
  PRIVACY_POLICY_VERSION,
  TERMS_OF_USE_VERSION,
} from "@/lib/legal/versions";
import {
  deletePlayerAccount,
  exportPlayerAccountData,
} from "@/lib/privacy/service";

describe("privacy/service", () => {
  it("exporta os dados da conta sem expor passwordHash", async () => {
    const db = {
      player: {
        findUnique: vi.fn().mockResolvedValue({
          id: "player-1",
          classroomId: "class-1",
          role: "player",
          displayName: "Jogador",
          username: "jogador",
          passwordHash: "secret",
          privacyPolicyAcknowledgedAt: new Date("2026-05-20T10:00:00.000Z"),
          privacyPolicyVersion: PRIVACY_POLICY_VERSION,
          termsOfUseAcceptedAt: new Date("2026-05-20T10:00:00.000Z"),
          termsOfUseVersion: TERMS_OF_USE_VERSION,
          hasSeenSynthesisTutorial: false,
          createdAt: new Date("2026-01-01T00:00:00.000Z"),
          updatedAt: new Date("2026-01-02T00:00:00.000Z"),
          classroom: {
            id: "class-1",
            code: "ABC123",
            name: "Turma Alfa",
          },
          sessions: [],
          chapterProgress: [],
          phaseSummaries: [],
          phaseAttempts: [],
          inventory: null,
          rewardEvents: [],
          analyticsEvents: [],
        }),
      },
    } as never;

    const exported = await exportPlayerAccountData(db, "player-1");

    expect(exported.player).toMatchObject({
      id: "player-1",
      username: "jogador",
      classroom: {
        code: "ABC123",
      },
      privacyPolicyVersion: PRIVACY_POLICY_VERSION,
      termsOfUseVersion: TERMS_OF_USE_VERSION,
    });
    expect(exported.player).not.toHaveProperty("passwordHash");
    expect(typeof exported.exportedAt).toBe("string");
  });

  it("rejeita exclusao quando a senha atual e invalida", async () => {
    const db = {
      player: {
        findUnique: vi.fn().mockResolvedValue({
          id: "player-1",
          username: "jogador",
          displayName: "Jogador",
          passwordHash: hashPassword("senha-correta"),
        }),
      },
    } as never;

    await expect(
      deletePlayerAccount(db, "player-1", {
        password: "senha-incorreta",
        confirmation: "EXCLUIR MINHA CONTA",
      }),
    ).rejects.toThrow("Senha atual inválida.");
  });

  it("exclui a conta e invalida sessoes do jogador autenticado", async () => {
    const deleteMany = vi.fn().mockResolvedValue({ count: 1 });
    const deletePlayer = vi.fn().mockResolvedValue({ id: "player-1" });
    const transaction = vi.fn(async (callback: (tx: unknown) => Promise<void>) =>
      callback({
        session: {
          deleteMany,
        },
        player: {
          delete: deletePlayer,
        },
      }),
    );
    const db = {
      player: {
        findUnique: vi.fn().mockResolvedValue({
          id: "player-1",
          username: "jogador",
          displayName: "Jogador",
          passwordHash: hashPassword("senha-correta"),
        }),
      },
      $transaction: transaction,
    } as never;

    const deleted = await deletePlayerAccount(db, "player-1", {
      password: "senha-correta",
      confirmation: "EXCLUIR MINHA CONTA",
    });

    expect(deleteMany).toHaveBeenCalledWith({
      where: {
        playerId: "player-1",
      },
    });
    expect(deletePlayer).toHaveBeenCalledWith({
      where: { id: "player-1" },
    });
    expect(deleted).toMatchObject({
      deletedPlayerId: "player-1",
      deletedUsername: "jogador",
    });
  });
});
