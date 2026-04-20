import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../shared/AppError";
import { Permission, hasPermission } from "../../../infrastructure/security/rbac";

export function requirePermission(permission: Permission) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const role = req.user?.role ?? "GUEST";

    if (!hasPermission(role, permission)) {
      throw new AppError("Forbidden", 403);
    }

    next();
  };
}