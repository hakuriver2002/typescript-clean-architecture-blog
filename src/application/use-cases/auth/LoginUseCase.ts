import { UserRepository } from "../../../domain/repositories/UserRepository";
import { HashService } from "../../../domain/repositories/HashService";
import { AppError } from "../../../shared/AppError";

interface LoginInput {
  email: string;
  password: string;
}

export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashService: HashService,
  ) { }

  async execute(input: LoginInput) {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const validPassword = await this.hashService.compare(input.password, user.passwordHash);
    if (!validPassword) {
      throw new AppError("Invalid credentials", 401);
    }

    if (user.status !== "ACTIVE") {
      throw new AppError("Account is not active", 403);
    }

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      status: user.status,
    };
  }
}