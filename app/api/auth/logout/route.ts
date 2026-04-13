import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/db/prisma";
import { clearSessionCookie, deleteCurrentSession } from "@/lib/auth/session";

export async function POST() {
  const requestCookies = await cookies();
  await deleteCurrentSession(prisma, requestCookies);

  const response = NextResponse.json({ ok: true }, { status: 200 });
  clearSessionCookie(response.cookies);

  return response;
}
