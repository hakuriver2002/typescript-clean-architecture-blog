import { JwtPayload } from "../entities/Auth";

export interface TokenService {
  signAccessToken(payload: JwtPayload): string;
  verifyAccessToken(token: string): JwtPayload;
}