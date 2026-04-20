import { Request, Response } from "express";
import { container } from "../../../infrastructure/container";

export class UserController {
  async list(req: Request, res: Response) {
    const status = req.query.status as "PENDING" | "ACTIVE" | "INACTIVE" | "REJECTED" | undefined;
    const role = req.query.role as "ADMIN" | "EDITOR" | "TRAINER" | "MEMBER" | undefined;
    const search = req.query.search as string | undefined;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await container.listUsersUseCase.execute({ status, role, search, page, limit });
    return res.status(200).json(result);
  }

  async listPending(req: Request, res: Response) {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await container.listPendingUsersUseCase.execute({ page, limit });
    return res.status(200).json(result);
  }

  async updateStatus(req: Request, res: Response) {
    const result = await container.updateUserStatusUseCase.execute({
      userId: String(req.params.id),
      status: req.body.status,
    });

    return res.status(200).json(result);
  }

  async updateRole(req: Request, res: Response) {
    const result = await container.updateUserRoleUseCase.execute({
      userId: String(req.params.id),
      role: req.body.role,
    });

    return res.status(200).json(result);
  }
}

export const userController = new UserController();