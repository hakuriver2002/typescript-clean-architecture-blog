import { ArticleRepository } from "../../../domain/repositories/ArticleRepository";

export class GetArticleBySlugAndIdUseCase {
    constructor(private articleRepository: ArticleRepository) { }

    async execute(id: string) {
        const article = await this.articleRepository.findById(id);
        if (!article) throw new Error("Article not found");
        return article;
    }
}