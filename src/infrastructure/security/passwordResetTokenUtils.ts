import crypto from "crypto";

export function hashResetToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function generateResetToken(): string {
  return crypto.randomBytes(32).toString("hex");
}