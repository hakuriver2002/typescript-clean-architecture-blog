import { Comment } from "@prisma/client";
import { prisma } from "../db/prisma";
import {
  CommentNode,
  CommentRepository,
  CommentWithAuthor,
  CreateCommentInput,
  ListCommentsResult,
} from "../../domain/repositories/CommentRepository";

function toDomain(comment: Comment): import("../../domain/entities/Comment").Comment {
  return {
    id: comment.id,
    articleId: comment.articleId,
    userId: comment.userId,
    parentId: comment.parentId,
    content: comment.content,
    status: comment.status.toLowerCase() as import("../../domain/enums/comment").CommentStatus,
    hiddenById: comment.hiddenById,
    hiddenReason: comment.hiddenReason,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
  };
}

export class PrismaCommentRepository implements CommentRepository {
  async findById(id: string) {
    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) return null;
    return toDomain(comment);
  }

  async findByIdWithAuthor(id: string): Promise<CommentWithAuthor | null> {
    const comment = await prisma.comment.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, fullName: true, avatarUrl: true },
        },
      },
    });

    if (!comment) return null;

    return {
      ...toDomain(comment),
      author: comment.user,
    };
  }

  async findByArticleId(articleId: string, page: number, pageSize: number): Promise<ListCommentsResult> {
    const skip = (page - 1) * pageSize;

    const [roots, total] = await Promise.all([
      prisma.comment.findMany({
        where: { articleId, status: "VISIBLE", parentId: null },
        include: {
          user: {
            select: { id: true, fullName: true, avatarUrl: true },
          },
          replies: {
            where: { status: "VISIBLE" },
            include: {
              user: {
                select: { id: true, fullName: true, avatarUrl: true },
              },
            },
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.comment.count({
        where: { articleId, status: "VISIBLE", parentId: null },
      }),
    ]);

    const data: CommentNode[] = roots.map((root) => ({
      ...toDomain(root),
      author: root.user,
      replies: root.replies.map((reply) => ({
        ...toDomain(reply),
        author: reply.user,
      })),
    }));

    return { data, total };
  }

  async create(input: CreateCommentInput): Promise<CommentWithAuthor> {
    const comment = await prisma.comment.create({
      data: {
        articleId: input.articleId,
        userId: input.userId,
        content: input.content,
        parentId: input.parentId ?? null,
      },
      include: {
        user: {
          select: { id: true, fullName: true, avatarUrl: true },
        },
      },
    });

    return {
      ...toDomain(comment),
      author: comment.user,
    };
  }

  async updateStatus(id: string, status: import("../../domain/entities/Comment").Comment["status"]): Promise<void> {
    await prisma.comment.update({
      where: { id },
      data: { status: status.toUpperCase() as "VISIBLE" | "HIDDEN" | "DELETED" },
    });
  }
}
