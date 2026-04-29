import { Request, Response } from "express";
import { container } from "../../../infrastructure/container";

export class ArticleController {
  private jsonPaginated(res: Response, result: unknown) {
    return res.status(200).json(result);
  }

  private async trackPublishedArticleView(article: { id: string; status: string; viewCount: number }) {
    if (article.status !== "PUBLISHED") {
      return article;
    }

    await container.increaseViewUseCase.execute(article.id);

    return {
      ...article,
      viewCount: article.viewCount + 1,
    };
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
    const result = await container.listPublicArticlesUseCase.execute({
      page: Number(req.query.page),
      pageSize: Number(req.query.pageSize),
      search: typeof req.query.search === "string" ? req.query.search : undefined,
      category: typeof req.query.category === "string" ? req.query.category : undefined,
      tag: typeof req.query.tag === "string" ? req.query.tag : undefined,
      featured: typeof req.query.featured === "boolean" ? req.query.featured : undefined,
      sort: req.query.sort as "latest" | "popular" | undefined,
    });
    return this.jsonPaginated(res, result);
  }

  async listFeatured(req: Request, res: Response) {
    const result = await container.listFeaturedArticlesUseCase.execute(
      Number(req.query.page),
      Number(req.query.pageSize),
    );
    return this.jsonPaginated(res, result);
  }

  async listTrending(req: Request, res: Response) {
    const result = await container.listTrendingArticlesUseCase.execute(
      Number(req.query.page),
      Number(req.query.pageSize),
    );
    return this.jsonPaginated(res, result);
  }

  async listByTag(req: Request, res: Response) {
    const result = await container.listPublicArticlesUseCase.execute({
      page: Number(req.query.page),
      pageSize: Number(req.query.pageSize),
      tag: String(req.params.slug),
    });

    return this.jsonPaginated(res, result);
  }

  async listByCategory(req: Request, res: Response) {
    const result = await container.listPublicArticlesUseCase.execute({
      page: Number(req.query.page),
      pageSize: Number(req.query.pageSize),
      category: String(req.params.category),
    });

    return this.jsonPaginated(res, result);
  }

  async listRelatedById(req: Request, res: Response) {
    const result = await container.listRelatedArticlesByIdUseCase.execute({
      articleId: String(req.params.id),
      page: Number(req.query.page),
      pageSize: Number(req.query.pageSize),
    });

    return this.jsonPaginated(res, result);
  }

  async listRelatedBySlug(req: Request, res: Response) {
    const result = await container.listRelatedArticlesBySlugUseCase.execute({
      slug: String(req.params.slug),
      page: Number(req.query.page),
      pageSize: Number(req.query.pageSize),
    });

    return this.jsonPaginated(res, result);
  }

  async listMine(req: Request, res: Response) {
    const result = await container.listMyArticlesUseCase.execute({
      authorId: req.user!.id,
      page: Number(req.query.page),
      pageSize: Number(req.query.pageSize),
    });
    return this.jsonPaginated(res, result);
  }

  async getById(req: Request, res: Response) {
    const id = String(req.params.id);
    const article = await container.getArticleByIdUseCase.execute(id);
    const articleWithTrackedView = await this.trackPublishedArticleView(article);
    return res.status(200).json(articleWithTrackedView);
  }

  async getBySlug(req: Request, res: Response) {
    const slug = String(req.params.slug);
    const article = await container.getArticleBySlugUseCase.execute(slug);
    const articleWithTrackedView = await this.trackPublishedArticleView(article);
    return res.status(200).json(articleWithTrackedView);
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

  async toggleLike(req: Request, res: Response) {
    const result = await container.toggleLikeArticleUseCase.execute({
      articleId: String(req.params.id),
      userId: req.user!.id,
    });
    return res.status(200).json(result);
  }

  async toggleBookmark(req: Request, res: Response) {
    const result = await container.toggleBookmarkArticleUseCase.execute({
      articleId: String(req.params.id),
      userId: req.user!.id,
    });
    return res.status(200).json(result);
  }

  async increaseView(req: Request, res: Response) {
    const result = await container.increaseViewUseCase.execute(String(req.params.id));
    return res.status(200).json({
      articleId: result.id,
      viewCount: result.viewCount,
      message: "Article view count increased",
    });
  }

  async setFeatured(req: Request, res: Response) {
    const result = await container.setFeaturedArticleUseCase.execute({
      articleId: String(req.params.id),
      isFeatured: req.body.isFeatured,
    });
    return res.status(200).json({
      id: result.id,
      isFeatured: result.isFeatured,
      message: "Article featured status updated",
    });
  }
}
export const articleController = new ArticleController();
