import type { Prisma, PrismaClient } from "@prisma/client";

import { verifyPassword } from "@/lib/auth/password";
import type { DeleteAccountInput } from "@/lib/privacy/schema";

type DbClient = PrismaClient | Prisma.TransactionClient;

export async function exportPlayerAccountData(db: DbClient, playerId: string) {
  const player = await db.player.findUnique({
    where: { id: playerId },
    include: {
      classroom: true,
      sessions: {
        orderBy: { expiresAt: "desc" },
      },
      chapterProgress: {
        orderBy: { chapterId: "asc" },
      },
      phaseSummaries: {
        orderBy: [{ phaseId: "asc" }],
      },
      phaseAttempts: {
        orderBy: { createdAt: "desc" },
      },
      inventory: true,
      rewardEvents: {
        orderBy: { grantedAt: "desc" },
      },
      analyticsEvents: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!player) {
    throw new Error("Jogador não encontrado.");
  }

  const { passwordHash: _passwordHash, ...safePlayer } = player;

  return {
    exportedAt: new Date().toISOString(),
    player: safePlayer,
  };
}

export async function deletePlayerAccount(
  db: PrismaClient,
  playerId: string,
  input: DeleteAccountInput,
) {
  const player = await db.player.findUnique({
    where: { id: playerId },
    select: {
      id: true,
      username: true,
      displayName: true,
      passwordHash: true,
    },
  });

  if (!player) {
    throw new Error("Jogador não encontrado.");
  }

  if (!verifyPassword(input.password, player.passwordHash)) {
    throw new Error("Senha atual inválida.");
  }

  await db.$transaction(async (tx) => {
    await tx.session.deleteMany({
      where: {
        playerId: player.id,
      },
    });

    await tx.player.delete({
      where: { id: player.id },
    });
  });

  return {
    deletedPlayerId: player.id,
    deletedUsername: player.username,
    deletedDisplayName: player.displayName,
  };
}
