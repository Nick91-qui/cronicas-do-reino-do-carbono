import { NextResponse } from "next/server";

import { phaseIdSchema } from "@/lib/content/schema";
import { evaluatePhaseSubmission } from "@/lib/gameplay/evaluate-phase";
import { phaseSubmitSchema } from "@/lib/gameplay/schema";

export async function POST(
  request: Request,
  context: { params: Promise<{ phaseId: string }> },
) {
  const { phaseId: rawPhaseId } = await context.params;
  const parsedPhaseId = phaseIdSchema.safeParse(rawPhaseId);

  if (!parsedPhaseId.success) {
    return NextResponse.json({ error: "Parâmetro de fase inválido." }, { status: 400 });
  }

  const json = await request.json().catch(() => null);
  const parsedPayload = phaseSubmitSchema.safeParse(json);

  if (!parsedPayload.success) {
    return NextResponse.json(
      { error: "Payload de submissão inválido.", details: parsedPayload.error.flatten() },
      { status: 400 },
    );
  }

  if (parsedPayload.data.phaseId !== parsedPhaseId.data) {
    return NextResponse.json(
      { error: "`phaseId` do payload não corresponde à rota solicitada." },
      { status: 400 },
    );
  }

  try {
    const result = evaluatePhaseSubmission(parsedPayload.data);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao avaliar submissão.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
