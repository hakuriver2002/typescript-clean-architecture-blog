import { describe, expect, it, vi } from "vitest";
import { ListRelatedArticlesByIdUseCase } from "../../src/application/use-cases/article/ListRelatedArticlesByIdUseCase";
import { createArticleRepositoryMock } from "../helpers/repositoryMocks";

describe("ListRelatedArticlesByIdUseCase", () => {
  it("adds reason metadata based on shared tag first, then category fallback", async () => {
    const repo = createArticleRepositoryMock();
    repo.findById = vi.fn().mockResolvedValue({
      id: "source-1",
      title: "Source",
      slug: "source",
      content: "content",
      excerpt: null,
      thumbnailUrl: null,
      category: "events",
      status: "PUBLISHED",
      isFeatured: false,
      viewCount: 0,
      publishedAt: null,
      authorId: "author-1",
      createdAt: new Date("2026-04-29T00:00:00.000Z"),
      updatedAt: new Date("2026-04-29T00:00:00.000Z"),
      tags: [{ id: "tag-1", name: "Karatedo", slug: "karatedo", createdAt: new Date(), updatedAt: new Date() }],
    });
    repo.findRelatedArticles = vi.fn().mockResolvedValue({
      total: 2,
      data: [
        {
          id: "related-1",
          title: "Tag Related",
          slug: "tag-related",
          content: "content",
          excerpt: null,
          thumbnailUrl: null,
          category: "events",
          status: "PUBLISHED",
          isFeatured: false,
          viewCount: 10,
          publishedAt: null,
          authorId: "author-2",
          createdAt: new Date("2026-04-29T00:00:00.000Z"),
          updatedAt: new Date("2026-04-29T00:00:00.000Z"),
          tags: [{ id: "tag-1", name: "Karatedo", slug: "karatedo", createdAt: new Date(), updatedAt: new Date() }],
        },
        {
          id: "related-2",
          title: "Category Related",
          slug: "category-related",
          content: "content",
          excerpt: null,
          thumbnailUrl: null,
          category: "events",
          status: "PUBLISHED",
          isFeatured: false,
          viewCount: 5,
          publishedAt: null,
          authorId: "author-3",
          createdAt: new Date("2026-04-29T00:00:00.000Z"),
          updatedAt: new Date("2026-04-29T00:00:00.000Z"),
          tags: [{ id: "tag-2", name: "News", slug: "news", createdAt: new Date(), updatedAt: new Date() }],
        },
      ],
    });

    const useCase = new ListRelatedArticlesByIdUseCase(repo);
    const result = await useCase.execute({ articleId: "source-1", page: 1, pageSize: 10 });

    expect(result.data[0].reason).toBe("tag");
    expect(result.data[1].reason).toBe("category");
    expect(result.data[0].url).toBe("tag-related-related.html");
  });
});
