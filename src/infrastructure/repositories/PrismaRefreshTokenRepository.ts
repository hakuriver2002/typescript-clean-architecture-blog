import { RefreshToken } from "@prisma/client";
import { RefreshTokenRepository } from "../../domain/repositories/RefreshTokenRepository";
import { prisma } from "../db/prisma";

export class PrismaRefreshTokenRepository implements RefreshTokenRepository {
  private toDomain(token: RefreshToken) {
    return token;
  }

  async create(input: { tokenHash: string; userId: string; expiresAt: Date }) {
    const token = await prisma.refreshToken.create({ data: input });
    return this.toDomain(token);
  }

  async findByHash(tokenHash: string) {
    const token = await prisma.refreshToken.findUnique({ where: { tokenHash } });
    return token ? this.toDomain(token) : null;
  }

  async revoke(id: string) {
    await prisma.refreshToken.update({ where: { id }, data: { revokedAt: new Date() } });
  }

  async revokeAllForUser(userId: string) {
    await prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}