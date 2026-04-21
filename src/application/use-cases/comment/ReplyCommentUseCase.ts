import { CommentStatus } from "../../../domain/enums/comment";
import { CommentRepository } from "../../../domain/repositories/CommentRepository";
import { AppError } from "../../../shared/AppError";
import { CreateCommentUseCase } from "./CreateCommentUseCase";

export class ReplyCommentUseCase {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly createCommentUseCase: CreateCommentUseCase,
  ) { }

  async execute(input: {
    parentCommentId: string;
    userId: string;
    content: string;
  }) {
    const parent = await this.commentRepository.findById(input.parentCommentId);
    if (!parent) throw new AppError("Parent comment not found", 404);
    if (parent.status !== CommentStatus.VISIBLE) {
      throw new AppError("Cannot reply to hidden/deleted comment", 400);
    }

    return this.createCommentUseCase.execute({
      articleId: parent.articleId,
      userId: input.userId,
      content: input.content,
      parentId: parent.id,
    });
  }
}
