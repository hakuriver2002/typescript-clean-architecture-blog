export type Role = "ADMIN" | "EDITOR" | "TRAINER" | "MEMBER";
export type Status = "PENDING" | "ACTIVE" | "INACTIVE" | "REJECTED";

export interface User {
  id: string;
  email: string;
  fullName: string;
  passwordHash: string;
  role: Role;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
}