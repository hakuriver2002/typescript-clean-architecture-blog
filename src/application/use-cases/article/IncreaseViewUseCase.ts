import { AppError } from "../../../shared/AppError";
import { ArticleRepository } from "../../../domain/repositories/ArticleRepository";

export class IncreaseViewUseCase {
    constructor(private repo: ArticleRepository) { }

    async execute(id: string) {
        const article = await this.repo.findById(id);
        if (!article) throw new AppError("Article not found", 404);

        return this.repo.incrementViewCount(id);
    }
}
