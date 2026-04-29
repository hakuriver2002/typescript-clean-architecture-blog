import { describe, expect, it, vi } from "vitest";
import { ListMyArticlesUseCase } from "../../src/application/use-cases/article/ListMyArticlesUseCase";
import { AppError } from "../../src/shared/AppError";
import { createArticleRepositoryMock } from "../helpers/repositoryMocks";

describe("ListMyArticlesUseCase", () => {
  it("returns normalized paginated DTO for author's articles", async () => {
    const repo = createArticleRepositoryMock();
    repo.listByAuthor = vi.fn().mockResolvedValue({
      total: 1,
      data: [
        {
          id: "article-1",
          title: "My Article",
          slug: "my-article",
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
        },
      ],
    });

    const useCase = new ListMyArticlesUseCase(repo);
    const result = await useCase.execute({
      authorId: "author-1",
      page: 1,
      pageSize: 10,
    });

    expect(repo.listByAuthor).toHaveBeenCalledWith("author-1", 1, 10);
    expect(result.total).toBe(1);
    expect(result.totalPages).toBe(1);
    expect(result.data[0].url).toBe("my-article-article.html");
  });

  it("rejects invalid page size", async () => {
    const repo = createArticleRepositoryMock();
    const useCase = new ListMyArticlesUseCase(repo);

    await expect(
      useCase.execute({
        authorId: "author-1",
        page: 1,
        pageSize: 101,
      }),
    ).rejects.toMatchObject<AppError>({
      message: "Page size must be between 1 and 100",
      statusCode: 400,
    });
  });
});
