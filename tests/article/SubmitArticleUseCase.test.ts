import { describe, expect, it, vi } from "vitest";
import { SubmitArticleUseCase } from "../../src/application/use-cases/article/SubmitArticleUseCase";
import { AppError } from "../../src/shared/AppError";
import { createArticleRepositoryMock } from "../helpers/repositoryMocks";

describe("SubmitArticleUseCase", () => {
  it("submits a draft article and returns normalized DTO", async () => {
    const repo = createArticleRepositoryMock();
    const draftArticle = {
      id: "article-1",
      title: "Draft Article",
      slug: "draft-article",
      content: "content",
      excerpt: "excerpt",
      thumbnailUrl: null,
      category: "events",
      status: "DRAFT" as const,
      isFeatured: false,
      viewCount: 0,
      publishedAt: null,
      authorId: "author-1",
      createdAt: new Date("2026-04-29T00:00:00.000Z"),
      updatedAt: new Date("2026-04-29T00:00:00.000Z"),
      tags: [],
    };
    const pendingArticle = {
      ...draftArticle,
      status: "PENDING" as const,
    };

    repo.findById = vi.fn().mockResolvedValue(draftArticle);
    repo.updateStatus = vi.fn().mockResolvedValue(pendingArticle);

    const useCase = new SubmitArticleUseCase(repo);
    const result = await useCase.execute("article-1");

    expect(repo.updateStatus).toHaveBeenCalledWith("article-1", "PENDING");
    expect(result.status).toBe("PENDING");
    expect(result.url).toBe("draft-article-article.html");
  });

  it("throws AppError when article is not draft", async () => {
    const repo = createArticleRepositoryMock();
    repo.findById = vi.fn().mockResolvedValue({
      id: "article-1",
      status: "PUBLISHED",
    });

    const useCase = new SubmitArticleUseCase(repo);

    await expect(useCase.execute("article-1")).rejects.toMatchObject<AppError>({
      message: "Only draft articles can be submitted",
      statusCode: 400,
    });
  });
});
