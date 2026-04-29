import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createHttpTestApp } from "../helpers/httpTestApp";

const mockContainer = {
  listPublicArticlesUseCase: { execute: vi.fn() },
  getArticleByIdUseCase: { execute: vi.fn() },
  getArticleBySlugUseCase: { execute: vi.fn() },
  increaseViewUseCase: { execute: vi.fn() },
  listFeaturedArticlesUseCase: { execute: vi.fn() },
  listTrendingArticlesUseCase: { execute: vi.fn() },
  listRelatedArticlesByIdUseCase: { execute: vi.fn() },
  listRelatedArticlesBySlugUseCase: { execute: vi.fn() },
  listMyArticlesUseCase: { execute: vi.fn() },
  createArticleUseCase: { execute: vi.fn() },
  updateArticleUseCase: { execute: vi.fn() },
  submitArticleUseCase: { execute: vi.fn() },
  deleteArticleUseCase: { execute: vi.fn() },
  approveArticleUseCase: { execute: vi.fn() },
  rejectArticleUseCase: { execute: vi.fn() },
  toggleLikeArticleUseCase: { execute: vi.fn() },
  toggleBookmarkArticleUseCase: { execute: vi.fn() },
  setFeaturedArticleUseCase: { execute: vi.fn() },
};

vi.mock("../../src/infrastructure/container", () => ({
  container: mockContainer,
}));

async function createTestApp() {
  return createHttpTestApp(
    async () => (await import("../../src/interface/http/routes/articleRoutes")).articleRouter,
    "/api/v1/articles",
  );
}

describe("articleRouter HTTP", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET /api/v1/articles returns paginated public articles", async () => {
    mockContainer.listPublicArticlesUseCase.execute.mockResolvedValue({
      data: [
        {
          id: "article-1",
          title: "Karatedo News",
          slug: "karatedo-news",
          url: "karatedo-news-article.html",
          content: "content",
          excerpt: "excerpt",
          thumbnailUrl: null,
          category: "events",
          status: "PUBLISHED",
          isFeatured: false,
          viewCount: 10,
          publishedAt: null,
          authorId: "author-1",
          createdAt: "2026-04-29T00:00:00.000Z",
          updatedAt: "2026-04-29T00:00:00.000Z",
          tags: [],
        },
      ],
      total: 1,
      page: 1,
      pageSize: 10,
      totalPages: 1,
    });

    const app = await createTestApp();
    const response = await request(app).get("/api/v1/articles?page=1&pageSize=10&sort=popular");

    expect(response.status).toBe(200);
    expect(mockContainer.listPublicArticlesUseCase.execute).toHaveBeenCalledWith({
      page: 1,
      pageSize: 10,
      search: undefined,
      category: undefined,
      tag: undefined,
      featured: undefined,
      sort: "popular",
    });
    expect(response.body.total).toBe(1);
    expect(response.body.data[0].slug).toBe("karatedo-news");
  });

  it("GET /api/v1/articles/:id returns article and tracks view for published article", async () => {
    mockContainer.getArticleByIdUseCase.execute.mockResolvedValue({
      id: "550e8400-e29b-41d4-a716-446655440000",
      title: "Karatedo News",
      slug: "karatedo-news",
      url: "karatedo-news-550e8400.html",
      content: "content",
      excerpt: "excerpt",
      thumbnailUrl: null,
      category: "events",
      status: "PUBLISHED",
      isFeatured: false,
      viewCount: 10,
      publishedAt: null,
      authorId: "author-1",
      createdAt: "2026-04-29T00:00:00.000Z",
      updatedAt: "2026-04-29T00:00:00.000Z",
      tags: [],
    });
    mockContainer.increaseViewUseCase.execute.mockResolvedValue({
      id: "550e8400-e29b-41d4-a716-446655440000",
      viewCount: 11,
    });

    const app = await createTestApp();
    const response = await request(app).get("/api/v1/articles/550e8400-e29b-41d4-a716-446655440000");

    expect(response.status).toBe(200);
    expect(mockContainer.getArticleByIdUseCase.execute).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000");
    expect(mockContainer.increaseViewUseCase.execute).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000");
    expect(response.body.viewCount).toBe(11);
  });

  it("POST /api/v1/articles/:id/view increments article view count", async () => {
    mockContainer.increaseViewUseCase.execute.mockResolvedValue({
      id: "550e8400-e29b-41d4-a716-446655440000",
      viewCount: 42,
    });

    const app = await createTestApp();
    const response = await request(app).post("/api/v1/articles/550e8400-e29b-41d4-a716-446655440000/view");

    expect(response.status).toBe(200);
    expect(mockContainer.increaseViewUseCase.execute).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000");
    expect(response.body).toEqual({
      articleId: "550e8400-e29b-41d4-a716-446655440000",
      viewCount: 42,
      message: "Article view count increased",
    });
  });

  it("GET /api/v1/articles/slug/:slug returns article and tracks view for published article", async () => {
    mockContainer.getArticleBySlugUseCase.execute.mockResolvedValue({
      id: "550e8400-e29b-41d4-a716-446655440000",
      title: "Slug Article",
      slug: "slug-article",
      url: "slug-article-550e8400.html",
      content: "content",
      excerpt: "excerpt",
      thumbnailUrl: null,
      category: "events",
      status: "PUBLISHED",
      isFeatured: false,
      viewCount: 7,
      publishedAt: null,
      authorId: "author-1",
      createdAt: "2026-04-29T00:00:00.000Z",
      updatedAt: "2026-04-29T00:00:00.000Z",
      tags: [],
    });
    mockContainer.increaseViewUseCase.execute.mockResolvedValue({
      id: "550e8400-e29b-41d4-a716-446655440000",
      viewCount: 8,
    });

    const app = await createTestApp();
    const response = await request(app).get("/api/v1/articles/slug/slug-article");

    expect(response.status).toBe(200);
    expect(mockContainer.getArticleBySlugUseCase.execute).toHaveBeenCalledWith("slug-article");
    expect(mockContainer.increaseViewUseCase.execute).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000");
    expect(response.body.viewCount).toBe(8);
  });

  it("GET /api/v1/articles/featured returns featured article list", async () => {
    mockContainer.listFeaturedArticlesUseCase.execute.mockResolvedValue({
      data: [
        {
          id: "article-1",
          title: "Featured Article",
          slug: "featured-article",
          url: "featured-article-article.html",
          content: "content",
          excerpt: null,
          thumbnailUrl: null,
          category: "events",
          status: "PUBLISHED",
          isFeatured: true,
          viewCount: 12,
          publishedAt: null,
          authorId: "author-1",
          createdAt: "2026-04-29T00:00:00.000Z",
          updatedAt: "2026-04-29T00:00:00.000Z",
          tags: [],
        },
      ],
      total: 1,
      page: 1,
      pageSize: 5,
      totalPages: 1,
    });

    const app = await createTestApp();
    const response = await request(app).get("/api/v1/articles/featured?page=1&pageSize=5");

    expect(response.status).toBe(200);
    expect(mockContainer.listFeaturedArticlesUseCase.execute).toHaveBeenCalledWith(1, 5);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].isFeatured).toBe(true);
  });

  it("GET /api/v1/articles/trending returns trending article list", async () => {
    mockContainer.listTrendingArticlesUseCase.execute.mockResolvedValue({
      data: [
        {
          id: "article-1",
          title: "Trending Article",
          slug: "trending-article",
          url: "trending-article-article.html",
          content: "content",
          excerpt: null,
          thumbnailUrl: null,
          category: "events",
          status: "PUBLISHED",
          isFeatured: false,
          viewCount: 99,
          publishedAt: null,
          authorId: "author-1",
          createdAt: "2026-04-29T00:00:00.000Z",
          updatedAt: "2026-04-29T00:00:00.000Z",
          tags: [],
        },
      ],
      total: 1,
      page: 1,
      pageSize: 5,
      totalPages: 1,
    });

    const app = await createTestApp();
    const response = await request(app).get("/api/v1/articles/trending?page=1&pageSize=5");

    expect(response.status).toBe(200);
    expect(mockContainer.listTrendingArticlesUseCase.execute).toHaveBeenCalledWith(1, 5);
    expect(response.body.data[0].viewCount).toBe(99);
  });

  it("GET /api/v1/articles/:id/related returns related article list with reason metadata", async () => {
    mockContainer.listRelatedArticlesByIdUseCase.execute.mockResolvedValue({
      data: [
        {
          id: "related-1",
          title: "Related Article",
          slug: "related-article",
          url: "related-article-related.html",
          content: "content",
          excerpt: null,
          thumbnailUrl: null,
          category: "events",
          status: "PUBLISHED",
          isFeatured: false,
          viewCount: 10,
          publishedAt: null,
          authorId: "author-2",
          createdAt: "2026-04-29T00:00:00.000Z",
          updatedAt: "2026-04-29T00:00:00.000Z",
          tags: [],
          reason: "tag",
        },
      ],
      total: 1,
      page: 1,
      pageSize: 4,
      totalPages: 1,
    });

    const app = await createTestApp();
    const response = await request(app).get("/api/v1/articles/550e8400-e29b-41d4-a716-446655440000/related?page=1&pageSize=4");

    expect(response.status).toBe(200);
    expect(mockContainer.listRelatedArticlesByIdUseCase.execute).toHaveBeenCalledWith({
      articleId: "550e8400-e29b-41d4-a716-446655440000",
      page: 1,
      pageSize: 4,
    });
    expect(response.body.data[0].reason).toBe("tag");
  });

  it("GET /api/v1/articles/tag/:slug returns filtered public articles by tag", async () => {
    mockContainer.listPublicArticlesUseCase.execute.mockResolvedValue({
      data: [
        {
          id: "article-1",
          title: "Tagged Article",
          slug: "tagged-article",
          url: "tagged-article-article.html",
          content: "content",
          excerpt: null,
          thumbnailUrl: null,
          category: "events",
          status: "PUBLISHED",
          isFeatured: false,
          viewCount: 3,
          publishedAt: null,
          authorId: "author-1",
          createdAt: "2026-04-29T00:00:00.000Z",
          updatedAt: "2026-04-29T00:00:00.000Z",
          tags: [],
        },
      ],
      total: 1,
      page: 1,
      pageSize: 6,
      totalPages: 1,
    });

    const app = await createTestApp();
    const response = await request(app).get("/api/v1/articles/tag/karatedo?page=1&pageSize=6");

    expect(response.status).toBe(200);
    expect(mockContainer.listPublicArticlesUseCase.execute).toHaveBeenCalledWith({
      page: 1,
      pageSize: 6,
      tag: "karatedo",
    });
    expect(response.body.data[0].slug).toBe("tagged-article");
  });

  it("GET /api/v1/articles/category/:category returns filtered public articles by category", async () => {
    mockContainer.listPublicArticlesUseCase.execute.mockResolvedValue({
      data: [
        {
          id: "article-1",
          title: "Category Article",
          slug: "category-article",
          url: "category-article-article.html",
          content: "content",
          excerpt: null,
          thumbnailUrl: null,
          category: "events",
          status: "PUBLISHED",
          isFeatured: false,
          viewCount: 5,
          publishedAt: null,
          authorId: "author-1",
          createdAt: "2026-04-29T00:00:00.000Z",
          updatedAt: "2026-04-29T00:00:00.000Z",
          tags: [],
        },
      ],
      total: 1,
      page: 1,
      pageSize: 6,
      totalPages: 1,
    });

    const app = await createTestApp();
    const response = await request(app).get("/api/v1/articles/category/events?page=1&pageSize=6");

    expect(response.status).toBe(200);
    expect(mockContainer.listPublicArticlesUseCase.execute).toHaveBeenCalledWith({
      page: 1,
      pageSize: 6,
      category: "events",
    });
    expect(response.body.data[0].category).toBe("events");
  });

  it("GET /api/v1/articles rejects invalid query", async () => {
    const app = await createTestApp();
    const response = await request(app).get("/api/v1/articles?page=0&pageSize=10");

    expect(response.status).toBe(422);
    expect(response.body.message).toBe("Validation error");
  });
});
