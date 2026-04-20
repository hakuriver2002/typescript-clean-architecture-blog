import { TokenService } from "../../../domain/repositories/TokenService";
import { RefreshTokenRepository } from "../../../domain/repositories/RefreshTokenRepository";
import { UserRepository } from "../../../domain/repositories/UserRepository";
import { AppError } from "../../../shared/AppError";
import { env } from "../../../infrastructure/config/env";
import { generateRefreshToken, hashRefreshToken } from "../../../infrastructure/security/refreshTokenUtils";

export class CreateSessionUseCase {
  constructor(
    private readonly tokenService: TokenService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new AppError("User not found", 404);

    const accessToken = this.tokenService.signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken();
    const tokenHash = hashRefreshToken(refreshToken);
    const expiresAt = new Date(Date.now() + env.REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000);

    await this.refreshTokenRepository.create({ tokenHash, userId: user.id, expiresAt });

    return { accessToken, refreshToken, user };
  }
}