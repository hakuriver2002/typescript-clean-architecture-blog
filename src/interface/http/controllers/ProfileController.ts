import { Request, Response } from "express";
import { container } from "../../../infrastructure/container";

export class ProfileController {
  async getMe(req: Request, res: Response) {
    const result = await container.getMyProfileUseCase.execute(req.user!.id);
    return res.status(200).json(result);
  }

  async updateMe(req: Request, res: Response) {
    const result = await container.updateMyProfileUseCase.execute({
      userId: req.user!.id,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
    });
    return res.status(200).json(result);
  }

  async changePassword(req: Request, res: Response) {
    const result = await container.changeMyPasswordUseCase.execute({
      userId: req.user!.id,
      currentPassword: req.body.currentPassword,
      newPassword: req.body.newPassword,
    });
    return res.status(200).json(result);
  }

  async myArticles(req: Request, res: Response) {
    const page = Number(req.query.page);
    const pageSize = Number(req.query.pageSize);
    const result = await container.listMyArticlesUseCase.execute({
      authorId: req.user!.id,
      page,
      pageSize,
    });
    return res.status(200).json(result);
  }

  async myBookmarks(req: Request, res: Response) {
    const page = Number(req.query.page);
    const pageSize = Number(req.query.pageSize);
    const result = await container.listMyBookmarkedArticlesUseCase.execute({
      userId: req.user!.id,
      page,
      pageSize,
    });
    return res.status(200).json(result);
  }
}

export const profileController = new ProfileController();
