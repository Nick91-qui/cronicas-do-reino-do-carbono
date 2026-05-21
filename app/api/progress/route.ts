import {
  ApiAuthenticationRequiredError,
  ApiLegalAcceptanceRequiredError,
  requireApiAuthenticatedPlayer,
} from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { jsonNoStore } from "@/lib/http/response";
import { logServerError } from "@/lib/observability/logger";
import { getAllChaptersProgressView } from "@/lib/progress/queries";

export async function GET() {
  try {
    const player = await requireApiAuthenticatedPlayer(prisma);

    const progress = await getAllChaptersProgressView(prisma, player.playerId);
    return jsonNoStore({ progress }, { status: 200 });
  } catch (error) {
    if (error instanceof ApiAuthenticationRequiredError) {
      return jsonNoStore({ error: error.message }, { status: 401 });
    }

    if (error instanceof ApiLegalAcceptanceRequiredError) {
      return jsonNoStore({ error: error.message }, { status: 428 });
    }

    logServerError("progress.get", error);
    return jsonNoStore(
      { error: "Falha interna ao carregar o progresso." },
      { status: 500 },
    );
  }
}
