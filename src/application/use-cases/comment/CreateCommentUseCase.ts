import { AppError } from "../../../shared/AppError";
import { ArticleRepository } from "../../../domain/repositories/ArticleRepository";
import { CommentRepository } from "../../../domain/repositories/CommentRepository";
import { CommentStatus } from "../../../domain/enums/comment";

export class CreateCommentUseCase {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly articleRepository: ArticleRepository,
  ) { }

  async execute(input: {
    articleId: string;
    userId: string;
    content: string;
    parentId?: string;
  }) {
    const article = await this.articleRepository.findById(input.articleId);
    if (!article) throw new AppError("Article not found", 404);

    if (article.status !== "PUBLISHED") {
      throw new AppError("Cannot comment on unpublished article", 400);
    }

    if (input.parentId) {
      const parent = await this.commentRepository.findById(input.parentId);
      if (!parent) throw new AppError("Parent comment not found", 404);

      if (parent.articleId !== input.articleId) {
        throw new AppError("Parent comment does not belong to this article", 400);
      }

      if (parent.status !== CommentStatus.VISIBLE) {
        throw new AppError("Cannot reply to hidden/deleted comment", 400);
      }

      // Max depth is 3 levels:
      // level 1 = root, level 2 = reply, level 3 = reply-to-reply.
      let level = 2;
      let currentParentId = parent.parentId;
      while (currentParentId) {
        const ancestor = await this.commentRepository.findById(currentParentId);
        if (!ancestor) {
          throw new AppError("Comment thread is corrupted", 400);
        }
        level += 1;
        currentParentId = ancestor.parentId;
      }

      if (level > 3) {
        throw new AppError("Only 3-level comment thread is allowed", 400);
      }
    }

    return this.commentRepository.create({
      articleId: input.articleId,
      userId: input.userId,
      content: input.content,
      parentId: input.parentId ?? null,
    });
  }
}
