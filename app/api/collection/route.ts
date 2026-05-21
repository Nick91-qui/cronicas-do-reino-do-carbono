import {
  ApiAuthenticationRequiredError,
  ApiLegalAcceptanceRequiredError,
  requireApiAuthenticatedPlayer,
} from "@/lib/auth/session";
import { getPlayerCollection } from "@/lib/collection/service";
import { prisma } from "@/lib/db/prisma";
import { jsonNoStore } from "@/lib/http/response";
import { logServerError } from "@/lib/observability/logger";

export async function GET() {
  try {
    const player = await requireApiAuthenticatedPlayer(prisma);

    const collection = await getPlayerCollection(prisma, player.playerId);
    return jsonNoStore(collection, { status: 200 });
  } catch (error) {
    if (error instanceof ApiAuthenticationRequiredError) {
      return jsonNoStore({ error: error.message }, { status: 401 });
    }

    if (error instanceof ApiLegalAcceptanceRequiredError) {
      return jsonNoStore({ error: error.message }, { status: 428 });
    }

    logServerError("collection.get", error);
    return jsonNoStore(
      { error: "Falha interna ao carregar a coleção." },
      { status: 500 },
    );
  }
}
