import {
  ApiAuthenticationRequiredError,
  clearSessionCookie,
  requireApiAuthenticatedPlayer,
} from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { jsonNoStore } from "@/lib/http/response";
import { logServerError } from "@/lib/observability/logger";
import { deleteAccountInputSchema } from "@/lib/privacy/schema";
import { deletePlayerAccount } from "@/lib/privacy/service";

const DELETE_ACCOUNT_CLIENT_ERRORS = new Set([
  "Jogador não encontrado.",
  "Senha atual inválida.",
]);

export async function DELETE(request: Request) {
  try {
    const authenticatedPlayer = await requireApiAuthenticatedPlayer(prisma);
    const json = await request.json().catch(() => null);
    const parsedPayload = deleteAccountInputSchema.safeParse(json);

    if (!parsedPayload.success) {
      return jsonNoStore(
        { error: "Payload de exclusão de conta inválido.", details: parsedPayload.error.flatten() },
        { status: 400 },
      );
    }

    const deleted = await deletePlayerAccount(
      prisma,
      authenticatedPlayer.playerId,
      parsedPayload.data,
    );

    const response = jsonNoStore(
      {
        ok: true,
        deletedPlayerId: deleted.deletedPlayerId,
      },
      { status: 200 },
    );
    clearSessionCookie(response.cookies);

    return response;
  } catch (error) {
    if (error instanceof ApiAuthenticationRequiredError) {
      return jsonNoStore({ error: error.message }, { status: 401 });
    }

    if (error instanceof Error && DELETE_ACCOUNT_CLIENT_ERRORS.has(error.message)) {
      return jsonNoStore({ error: error.message }, { status: 400 });
    }

    logServerError("account.delete", error);
    return jsonNoStore(
      { error: "Falha interna ao excluir a conta." },
      { status: 500 },
    );
  }
}
