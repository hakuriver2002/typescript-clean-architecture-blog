import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createAuthMiddlewareMock, withTestAuth } from "../helpers/httpAuthMocks";
import { createHttpTestApp } from "../helpers/httpTestApp";

const mockContainer = {
  getMyProfileUseCase: { execute: vi.fn() },
  updateMyProfileUseCase: { execute: vi.fn() },
  changeMyPasswordUseCase: { execute: vi.fn() },
  listMyArticlesUseCase: { execute: vi.fn() },
  listMyBookmarkedArticlesUseCase: { execute: vi.fn() },
};

vi.mock("../../src/infrastructure/container", () => ({
  container: mockContainer,
}));

vi.mock("../../src/interface/http/middlewares/authMiddleware", () => createAuthMiddlewareMock());

async function createTestApp() {
  return createHttpTestApp(
    async () => (await import("../../src/interface/http/routes/profileRoutes")).profileRouter,
    "/api/v1/profile",
  );
}

describe("profileRouter HTTP", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET /api/v1/profile/me returns current profile", async () => {
    mockContainer.getMyProfileUseCase.execute.mockResolvedValue({
      id: "user-1",
      email: "user@example.com",
      fullName: "User Name",
      avatarUrl: null,
      role: "MEMBER",
      status: "ACTIVE",
      createdAt: "2026-04-29",
      updatedAt: "2026-04-29",
    });

    const app = await createTestApp();
    const response = await withTestAuth(request(app).get("/api/v1/profile/me"));

    expect(response.status).toBe(200);
    expect(mockContainer.getMyProfileUseCase.execute).toHaveBeenCalledWith("user-1");
    expect(response.body.fullName).toBe("User Name");
  });

  it("PATCH /api/v1/profile/me updates current profile", async () => {
    mockContainer.updateMyProfileUseCase.execute.mockResolvedValue({
      id: "user-1",
      email: "user@example.com",
      fullName: "Updated Name",
      avatarUrl: "https://example.com/avatar.jpg",
      role: "MEMBER",
      status: "ACTIVE",
      createdAt: "2026-04-29",
      updatedAt: "2026-04-29",
    });

    const app = await createTestApp();
    const response = await withTestAuth(
      request(app)
        .patch("/api/v1/profile/me")
        .send({ fullName: "Updated Name", avatarUrl: "https://example.com/avatar.jpg" }),
    );

    expect(response.status).toBe(200);
    expect(mockContainer.updateMyProfileUseCase.execute).toHaveBeenCalledWith({
      userId: "user-1",
      fullName: "Updated Name",
      avatarUrl: "https://example.com/avatar.jpg",
    });
    expect(response.body.fullName).toBe("Updated Name");
  });

  it("PATCH /api/v1/profile/me/password changes password", async () => {
    mockContainer.changeMyPasswordUseCase.execute.mockResolvedValue({
      message: "Password changed successfully",
    });

    const app = await createTestApp();
    const response = await withTestAuth(
      request(app)
        .patch("/api/v1/profile/me/password")
        .send({ currentPassword: "oldpassword", newPassword: "newpassword123" }),
    );

    expect(response.status).toBe(200);
    expect(mockContainer.changeMyPasswordUseCase.execute).toHaveBeenCalledWith({
      userId: "user-1",
      currentPassword: "oldpassword",
      newPassword: "newpassword123",
    });
    expect(response.body.message).toBe("Password changed successfully");
  });

  it("GET /api/v1/profile/me/bookmarks returns paginated bookmarks", async () => {
    mockContainer.listMyBookmarkedArticlesUseCase.execute.mockResolvedValue({
      data: [],
      total: 0,
      page: 1,
      pageSize: 10,
      totalPages: 0,
    });

    const app = await createTestApp();
    const response = await withTestAuth(
      request(app).get("/api/v1/profile/me/bookmarks?page=1&pageSize=10"),
    );

    expect(response.status).toBe(200);
    expect(mockContainer.listMyBookmarkedArticlesUseCase.execute).toHaveBeenCalledWith({
      userId: "user-1",
      page: 1,
      pageSize: 10,
    });
  });

  it("GET /api/v1/profile/me rejects unauthenticated request", async () => {
    const app = await createTestApp();
    const response = await request(app).get("/api/v1/profile/me");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Unauthorized");
  });
});
