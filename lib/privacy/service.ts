import type { Prisma, PrismaClient } from "@prisma/client";

import { verifyPassword } from "@/lib/auth/password";
import type { DeleteAccountInput } from "@/lib/privacy/schema";
import type { UpdateAccountProfileInput } from "@/lib/privacy/schema";
import type { UpdateLegalAcceptanceInput } from "@/lib/privacy/schema";
import {
  PRIVACY_POLICY_VERSION,
  TERMS_OF_USE_VERSION,
} from "@/lib/legal/versions";

type DbClient = PrismaClient | Prisma.TransactionClient;

function normalizeUsername(username: string) {
  return username.trim().toLowerCase();
}

function normalizeDisplayName(displayName: string) {
  return displayName.trim();
}

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

export async function updatePlayerAccountProfile(
  db: PrismaClient,
  playerId: string,
  input: UpdateAccountProfileInput,
) {
  const displayName = normalizeDisplayName(input.displayName);
  const username = normalizeUsername(input.username);

  const currentPlayer = await db.player.findUnique({
    where: { id: playerId },
    select: {
      id: true,
      displayName: true,
      username: true,
    },
  });

  if (!currentPlayer) {
    throw new Error("Jogador não encontrado.");
  }

  const conflictingUsername = await db.player.findUnique({
    where: { username },
  });

  if (conflictingUsername && conflictingUsername.id !== playerId) {
    throw new Error("Username já está em uso.");
  }

  const conflictingDisplayName = await db.player.findFirst({
    where: {
      displayName: {
        equals: displayName,
        mode: "insensitive",
      },
      NOT: {
        id: playerId,
      },
    },
  });

  if (conflictingDisplayName) {
    throw new Error("Nome no livro dos aprendizes já está em uso.");
  }

  const updatedPlayer = await db.player.update({
    where: { id: playerId },
    data: {
      displayName,
      username,
    },
    select: {
      id: true,
      displayName: true,
      username: true,
    },
  });

  return updatedPlayer;
}

export async function updatePlayerLegalAcceptance(
  db: PrismaClient,
  playerId: string,
  _input: UpdateLegalAcceptanceInput,
) {
  const currentPlayer = await db.player.findUnique({
    where: { id: playerId },
    select: {
      id: true,
    },
  });

  if (!currentPlayer) {
    throw new Error("Jogador não encontrado.");
  }

  const acceptedAt = new Date();

  const updatedPlayer = await db.player.update({
    where: { id: playerId },
    data: {
      privacyPolicyAcknowledgedAt: acceptedAt,
      privacyPolicyVersion: PRIVACY_POLICY_VERSION,
      termsOfUseAcceptedAt: acceptedAt,
      termsOfUseVersion: TERMS_OF_USE_VERSION,
    },
    select: {
      id: true,
      privacyPolicyAcknowledgedAt: true,
      privacyPolicyVersion: true,
      termsOfUseAcceptedAt: true,
      termsOfUseVersion: true,
    },
  });

  return updatedPlayer;
}
