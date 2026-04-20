import { UserRepository } from "../../../domain/repositories/UserRepository";
import { PasswordResetTokenRepository } from "../../../domain/repositories/PasswordResetTokenRepository";
import { EmailService } from "../../../domain/repositories/EmailService";
import { env } from "../../../infrastructure/config/env";
import { generateResetToken, hashResetToken } from "../../../infrastructure/security/passwordResetTokenUtils";

export class ForgotPasswordUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordResetTokenRepository: PasswordResetTokenRepository,
    private readonly emailService: EmailService,
  ) { }

  async execute(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) return;

    if (user.status !== 'ACTIVE') return;

    const rawToken = generateResetToken();
    const tokenHash = hashResetToken(rawToken);
    const expiresAt = new Date(Date.now() + env.PASSWORD_RESET_TOKEN_EXPIRES_MINUTES * 60 * 1000);

    await this.passwordResetTokenRepository.create({ tokenHash, userId: user.id, expiresAt });

    const resetUrl = `${env.FRONTEND_BASE_URL}/reset-password?token=${rawToken}`;
    await this.emailService.sendPasswordResetEmail(user.email, user.fullName, resetUrl);
  }
}