import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const SCRYPT_KEY_LENGTH = 64;
const SCRYPT_SALT_LENGTH = 16;

export function hashPassword(password: string): string {
  const salt = randomBytes(SCRYPT_SALT_LENGTH).toString("hex");
  const hash = scryptSync(password, salt, SCRYPT_KEY_LENGTH).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, originalHash] = storedHash.split(":");

  if (!salt || !originalHash) {
    return false;
  }

  const originalBuffer = Buffer.from(originalHash, "hex");
  const comparisonBuffer = scryptSync(password, salt, originalBuffer.length);

  if (originalBuffer.length !== comparisonBuffer.length) {
    return false;
  }

  return timingSafeEqual(originalBuffer, comparisonBuffer);
}
