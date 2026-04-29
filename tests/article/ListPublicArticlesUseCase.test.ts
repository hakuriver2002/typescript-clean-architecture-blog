import { describe, expect, it, vi } from "vitest";
import { ListPublicArticlesUseCase } from "../../src/application/use-cases/article/ListPublicArticlesUseCase";
import { createArticleRepositoryMock } from "../helpers/repositoryMocks";

describe("ListPublicArticlesUseCase", () => {
  it("passes filters to repository and returns normalized paginated DTO", async () => {
    const repo = createArticleRepositoryMock();
    repo.findPublicArticles = vi.fn().mockResolvedValue({
      total: 1,
      data: [
        {
          id: "article-1",
          title: "Karatedo News",
          slug: "karatedo-news",
          content: "content",
          excerpt: "excerpt",
          thumbnailUrl: null,
          category: "events",
          status: "PUBLISHED",
          isFeatured: true,
          viewCount: 22,
          publishedAt: new Date("2026-04-29T00:00:00.000Z"),
          authorId: "author-1",
          createdAt: new Date("2026-04-29T00:00:00.000Z"),
          updatedAt: new Date("2026-04-29T00:00:00.000Z"),
          tags: [],
        },
      ],
    });

    const useCase = new ListPublicArticlesUseCase(repo);
    const result = await useCase.execute({
      page: 2,
      pageSize: 5,
      search: "karate",
      category: "events",
      tag: "karatedo",
      featured: true,
      sort: "popular",
    });

    expect(repo.findPublicArticles).toHaveBeenCalledWith({
      page: 2,
      pageSize: 5,
      search: "karate",
      category: "events",
      tag: "karatedo",
      featured: true,
      sort: "popular",
    });
    expect(result.page).toBe(2);
    expect(result.pageSize).toBe(5);
    expect(result.totalPages).toBe(1);
    expect(result.data[0].url).toBe("karatedo-news-article.html");
  });

  it("uses default pagination when page and pageSize are omitted", async () => {
    const repo = createArticleRepositoryMock();
    repo.findPublicArticles = vi.fn().mockResolvedValue({
      total: 0,
      data: [],
    });

    const useCase = new ListPublicArticlesUseCase(repo);
    const result = await useCase.execute({});

    expect(repo.findPublicArticles).toHaveBeenCalledWith({
      page: 1,
      pageSize: 10,
      search: undefined,
      category: undefined,
      tag: undefined,
      featured: undefined,
      sort: undefined,
    });
    expect(result).toEqual({
      data: [],
      total: 0,
      page: 1,
      pageSize: 10,
      totalPages: 0,
    });
  });
});
