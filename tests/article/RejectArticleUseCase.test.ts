import { describe, expect, it, vi } from "vitest";
import { RejectArticleUseCase } from "../../src/application/use-cases/article/RejectArticleUseCase";
import { AppError } from "../../src/shared/AppError";
import { createArticleRepositoryMock } from "../helpers/repositoryMocks";

describe("RejectArticleUseCase", () => {
  it("rejects a pending article with reason", async () => {
    const repo = createArticleRepositoryMock();
    repo.findById = vi.fn().mockResolvedValue({
      id: "article-1",
      status: "PENDING",
    });
    repo.reject = vi.fn().mockResolvedValue({
      id: "article-1",
      title: "Rejected Article",
      slug: "rejected-article",
      content: "content",
      excerpt: null,
      thumbnailUrl: null,
      category: "events",
      status: "REJECTED",
      isFeatured: false,
      viewCount: 0,
      publishedAt: null,
      authorId: "author-1",
      createdAt: new Date("2026-04-29T00:00:00.000Z"),
      updatedAt: new Date("2026-04-29T00:00:00.000Z"),
      tags: [],
    });

    const useCase = new RejectArticleUseCase(repo);
    const result = await useCase.execute({
      articleId: "article-1",
      rejectionReason: "Needs revision",
      actorId: "editor-1",
      actorRole: "EDITOR",
    });

    expect(repo.reject).toHaveBeenCalledWith("article-1", "Needs revision");
    expect(result.message).toBe("Article rejected successfully");
    expect(result.article.status).toBe("REJECTED");
  });

  it("requires rejection reason", async () => {
    const repo = createArticleRepositoryMock();
    const useCase = new RejectArticleUseCase(repo);

    await expect(
      useCase.execute({
        articleId: "article-1",
        rejectionReason: "",
        actorId: "editor-1",
        actorRole: "EDITOR",
      }),
    ).rejects.toMatchObject<AppError>({
      message: "Rejection reason is required",
      statusCode: 400,
    });
  });
});
