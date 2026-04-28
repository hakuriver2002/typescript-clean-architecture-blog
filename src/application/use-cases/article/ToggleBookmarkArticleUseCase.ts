import { AppError } from "../../../shared/AppError";
import { ArticleRepository } from "../../../domain/repositories/ArticleRepository";
import { BookmarkRepository } from "../../../domain/repositories/BookmarkRepository";

export class ToggleBookmarkArticleUseCase {
  constructor(
    private readonly articleRepository: ArticleRepository,
    private readonly bookmarkRepository: BookmarkRepository,
  ) { }

  async execute(input: { articleId: string; userId: string }) {
    const article = await this.articleRepository.findById(input.articleId);
    if (!article) throw new AppError("Article not found", 404);

    const existing = await this.bookmarkRepository.find(input.userId, input.articleId);
    if (existing) {
      await this.bookmarkRepository.delete(input.userId, input.articleId);
      return {
        articleId: input.articleId,
        bookmarked: false,
        message: "Bookmark removed",
      };
    }

    await this.bookmarkRepository.create({
      userId: input.userId,
      articleId: input.articleId,
      createdAt: new Date(),
    });

    return {
      articleId: input.articleId,
      bookmarked: true,
      message: "Article bookmarked",
    };
  }
}
