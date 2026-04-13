import { NextResponse } from "next/server";

import { registerPlayer } from "@/lib/auth/service";
import { registerInputSchema } from "@/lib/auth/schema";
import { setSessionCookie } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsedPayload = registerInputSchema.safeParse(json);

  if (!parsedPayload.success) {
    return NextResponse.json(
      { error: "Payload de cadastro inválido.", details: parsedPayload.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const { player, session } = await registerPlayer(prisma, parsedPayload.data);
    const response = NextResponse.json(
      {
        player: {
          id: player.id,
          displayName: player.displayName,
          username: player.username,
        },
      },
      { status: 201 },
    );

    setSessionCookie(response.cookies, session.token, session.expiresAt);
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao registrar jogador.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
