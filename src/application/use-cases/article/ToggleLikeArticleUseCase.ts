import { AppError } from "../../../shared/AppError";
import { ArticleRepository } from "../../../domain/repositories/ArticleRepository";
import { LikeRepository } from "../../../domain/repositories/LikeRepository";

export class ToggleLikeArticleUseCase {
  constructor(
    private readonly articleRepository: ArticleRepository,
    private readonly likeRepository: LikeRepository,
  ) { }

  async execute(input: { articleId: string; userId: string }) {
    const article = await this.articleRepository.findById(input.articleId);
    if (!article) throw new AppError("Article not found", 404);

    const existing = await this.likeRepository.find(input.userId, input.articleId);
    if (existing) {
      await this.likeRepository.delete(input.userId, input.articleId);
      return { liked: false, message: "Article unliked" };
    }

    await this.likeRepository.create({
      userId: input.userId,
      articleId: input.articleId,
      createdAt: new Date(),
    });
    return { liked: true, message: "Article liked" };
  }
}
