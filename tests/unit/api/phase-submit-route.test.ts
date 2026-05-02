import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  requireApiAuthenticatedPlayerMock,
  submitPhaseForPlayerMock,
  logServerErrorMock,
} = vi.hoisted(() => ({
  requireApiAuthenticatedPlayerMock: vi.fn(),
  submitPhaseForPlayerMock: vi.fn(),
  logServerErrorMock: vi.fn(),
}));

vi.mock("@/lib/auth/session", () => ({
  ApiAuthenticationRequiredError: class ApiAuthenticationRequiredError extends Error {
    constructor() {
      super("Autenticação obrigatória.");
    }
  },
  requireApiAuthenticatedPlayer: requireApiAuthenticatedPlayerMock,
}));

vi.mock("@/lib/gameplay/submit-phase", () => ({
  submitPhaseForPlayer: submitPhaseForPlayerMock,
}));

vi.mock("@/lib/observability/logger", () => ({
  logServerError: logServerErrorMock,
}));

vi.mock("@/lib/db/prisma", () => ({
  prisma: {},
}));

import { POST } from "@/app/api/phases/[phaseId]/submit/route";
import { ApiAuthenticationRequiredError } from "@/lib/auth/session";

describe("api/phases/[phaseId]/submit", () => {
  beforeEach(() => {
    requireApiAuthenticatedPlayerMock.mockReset();
    submitPhaseForPlayerMock.mockReset();
    logServerErrorMock.mockReset();
  });

  it("exige autenticação", async () => {
    requireApiAuthenticatedPlayerMock.mockRejectedValue(
      new ApiAuthenticationRequiredError(),
    );

    const response = await POST(
      new Request("http://localhost/api/phases/chapter-1-phase-1/submit", {
        method: "POST",
        body: JSON.stringify({
          phaseId: "chapter-1-phase-1",
          builderState: {
            layout: "open_chain",
            carbonCount: 1,
            bonds: [],
          },
          selectedProperties: ["cadeia_curta"],
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }),
      { params: Promise.resolve({ phaseId: "chapter-1-phase-1" }) },
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      error: "Autenticação obrigatória.",
    });
    expect(response.headers.get("Cache-Control")).toBe("no-store");
  });

  it("submete a fase para o jogador autenticado", async () => {
    requireApiAuthenticatedPlayerMock.mockResolvedValue({
      playerId: "player-1",
    });
    submitPhaseForPlayerMock.mockResolvedValue({
      evaluation: { validationResult: "correct" },
      persistence: { attemptId: "attempt-1" },
    });

    const response = await POST(
      new Request("http://localhost/api/phases/chapter-1-phase-1/submit", {
        method: "POST",
        body: JSON.stringify({
          phaseId: "chapter-1-phase-1",
          builderState: {
            layout: "open_chain",
            carbonCount: 1,
            bonds: [],
          },
          selectedProperties: ["cadeia_curta"],
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }),
      { params: Promise.resolve({ phaseId: "chapter-1-phase-1" }) },
    );

    expect(response.status).toBe(200);
    expect(submitPhaseForPlayerMock).toHaveBeenCalledWith(
      {},
      "player-1",
      expect.objectContaining({
        phaseId: "chapter-1-phase-1",
      }),
    );
    await expect(response.json()).resolves.toMatchObject({
      evaluation: { validationResult: "correct" },
      persistence: { attemptId: "attempt-1" },
    });
  });

  it("registra falha inesperada no submit", async () => {
    requireApiAuthenticatedPlayerMock.mockResolvedValue({
      playerId: "player-1",
    });
    submitPhaseForPlayerMock.mockRejectedValue(new Error("kaboom"));

    const response = await POST(
      new Request("http://localhost/api/phases/chapter-1-phase-1/submit", {
        method: "POST",
        body: JSON.stringify({
          phaseId: "chapter-1-phase-1",
          builderState: {
            layout: "open_chain",
            carbonCount: 1,
            bonds: [],
          },
          selectedProperties: ["cadeia_curta"],
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }),
      { params: Promise.resolve({ phaseId: "chapter-1-phase-1" }) },
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Falha interna ao avaliar submissão.",
    });
    expect(logServerErrorMock).toHaveBeenCalledWith(
      "phases.submit",
      expect.any(Error),
      { phaseId: "chapter-1-phase-1" },
    );
  });
});
