import { Tag } from "../../../domain/entities/Tag";
import { ArticleStatus } from "../../../domain/enums/article";
import { ArticleCategory } from "../../../domain/enums/article";

export interface CreateArticleDTO {
    title: string;
    content: string;
    excerpt?: string;
    category: ArticleCategory;
    thumbnailUrl: string;

    tagIds?: string[];

    // articleImages?: string[];

    authorId: string;
}

export interface UpdateArticleDTO {
    title?: string;
    content?: string;
    excerpt?: string;

    category?: ArticleCategory;
    tagIds?: string[];

    thumbnailUrl?: string;
    // articleImages?: string[];
}

export interface ArticleResponseDTO {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string | null;
    thumbnailUrl: string | null;
    category: string | null;
    status: ArticleStatus;
    isFeatured: boolean;
    viewCount: number;
    publishedAt: Date | null;
    authorId: string;
    createdAt: Date;
    updatedAt: Date;
    tags?: Tag[];
}