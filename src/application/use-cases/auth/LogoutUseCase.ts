import { RefreshTokenRepository } from "../../../domain/repositories/RefreshTokenRepository";
import { hashRefreshToken } from "../../../infrastructure/security/refreshTokenUtils";

export class LogoutUseCase {
  constructor(private readonly refreshTokenRepository: RefreshTokenRepository) {}

  async execute(rawRefreshToken?: string) {
    if (!rawRefreshToken) return;

    const tokenHash = hashRefreshToken(rawRefreshToken);
    const stored = await this.refreshTokenRepository.findByHash(tokenHash);
    if (!stored || stored.revokedAt) return;

    await this.refreshTokenRepository.revoke(stored.id);
  }
}