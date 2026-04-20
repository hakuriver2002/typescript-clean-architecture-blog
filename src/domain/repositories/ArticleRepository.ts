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
}

export interface ArticleRepository {
  create(input: CreateArticleInput): Promise<Article>;
  approve(articleId: string, approvedBy: string): Promise<Article>;
  reject(articleId: string, rejectionReason: string): Promise<Article>;
  findById(id: string): Promise<Article | null>;
  findBySlug(slug: string): Promise<Article | null>;
  findPublicArticles(page: number, pageSize: number): Promise<{ data: Article[]; total: number }>;
  update(id: string, input: UpdateArticleInput): Promise<Article>;
  delete(id: string): Promise<void>;
  updateStatus(id: string, status: ArticleStatus): Promise<Article>;
  listByAuthor(authorId: string, page: number, pageSize: number): Promise<{ data: Article[]; total: number }>;
}
