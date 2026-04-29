import { AppError } from "../../../shared/AppError";
import { ArticleRepository } from "../../../domain/repositories/ArticleRepository";
import { RelatedArticleDTO } from "../../dto/article/RelatedArticleDTO";
import { ArticleDTOMapper } from "../../mappers/ArticleDTOMapper";

export class ListRelatedArticlesByIdUseCase {
  constructor(private readonly repo: ArticleRepository) { }

  async execute(input: { articleId: string; page?: number; pageSize?: number }) {
    const article = await this.repo.findById(input.articleId);
    if (!article) throw new AppError("Article not found", 404);

    const result = await this.repo.findRelatedArticles(
      input.articleId,
      input.page ?? 1,
      input.pageSize ?? 10,
    );

    const sourceTagIds = new Set((article.tags ?? []).map((tag) => tag.id));

        return {
          ...result,
          data: result.data.map((relatedArticle): RelatedArticleDTO => {
            const sharesTag = (relatedArticle.tags ?? []).some((tag) => sourceTagIds.has(tag.id));

            return ArticleDTOMapper.toRelatedDTO(
              relatedArticle,
              sharesTag ? "tag" : "category",
            );
      }),
    };
  }
}
