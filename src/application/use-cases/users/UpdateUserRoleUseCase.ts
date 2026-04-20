import { UserRepository } from "../../../domain/repositories/UserRepository";
import { AppError } from "../../../shared/AppError";
import { Role } from "../../../domain/entities/User";

interface Input {
  userId: string;
  role: Role;
}

export class UpdateUserRoleUsecase {
  constructor(private readonly userRepository: UserRepository) { }

  async execute(input: Input) {
    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    await this.userRepository.updateRole(input.userId, input.role);
    return { message: "User role updated" };
  }
}