import { describe, expect, it, vi } from "vitest";
import { ReplyCommentUseCase } from "../../src/application/use-cases/comment/ReplyCommentUseCase";
import { AppError } from "../../src/shared/AppError";
import { CommentStatus } from "../../src/domain/enums/comment";
import { CreateCommentUseCase } from "../../src/application/use-cases/comment/CreateCommentUseCase";
import { createCommentRepositoryMock } from "../helpers/repositoryMocks";

describe("ReplyCommentUseCase", () => {
  it("replies to visible parent comment", async () => {
    const commentRepo = createCommentRepositoryMock();
    const createCommentUseCase = {
      execute: vi.fn().mockResolvedValue({ id: "reply-1" }),
    } as unknown as CreateCommentUseCase;

    commentRepo.findById = vi.fn().mockResolvedValue({
      id: "parent-1",
      articleId: "article-1",
      status: CommentStatus.VISIBLE,
    });

    const useCase = new ReplyCommentUseCase(commentRepo, createCommentUseCase);
    const result = await useCase.execute({
      parentCommentId: "parent-1",
      userId: "user-1",
      content: "Reply text",
    });

    expect((createCommentUseCase.execute as any)).toHaveBeenCalledWith({
      articleId: "article-1",
      userId: "user-1",
      content: "Reply text",
      parentId: "parent-1",
    });
    expect(result).toEqual({ id: "reply-1" });
  });

  it("rejects reply to hidden comment", async () => {
    const commentRepo = createCommentRepositoryMock();
    const createCommentUseCase = {
      execute: vi.fn(),
    } as unknown as CreateCommentUseCase;

    commentRepo.findById = vi.fn().mockResolvedValue({
      id: "parent-1",
      articleId: "article-1",
      status: CommentStatus.HIDDEN,
    });

    const useCase = new ReplyCommentUseCase(commentRepo, createCommentUseCase);

    await expect(
      useCase.execute({
        parentCommentId: "parent-1",
        userId: "user-1",
        content: "Reply text",
      }),
    ).rejects.toMatchObject<AppError>({
      message: "Cannot reply to hidden/deleted comment",
      statusCode: 400,
    });
  });
});
