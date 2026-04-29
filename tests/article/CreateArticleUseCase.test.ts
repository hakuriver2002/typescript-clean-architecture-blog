import { describe, expect, it, vi } from "vitest";
import { CreateArticleUseCase } from "../../src/application/use-cases/article/CreateArticleUseCase";
import { AppError } from "../../src/shared/AppError";
import { createArticleRepositoryMock, createTagRepositoryMock } from "../helpers/repositoryMocks";

describe("CreateArticleUseCase", () => {
  it("creates article with normalized slug and DTO", async () => {
    const articleRepo = createArticleRepositoryMock();
    const tagRepo = createTagRepositoryMock();

    tagRepo.findByIds = vi.fn().mockResolvedValue([
      { id: "tag-1", name: "Karatedo", slug: "karatedo", createdAt: new Date(), updatedAt: new Date() },
    ]);
    articleRepo.create = vi.fn().mockResolvedValue({
      id: "article-1",
      title: "Karatedo News",
      slug: "karatedo-news",
      content: "content",
      excerpt: "excerpt",
      thumbnailUrl: null,
      category: "events",
      status: "DRAFT",
      isFeatured: false,
      viewCount: 0,
      publishedAt: null,
      authorId: "author-1",
      createdAt: new Date("2026-04-29T00:00:00.000Z"),
      updatedAt: new Date("2026-04-29T00:00:00.000Z"),
      tags: [],
    });

    const useCase = new CreateArticleUseCase(articleRepo, tagRepo);
    const result = await useCase.execute(
      {
        title: "Karatedo News",
        content: "content",
        excerpt: "excerpt",
        category: "events" as any,
        thumbnailUrl: "https://example.com/image.jpg",
        tagIds: ["tag-1"],
        authorId: "ignored-in-use-case",
      },
      "author-1",
    );

    expect(articleRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Karatedo News",
        slug: "karatedo-news",
        authorId: "author-1",
        tagIds: ["tag-1"],
      }),
    );
    expect(result.url).toBe("karatedo-news-article.html");
  });

  it("rejects when provided tags do not all exist", async () => {
    const articleRepo = createArticleRepositoryMock();
    const tagRepo = createTagRepositoryMock();

    tagRepo.findByIds = vi.fn().mockResolvedValue([]);

    const useCase = new CreateArticleUseCase(articleRepo, tagRepo);

    await expect(
      useCase.execute(
        {
          title: "Karatedo News",
          content: "content",
          excerpt: "excerpt",
          category: "events" as any,
          thumbnailUrl: "https://example.com/image.jpg",
          tagIds: ["missing-tag"],
          authorId: "ignored-in-use-case",
        },
        "author-1",
      ),
    ).rejects.toMatchObject<AppError>({
      message: "Some tags not found",
      statusCode: 400,
    });
  });
});
