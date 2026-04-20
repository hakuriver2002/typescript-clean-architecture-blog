import { ArticleRepository } from "../../../domain/repositories/ArticleRepository";
import { ArticleStatus } from "../../../domain/enums/article";
import { AppError } from "../../../shared/AppError";

interface Input {
    articleId: string;
    rejectionReason: string;
    actorId: string;
    actorRole: string;
}

interface Output {
    message: string;
    article: any;
}

export class RejectArticleUseCase {
    constructor(private readonly articleRepository: ArticleRepository) { }

    private isAuthorized(actorRole: string): boolean {
        return actorRole === "ADMIN" || actorRole === "EDITOR";
    }

    async execute(input: Input): Promise<Output> {
        if (!input.articleId?.trim()) {
            throw new AppError("Article ID is required", 400);
        }

        if (!input.rejectionReason?.trim()) {
            throw new AppError("Rejection reason is required", 400);
        }

        if (!input.actorId?.trim()) {
            throw new AppError("Actor ID is required", 400);
        }

        if (!this.isAuthorized(input.actorRole)) {
            throw new AppError(
                "Only admins and editors can reject articles",
                403
            );
        }

        const article = await this.articleRepository.findById(input.articleId);
        if (!article) {
            throw new AppError("Article not found", 404);
        }

        if (article.status !== "PENDING") {
            throw new AppError(
                `Cannot reject article with status: ${article.status}`,
                400
            );
        }

        // Reject article
        const rejectedArticle = await this.articleRepository.reject(
            input.articleId,
            input.rejectionReason
        );

        return {
            message: "Article rejected successfully",
            article: rejectedArticle,
        };
    }
}