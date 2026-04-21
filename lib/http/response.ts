import { NextResponse } from "next/server";

type JsonInit = number | ResponseInit;

export function jsonNoStore(body: unknown, init?: JsonInit) {
  const response = NextResponse.json(body, init);
  response.headers.set("Cache-Control", "no-store");
  return response;
}
