import { ArticleRepository } from "../../../domain/repositories/ArticleRepository";

export class ListTrendingArticlesUseCase {
  constructor(private readonly repo: ArticleRepository) { }

  async execute(page = 1, pageSize = 10) {
    return this.repo.findTrendingArticles(page, pageSize);
  }
}
