import { ArticleRepository } from "../../../domain/repositories/ArticleRepository";
import { ArticleDTOMapper } from "../../mappers/ArticleDTOMapper";

export class ListTrendingArticlesUseCase {
  constructor(private readonly repo: ArticleRepository) { }

  async execute(page = 1, pageSize = 10) {
    const result = await this.repo.findTrendingArticles(page, pageSize);
    return ArticleDTOMapper.toPaginatedDTO({
      data: ArticleDTOMapper.toListDTO(result.data),
      total: result.total,
      page,
      pageSize,
    });
  }
}
