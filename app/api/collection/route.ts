import { NextResponse } from "next/server";

import { getAuthenticatedPlayer } from "@/lib/auth/session";
import { getPlayerCollection } from "@/lib/collection/service";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const player = await getAuthenticatedPlayer(prisma);

  if (!player) {
    return NextResponse.json({ error: "Autenticação obrigatória." }, { status: 401 });
  }

  const collection = await getPlayerCollection(prisma, player.playerId);
  return NextResponse.json(collection, { status: 200 });
}
