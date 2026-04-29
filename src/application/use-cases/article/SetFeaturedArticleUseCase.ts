import { AppError } from "../../../shared/AppError";
import { ArticleRepository } from "../../../domain/repositories/ArticleRepository";
import { ArticleDTOMapper } from "../../mappers/ArticleDTOMapper";

export class SetFeaturedArticleUseCase {
  constructor(private readonly repo: ArticleRepository) { }

  async execute(input: { articleId: string; isFeatured: boolean }) {
    const article = await this.repo.findById(input.articleId);
    if (!article) throw new AppError("Article not found", 404);

    const updated = await this.repo.update(input.articleId, {
      isFeatured: input.isFeatured,
    });
    return ArticleDTOMapper.toDTO(updated);
  }
}
