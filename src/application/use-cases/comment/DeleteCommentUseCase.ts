import { CommentStatus } from "../../../domain/enums/comment";
import { Role } from "../../../domain/entities/User";
import { CommentRepository } from "../../../domain/repositories/CommentRepository";
import { AppError } from "../../../shared/AppError";

export class DeleteCommentUseCase {
  constructor(private readonly repo: CommentRepository) { }

  async execute(input: { id: string; articleId: string; userId: string; role: Role }) {
    const comment = await this.repo.findById(input.id);
    if (!comment) throw new AppError("Comment not found", 404);
    if (comment.articleId !== input.articleId) {
      throw new AppError("Comment does not belong to this article", 400);
    }

    const isOwner = comment.userId === input.userId;
    const canDeleteAnyComment = input.role === "ADMIN" || input.role === "EDITOR";
    if (!isOwner && !canDeleteAnyComment) {
      throw new AppError("Forbidden", 403);
    }

    await this.repo.updateStatus(input.id, CommentStatus.DELETE);
  }
}
