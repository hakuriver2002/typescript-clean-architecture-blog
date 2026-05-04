import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createAuthMiddlewareMock, withTestAuth } from "../helpers/httpAuthMocks";
import { createHttpTestApp } from "../helpers/httpTestApp";

const mockContainer = {
  toggleLikeArticleUseCase: { execute: vi.fn() },
  toggleBookmarkArticleUseCase: { execute: vi.fn() },
  setFeaturedArticleUseCase: { execute: vi.fn() },
  submitArticleUseCase: { execute: vi.fn() },
  approveArticleUseCase: { execute: vi.fn() },
  rejectArticleUseCase: { execute: vi.fn() },
  deleteArticleUseCase: { execute: vi.fn() },
};

vi.mock("../../src/infrastructure/container", () => ({
  container: mockContainer,
}));

vi.mock("../../src/interface/http/middlewares/authMiddleware", () => createAuthMiddlewareMock());

async function createTestApp() {
  return createHttpTestApp(
    async () => (await import("../../src/interface/http/routes/articleRoutes")).articleRouter,
    "/api/v1/articles",
  );
}

describe("articleRouter auth interactions HTTP", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("POST /api/v1/articles/:id/like likes article for authenticated member", async () => {
    mockContainer.toggleLikeArticleUseCase.execute.mockResolvedValue({
      liked: true,
      message: "Article liked",
    });

    const app = await createTestApp();
    const response = await withTestAuth(
      request(app).post("/api/v1/articles/550e8400-e29b-41d4-a716-446655440000/like"),
      { userId: "member-1", role: "MEMBER" },
    );

    expect(response.status).toBe(200);
    expect(mockContainer.toggleLikeArticleUseCase.execute).toHaveBeenCalledWith({
      articleId: "550e8400-e29b-41d4-a716-446655440000",
      userId: "member-1",
    });
    expect(response.body).toEqual({
      liked: true,
      message: "Article liked",
    });
  });

  it("POST /api/v1/articles/:id/bookmark bookmarks article for authenticated member", async () => {
    mockContainer.toggleBookmarkArticleUseCase.execute.mockResolvedValue({
      articleId: "550e8400-e29b-41d4-a716-446655440000",
      bookmarked: true,
      message: "Article bookmarked",
    });

    const app = await createTestApp();
    const response = await withTestAuth(
      request(app).post("/api/v1/articles/550e8400-e29b-41d4-a716-446655440000/bookmark"),
      { userId: "member-1", role: "MEMBER" },
    );

    expect(response.status).toBe(200);
    expect(mockContainer.toggleBookmarkArticleUseCase.execute).toHaveBeenCalledWith({
      articleId: "550e8400-e29b-41d4-a716-446655440000",
      userId: "member-1",
    });
    expect(response.body.bookmarked).toBe(true);
  });

  it("PATCH /api/v1/articles/:id/featured updates featured status for admin", async () => {
    mockContainer.setFeaturedArticleUseCase.execute.mockResolvedValue({
      id: "550e8400-e29b-41d4-a716-446655440000",
      isFeatured: true,
      url: "featured-article-550e8400.html",
    });

    const app = await createTestApp();
    const response = await withTestAuth(
      request(app)
        .patch("/api/v1/articles/550e8400-e29b-41d4-a716-446655440000/featured")
        .send({ isFeatured: true }),
      { userId: "admin-1", role: "ADMIN" },
    );

    expect(response.status).toBe(200);
    expect(mockContainer.setFeaturedArticleUseCase.execute).toHaveBeenCalledWith({
      articleId: "550e8400-e29b-41d4-a716-446655440000",
      isFeatured: true,
    });
    expect(response.body).toEqual({
      id: "550e8400-e29b-41d4-a716-446655440000",
      isFeatured: true,
      message: "Article featured status updated",
    });
  });

  it("PATCH /api/v1/articles/:id/featured rejects authenticated member without permission", async () => {
    const app = await createTestApp();
    const response = await withTestAuth(
      request(app)
        .patch("/api/v1/articles/550e8400-e29b-41d4-a716-446655440000/featured")
        .send({ isFeatured: true }),
      { userId: "member-1", role: "MEMBER" },
    );

    expect(response.status).toBe(403);
    expect(response.body.message).toBe("Forbidden");
  });

  it("POST /api/v1/articles/:id/like rejects unauthenticated request", async () => {
    const app = await createTestApp();
    const response = await request(app)
      .post("/api/v1/articles/550e8400-e29b-41d4-a716-446655440000/like");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Unauthorized");
  });

  it("PATCH /api/v1/articles/:id/submit submits article for authenticated trainer", async () => {
    mockContainer.submitArticleUseCase.execute.mockResolvedValue({
      id: "550e8400-e29b-41d4-a716-446655440000",
      title: "Submitted Article",
      slug: "submitted-article",
      url: "submitted-article-550e8400.html",
      content: "content",
      excerpt: null,
      thumbnailUrl: null,
      category: "events",
      status: "PENDING",
      isFeatured: false,
      viewCount: 0,
      publishedAt: null,
      authorId: "trainer-1",
      createdAt: "2026-04-29T00:00:00.000Z",
      updatedAt: "2026-04-29T00:00:00.000Z",
      tags: [],
    });

    const app = await createTestApp();
    const response = await withTestAuth(
      request(app).patch("/api/v1/articles/550e8400-e29b-41d4-a716-446655440000/submit"),
      { userId: "trainer-1", role: "TRAINER" },
    );

    expect(response.status).toBe(200);
    expect(mockContainer.submitArticleUseCase.execute).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000");
    expect(response.body.status).toBe("PENDING");
  });

  it("PATCH /api/v1/articles/:id/approve approves article for editor", async () => {
    mockContainer.approveArticleUseCase.execute.mockResolvedValue({
      message: "Article approved successfully",
      article: {
        id: "550e8400-e29b-41d4-a716-446655440000",
        status: "PUBLISHED",
        url: "approved-article-550e8400.html",
      },
    });

    const app = await createTestApp();
    const response = await withTestAuth(
      request(app).patch("/api/v1/articles/550e8400-e29b-41d4-a716-446655440000/approve"),
      { userId: "editor-1", role: "EDITOR" },
    );

    expect(response.status).toBe(200);
    expect(mockContainer.approveArticleUseCase.execute).toHaveBeenCalledWith({
      articleId: "550e8400-e29b-41d4-a716-446655440000",
      actorId: "editor-1",
      actorRole: "EDITOR",
    });
    expect(response.body.message).toBe("Article approved successfully");
  });

  it("PATCH /api/v1/articles/:id/reject rejects article for admin with reason", async () => {
    mockContainer.rejectArticleUseCase.execute.mockResolvedValue({
      message: "Article rejected successfully",
      article: {
        id: "550e8400-e29b-41d4-a716-446655440000",
        status: "REJECTED",
        url: "rejected-article-550e8400.html",
      },
    });

    const app = await createTestApp();
    const response = await withTestAuth(
      request(app)
        .patch("/api/v1/articles/550e8400-e29b-41d4-a716-446655440000/reject")
        .send({ rejectionReason: "Needs revision" }),
      { userId: "admin-1", role: "ADMIN" },
    );

    expect(response.status).toBe(200);
    expect(mockContainer.rejectArticleUseCase.execute).toHaveBeenCalledWith({
      articleId: "550e8400-e29b-41d4-a716-446655440000",
      rejectionReason: "Needs revision",
      actorId: "admin-1",
      actorRole: "ADMIN",
    });
    expect(response.body.message).toBe("Article rejected successfully");
  });

  it("PATCH /api/v1/articles/:id/reject rejects invalid body", async () => {
    const app = await createTestApp();
    const response = await withTestAuth(
      request(app)
        .patch("/api/v1/articles/550e8400-e29b-41d4-a716-446655440000/reject")
        .send({ rejectionReason: "" }),
      { userId: "admin-1", role: "ADMIN" },
    );

    expect(response.status).toBe(422);
    expect(response.body.message).toBe("Validation error");
  });

  it("DELETE /api/v1/articles/:id deletes article for author", async () => {
    mockContainer.deleteArticleUseCase.execute.mockResolvedValue({
      success: true,
      message: "Article deleted successfully",
    });

    const app = await createTestApp();
    const response = await withTestAuth(
      request(app).delete("/api/v1/articles/550e8400-e29b-41d4-a716-446655440000"),
      { userId: "author-1", role: "EDITOR" },
    );

    expect(response.status).toBe(200);
    expect(mockContainer.deleteArticleUseCase.execute).toHaveBeenCalledWith({
      articleId: "550e8400-e29b-41d4-a716-446655440000",
      actorId: "author-1",
      actorRole: "EDITOR",
    });
    expect(response.body.message).toBe("Article deleted successfully");
  });

  it("PATCH /api/v1/articles/:id/approve rejects trainer without review permission", async () => {
    const app = await createTestApp();
    const response = await withTestAuth(
      request(app).patch("/api/v1/articles/550e8400-e29b-41d4-a716-446655440000/approve"),
      { userId: "trainer-1", role: "TRAINER" },
    );

    expect(response.status).toBe(403);
    expect(response.body.message).toBe("Forbidden");
  });
});
