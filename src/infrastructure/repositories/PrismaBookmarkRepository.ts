import { prisma } from "../db/prisma";
import { BookmarkRepository } from "../../domain/repositories/BookmarkRepository";
import { Bookmark } from "../../domain/entities/ArticleBookmark";
import { ArticleMapper } from "../mappers/ArticleMapper";
import { Article } from "../../domain/entities/Article";

export class PrismaBookmarkRepository implements BookmarkRepository {
  async create(data: Bookmark): Promise<void> {
    await prisma.articleBookmark.create({
      data: {
        userId: data.userId,
        articleId: data.articleId,
      },
    });
  }

  async delete(userId: string, articleId: string): Promise<void> {
    await prisma.articleBookmark.deleteMany({
      where: {
        userId,
        articleId,
      },
    });
  }

  async listByUser(userId: string, page: number, pageSize: number): Promise<{ data: Article[]; total: number }> {
    const skip = (page - 1) * pageSize;
    const [bookmarks, total] = await Promise.all([
      prisma.articleBookmark.findMany({
        where: { userId },
        include: {
          article: {
            include: {
              tags: { include: { tag: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.articleBookmark.count({ where: { userId } }),
    ]);

    return {
      data: bookmarks.map((bookmark) => ArticleMapper.toDomain(bookmark.article)),
      total,
    };
  }
}
