import { UserRepository } from "../../../domain/repositories/UserRepository";
import { AppError } from "../../../shared/AppError";

export class GetMyProfileUseCase {
  constructor(private readonly userRepository: UserRepository) { }

  async execute(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new AppError("User not found", 404);

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl ?? null,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
