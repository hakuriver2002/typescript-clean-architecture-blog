import { UserRepository } from "../../../domain/repositories/UserRepository";
import { AppError } from "../../../shared/AppError";
import { Status } from "../../../domain/entities/User";

interface Input {
  userId: string;
  status: Status;
}

export class UpdateUserStatusUseCase {
  constructor(private readonly userRepository: UserRepository) { }

  async execute(input: Input) {
    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    await this.userRepository.updateStatus(input.userId, input.status);
    return { message: "User status updated" };
  }
}