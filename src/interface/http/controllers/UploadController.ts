import { Request, Response } from "express";
import { AppError } from "../../../shared/AppError";
import { container } from "../../../infrastructure/container";

export class UploadController {
  async uploadArticleImage(req: Request, res: Response) {
    if (!req.file) throw new AppError("Image file is required", 422);

    const result = await container.uploadImageUseCase.execute({
      target: "article",
      actor: req.user,
      fileBuffer: req.file.buffer,
    });

    return res.status(201).json(result);
  }

  async uploadAvatar(req: Request, res: Response) {
    if (!req.file) throw new AppError("Image file is required", 422);

    const result = await container.uploadImageUseCase.execute({
      target: "avatar",
      actor: req.user,
      fileBuffer: req.file.buffer,
    });

    return res.status(201).json(result);
  }
}

export const uploadController = new UploadController();
