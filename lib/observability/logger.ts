type LogContext = Record<string, unknown> | undefined;

function normalizeError(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return {
    message: String(error),
  };
}

export function logServerError(scope: string, error: unknown, context?: LogContext) {
  console.error(`[crc][${scope}]`, {
    ...normalizeError(error),
    ...(context ?? {}),
  });
}
