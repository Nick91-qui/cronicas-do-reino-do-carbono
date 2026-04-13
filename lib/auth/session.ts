import { createHmac, randomBytes } from "node:crypto";

import type { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getEnv } from "@/lib/validation/env";

const SESSION_COOKIE_NAME = "crc_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7;

type CookieGetter = {
  get(name: string): { value: string } | undefined;
};

type CookieSetter = {
  set(
    name: string,
    value: string,
    options?: {
      httpOnly?: boolean;
      sameSite?: "lax" | "strict" | "none";
      secure?: boolean;
      path?: string;
      expires?: Date;
      maxAge?: number;
    },
  ): void;
};

function getSessionSecret(): string {
  return getEnv().SESSION_SECRET;
}

function createSessionToken(): string {
  return randomBytes(32).toString("hex");
}

function hashSessionToken(token: string): string {
  return createHmac("sha256", getSessionSecret()).update(token).digest("hex");
}

function buildCookieOptions(expiresAt: Date) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  };
}

export type AuthenticatedPlayer = {
  playerId: string;
  classroomId: string;
  classroomCode: string;
  displayName: string;
  username: string;
  sessionExpiresAt: Date;
};

export async function createSessionForPlayer(db: PrismaClient, playerId: string) {
  const token = createSessionToken();
  const sessionId = hashSessionToken(token);
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await db.session.create({
    data: {
      id: sessionId,
      playerId,
      expiresAt,
    },
  });

  return { token, expiresAt };
}

export function setSessionCookie(cookieStore: CookieSetter, token: string, expiresAt: Date) {
  cookieStore.set(SESSION_COOKIE_NAME, token, buildCookieOptions(expiresAt));
}

export function clearSessionCookie(cookieStore: CookieSetter) {
  cookieStore.set(SESSION_COOKIE_NAME, "", {
    ...buildCookieOptions(new Date(0)),
    maxAge: 0,
  });
}

function readSessionToken(cookieStore: CookieGetter): string | null {
  return cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
}

export async function getAuthenticatedPlayer(db: PrismaClient): Promise<AuthenticatedPlayer | null> {
  const cookieStore = await cookies();
  const token = readSessionToken(cookieStore);

  if (!token) {
    return null;
  }

  const session = await db.session.findUnique({
    where: { id: hashSessionToken(token) },
    include: {
      player: {
        include: {
          classroom: true,
        },
      },
    },
  });

  if (!session || session.expiresAt <= new Date()) {
    return null;
  }

  return {
    playerId: session.player.id,
    classroomId: session.player.classroomId,
    classroomCode: session.player.classroom.code,
    displayName: session.player.displayName,
    username: session.player.username,
    sessionExpiresAt: session.expiresAt,
  };
}

export async function requireAuthenticatedPlayer(db: PrismaClient): Promise<AuthenticatedPlayer> {
  const player = await getAuthenticatedPlayer(db);

  if (!player) {
    redirect("/login");
  }

  return player;
}

export async function deleteCurrentSession(db: PrismaClient, cookieStore: CookieGetter) {
  const token = readSessionToken(cookieStore);

  if (!token) {
    return;
  }

  await db.session.deleteMany({ where: { id: hashSessionToken(token) } });
}
