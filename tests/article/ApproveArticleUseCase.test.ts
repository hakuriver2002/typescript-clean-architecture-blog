import { describe, expect, it, vi } from "vitest";
import { ApproveArticleUseCase } from "../../src/application/use-cases/article/ApproveArticleUseCase";
import { AppError } from "../../src/shared/AppError";
import { createArticleRepositoryMock } from "../helpers/repositoryMocks";

describe("ApproveArticleUseCase", () => {
  it("approves a pending article for admin/editor", async () => {
    const repo = createArticleRepositoryMock();
    repo.findById = vi.fn().mockResolvedValue({
      id: "article-1",
      status: "PENDING",
    });
    repo.approve = vi.fn().mockResolvedValue({
      id: "article-1",
      title: "Approved Article",
      slug: "approved-article",
      content: "content",
      excerpt: null,
      thumbnailUrl: null,
      category: "events",
      status: "PUBLISHED",
      isFeatured: false,
      viewCount: 0,
      publishedAt: new Date("2026-04-29T00:00:00.000Z"),
      authorId: "author-1",
      createdAt: new Date("2026-04-29T00:00:00.000Z"),
      updatedAt: new Date("2026-04-29T00:00:00.000Z"),
      tags: [],
    });

    const useCase = new ApproveArticleUseCase(repo);
    const result = await useCase.execute({
      articleId: "article-1",
      actorId: "admin-1",
      actorRole: "ADMIN",
    });

    expect(repo.approve).toHaveBeenCalledWith("article-1", "admin-1");
    expect(result.message).toBe("Article approved successfully");
    expect(result.article.status).toBe("PUBLISHED");
  });

  it("rejects unauthorized actor", async () => {
    const repo = createArticleRepositoryMock();
    const useCase = new ApproveArticleUseCase(repo);

    await expect(
      useCase.execute({
        articleId: "article-1",
        actorId: "member-1",
        actorRole: "MEMBER",
      }),
    ).rejects.toMatchObject<AppError>({
      message: "Only admins and editors can approve articles",
      statusCode: 403,
    });
  });
});
