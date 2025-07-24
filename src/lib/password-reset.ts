import { randomBytes } from "crypto";
import { db } from "~/server/db";
import { env } from "~/env";

/**
 * Generates a secure random token
 */
export function generatePasswordResetToken(): string {
  return randomBytes(32).toString("hex");
}

/**
 * Creates a new password reset token for a user
 */
export async function createPasswordResetToken(
  userId: string,
): Promise<string> {
  await db.passwordResetToken.deleteMany({
    where: { userId },
  });

  const token = generatePasswordResetToken();
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 Stunden

  await db.passwordResetToken.create({
    data: {
      token,
      userId,
      expires,
    },
  });

  return token;
}

/**
 * Validates a password reset token
 */
export async function validatePasswordResetToken(token: string) {
  const tokenRecord = await db.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!tokenRecord) {
    return { valid: false, error: "Token nicht gefunden" };
  }

  if (tokenRecord.used) {
    return { valid: false, error: "Token wurde bereits verwendet" };
  }

  if (tokenRecord.expires < new Date()) {
    return { valid: false, error: "Token ist abgelaufen" };
  }

  return {
    valid: true,
    user: tokenRecord.user,
    tokenId: tokenRecord.id,
  };
}

/**
 * Marks a token as used
 */
export async function markTokenAsUsed(tokenId: string): Promise<void> {
  await db.passwordResetToken.update({
    where: { id: tokenId },
    data: { used: true },
  });
}

/**
 * Generates the password reset URL
 */
export function generatePasswordResetUrl(token: string): string {
  return `${env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;
}
