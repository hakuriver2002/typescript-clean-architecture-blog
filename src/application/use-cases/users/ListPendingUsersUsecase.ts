import { UserRepository } from "../../../domain/repositories/UserRepository";

export interface ListPendingUsersInput {
    page: number;
    limit: number;
}

export class ListPendingUsersUseCase {
    constructor(private readonly userRepository: UserRepository) { }

    async execute(input: ListPendingUsersInput) {
        const { page, limit } = input;
        const { users, total } = await this.userRepository.list({
            status: "PENDING",
            page,
            limit,
        });

        return {
            data: users.map((u) => ({
                id: u.id,
                email: u.email,
                fullName: u.fullName,
                role: u.role,
                status: u.status,
                createdAt: u.createdAt,
            })),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
}