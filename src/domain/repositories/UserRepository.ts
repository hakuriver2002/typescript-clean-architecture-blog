import { User } from "../entities/User";

export interface CreateUserInput {
  email: string;
  fullName: string;
  passwordHash: string;
}

export interface ListUsersInput {
  status?: "PENDING" | "ACTIVE" | "INACTIVE" | "REJECTED";
  role?: "ADMIN" | "EDITOR" | "TRAINER" | "MEMBER";
  search?: string;
  page: number;
  limit: number;
}

export interface ListPendingUsersInput {
  page: number;
  limit: number;
}

export interface UserRepository {
  create(input: CreateUserInput): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  list(params: ListUsersInput): Promise<{ users: User[]; total: number }>;
  listPending(params: ListPendingUsersInput): Promise<{ users: User[]; total: number }>;
  updateStatus(userId: string, status: "PENDING" | "ACTIVE" | "INACTIVE" | "REJECTED"): Promise<void>;
  updateRole(userId: string, role: "ADMIN" | "EDITOR" | "TRAINER" | "MEMBER"): Promise<void>;
  updateProfile(userId: string, data: { fullName?: string; avatarUrl?: string | null }): Promise<void>;
  updateAvatarUrl(userId: string, avatarUrl: string): Promise<void>;
  updatePassword(userId: string, passwordHash: string): Promise<void>;
  findByStatus(status: "PENDING" | "ACTIVE" | "INACTIVE" | "REJECTED"): Promise<User[]>;
}
