import { loginInputSchema } from "@/lib/auth/schema";
import { loginPlayer } from "@/lib/auth/service";
import { jsonNoStore } from "@/lib/http/response";
import { logServerError } from "@/lib/observability/logger";
import { setSessionCookie } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

const LOGIN_CLIENT_ERRORS = new Set([
  "Credenciais inválidas.",
]);

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsedPayload = loginInputSchema.safeParse(json);

  if (!parsedPayload.success) {
    return jsonNoStore(
      { error: "Payload de login inválido.", details: parsedPayload.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const { player, session } = await loginPlayer(prisma, parsedPayload.data);
    const response = jsonNoStore(
      {
        player: {
          id: player.id,
          displayName: player.displayName,
          username: player.username,
          classroomCode: player.classroom.code,
        },
      },
      { status: 200 },
    );

    setSessionCookie(response.cookies, session.token, session.expiresAt);
    return response;
  } catch (error) {
    if (error instanceof Error && LOGIN_CLIENT_ERRORS.has(error.message)) {
      return jsonNoStore({ error: error.message }, { status: 401 });
    }

    logServerError("auth.login", error);
    return jsonNoStore({ error: "Falha interna ao autenticar jogador." }, { status: 500 });
  }
}
