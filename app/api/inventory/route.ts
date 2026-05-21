import {
  ApiAuthenticationRequiredError,
  ApiLegalAcceptanceRequiredError,
  requireApiAuthenticatedPlayer,
} from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { jsonNoStore } from "@/lib/http/response";
import { getPlayerInventorySnapshot } from "@/lib/inventory/service";
import { logServerError } from "@/lib/observability/logger";

export async function GET() {
  try {
    const player = await requireApiAuthenticatedPlayer(prisma);

    const inventory = await getPlayerInventorySnapshot(prisma, player.playerId);
    return jsonNoStore(inventory, { status: 200 });
  } catch (error) {
    if (error instanceof ApiAuthenticationRequiredError) {
      return jsonNoStore({ error: error.message }, { status: 401 });
    }

    if (error instanceof ApiLegalAcceptanceRequiredError) {
      return jsonNoStore({ error: error.message }, { status: 428 });
    }

    logServerError("inventory.get", error);
    return jsonNoStore(
      { error: "Falha interna ao carregar o inventário." },
      { status: 500 },
    );
  }
}
