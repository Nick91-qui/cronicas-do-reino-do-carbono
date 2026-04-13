import { NextResponse } from "next/server";

import { loginInputSchema } from "@/lib/auth/schema";
import { loginPlayer } from "@/lib/auth/service";
import { setSessionCookie } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsedPayload = loginInputSchema.safeParse(json);

  if (!parsedPayload.success) {
    return NextResponse.json(
      { error: "Payload de login inválido.", details: parsedPayload.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const { player, session } = await loginPlayer(prisma, parsedPayload.data);
    const response = NextResponse.json(
      {
        player: {
          id: player.id,
          displayName: player.displayName,
          username: player.username,
          classroomCode: player.classroom.code,
        },
      },
      { status: 200 },
    );

    setSessionCookie(response.cookies, session.token, session.expiresAt);
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao autenticar jogador.";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
