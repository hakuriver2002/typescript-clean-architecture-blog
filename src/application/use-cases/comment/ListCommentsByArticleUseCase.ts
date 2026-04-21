import { ArticleRepository } from "../../../domain/repositories/ArticleRepository";
import { CommentRepository } from "../../../domain/repositories/CommentRepository";
import { AppError } from "../../../shared/AppError";

export class ListCommentsByArticleUseCase {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly articleRepository: ArticleRepository,
  ) { }

  async execute(input: { articleId: string; page: number; pageSize: number }) {
    const { articleId, page, pageSize } = input;
    const article = await this.articleRepository.findById(articleId);
    if (!article) throw new AppError("Article not found", 404);

    const result = await this.commentRepository.findByArticleId(articleId, page, pageSize);
    return {
      ...result,
      page,
      pageSize,
      totalPages: Math.ceil(result.total / pageSize),
    };
  }
}
