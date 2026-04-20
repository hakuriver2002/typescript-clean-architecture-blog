export interface PasswordResetToken {
  id: string;
  tokenHash: string;
  userId: string;
  expiresAt: Date;
  usedAt: Date | null;
  createdAt: Date;
}

export interface PasswordResetTokenRepository {
  create(input: { tokenHash: string; userId: string; expiresAt: Date }): Promise<PasswordResetToken>;
  findByHash(tokenHash: string): Promise<PasswordResetToken | null>;
  markUsed(id: string): Promise<void>;
}