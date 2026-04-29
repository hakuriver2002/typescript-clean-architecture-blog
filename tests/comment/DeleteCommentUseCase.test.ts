import { describe, expect, it, vi } from "vitest";
import { DeleteCommentUseCase } from "../../src/application/use-cases/comment/DeleteCommentUseCase";
import { AppError } from "../../src/shared/AppError";
import { CommentStatus } from "../../src/domain/enums/comment";
import { createCommentRepositoryMock } from "../helpers/repositoryMocks";

describe("DeleteCommentUseCase", () => {
  it("allows owner to delete own comment", async () => {
    const repo = createCommentRepositoryMock();
    repo.findById = vi.fn().mockResolvedValue({
      id: "comment-1",
      articleId: "article-1",
      userId: "user-1",
    });
    repo.updateStatus = vi.fn().mockResolvedValue(undefined);

    const useCase = new DeleteCommentUseCase(repo);
    await useCase.execute({
      id: "comment-1",
      articleId: "article-1",
      userId: "user-1",
      role: "MEMBER",
    });

    expect(repo.updateStatus).toHaveBeenCalledWith("comment-1", CommentStatus.DELETE);
  });

  it("rejects deleting comment from another article", async () => {
    const repo = createCommentRepositoryMock();
    repo.findById = vi.fn().mockResolvedValue({
      id: "comment-1",
      articleId: "article-2",
      userId: "user-1",
    });

    const useCase = new DeleteCommentUseCase(repo);

    await expect(
      useCase.execute({
        id: "comment-1",
        articleId: "article-1",
        userId: "user-1",
        role: "MEMBER",
      }),
    ).rejects.toMatchObject<AppError>({
      message: "Comment does not belong to this article",
      statusCode: 400,
    });
  });
});
