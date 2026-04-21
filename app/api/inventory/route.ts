import { getAuthenticatedPlayer } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { jsonNoStore } from "@/lib/http/response";
import { getPlayerInventorySnapshot } from "@/lib/inventory/service";

export async function GET() {
  const player = await getAuthenticatedPlayer(prisma);

  if (!player) {
    return jsonNoStore({ error: "Autenticação obrigatória." }, { status: 401 });
  }

  const inventory = await getPlayerInventorySnapshot(prisma, player.playerId);
  return jsonNoStore(inventory, { status: 200 });
}
