import { NextResponse } from "next/server";

import { getAuthenticatedPlayer } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { getAllChaptersProgressView } from "@/lib/progress/queries";

export async function GET() {
  const player = await getAuthenticatedPlayer(prisma);

  if (!player) {
    return NextResponse.json({ error: "Autenticação obrigatória." }, { status: 401 });
  }

  const progress = await getAllChaptersProgressView(prisma, player.playerId);
  return NextResponse.json({ progress }, { status: 200 });
}
