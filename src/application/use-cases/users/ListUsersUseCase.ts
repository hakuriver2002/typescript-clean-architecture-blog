import { UserRepository } from "../../../domain/repositories/UserRepository";

export interface ListUsersInput {
  status?: "PENDING" | "ACTIVE" | "INACTIVE" | "REJECTED";
  role?: "ADMIN" | "EDITOR" | "TRAINER" | "MEMBER";
  search?: string;
  page: number;
  limit: number;
}

export class ListUsersUseCase {
  constructor(private readonly userRepository: UserRepository) { }

  async execute(input: ListUsersInput) {
    const { status, role, search, page, limit } = input;
    const { users, total } = await this.userRepository.list({
      status,
      role,
      search,
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