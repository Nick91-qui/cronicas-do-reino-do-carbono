import { getAuthenticatedPlayer } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { jsonNoStore } from "@/lib/http/response";
import { getAllChaptersProgressView } from "@/lib/progress/queries";

export async function GET() {
  const player = await getAuthenticatedPlayer(prisma);

  if (!player) {
    return jsonNoStore({ error: "Autenticação obrigatória." }, { status: 401 });
  }

  const progress = await getAllChaptersProgressView(prisma, player.playerId);
  return jsonNoStore({ progress }, { status: 200 });
}
