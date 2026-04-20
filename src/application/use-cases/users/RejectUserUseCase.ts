import { UserRepository } from "../../../domain/repositories/UserRepository";
import { AppError } from "../../../shared/AppError";

interface Input {
    userId: string;
    status: "REJECTED";
}

export class RejectUserUseCase {
    constructor(private readonly userRepository: UserRepository) { }

    async execute(input: Input) {
        const user = await this.userRepository.findById(input.userId);
        if (!user) {
            throw new AppError("User not found", 404);
        }

        await this.userRepository.updateStatus(input.userId, input.status);
        return { message: "User rejected" };
    }
}