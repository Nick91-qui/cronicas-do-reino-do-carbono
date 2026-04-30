import { registerPlayer } from "@/lib/auth/service";
import { registerInputSchema } from "@/lib/auth/schema";
import { getClientAddress, createFixedWindowRateLimiter } from "@/lib/http/rate-limit";
import { jsonNoStore } from "@/lib/http/response";
import { logServerError } from "@/lib/observability/logger";
import { setSessionCookie } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

const REGISTER_CLIENT_ERRORS = new Set([
  "Turma inválida. Cadastre uma turma antes de registrar jogadores.",
  "Username já está em uso.",
]);
const registerRateLimiter = createFixedWindowRateLimiter({
  limit: 3,
  windowMs: 1000 * 60,
});

export async function POST(request: Request) {
  const rateLimit = registerRateLimiter.consume(`register:${getClientAddress(request)}`);

  if (!rateLimit.allowed) {
    return jsonNoStore(
      { error: "Muitas tentativas de cadastro. Aguarde um pouco antes de tentar novamente." },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfterSeconds),
        },
      },
    );
  }

  const json = await request.json().catch(() => null);
  const parsedPayload = registerInputSchema.safeParse(json);

  if (!parsedPayload.success) {
    return jsonNoStore(
      { error: "Payload de cadastro inválido.", details: parsedPayload.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const { player, session } = await registerPlayer(prisma, parsedPayload.data);
    const response = jsonNoStore(
      {
        player: {
          id: player.id,
          displayName: player.displayName,
          username: player.username,
        },
      },
      { status: 201 },
    );

    setSessionCookie(response.cookies, session.token, session.expiresAt);
    return response;
  } catch (error) {
    if (error instanceof Error && REGISTER_CLIENT_ERRORS.has(error.message)) {
      return jsonNoStore({ error: error.message }, { status: 400 });
    }

    logServerError("auth.register", error);
    return jsonNoStore({ error: "Falha interna ao registrar jogador." }, { status: 500 });
  }
}
