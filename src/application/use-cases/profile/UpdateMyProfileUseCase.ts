import { UserRepository } from "../../../domain/repositories/UserRepository";
import { AppError } from "../../../shared/AppError";

export class UpdateMyProfileUseCase {
  constructor(private readonly userRepository: UserRepository) { }

  async execute(input: { userId: string; fullName?: string; avatarUrl?: string | null }) {
    const user = await this.userRepository.findById(input.userId);
    if (!user) throw new AppError("User not found", 404);

    await this.userRepository.updateProfile(input.userId, {
      fullName: input.fullName,
      avatarUrl: input.avatarUrl,
    });

    const updated = await this.userRepository.findById(input.userId);
    if (!updated) throw new AppError("User not found after update", 404);

    return {
      id: updated.id,
      email: updated.email,
      fullName: updated.fullName,
      avatarUrl: updated.avatarUrl ?? null,
      role: updated.role,
      status: updated.status,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }
}
