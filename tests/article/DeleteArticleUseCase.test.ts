import { describe, expect, it, vi } from "vitest";
import { DeleteArticleUseCase } from "../../src/application/use-cases/article/DeleteArticleUseCase";
import { AppError } from "../../src/shared/AppError";
import { createArticleRepositoryMock } from "../helpers/repositoryMocks";

describe("DeleteArticleUseCase", () => {
  it("allows author to delete own article", async () => {
    const repo = createArticleRepositoryMock();
    repo.findById = vi.fn().mockResolvedValue({
      id: "article-1",
      authorId: "author-1",
    });
    repo.delete = vi.fn().mockResolvedValue(undefined);

    const useCase = new DeleteArticleUseCase(repo);
    const result = await useCase.execute({
      articleId: "article-1",
      actorId: "author-1",
      actorRole: "MEMBER",
    });

    expect(repo.delete).toHaveBeenCalledWith("article-1");
    expect(result).toEqual({
      success: true,
      message: "Article deleted successfully",
    });
  });

  it("allows admin to delete any article", async () => {
    const repo = createArticleRepositoryMock();
    repo.findById = vi.fn().mockResolvedValue({
      id: "article-1",
      authorId: "author-1",
    });
    repo.delete = vi.fn().mockResolvedValue(undefined);

    const useCase = new DeleteArticleUseCase(repo);
    const result = await useCase.execute({
      articleId: "article-1",
      actorId: "admin-1",
      actorRole: "ADMIN",
    });

    expect(repo.delete).toHaveBeenCalledWith("article-1");
    expect(result.success).toBe(true);
  });

  it("rejects non-author non-admin", async () => {
    const repo = createArticleRepositoryMock();
    repo.findById = vi.fn().mockResolvedValue({
      id: "article-1",
      authorId: "author-1",
    });

    const useCase = new DeleteArticleUseCase(repo);

    await expect(
      useCase.execute({
        articleId: "article-1",
        actorId: "member-2",
        actorRole: "MEMBER",
      }),
    ).rejects.toMatchObject<AppError>({
      message: "Unauthorized to delete this article",
      statusCode: 403,
    });
  });
});
