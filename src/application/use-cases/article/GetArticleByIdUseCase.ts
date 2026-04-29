import { ArticleRepository } from "../../../domain/repositories/ArticleRepository";
import { ArticleResponseDTO } from "../../../application/dto/article/ArticleDTO";
import { ArticleDTOMapper } from "../../mappers/ArticleDTOMapper";
import { AppError } from "../../../shared/AppError";

export class GetArticleByIdUseCase {
    constructor(private repo: ArticleRepository) { }

    async execute(id: string): Promise<ArticleResponseDTO> {
        const article = await this.repo.findById(id);
        if (!article) throw new AppError("Article not found", 404);
        return ArticleDTOMapper.toDTO(article);
    }
}
