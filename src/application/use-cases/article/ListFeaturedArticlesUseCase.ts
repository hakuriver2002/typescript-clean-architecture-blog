import { ArticleRepository } from "../../../domain/repositories/ArticleRepository";

export class ListFeaturedArticlesUseCase {
  constructor(private readonly repo: ArticleRepository) { }

  async execute(page = 1, pageSize = 10) {
    return this.repo.findFeaturedArticles(page, pageSize);
  }
}
