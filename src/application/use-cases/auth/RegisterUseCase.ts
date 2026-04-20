import { UserRepository } from "../../../domain/repositories/UserRepository";
import { HashService } from "../../../domain/repositories/HashService";
import { AppError } from "../../../shared/AppError";

interface RegisterInput {
  email: string;
  fullName: string;
  password: string;
}

export class RegisterUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashService: HashService,
  ) { }

  async execute(input: RegisterInput) {
    const exists = await this.userRepository.findByEmail(input.email);
    if (exists) {
      throw new AppError("Email already in use", 409);
    }

    const passwordHash = await this.hashService.hash(input.password);
    const user = await this.userRepository.create({
      email: input.email,
      fullName: input.fullName,
      passwordHash,
    });

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      status: user.status,
    };
  }
}