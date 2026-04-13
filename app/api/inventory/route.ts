import { NextResponse } from "next/server";

import { getAuthenticatedPlayer } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { getPlayerInventorySnapshot } from "@/lib/inventory/service";

export async function GET() {
  const player = await getAuthenticatedPlayer(prisma);

  if (!player) {
    return NextResponse.json({ error: "Autenticação obrigatória." }, { status: 401 });
  }

  const inventory = await getPlayerInventorySnapshot(prisma, player.playerId);
  return NextResponse.json(inventory, { status: 200 });
}
