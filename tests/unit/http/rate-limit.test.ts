import { describe, expect, it } from "vitest";

import {
  createFixedWindowRateLimiter,
  getClientAddress,
} from "@/lib/http/rate-limit";

describe("http/rate-limit", () => {
  it("permite até o limite e bloqueia dentro da mesma janela", () => {
    const limiter = createFixedWindowRateLimiter({
      limit: 2,
      windowMs: 10_000,
    });

    expect(limiter.consume("ip-1", 1_000)).toMatchObject({
      allowed: true,
      remaining: 1,
    });
    expect(limiter.consume("ip-1", 1_500)).toMatchObject({
      allowed: true,
      remaining: 0,
    });
    expect(limiter.consume("ip-1", 2_000)).toMatchObject({
      allowed: false,
      remaining: 0,
    });
  });

  it("reinicia a contagem quando a janela expira", () => {
    const limiter = createFixedWindowRateLimiter({
      limit: 1,
      windowMs: 1_000,
    });

    expect(limiter.consume("ip-1", 1_000).allowed).toBe(true);
    expect(limiter.consume("ip-1", 1_500).allowed).toBe(false);
    expect(limiter.consume("ip-1", 2_100)).toMatchObject({
      allowed: true,
      remaining: 0,
    });
  });

  it("usa x-forwarded-for prioritariamente para identificar o cliente", () => {
    const request = new Request("http://localhost", {
      headers: {
        "x-forwarded-for": "203.0.113.10, 10.0.0.1",
        "x-real-ip": "10.0.0.2",
      },
    });

    expect(getClientAddress(request)).toBe("203.0.113.10");
  });
});
