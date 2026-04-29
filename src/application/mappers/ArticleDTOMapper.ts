import { Article } from "../../domain/entities/Article";
import { ArticleResponseDTO } from "../dto/article/ArticleDTO";
import { RelatedArticleDTO, RelatedArticleReason } from "../dto/article/RelatedArticleDTO";
import { buildArticleUrl } from "../../domain/utils/buildArticleUrl";

export class ArticleDTOMapper {
    static toDTO(article: Article): ArticleResponseDTO {
        return {
            id: article.id,
            title: article.title,
            slug: article.slug,
            url: buildArticleUrl(article.slug, article.id),
            content: article.content,
            excerpt: article.excerpt,
            thumbnailUrl: article.thumbnailUrl,
            category: article.category,
            status: article.status,
            isFeatured: article.isFeatured,
            viewCount: article.viewCount,
            publishedAt: article.publishedAt,
            authorId: article.authorId,
            createdAt: article.createdAt,
            updatedAt: article.updatedAt,
            tags: article.tags,
        };
    }

    static toListDTO(articles: Article[]): ArticleResponseDTO[] {
        return articles.map((article) => this.toDTO(article));
    }

    static toRelatedDTO(article: Article, reason: RelatedArticleReason): RelatedArticleDTO {
        return {
            ...this.toDTO(article),
            reason,
        };
    }

    static toPaginatedDTO<T>(input: { data: T[]; total: number; page: number; pageSize: number }) {
        return {
            data: input.data,
            total: input.total,
            page: input.page,
            pageSize: input.pageSize,
            totalPages: Math.ceil(input.total / input.pageSize),
        };
    }
}
