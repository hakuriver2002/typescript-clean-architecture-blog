import { UserRepository } from "../../../domain/repositories/UserRepository";

export class GetPendingUsersUseCase {
    constructor(private readonly userRepository: UserRepository) { }

    async execute() {
        const users = await this.userRepository.findByStatus("PENDING");

        return users.map((u) => ({
            id: u.id,
            email: u.email,
            fullName: u.fullName,
            role: u.role,
            status: u.status,
            createdAt: u.createdAt,
        }));
    }
}