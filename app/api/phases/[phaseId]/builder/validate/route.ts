import { canonicalBuilderStateSchema } from "@/lib/builder/schema";
import { getAuthenticatedPlayer } from "@/lib/auth/session";
import { validateBuilderStateForPhase } from "@/lib/builder/validate";
import { phaseIdSchema } from "@/lib/content/schema";
import { prisma } from "@/lib/db/prisma";
import { jsonNoStore } from "@/lib/http/response";
import { logServerError } from "@/lib/observability/logger";

export async function POST(
  request: Request,
  context: { params: Promise<{ phaseId: string }> },
) {
  const { phaseId: rawPhaseId } = await context.params;
  const parsedPhaseId = phaseIdSchema.safeParse(rawPhaseId);

  if (!parsedPhaseId.success) {
    return jsonNoStore(
      { error: "Parâmetro de fase inválido." },
      { status: 400 },
    );
  }

  const authenticatedPlayer = await getAuthenticatedPlayer(prisma);

  if (!authenticatedPlayer) {
    return jsonNoStore({ error: "Autenticação obrigatória." }, { status: 401 });
  }

  try {
    const json = await request.json().catch(() => null);
    const parsedBuilderState = canonicalBuilderStateSchema.safeParse(json);

    if (!parsedBuilderState.success) {
      return jsonNoStore(
        {
          error: "Payload do builder inválido.",
          details: parsedBuilderState.error.flatten(),
        },
        { status: 400 },
      );
    }

    const result = validateBuilderStateForPhase(
      parsedPhaseId.data,
      parsedBuilderState.data,
    );

    return jsonNoStore(result, { status: 200 });
  } catch (error) {
    logServerError("phases.builder.validate", error, {
      phaseId: parsedPhaseId.data,
    });
    return jsonNoStore(
      { error: "Falha interna ao validar estrutura do builder." },
      { status: 500 },
    );
  }
}
