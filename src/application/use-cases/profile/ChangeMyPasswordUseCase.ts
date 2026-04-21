import { HashService } from "../../../domain/repositories/HashService";
import { UserRepository } from "../../../domain/repositories/UserRepository";
import { AppError } from "../../../shared/AppError";

export class ChangeMyPasswordUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashService: HashService,
  ) { }

  async execute(input: { userId: string; currentPassword: string; newPassword: string }) {
    const user = await this.userRepository.findById(input.userId);
    if (!user) throw new AppError("User not found", 404);

    const ok = await this.hashService.compare(input.currentPassword, user.passwordHash);
    if (!ok) throw new AppError("Current password is incorrect", 400);

    const nextHash = await this.hashService.hash(input.newPassword);
    await this.userRepository.updatePassword(input.userId, nextHash);

    return { message: "Password changed successfully" };
  }
}
