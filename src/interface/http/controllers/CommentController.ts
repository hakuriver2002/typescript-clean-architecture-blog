import { Request, Response } from "express";
import { container } from "../../../infrastructure/container";

export class CommentController {
  async listByArticle(req: Request, res: Response) {
    const articleId = String(req.params.articleId);
    const page = Number(req.query.page);
    const pageSize = Number(req.query.pageSize);
    const comments = await container.listCommentsByArticleUseCase.execute({
      articleId,
      page,
      pageSize,
    });
    return res.status(200).json(comments);
  }

  async create(req: Request, res: Response) {
    const articleId = String(req.params.articleId);
    const result = await container.createCommentUseCase.execute({
      articleId,
      userId: req.user!.id,
      content: req.body.content,
      parentId: req.body.parentId,
    });

    return res.status(201).json(result);
  }

  async reply(req: Request, res: Response) {
    const result = await container.replyCommentUseCase.execute({
      parentCommentId: String(req.params.id),
      userId: req.user!.id,
      content: req.body.content,
    });

    return res.status(201).json(result);
  }

  async delete(req: Request, res: Response) {
    await container.deleteCommentUseCase.execute({
      id: String(req.params.commentId),
      articleId: String(req.params.articleId),
      userId: req.user!.id,
      role: req.user!.role,
    });

    return res.status(200).json({ message: "Comment deleted successfully" });
  }
}

export const commentController = new CommentController();
