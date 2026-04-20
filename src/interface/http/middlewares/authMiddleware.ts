import { NextFunction, Request, Response } from "express";
import { JwtService } from "../../../infrastructure/security/JwtService";
import { AppError } from "../../../shared/AppError";

const jwtService = new JwtService();

export function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader && authHeader.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : undefined;
  const cookieToken = (req.cookies?.access_token as string | undefined) ?? undefined;
  const token = bearerToken || cookieToken;

  if (!token) {
    throw new AppError("Unauthorized", 401);
  }

  const payload = jwtService.verifyAccessToken(token);

  req.user = {
    id: payload.sub,
    email: payload.email,
    role: payload.role,
  };

  next();
}