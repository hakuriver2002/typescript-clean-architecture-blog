import { describe, expect, it, vi } from "vitest";
import { CreateCommentUseCase } from "../../src/application/use-cases/comment/CreateCommentUseCase";
import { AppError } from "../../src/shared/AppError";
import { CommentStatus } from "../../src/domain/enums/comment";
import { createArticleRepositoryMock, createCommentRepositoryMock } from "../helpers/repositoryMocks";

describe("CreateCommentUseCase", () => {
  it("creates comment on published article", async () => {
    const articleRepo = createArticleRepositoryMock();
    const commentRepo = createCommentRepositoryMock();

    articleRepo.findById = vi.fn().mockResolvedValue({
      id: "article-1",
      status: "PUBLISHED",
    });
    commentRepo.create = vi.fn().mockResolvedValue({
      id: "comment-1",
      articleId: "article-1",
      userId: "user-1",
      parentId: null,
      content: "Nice article",
      status: CommentStatus.VISIBLE,
      hiddenById: null,
      hiddenReason: null,
      createdAt: new Date("2026-04-29T00:00:00.000Z"),
      updatedAt: new Date("2026-04-29T00:00:00.000Z"),
      author: {
        id: "user-1",
        fullName: "User One",
        avatarUrl: null,
      },
    });

    const useCase = new CreateCommentUseCase(commentRepo, articleRepo);
    const result = await useCase.execute({
      articleId: "article-1",
      userId: "user-1",
      content: "Nice article",
    });

    expect(commentRepo.create).toHaveBeenCalledWith({
      articleId: "article-1",
      userId: "user-1",
      content: "Nice article",
      parentId: null,
    });
    expect(result.id).toBe("comment-1");
  });

  it("rejects comment on unpublished article", async () => {
    const articleRepo = createArticleRepositoryMock();
    const commentRepo = createCommentRepositoryMock();

    articleRepo.findById = vi.fn().mockResolvedValue({
      id: "article-1",
      status: "DRAFT",
    });

    const useCase = new CreateCommentUseCase(commentRepo, articleRepo);

    await expect(
      useCase.execute({
        articleId: "article-1",
        userId: "user-1",
        content: "Nice article",
      }),
    ).rejects.toMatchObject<AppError>({
      message: "Cannot comment on unpublished article",
      statusCode: 400,
    });
  });

  it("rejects reply deeper than 3 levels", async () => {
    const articleRepo = createArticleRepositoryMock();
    const commentRepo = createCommentRepositoryMock();

    articleRepo.findById = vi.fn().mockResolvedValue({
      id: "article-1",
      status: "PUBLISHED",
    });

    commentRepo.findById = vi
      .fn()
      .mockResolvedValueOnce({
        id: "parent-3",
        articleId: "article-1",
        userId: "user-a",
        parentId: "parent-2",
        content: "level 3",
        status: CommentStatus.VISIBLE,
      })
      .mockResolvedValueOnce({
        id: "parent-2",
        articleId: "article-1",
        userId: "user-b",
        parentId: "parent-1",
        content: "level 2",
        status: CommentStatus.VISIBLE,
      })
      .mockResolvedValueOnce({
        id: "parent-1",
        articleId: "article-1",
        userId: "user-c",
        parentId: "root-1",
        content: "level 1",
        status: CommentStatus.VISIBLE,
      })
      .mockResolvedValueOnce({
        id: "root-1",
        articleId: "article-1",
        userId: "user-d",
        parentId: null,
        content: "root",
        status: CommentStatus.VISIBLE,
      });

    const useCase = new CreateCommentUseCase(commentRepo, articleRepo);

    await expect(
      useCase.execute({
        articleId: "article-1",
        userId: "user-1",
        content: "Too deep",
        parentId: "parent-3",
      }),
    ).rejects.toMatchObject<AppError>({
      message: "Only 3-level comment thread is allowed",
      statusCode: 400,
    });
  });
});
