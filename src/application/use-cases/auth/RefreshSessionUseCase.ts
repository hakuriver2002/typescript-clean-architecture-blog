import { TokenService } from "../../../domain/repositories/TokenService";
import { RefreshTokenRepository } from "../../../domain/repositories/RefreshTokenRepository";
import { UserRepository } from "../../../domain/repositories/UserRepository";
import { AppError } from "../../../shared/AppError";
import { env } from "../../../infrastructure/config/env";
import { generateRefreshToken, hashRefreshToken } from "../../../infrastructure/security/refreshTokenUtils";

export class RefreshSessionUseCase {
  constructor(
    private readonly tokenService: TokenService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(rawRefreshToken: string) {
    const tokenHash = hashRefreshToken(rawRefreshToken);
    const stored = await this.refreshTokenRepository.findByHash(tokenHash);

    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      throw new AppError("Invalid refresh token", 401);
    }

    const user = await this.userRepository.findById(stored.userId);
    if (!user) throw new AppError("User not found", 404);

    await this.refreshTokenRepository.revoke(stored.id);

    const newRefreshToken = generateRefreshToken();
    const newHash = hashRefreshToken(newRefreshToken);
    const expiresAt = new Date(Date.now() + env.REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000);
    await this.refreshTokenRepository.create({ tokenHash: newHash, userId: user.id, expiresAt });

    const accessToken = this.tokenService.signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return { accessToken, refreshToken: newRefreshToken };
  }
}