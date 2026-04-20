import { ArticleRepository } from "../../../domain/repositories/ArticleRepository";

export class IncreaseViewUseCase {
    constructor(private repo: ArticleRepository) { }

    async execute(id: string) {
        const article = await this.repo.findById(id);
        if (!article) return;

        await this.repo.update(id, {
            viewCount: article.viewCount + 1,
        } as any);
    }
}