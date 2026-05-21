import { createHmac, randomBytes } from "node:crypto";

import type { Prisma, PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getEnv } from "@/lib/validation/env";
import {
  PRIVACY_POLICY_VERSION,
  TERMS_OF_USE_VERSION,
} from "@/lib/legal/versions";

const SESSION_COOKIE_NAME = "crc_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7;

type DbClient = PrismaClient | Prisma.TransactionClient;

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
  role: "player" | "operator";
  displayName: string;
  username: string;
  hasSeenSynthesisTutorial: boolean;
  privacyPolicyVersion: string | null;
  termsOfUseVersion: string | null;
  needsLegalAcceptance: boolean;
  sessionExpiresAt: Date;
};

type AuthRequirementOptions = {
  allowOutdatedLegalAcceptance?: boolean;
};

export class ApiAuthenticationRequiredError extends Error {
  constructor() {
    super("Autenticação obrigatória.");
    this.name = "ApiAuthenticationRequiredError";
  }
}

export class ApiLegalAcceptanceRequiredError extends Error {
  constructor() {
    super("Aceite atualizado dos documentos legais é obrigatório.");
    this.name = "ApiLegalAcceptanceRequiredError";
  }
}

function needsCurrentLegalAcceptance(input: {
  privacyPolicyVersion: string | null;
  termsOfUseVersion: string | null;
}) {
  return (
    input.privacyPolicyVersion !== PRIVACY_POLICY_VERSION ||
    input.termsOfUseVersion !== TERMS_OF_USE_VERSION
  );
}

export async function createSessionForPlayer(db: DbClient, playerId: string) {
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

export async function getAuthenticatedPlayer(db: DbClient): Promise<AuthenticatedPlayer | null> {
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

  if (!session) {
    return null;
  }

  if (session.expiresAt <= new Date()) {
    await db.session.deleteMany({ where: { id: session.id } });
    return null;
  }

  return {
    playerId: session.player.id,
    classroomId: session.player.classroomId,
    classroomCode: session.player.classroom.code,
    role: session.player.role,
    displayName: session.player.displayName,
    username: session.player.username,
    hasSeenSynthesisTutorial: session.player.hasSeenSynthesisTutorial,
    privacyPolicyVersion: session.player.privacyPolicyVersion,
    termsOfUseVersion: session.player.termsOfUseVersion,
    needsLegalAcceptance: needsCurrentLegalAcceptance({
      privacyPolicyVersion: session.player.privacyPolicyVersion,
      termsOfUseVersion: session.player.termsOfUseVersion,
    }),
    sessionExpiresAt: session.expiresAt,
  };
}

export async function requireAuthenticatedPlayer(
  db: DbClient,
  options: AuthRequirementOptions = {},
): Promise<AuthenticatedPlayer> {
  const player = await getAuthenticatedPlayer(db);

  if (!player) {
    redirect("/login");
  }

  if (!options.allowOutdatedLegalAcceptance && player.needsLegalAcceptance) {
    redirect("/legal/update");
  }

  return player;
}

export async function requireApiAuthenticatedPlayer(
  db: DbClient,
  options: AuthRequirementOptions = {},
): Promise<AuthenticatedPlayer> {
  const player = await getAuthenticatedPlayer(db);

  if (!player) {
    throw new ApiAuthenticationRequiredError();
  }

  if (!options.allowOutdatedLegalAcceptance && player.needsLegalAcceptance) {
    throw new ApiLegalAcceptanceRequiredError();
  }

  return player;
}

export async function requireOperator(db: DbClient): Promise<AuthenticatedPlayer> {
  const player = await requireAuthenticatedPlayer(db);

  if (player.role !== "operator") {
    redirect("/hall");
  }

  return player;
}

export async function deleteCurrentSession(db: DbClient, cookieStore: CookieGetter) {
  const token = readSessionToken(cookieStore);

  if (!token) {
    return;
  }

  await db.session.deleteMany({ where: { id: hashSessionToken(token) } });
}
