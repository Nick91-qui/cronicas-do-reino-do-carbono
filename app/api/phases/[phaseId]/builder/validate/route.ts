import { NextResponse } from "next/server";

import { builderStateCompatibilitySchema } from "@/lib/builder/schema";
import { validateBuilderStateForPhase } from "@/lib/builder/validate";
import { phaseIdSchema } from "@/lib/content/schema";

export async function POST(
  request: Request,
  context: { params: Promise<{ phaseId: string }> },
) {
  const { phaseId: rawPhaseId } = await context.params;
  const parsedPhaseId = phaseIdSchema.safeParse(rawPhaseId);

  if (!parsedPhaseId.success) {
    return NextResponse.json(
      { error: "Parâmetro de fase inválido." },
      { status: 400 },
    );
  }

  const json = await request.json().catch(() => null);
  const parsedBuilderState = builderStateCompatibilitySchema.safeParse(json);

  if (!parsedBuilderState.success) {
    return NextResponse.json(
      {
        error: "Payload do builder inválido.",
        details: parsedBuilderState.error.flatten(),
      },
      { status: 400 },
    );
  }

  const result = validateBuilderStateForPhase(parsedPhaseId.data, parsedBuilderState.data);

  return NextResponse.json(result, { status: 200 });
}
