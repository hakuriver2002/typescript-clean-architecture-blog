import { Prisma } from "@prisma/client";
import { Article } from "../../domain/entities/Article";
import { ArticleStatus } from "../../domain/enums/article";
import {
  ArticleRepository,
  CreateArticleInput,
  FindPublicArticlesInput,
  UpdateArticleInput,
} from "../../domain/repositories/ArticleRepository";
import { prisma } from "../db/prisma";
import { ArticleMapper } from "../mappers/ArticleMapper";

export class PrismaArticleRepository implements ArticleRepository {
  private readonly include = {
    tags: { include: { tag: true } },
  } satisfies Prisma.ArticleInclude;

  private toListResult(data: Array<Parameters<typeof ArticleMapper.toDomain>[0]>, total: number) {
    return {
      data: data.map(ArticleMapper.toDomain),
      total,
    };
  }

  async create(input: CreateArticleInput) {
    const article = await prisma.article.create({
      data: {
        title: input.title,
        slug: input.slug,
        content: input.content,
        excerpt: input.excerpt,
        thumbnailUrl: input.thumbnailUrl,
        category: input.category,
        status: "DRAFT",
        authorId: input.authorId,
      },
    });

    if (input.tagIds?.length) {
      await prisma.articleTag.createMany({
        data: input.tagIds.map((tagId) => ({
          articleId: article.id,
          tagId,
        })),
      });
    }

    const full = await prisma.article.findUnique({
      where: { id: article.id },
      include: this.include,
    });

    if (!full) throw new Error("Article not found");

    return ArticleMapper.toDomain(full);
  }

  async findById(id: string) {
    const article = await prisma.article.findUnique({
      where: { id },
      include: this.include,
    });

    if (!article) return null;

    return ArticleMapper.toDomain(article);
  }

  async findBySlug(slug: string) {
    const article = await prisma.article.findUnique({
      where: { slug },
      include: this.include,
    });

    if (!article) return null;

    return ArticleMapper.toDomain(article);
  }

  async findPublicArticles(input: FindPublicArticlesInput) {
    const skip = (input.page - 1) * input.pageSize;
    const where: Prisma.ArticleWhereInput = {
      status: "PUBLISHED",
      ...(input.search
        ? {
            OR: [
              { title: { contains: input.search, mode: "insensitive" } },
              { content: { contains: input.search, mode: "insensitive" } },
              { excerpt: { contains: input.search, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(input.category ? { category: input.category } : {}),
      ...(input.tag
        ? {
            tags: {
              some: {
                tag: {
                  slug: input.tag,
                },
              },
            },
          }
        : {}),
      ...(typeof input.featured === "boolean" ? { isFeatured: input.featured } : {}),
    };

    const orderBy: Prisma.ArticleOrderByWithRelationInput[] =
      input.sort === "popular"
        ? [{ viewCount: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }]
        : [{ publishedAt: "desc" }, { createdAt: "desc" }];

    const [data, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip,
        take: input.pageSize,
        orderBy,
        include: this.include,
      }),
      prisma.article.count({ where }),
    ]);

    return this.toListResult(data, total);
  }

  async findFeaturedArticles(page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;
    const where: Prisma.ArticleWhereInput = {
      status: "PUBLISHED",
      isFeatured: true,
    };

    const [data, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        include: this.include,
      }),
      prisma.article.count({ where }),
    ]);

    return this.toListResult(data, total);
  }

  async findTrendingArticles(page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;
    const where: Prisma.ArticleWhereInput = {
      status: "PUBLISHED",
    };

    const [data, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: [{ viewCount: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
        include: this.include,
      }),
      prisma.article.count({ where }),
    ]);

    return this.toListResult(data, total);
  }

  async update(id: string, input: UpdateArticleInput) {
    const article = await prisma.article.update({
      where: { id },
      data: {
        ...input,
      },
      include: this.include,
    });

    return ArticleMapper.toDomain(article);
  }

  async delete(id: string): Promise<void> {
    await prisma.article.delete({ where: { id } });
  }

  async updateStatus(id: string, status: ArticleStatus) {
    const article = await prisma.article.update({
      where: { id },
      data: {
        status,
        publishedAt: status === "PUBLISHED" ? new Date() : null,
      },
      include: this.include,
    });

    return ArticleMapper.toDomain(article);
  }

  async listByAuthor(authorId: string, page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      prisma.article.findMany({
        where: { authorId },
        skip,
        take: pageSize,
        include: this.include,
      }),
      prisma.article.count({ where: { authorId } }),
    ]);

    return {
      data: data.map(ArticleMapper.toDomain),
      total,
    };
  }

  async approve(articleId: string, approvedBy: string): Promise<Article> {
    const article = await prisma.article.update({
      where: { id: articleId },
      data: {
        status: "PUBLISHED",
        approvedBy,
        publishedAt: new Date(),
      },
      include: this.include,
    });

    return ArticleMapper.toDomain(article);
  }

  async reject(articleId: string, rejectionReason: string): Promise<Article> {
    const article = await prisma.article.update({
      where: { id: articleId },
      data: {
        status: "REJECTED",
        rejectionReason,
      },
      include: this.include,
    });

    return ArticleMapper.toDomain(article);
  }
}
