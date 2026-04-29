import { Request, Response } from "express";
import { container } from "../../../infrastructure/container";

export class ProfileController {
  private json(res: Response, statusCode: number, payload: unknown) {
    return res.status(statusCode).json(payload);
  }

  async getMe(req: Request, res: Response) {
    const result = await container.getMyProfileUseCase.execute(req.user!.id);
    return this.json(res, 200, result);
  }

  async updateMe(req: Request, res: Response) {
    const result = await container.updateMyProfileUseCase.execute({
      userId: req.user!.id,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
    });
    return this.json(res, 200, result);
  }

  async changePassword(req: Request, res: Response) {
    const result = await container.changeMyPasswordUseCase.execute({
      userId: req.user!.id,
      currentPassword: req.body.currentPassword,
      newPassword: req.body.newPassword,
    });
    return this.json(res, 200, result);
  }

  async myArticles(req: Request, res: Response) {
    const page = Number(req.query.page);
    const pageSize = Number(req.query.pageSize);
    const result = await container.listMyArticlesUseCase.execute({
      authorId: req.user!.id,
      page,
      pageSize,
    });
    return this.json(res, 200, result);
  }

  async myBookmarks(req: Request, res: Response) {
    const page = Number(req.query.page);
    const pageSize = Number(req.query.pageSize);
    const result = await container.listMyBookmarkedArticlesUseCase.execute({
      userId: req.user!.id,
      page,
      pageSize,
    });
    return this.json(res, 200, result);
  }
}

export const profileController = new ProfileController();
