import { EmailService } from "../../domain/repositories/EmailService";

export class ConsoleEmailService implements EmailService {
  async sendPasswordResetEmail(email: string, fullName: string, resetUrl: string): Promise<void> {
    console.log(`[EMAIL] Password reset for ${email}: ${resetUrl}`);
    console.log(`Full name: ${fullName}`);
  }
}