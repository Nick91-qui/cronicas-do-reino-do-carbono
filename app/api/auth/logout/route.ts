import { cookies } from "next/headers";

import { prisma } from "@/lib/db/prisma";
import { clearSessionCookie, deleteCurrentSession } from "@/lib/auth/session";
import { jsonNoStore } from "@/lib/http/response";
import { logServerError } from "@/lib/observability/logger";

export async function POST() {
  try {
    const requestCookies = await cookies();
    await deleteCurrentSession(prisma, requestCookies);

    const response = jsonNoStore({ ok: true }, { status: 200 });
    clearSessionCookie(response.cookies);

    return response;
  } catch (error) {
    logServerError("auth.logout", error);
    return jsonNoStore({ error: "Falha interna ao encerrar sessão." }, { status: 500 });
  }
}
