import jwt from "jsonwebtoken";
import { TokenService } from "../../domain/repositories/TokenService";
import { JwtPayload } from "../../domain/entities/Auth";
import { env } from "../config/env";
import { AppError } from "../../shared/AppError";

export class JwtService implements TokenService {
  signAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.ACCESS_TOKEN_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    });
  }

  verifyAccessToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    } catch {
      throw new AppError("Invalid or expired token", 401);
    }
  }
}