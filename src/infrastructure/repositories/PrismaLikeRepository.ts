import { prisma } from "../db/prisma";
import { LikeRepository } from "../../domain/repositories/LikeRepository";
import { ArticleLike } from "../../domain/entities/ArticleLike";

export class PrismaLikeRepository implements LikeRepository {
  async find(userId: string, articleId: string): Promise<ArticleLike | null> {
    const found = await prisma.articleLike.findUnique({
      where: {
        articleId_userId: {
          articleId,
          userId,
        },
      },
    });

    if (!found) return null;

    return {
      userId: found.userId,
      articleId: found.articleId,
      createdAt: found.createdAt,
    };
  }

  async create(data: ArticleLike): Promise<void> {
    await prisma.articleLike.create({
      data: {
        userId: data.userId,
        articleId: data.articleId,
      },
    });
  }

  async delete(userId: string, articleId: string): Promise<void> {
    await prisma.articleLike.deleteMany({
      where: {
        userId,
        articleId,
      },
    });
  }
}
