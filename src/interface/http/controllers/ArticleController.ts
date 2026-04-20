import { Request, Response } from "express";
import { container } from "../../../infrastructure/container";
import { buildArticleUrl } from "../../../domain/utils/buildArticleUrl";

export class ArticleController {
  private getShortId(uuid: string): string {
    return uuid.split("-")[0];
  }

  async create(req: Request, res: Response) {
    const result = await container.createArticleUseCase.execute(
      req.body,
      req.user!.id,
    );
    return res.status(201).json(result);
  }

  async update(req: Request, res: Response) {
    const result = await container.updateArticleUseCase.execute(
      String(req.params.id),
      req.body,
    );
    return res.status(200).json(result);
  }

  async delete(req: Request, res: Response) {
    await container.deleteArticleUseCase.execute({
      articleId: String(req.params.id),
      actorId: req.user!.id,
      actorRole: req.user!.role,
    });

    return res.status(200).json({
      message: "Article deleted successfully",
    });
  }

  async listPublic(req: Request, res: Response) {
    const page = Number(req.query.page);
    const pageSize = Number(req.query.pageSize);
    const result = await container.listPublicArticlesUseCase.execute(page, pageSize);
    return res.status(200).json({
      ...result,
      page,
      pageSize,
      totalPages: Math.ceil(result.total / pageSize),
    });
  }

  async listMine(req: Request, res: Response) {
    console.log(req.user!.id);
    const page = Number(req.query.page);
    const pageSize = Number(req.query.pageSize);
    const result = await container.listMyArticlesUseCase.execute({
      authorId: req.user!.id,
      page,
      pageSize,
    });
    return res.status(200).json({
      ...result,
      page,
      pageSize,
      totalPages: Math.ceil(result.total / pageSize),
    });
  }

  async getById(req: Request, res: Response) {
    const id = String(req.params.id);
    const article = await container.getArticleByIdUseCase.execute(id);
    return res.status(200).json(article);
  }

  async getBySlug(req: Request, res: Response) {
    const slug = String(req.params.slug);
    const article = await container.getArticleBySlugUseCase.execute(slug);
    return res.status(200).json(article);
  }

  async submit(req: Request, res: Response) {
    const result = await container.submitArticleUseCase.execute(
      String(req.params.id),
    );
    return res.status(200).json(result);
  }

  async approve(req: Request, res: Response) {
    const result = await container.approveArticleUseCase.execute({
      articleId: String(req.params.id),
      actorId: req.user!.id,
      actorRole: req.user!.role,
    });

    return res.status(200).json(result);
  }

  async reject(req: Request, res: Response) {
    const { rejectionReason } = req.body;

    const result = await container.rejectArticleUseCase.execute({
      articleId: String(req.params.id),
      rejectionReason,
      actorId: req.user!.id,
      actorRole: req.user!.role,
    });

    return res.status(200).json(result);
  }


  //   async getBySlugAndId(req: Request, res: Response) {
  //     const id = String(req.params.id);
  //     const slug = String(req.params.slug);

  //     const article = await container.getArticleBySlugAndIdUseCase.execute(id);

  //     if (!article) {
  //       return res.status(404).json({ message: "Article not found" });
  //     }

  //     if (slug !== article.slug) {
  //       return res.redirect(301, `/${buildArticleUrl(article.slug, article.id)}`);
  //     }

  //     return res.status(200).json(article);
  //   }
  // }
}
export const articleController = new ArticleController();
