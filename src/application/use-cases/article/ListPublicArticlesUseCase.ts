import { ArticleRepository } from "../../../domain/repositories/ArticleRepository";
import { ArticleDTOMapper } from "../../mappers/ArticleDTOMapper";

export class ListPublicArticlesUseCase {
    constructor(private repo: ArticleRepository) { }

    async execute(input: {
        page?: number;
        pageSize?: number;
        search?: string;
        category?: string;
        tag?: string;
        featured?: boolean;
        sort?: "latest" | "popular";
    }) {
        const result = await this.repo.findPublicArticles({
            page: input.page ?? 1,
            pageSize: input.pageSize ?? 10,
            search: input.search,
            category: input.category,
            tag: input.tag,
            featured: input.featured,
            sort: input.sort,
        });

        return ArticleDTOMapper.toPaginatedDTO({
            data: ArticleDTOMapper.toListDTO(result.data),
            total: result.total,
            page: input.page ?? 1,
            pageSize: input.pageSize ?? 10,
        });
    }
}
