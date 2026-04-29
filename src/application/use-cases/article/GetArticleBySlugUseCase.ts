import { ArticleRepository } from "../../../domain/repositories/ArticleRepository";
import { ArticleDTOMapper } from "../../mappers/ArticleDTOMapper";
import { AppError } from "../../../shared/AppError";

export class GetArticleBySlugUseCase {
    constructor(private articleRepository: ArticleRepository) { }

    async execute(slug: string) {
        const article = await this.articleRepository.findBySlug(slug);
        if (!article) throw new AppError("Article not found", 404);
        return ArticleDTOMapper.toDTO(article);
    }
}
