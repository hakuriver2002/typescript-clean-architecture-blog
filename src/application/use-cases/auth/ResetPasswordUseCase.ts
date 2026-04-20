import { UserRepository } from "../../../domain/repositories/UserRepository";
import { PasswordResetTokenRepository } from "../../../domain/repositories/PasswordResetTokenRepository";
import { HashService } from "../../../domain/repositories/HashService";
import { AppError } from "../../../shared/AppError";
import { hashResetToken } from "../../../infrastructure/security/passwordResetTokenUtils";

interface ResetPasswordInput {
  token: string;
  newPassword: string;
}

export class ResetPasswordUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordResetTokenRepository: PasswordResetTokenRepository,
    private readonly hashService: HashService,
  ) {}

  async execute(input: ResetPasswordInput): Promise<void> {
    const tokenHash = hashResetToken(input.token);
    const resetToken = await this.passwordResetTokenRepository.findByHash(tokenHash);

    if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
      throw new AppError("Invalid or expired reset token", 400);
    }

    const passwordHash = await this.hashService.hash(input.newPassword);
    await this.userRepository.updatePassword(resetToken.userId, passwordHash);
    await this.passwordResetTokenRepository.markUsed(resetToken.id);
  }
}