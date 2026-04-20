import { PasswordResetToken } from "@prisma/client";
import { PasswordResetTokenRepository } from "../../domain/repositories/PasswordResetTokenRepository";
import { prisma } from "../db/prisma";

export class PrismaPasswordResetTokenRepository implements PasswordResetTokenRepository {
  private toDomain(token: PasswordResetToken) {
    return token;
  }

  async create(input: { tokenHash: string; userId: string; expiresAt: Date }) {
    const token = await prisma.passwordResetToken.create({ data: input });
    return this.toDomain(token);
  }

  async findByHash(tokenHash: string) {
    const token = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });
    return token ? this.toDomain(token) : null;
  }

  async markUsed(id: string) {
    await prisma.passwordResetToken.update({
      where: { id },
      data: { usedAt: new Date() },
    });
  }
}