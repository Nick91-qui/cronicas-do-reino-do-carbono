import { getAuthenticatedPlayer } from "@/lib/auth/session";
import { phaseIdSchema } from "@/lib/content/schema";
import { prisma } from "@/lib/db/prisma";
import { submitPhaseForPlayer } from "@/lib/gameplay/submit-phase";
import { phaseSubmitSchema } from "@/lib/gameplay/schema";
import { jsonNoStore } from "@/lib/http/response";
import { logServerError } from "@/lib/observability/logger";

const PHASE_SUBMIT_CLIENT_ERRORS = new Set([
  "Fases de construção exigem `builderState`.",
  "Fases de escolha exigem `selectedMoleculeId`.",
  "Propriedades duplicadas não são permitidas na submissão.",
]);

export async function POST(
  request: Request,
  context: { params: Promise<{ phaseId: string }> },
) {
  const { phaseId: rawPhaseId } = await context.params;
  const parsedPhaseId = phaseIdSchema.safeParse(rawPhaseId);

  if (!parsedPhaseId.success) {
    return jsonNoStore({ error: "Parâmetro de fase inválido." }, { status: 400 });
  }

  const authenticatedPlayer = await getAuthenticatedPlayer(prisma);

  if (!authenticatedPlayer) {
    return jsonNoStore({ error: "Autenticação obrigatória." }, { status: 401 });
  }

  const json = await request.json().catch(() => null);
  const parsedPayload = phaseSubmitSchema.safeParse(json);

  if (!parsedPayload.success) {
    return jsonNoStore(
      { error: "Payload de submissão inválido.", details: parsedPayload.error.flatten() },
      { status: 400 },
    );
  }

  if (parsedPayload.data.phaseId !== parsedPhaseId.data) {
    return jsonNoStore(
      { error: "`phaseId` do payload não corresponde à rota solicitada." },
      { status: 400 },
    );
  }

  try {
    const result = await submitPhaseForPlayer(
      prisma,
      authenticatedPlayer.playerId,
      parsedPayload.data,
    );

    return jsonNoStore(result, { status: 200 });
  } catch (error) {
    if (error instanceof Error && PHASE_SUBMIT_CLIENT_ERRORS.has(error.message)) {
      return jsonNoStore({ error: error.message }, { status: 400 });
    }

    logServerError("phases.submit", error, { phaseId: parsedPhaseId.data });
    return jsonNoStore({ error: "Falha interna ao avaliar submissão." }, { status: 500 });
  }
}
