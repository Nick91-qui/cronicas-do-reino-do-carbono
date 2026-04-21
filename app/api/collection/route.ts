import { getAuthenticatedPlayer } from "@/lib/auth/session";
import { getPlayerCollection } from "@/lib/collection/service";
import { prisma } from "@/lib/db/prisma";
import { jsonNoStore } from "@/lib/http/response";

export async function GET() {
  const player = await getAuthenticatedPlayer(prisma);

  if (!player) {
    return jsonNoStore({ error: "Autenticação obrigatória." }, { status: 401 });
  }

  const collection = await getPlayerCollection(prisma, player.playerId);
  return jsonNoStore(collection, { status: 200 });
}
