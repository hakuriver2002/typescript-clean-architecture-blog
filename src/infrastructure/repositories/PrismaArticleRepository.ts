import { prisma } from "../db/prisma";
import { ArticleRepository } from "../../domain/repositories/ArticleRepository";
import { CreateArticleInput, UpdateArticleInput } from "../../domain/repositories/ArticleRepository";
import { Article } from "../../domain/entities/Article";
import { ArticleMapper } from "../mappers/ArticleMapper";
import { ArticleStatus } from "../../domain/enums/article";

export class PrismaArticleRepository implements ArticleRepository {

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
      include: {
        tags: { include: { tag: true } },
      },
    });

    if (!full) throw new Error("Article not found");

    return ArticleMapper.toDomain(full);
  }

  async findById(id: string) {
    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        tags: { include: { tag: true } },
      },
    });

    if (!article) return null;

    return ArticleMapper.toDomain(article);
  }

  async findBySlug(slug: string) {
    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        tags: { include: { tag: true } },
      },
    });

    if (!article) return null;

    return ArticleMapper.toDomain(article);
  }

  async findPublicArticles(page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      prisma.article.findMany({
        where: { status: "PUBLISHED" },
        skip,
        take: pageSize,
        include: {
          tags: { include: { tag: true } },
        },
      }),
      prisma.article.count(),
    ]);

    return {
      data: data.map(ArticleMapper.toDomain),
      total,
    };
  }

  async update(id: string, input: UpdateArticleInput) {
    const article = await prisma.article.update({
      where: { id },
      data: {
        ...input,
      },
      include: {
        tags: { include: { tag: true } },
      },
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
      include: {
        tags: { include: { tag: true } },
      },
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
        include: {
          tags: { include: { tag: true } },
        },
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
      include: {
        tags: { include: { tag: true } },
      },
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
      include: {
        tags: { include: { tag: true } },
      },
    });

    return ArticleMapper.toDomain(article);
  }
}