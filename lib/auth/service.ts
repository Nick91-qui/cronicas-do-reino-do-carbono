import type { PrismaClient } from "@prisma/client";

import { ensurePlayerInventorySnapshot } from "@/lib/inventory/service";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import type { LoginInput, RegisterInput } from "@/lib/auth/schema";
import { createSessionForPlayer } from "@/lib/auth/session";

function normalizeUsername(username: string): string {
  return username.trim().toLowerCase();
}

function normalizeClassroomCode(classroomCode: string): string {
  return classroomCode.trim().toUpperCase();
}

export async function registerPlayer(db: PrismaClient, input: RegisterInput) {
  const classroomCode = normalizeClassroomCode(input.classroomCode);
  const username = normalizeUsername(input.username);

  const classroom = await db.classroom.findUnique({ where: { code: classroomCode } });

  if (!classroom) {
    throw new Error("Turma inválida. Cadastre uma turma antes de registrar jogadores.");
  }

  const existingPlayer = await db.player.findUnique({ where: { username } });

  if (existingPlayer) {
    throw new Error("Username já está em uso.");
  }

  const passwordHash = hashPassword(input.password);

  const player = await db.$transaction(async (tx) => {
    const createdPlayer = await tx.player.create({
      data: {
        classroomId: classroom.id,
        displayName: input.displayName.trim(),
        username,
        passwordHash,
      },
    });

    await ensurePlayerInventorySnapshot(tx, createdPlayer.id);

    await tx.playerAnalyticsEvent.create({
      data: {
        playerId: createdPlayer.id,
        eventType: "player_registered",
        payloadJson: {
          classroomCode,
          username,
        },
      },
    });

    return createdPlayer;
  });

  const session = await createSessionForPlayer(db, player.id);

  await db.playerAnalyticsEvent.create({
    data: {
      playerId: player.id,
      eventType: "player_authenticated",
      payloadJson: {
        reason: "register",
      },
    },
  });

  return {
    player,
    session,
  };
}

export async function loginPlayer(db: PrismaClient, input: LoginInput) {
  const username = normalizeUsername(input.username);

  const player = await db.player.findUnique({
    where: { username },
    include: { classroom: true },
  });

  if (!player || !verifyPassword(input.password, player.passwordHash)) {
    throw new Error("Credenciais inválidas.");
  }

  const session = await createSessionForPlayer(db, player.id);

  await db.playerAnalyticsEvent.create({
    data: {
      playerId: player.id,
      eventType: "player_authenticated",
      payloadJson: {
        reason: "login",
      },
    },
  });

  return {
    player,
    session,
  };
}
