import { ArticleRepository } from "../../../domain/repositories/ArticleRepository";
import { AppError } from "../../../shared/AppError";

export class GetArticleBySlugAndIdUseCase {
    constructor(private articleRepository: ArticleRepository) { }

    async execute(id: string) {
        const article = await this.articleRepository.findById(id);
        if (!article) throw new AppError("Article not found", 404);
        return article;
    }
}
