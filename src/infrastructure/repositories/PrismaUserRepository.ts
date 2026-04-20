import { User, UserStatus } from "@prisma/client";
import { UserRepository, CreateUserInput, ListUsersInput, ListPendingUsersInput } from "../../domain/repositories/UserRepository";
import { prisma } from "../db/prisma";

export class PrismaUserRepository implements UserRepository {
  private toDomain(user: User) {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      passwordHash: user.passwordHash,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async create(input: CreateUserInput) {
    const user = await prisma.user.create({
      data: {
        fullName: input.fullName,
        email: input.email,
        passwordHash: input.passwordHash,
        status: UserStatus.PENDING,
      },
    });
    return this.toDomain(user);
  }

  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    return user ? this.toDomain(user) : null;
  }

  async findById(id: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    return user ? this.toDomain(user) : null;
  }

  async list(params: ListUsersInput) {
    const { status, role, search, page, limit } = params
    const skip = (page - 1) * limit;

    const where: any = {
      ...(status && { status }),
      ...(role && { role }),
      ...(search && {
        OR: [
          { email: { contains: search, mode: "insensitive" } },
          { fullName: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users: users.map((u) => this.toDomain(u)),
      total
    };
  }

  async listPending(params: ListPendingUsersInput) {
    const { page, limit } = params;
    const skip = (page - 1) * limit;

    const where: any = {
      status: "PENDING",
    };
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users: users.map((u) => this.toDomain(u)),
      total
    };
  }

  async updateStatus(userId: string, status: "PENDING" | "ACTIVE" | "INACTIVE" | "REJECTED") {
    await prisma.user.update({ where: { id: userId }, data: { status } });
  }

  async updateRole(userId: string, role: "ADMIN" | "EDITOR" | "TRAINER" | "MEMBER") {
    await prisma.user.update({ where: { id: userId }, data: { role } });
  }

  async updatePassword(userId: string, passwordHash: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  }

  async findByStatus(status: "PENDING" | "ACTIVE" | "INACTIVE" | "REJECTED") {
    const users = await prisma.user.findMany({ where: { status } });
    return users.map((u) => this.toDomain(u));
  }
}