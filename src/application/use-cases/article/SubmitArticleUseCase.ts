import { ArticleStatus } from "../../../domain/enums/article";
import { ArticleRepository } from "../../../domain/repositories/ArticleRepository";
import { ArticleDTOMapper } from "../../mappers/ArticleDTOMapper";
import { AppError } from "../../../shared/AppError";

export class SubmitArticleUseCase {
    constructor(private repo: ArticleRepository) { }

    async execute(id: string) {
        const article = await this.repo.findById(id);
        if (!article) throw new AppError("Article not found", 404);

        if (article.status !== "DRAFT") {
            throw new AppError("Only draft articles can be submitted", 400);
        }

        const updated = await this.repo.updateStatus(id, "PENDING");
        return ArticleDTOMapper.toDTO(updated);
    }
}
