import { ArticleStatus } from "../../../domain/enums/article";
import { ArticleRepository } from "../../../domain/repositories/ArticleRepository";

export class SubmitArticleUseCase {
    constructor(private repo: ArticleRepository) { }

    async execute(id: string) {
        const article = await this.repo.findById(id);
        if (!article) throw new Error("Not found");

        if (article.status !== "DRAFT") {
            throw new Error("Only draft can submit");
        }

        return this.repo.updateStatus(id, "PENDING");
    }
}