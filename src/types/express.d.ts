import { AuthUser } from "../../domain/entities/Auth";

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export {};