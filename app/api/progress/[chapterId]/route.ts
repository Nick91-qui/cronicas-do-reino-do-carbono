import { NextResponse } from "next/server";

import { getAuthenticatedPlayer } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { getChapterProgressView } from "@/lib/progress/queries";

export async function GET(
  _request: Request,
  context: { params: Promise<{ chapterId: string }> },
) {
  const player = await getAuthenticatedPlayer(prisma);

  if (!player) {
    return NextResponse.json({ error: "Autenticação obrigatória." }, { status: 401 });
  }

  const { chapterId } = await context.params;

  if (chapterId !== "chapter-1") {
    return NextResponse.json({ error: "Capítulo inválido." }, { status: 400 });
  }

  const progress = await getChapterProgressView(prisma, player.playerId, "chapter-1");
  return NextResponse.json(progress, { status: 200 });
}
