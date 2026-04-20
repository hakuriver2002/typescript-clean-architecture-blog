import { ArticleRepository } from "../../../domain/repositories/ArticleRepository";

export class GetArticleBySlugUseCase {
    constructor(private articleRepository: ArticleRepository) { }

    async execute(slug: string) {
        const article = await this.articleRepository.findBySlug(slug);
        if (!article) throw new Error("Article not found");
        return article;
    }
}