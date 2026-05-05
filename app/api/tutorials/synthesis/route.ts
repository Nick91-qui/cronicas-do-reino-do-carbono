import {
  ApiAuthenticationRequiredError,
  requireApiAuthenticatedPlayer,
} from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { jsonNoStore } from "@/lib/http/response";
import { logServerError } from "@/lib/observability/logger";
import { markPlayerSynthesisTutorialSeen } from "@/lib/progress/service";

export async function POST() {
  try {
    const player = await requireApiAuthenticatedPlayer(prisma);

    await markPlayerSynthesisTutorialSeen(prisma, player.playerId);

    return jsonNoStore({ ok: true }, { status: 200 });
  } catch (error) {
    if (error instanceof ApiAuthenticationRequiredError) {
      return jsonNoStore({ error: error.message }, { status: 401 });
    }

    logServerError("tutorials.synthesis", error);
    return jsonNoStore(
      { error: "Falha interna ao registrar o tutorial de sintese." },
      { status: 500 },
    );
  }
}
