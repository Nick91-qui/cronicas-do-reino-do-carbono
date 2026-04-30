type FixedWindowRateLimiterOptions = {
  limit: number;
  windowMs: number;
};

type RateLimitState = {
  count: number;
  resetAt: number;
};

export type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
  remaining: number;
};

type RateLimitStore = Map<string, RateLimitState>;

function getRetryAfterSeconds(resetAt: number, now: number) {
  return Math.max(1, Math.ceil((resetAt - now) / 1000));
}

export function getClientAddress(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  const realIp = request.headers.get("x-real-ip");

  return realIp?.trim() || "unknown";
}

export function createFixedWindowRateLimiter({
  limit,
  windowMs,
}: FixedWindowRateLimiterOptions) {
  const store: RateLimitStore = new Map();

  function consume(key: string, now = Date.now()): RateLimitResult {
    const current = store.get(key);

    if (!current || current.resetAt <= now) {
      const resetAt = now + windowMs;
      store.set(key, { count: 1, resetAt });

      return {
        allowed: true,
        retryAfterSeconds: getRetryAfterSeconds(resetAt, now),
        remaining: Math.max(0, limit - 1),
      };
    }

    if (current.count >= limit) {
      return {
        allowed: false,
        retryAfterSeconds: getRetryAfterSeconds(current.resetAt, now),
        remaining: 0,
      };
    }

    current.count += 1;
    store.set(key, current);

    return {
      allowed: true,
      retryAfterSeconds: getRetryAfterSeconds(current.resetAt, now),
      remaining: Math.max(0, limit - current.count),
    };
  }

  function clear() {
    store.clear();
  }

  return {
    consume,
    clear,
  };
}
