import { ArticleRepository } from "../../../domain/repositories/ArticleRepository";
import { ArticleResponseDTO } from "../../../application/dto/article/ArticleDTO";

export class GetArticleByIdUseCase {
    constructor(private repo: ArticleRepository) { }

    async execute(id: string): Promise<ArticleResponseDTO> {
        const article = await this.repo.findById(id);
        if (!article) throw new Error("Article not found");
        return this.mapToDTO(article);
    }

    private mapToDTO(article: any): ArticleResponseDTO {
        return {
            id: article.id,
            title: article.title,
            slug: article.slug,
            content: article.content,
            excerpt: article.excerpt,
            status: article.status,
            thumbnailUrl: article.thumbnailUrl,
            category: article.category,
            isFeatured: article.isFeatured,
            viewCount: article.viewCount,
            publishedAt: article.publishedAt,
            authorId: article.authorId,
            createdAt: article.createdAt,
            updatedAt: article.updatedAt,
            tags: article.tags,
        };
    }
}