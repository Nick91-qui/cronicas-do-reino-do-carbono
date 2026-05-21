import {
  ApiAuthenticationRequiredError,
  ApiLegalAcceptanceRequiredError,
  requireApiAuthenticatedPlayer,
} from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { jsonNoStore } from "@/lib/http/response";
import { logServerError } from "@/lib/observability/logger";
import { updateAccountProfileInputSchema } from "@/lib/privacy/schema";
import { updatePlayerAccountProfile } from "@/lib/privacy/service";

const UPDATE_ACCOUNT_PROFILE_CLIENT_ERRORS = new Set([
  "Jogador não encontrado.",
  "Username já está em uso.",
  "Nome no livro dos aprendizes já está em uso.",
]);

export async function PATCH(request: Request) {
  try {
    const authenticatedPlayer = await requireApiAuthenticatedPlayer(prisma);
    const json = await request.json().catch(() => null);
    const parsedPayload = updateAccountProfileInputSchema.safeParse(json);

    if (!parsedPayload.success) {
      return jsonNoStore(
        { error: "Payload de atualização de perfil inválido.", details: parsedPayload.error.flatten() },
        { status: 400 },
      );
    }

    const updatedPlayer = await updatePlayerAccountProfile(
      prisma,
      authenticatedPlayer.playerId,
      parsedPayload.data,
    );

    return jsonNoStore(
      {
        player: updatedPlayer,
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
      UPDATE_ACCOUNT_PROFILE_CLIENT_ERRORS.has(error.message)
    ) {
      return jsonNoStore({ error: error.message }, { status: 400 });
    }

    logServerError("account.profile.update", error);
    return jsonNoStore(
      { error: "Falha interna ao atualizar os dados da conta." },
      { status: 500 },
    );
  }
}
