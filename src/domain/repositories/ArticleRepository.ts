import { Article } from "../entities/Article";
import { ArticleStatus } from "../enums/article";

export interface CreateArticleInput {
  title: string;
  content: string;
  excerpt?: string;
  thumbnailUrl?: string;
  category?: string;
  authorId: string;
  tagIds?: string[];
  slug: string;
}

export interface UpdateArticleInput {
  title?: string;
  content?: string;
  excerpt?: string;
  thumbnailUrl?: string;
  category?: string;
  tagIds?: string[];
  isFeatured?: boolean;
}

export interface FindPublicArticlesInput {
  page: number;
  pageSize: number;
  search?: string;
  category?: string;
  tag?: string;
  featured?: boolean;
  sort?: "latest" | "popular";
}

export interface ArticleRepository {
  create(input: CreateArticleInput): Promise<Article>;
  approve(articleId: string, approvedBy: string): Promise<Article>;
  reject(articleId: string, rejectionReason: string): Promise<Article>;
  findById(id: string): Promise<Article | null>;
  findBySlug(slug: string): Promise<Article | null>;
  findPublicArticles(input: FindPublicArticlesInput): Promise<{ data: Article[]; total: number }>;
  findFeaturedArticles(page: number, pageSize: number): Promise<{ data: Article[]; total: number }>;
  findTrendingArticles(page: number, pageSize: number): Promise<{ data: Article[]; total: number }>;
  findRelatedArticles(articleId: string, page: number, pageSize: number): Promise<{ data: Article[]; total: number }>;
  incrementViewCount(id: string): Promise<Article>;
  update(id: string, input: UpdateArticleInput): Promise<Article>;
  delete(id: string): Promise<void>;
  updateStatus(id: string, status: ArticleStatus): Promise<Article>;
  listByAuthor(authorId: string, page: number, pageSize: number): Promise<{ data: Article[]; total: number }>;
}
