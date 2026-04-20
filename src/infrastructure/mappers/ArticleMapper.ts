import { Article } from "../../domain/entities/Article";
import { Prisma } from "@prisma/client";

type PrismaArticleWithTags = Prisma.ArticleGetPayload<{
    include: {
        tags: {
            include: {
                tag: true;
            };
        };
    };
}>;

export class ArticleMapper {
    static toDomain(article: PrismaArticleWithTags): Article {
        return {
            id: article.id,
            title: article.title,
            slug: article.slug,
            content: article.content,
            excerpt: article.excerpt,
            thumbnailUrl: article.thumbnailUrl,
            category: article.category,
            rejectionReason: article.rejectionReason,
            approvedBy: article.approvedBy,
            status: article.status as "DRAFT" | "PUBLISHED" | "PENDING" | "REJECTED" | "ARCHIVED",
            isFeatured: article.isFeatured,
            viewCount: article.viewCount,
            publishedAt: article.publishedAt,
            authorId: article.authorId,
            createdAt: article.createdAt,
            updatedAt: article.updatedAt,

            tags: article.tags.map((t) => ({
                id: t.tag.id,
                name: t.tag.name,
                slug: t.tag.slug,
                createdAt: t.tag.createdAt,
                updatedAt: t.tag.updatedAt,
            })),
        };
    }
}

export class ArticleDomainService {
    static validateTags(tagIds: string[]) {
        if (tagIds.length > 3) {
            throw new Error("Maximum 3 tags allowed");
        }
    }
}