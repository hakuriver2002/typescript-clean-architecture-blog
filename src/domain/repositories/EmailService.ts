export interface EmailService {
  sendPasswordResetEmail(email: string, fullName: string, resetUrl: string): Promise<void>;
}