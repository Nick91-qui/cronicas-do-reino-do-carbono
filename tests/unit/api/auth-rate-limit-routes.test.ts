import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  loginPlayerMock,
  registerPlayerMock,
  setSessionCookieMock,
  logServerErrorMock,
  consumeLoginMock,
  consumeRegisterMock,
} = vi.hoisted(() => ({
  loginPlayerMock: vi.fn(),
  registerPlayerMock: vi.fn(),
  setSessionCookieMock: vi.fn(),
  logServerErrorMock: vi.fn(),
  consumeLoginMock: vi.fn(),
  consumeRegisterMock: vi.fn(),
}));

vi.mock("@/lib/auth/service", () => ({
  loginPlayer: loginPlayerMock,
  registerPlayer: registerPlayerMock,
}));

vi.mock("@/lib/auth/session", () => ({
  setSessionCookie: setSessionCookieMock,
}));

vi.mock("@/lib/observability/logger", () => ({
  logServerError: logServerErrorMock,
}));

vi.mock("@/lib/db/prisma", () => ({
  prisma: {},
}));

vi.mock("@/lib/http/rate-limit", () => ({
  getClientAddress: () => "203.0.113.10",
  createFixedWindowRateLimiter: vi
    .fn()
    .mockReturnValueOnce({ consume: consumeLoginMock })
    .mockReturnValueOnce({ consume: consumeRegisterMock }),
}));

import { POST as loginPost } from "@/app/api/auth/login/route";
import { POST as registerPost } from "@/app/api/auth/register/route";

describe("api/auth rate limiting", () => {
  beforeEach(() => {
    loginPlayerMock.mockReset();
    registerPlayerMock.mockReset();
    setSessionCookieMock.mockReset();
    logServerErrorMock.mockReset();
    consumeLoginMock.mockReset();
    consumeRegisterMock.mockReset();
  });

  it("retorna 429 em login acima do limite", async () => {
    consumeLoginMock.mockReturnValue({
      allowed: false,
      retryAfterSeconds: 120,
      remaining: 0,
    });

    const response = await loginPost(
      new Request("http://localhost/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username: "nick", password: "12345678" }),
        headers: { "Content-Type": "application/json" },
      }),
    );

    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("120");
    await expect(response.json()).resolves.toEqual({
      error: "Muitas tentativas de login. Aguarde um pouco antes de tentar novamente.",
    });
    expect(loginPlayerMock).not.toHaveBeenCalled();
  });

  it("retorna 429 em cadastro acima do limite", async () => {
    consumeRegisterMock.mockReturnValue({
      allowed: false,
      retryAfterSeconds: 300,
      remaining: 0,
    });

    const response = await registerPost(
      new Request("http://localhost/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          classroomCode: "ABC123",
          displayName: "Nick",
          username: "nick",
          password: "12345678",
        }),
        headers: { "Content-Type": "application/json" },
      }),
    );

    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("300");
    await expect(response.json()).resolves.toEqual({
      error: "Muitas tentativas de cadastro. Aguarde um pouco antes de tentar novamente.",
    });
    expect(registerPlayerMock).not.toHaveBeenCalled();
  });
});
