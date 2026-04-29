import { ArticleRepository } from "../../../domain/repositories/ArticleRepository";
import { ArticleDTOMapper } from "../../mappers/ArticleDTOMapper";
import { AppError } from "../../../shared/AppError";

interface Input {
    authorId: string;
    page: number;
    pageSize: number;
}

export class ListMyArticlesUseCase {
    constructor(private readonly articleRepository: ArticleRepository) { }

    async execute(input: Input) {
        if (!input.authorId?.trim()) {
            throw new AppError("Actor ID is required", 400);
        }

        if (input.page < 1) {
            throw new AppError("Page must be greater than 0", 400);
        }

        if (input.pageSize < 1 || input.pageSize > 100) {
            throw new AppError("Page size must be between 1 and 100", 400);
        }

        const result = await this.articleRepository.listByAuthor(
            input.authorId,
            input.page,
            input.pageSize
        );

        return ArticleDTOMapper.toPaginatedDTO({
            data: ArticleDTOMapper.toListDTO(result.data),
            total: result.total,
            page: input.page,
            pageSize: input.pageSize,
        });
    }
}
