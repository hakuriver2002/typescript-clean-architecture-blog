import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createAuthMiddlewareMock, withTestAuth } from "../helpers/httpAuthMocks";
import { createHttpTestApp } from "../helpers/httpTestApp";

const mockContainer = {
  listCommentsByArticleUseCase: { execute: vi.fn() },
  createCommentUseCase: { execute: vi.fn() },
  replyCommentUseCase: { execute: vi.fn() },
  deleteCommentUseCase: { execute: vi.fn() },
};

vi.mock("../../src/infrastructure/container", () => ({
  container: mockContainer,
}));

vi.mock("../../src/interface/http/middlewares/authMiddleware", () => createAuthMiddlewareMock());

async function createTestApp() {
  return createHttpTestApp(
    async () => (await import("../../src/interface/http/routes/commentRoutes")).commentRouter,
    "/api/v1/articles/:articleId/comments",
  );
}

describe("commentRouter HTTP", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET /api/v1/articles/:articleId/comments returns paginated comments", async () => {
    mockContainer.listCommentsByArticleUseCase.execute.mockResolvedValue({
      data: [],
      total: 0,
      page: 1,
      pageSize: 10,
      totalPages: 0,
    });

    const app = await createTestApp();
    const response = await request(app).get(
      "/api/v1/articles/550e8400-e29b-41d4-a716-446655440000/comments?page=1&pageSize=10",
    );

    expect(response.status).toBe(200);
    expect(mockContainer.listCommentsByArticleUseCase.execute).toHaveBeenCalledWith({
      articleId: "550e8400-e29b-41d4-a716-446655440000",
      page: 1,
      pageSize: 10,
    });
  });

  it("POST /api/v1/articles/:articleId/comments creates comment for authenticated member", async () => {
    mockContainer.createCommentUseCase.execute.mockResolvedValue({
      id: "comment-1",
      content: "Nice article",
    });

    const app = await createTestApp();
    const response = await withTestAuth(
      request(app)
        .post("/api/v1/articles/550e8400-e29b-41d4-a716-446655440000/comments")
        .send({ content: "Nice article" }),
    );

    expect(response.status).toBe(201);
    expect(mockContainer.createCommentUseCase.execute).toHaveBeenCalledWith({
      articleId: "550e8400-e29b-41d4-a716-446655440000",
      userId: "user-1",
      content: "Nice article",
      parentId: undefined,
    });
  });

  it("POST /api/v1/articles/:articleId/comments/:id/reply replies for authenticated member", async () => {
    mockContainer.replyCommentUseCase.execute.mockResolvedValue({
      id: "reply-1",
      content: "Reply text",
    });

    const app = await createTestApp();
    const response = await withTestAuth(
      request(app)
        .post("/api/v1/articles/550e8400-e29b-41d4-a716-446655440000/comments/550e8400-e29b-41d4-a716-446655440111/reply")
        .send({ content: "Reply text" }),
    );

    expect(response.status).toBe(201);
    expect(mockContainer.replyCommentUseCase.execute).toHaveBeenCalledWith({
      parentCommentId: "550e8400-e29b-41d4-a716-446655440111",
      userId: "user-1",
      content: "Reply text",
    });
  });

  it("DELETE /api/v1/articles/:articleId/comments/:commentId deletes comment for authenticated member", async () => {
    mockContainer.deleteCommentUseCase.execute.mockResolvedValue(undefined);

    const app = await createTestApp();
    const response = await withTestAuth(
      request(app).delete("/api/v1/articles/550e8400-e29b-41d4-a716-446655440000/comments/550e8400-e29b-41d4-a716-446655440111"),
    );

    expect(response.status).toBe(200);
    expect(mockContainer.deleteCommentUseCase.execute).toHaveBeenCalledWith({
      id: "550e8400-e29b-41d4-a716-446655440111",
      articleId: "550e8400-e29b-41d4-a716-446655440000",
      userId: "user-1",
      role: "MEMBER",
    });
    expect(response.body.message).toBe("Comment deleted successfully");
  });

  it("POST /api/v1/articles/:articleId/comments rejects unauthenticated request", async () => {
    const app = await createTestApp();
    const response = await request(app)
      .post("/api/v1/articles/550e8400-e29b-41d4-a716-446655440000/comments")
      .send({ content: "Nice article" });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Unauthorized");
  });
});
