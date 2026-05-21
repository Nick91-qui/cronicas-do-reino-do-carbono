import {
  ApiAuthenticationRequiredError,
  ApiLegalAcceptanceRequiredError,
  requireApiAuthenticatedPlayer,
} from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { jsonNoStore } from "@/lib/http/response";
import { logServerError } from "@/lib/observability/logger";
import { exportPlayerAccountData } from "@/lib/privacy/service";

export async function GET() {
  try {
    const player = await requireApiAuthenticatedPlayer(prisma);
    const exported = await exportPlayerAccountData(prisma, player.playerId);

    return jsonNoStore(exported, { status: 200 });
  } catch (error) {
    if (error instanceof ApiAuthenticationRequiredError) {
      return jsonNoStore({ error: error.message }, { status: 401 });
    }

    if (error instanceof ApiLegalAcceptanceRequiredError) {
      return jsonNoStore({ error: error.message }, { status: 428 });
    }

    logServerError("account.export", error);
    return jsonNoStore(
      { error: "Falha interna ao exportar os dados da conta." },
      { status: 500 },
    );
  }
}
