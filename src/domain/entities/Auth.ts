export interface JwtPayload {
  sub: string;
  email: string;
  role: "ADMIN" | "EDITOR" | "TRAINER" | "MEMBER";
}

export interface AuthUser {
  id: string;
  email: string;
  role: "ADMIN" | "EDITOR" | "TRAINER" | "MEMBER";
}
