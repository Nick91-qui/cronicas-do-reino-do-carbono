import {
  ApiAuthenticationRequiredError,
  ApiLegalAcceptanceRequiredError,
  requireApiAuthenticatedPlayer,
} from "@/lib/auth/session";
import { getChapterById } from "@/lib/content/loaders";
import { prisma } from "@/lib/db/prisma";
import { jsonNoStore } from "@/lib/http/response";
import { logServerError } from "@/lib/observability/logger";
import { getChapterProgressView } from "@/lib/progress/queries";

export async function GET(
  _request: Request,
  context: { params: Promise<{ chapterId: string }> },
) {
  try {
    const player = await requireApiAuthenticatedPlayer(prisma);
    const { chapterId } = await context.params;
    let chapter;

    try {
      chapter = getChapterById(chapterId as never);
    } catch {
      return jsonNoStore({ error: "Capítulo inválido." }, { status: 400 });
    }

    const progress = await getChapterProgressView(prisma, player.playerId, chapter.id);
    return jsonNoStore(progress, { status: 200 });
  } catch (error) {
    if (error instanceof ApiAuthenticationRequiredError) {
      return jsonNoStore({ error: error.message }, { status: 401 });
    }

    if (error instanceof ApiLegalAcceptanceRequiredError) {
      return jsonNoStore({ error: error.message }, { status: 428 });
    }

    logServerError("progress.chapter.get", error);
    return jsonNoStore(
      { error: "Falha interna ao carregar o progresso do capítulo." },
      { status: 500 },
    );
  }
}
