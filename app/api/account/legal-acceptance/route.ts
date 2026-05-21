import {
  ApiAuthenticationRequiredError,
  ApiLegalAcceptanceRequiredError,
  requireApiAuthenticatedPlayer,
} from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { jsonNoStore } from "@/lib/http/response";
import { logServerError } from "@/lib/observability/logger";
import { updateLegalAcceptanceInputSchema } from "@/lib/privacy/schema";
import { updatePlayerLegalAcceptance } from "@/lib/privacy/service";

const UPDATE_LEGAL_ACCEPTANCE_CLIENT_ERRORS = new Set([
  "Jogador não encontrado.",
]);

export async function PATCH(request: Request) {
  try {
    const authenticatedPlayer = await requireApiAuthenticatedPlayer(prisma, {
      allowOutdatedLegalAcceptance: true,
    });
    const json = await request.json().catch(() => null);
    const parsedPayload = updateLegalAcceptanceInputSchema.safeParse(json);

    if (!parsedPayload.success) {
      return jsonNoStore(
        {
          error: "Payload de aceite legal inválido.",
          details: parsedPayload.error.flatten(),
        },
        { status: 400 },
      );
    }

    const updatedPlayer = await updatePlayerLegalAcceptance(
      prisma,
      authenticatedPlayer.playerId,
      parsedPayload.data,
    );

    return jsonNoStore(
      {
        legalAcceptance: updatedPlayer,
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof ApiAuthenticationRequiredError) {
      return jsonNoStore({ error: error.message }, { status: 401 });
    }

    if (error instanceof ApiLegalAcceptanceRequiredError) {
      return jsonNoStore({ error: error.message }, { status: 428 });
    }

    if (
      error instanceof Error &&
      UPDATE_LEGAL_ACCEPTANCE_CLIENT_ERRORS.has(error.message)
    ) {
      return jsonNoStore({ error: error.message }, { status: 400 });
    }

    logServerError("account.legal-acceptance.update", error);
    return jsonNoStore(
      { error: "Falha interna ao atualizar o aceite legal." },
      { status: 500 },
    );
  }
}
