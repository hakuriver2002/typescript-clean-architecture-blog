import { ArticleRepository } from "../../../domain/repositories/ArticleRepository";
import { AppError } from "../../../shared/AppError";

interface Input {
    articleId: string;
    actorId: string;
    actorRole: string;
}

export class DeleteArticleUseCase {
    constructor(private readonly articleRepository: ArticleRepository) { }

    private validateInput(input: Input): void {
        if (!input.articleId?.trim()) {
            throw new AppError("Article ID is required", 400);
        }
        if (!input.actorId?.trim()) {
            throw new AppError("Actor ID is required", 400);
        }
    }

    async execute(input: Input) {
        this.validateInput(input);

        const article = await this.articleRepository.findById(input.articleId);
        if (!article) {
            throw new AppError("Article not found", 404);
        }

        const isAuthor = article.authorId === input.actorId;
        const isAdmin = input.actorRole?.toUpperCase() === "ADMIN";

        if (!isAuthor && !isAdmin) {
            throw new AppError("Unauthorized to delete this article", 403);
        }

        await this.articleRepository.delete(input.articleId);
        return { success: true, message: "Article deleted successfully" };
    }
}