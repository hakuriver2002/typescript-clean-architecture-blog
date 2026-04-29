import { describe, expect, it, vi } from "vitest";
import { SetFeaturedArticleUseCase } from "../../src/application/use-cases/article/SetFeaturedArticleUseCase";
import { AppError } from "../../src/shared/AppError";
import { createArticleRepositoryMock } from "../helpers/repositoryMocks";

describe("SetFeaturedArticleUseCase", () => {
  it("updates featured status and returns normalized DTO", async () => {
    const repo = createArticleRepositoryMock();
    const updatedArticle = {
      id: "article-1",
      title: "Featured Article",
      slug: "featured-article",
      content: "content",
      excerpt: null,
      thumbnailUrl: null,
      category: "events",
      status: "PUBLISHED",
      isFeatured: true,
      viewCount: 100,
      publishedAt: null,
      authorId: "author-1",
      createdAt: new Date("2026-04-29T00:00:00.000Z"),
      updatedAt: new Date("2026-04-29T00:00:00.000Z"),
      tags: [],
    };

    repo.findById = vi.fn().mockResolvedValue({ id: "article-1" });
    repo.update = vi.fn().mockResolvedValue(updatedArticle);

    const useCase = new SetFeaturedArticleUseCase(repo);
    const result = await useCase.execute({ articleId: "article-1", isFeatured: true });

    expect(repo.update).toHaveBeenCalledWith("article-1", { isFeatured: true });
    expect(result.isFeatured).toBe(true);
    expect(result.url).toBe("featured-article-article.html");
  });

  it("throws AppError when article does not exist", async () => {
    const repo = createArticleRepositoryMock();
    repo.findById = vi.fn().mockResolvedValue(null);

    const useCase = new SetFeaturedArticleUseCase(repo);

    await expect(useCase.execute({ articleId: "missing", isFeatured: true })).rejects.toMatchObject<AppError>({
      message: "Article not found",
      statusCode: 404,
    });
  });
});
