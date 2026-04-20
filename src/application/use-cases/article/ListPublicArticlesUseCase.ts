import { ArticleRepository } from "../../../domain/repositories/ArticleRepository";

export class ListPublicArticlesUseCase {
    constructor(private repo: ArticleRepository) { }

    async execute(page = 1, pageSize = 10) {
        return this.repo.findPublicArticles(page, pageSize);
    }
}