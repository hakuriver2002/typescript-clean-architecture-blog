import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createHttpTestApp } from "../helpers/httpTestApp";

const mockContainer = {
  getAllTagsUseCase: { execute: vi.fn() },
  getTagBySlugUseCase: { execute: vi.fn() },
  getTagByIdUseCase: { execute: vi.fn() },
  getTagByNameUseCase: { execute: vi.fn() },
  createTagUseCase: { execute: vi.fn() },
  updateTagUseCase: { execute: vi.fn() },
  deleteTagUseCase: { execute: vi.fn() },
};

vi.mock("../../src/infrastructure/container", () => ({
  container: mockContainer,
}));

vi.mock("../../src/interface/http/middlewares/authMiddleware", () => {
  return {
    authMiddleware: (req: any, res: any, next: any) => {
      const userId = req.header("x-test-user-id");
      const role = req.header("x-test-role");

      if (!userId || !role) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      req.user = {
        id: userId,
        email: "tester@example.com",
        role,
      };

      next();
    },
  };
});

async function createTestApp() {
  return createHttpTestApp(
    async () => (await import("../../src/interface/http/routes/tagRoutes")).tagRouter,
    "/api/v1/tags",
  );
}

describe("tagRouter HTTP", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET /api/v1/tags returns paginated public tags", async () => {
    mockContainer.getAllTagsUseCase.execute.mockResolvedValue({
      data: [{ id: "tag-1", name: "Karatedo", slug: "karatedo", createdAt: "2026-04-29", updatedAt: "2026-04-29" }],
      total: 1,
      page: 1,
      pageSize: 10,
      totalPages: 1,
    });

    const app = await createTestApp();
    const response = await request(app).get("/api/v1/tags?page=1&limit=10&search=karate");

    expect(response.status).toBe(200);
    expect(mockContainer.getAllTagsUseCase.execute).toHaveBeenCalledWith(1, 10, "karate");
    expect(response.body.data[0].slug).toBe("karatedo");
  });

  it("GET /api/v1/tags/slug/:slug returns tag detail", async () => {
    mockContainer.getTagBySlugUseCase.execute.mockResolvedValue({
      id: "tag-1",
      name: "Karatedo",
      slug: "karatedo",
      createdAt: "2026-04-29",
      updatedAt: "2026-04-29",
    });

    const app = await createTestApp();
    const response = await request(app).get("/api/v1/tags/slug/karatedo");

    expect(response.status).toBe(200);
    expect(mockContainer.getTagBySlugUseCase.execute).toHaveBeenCalledWith("karatedo");
    expect(response.body.name).toBe("Karatedo");
  });

  it("POST /api/v1/tags requires admin permission", async () => {
    const app = await createTestApp();
    const response = await request(app)
      .post("/api/v1/tags")
      .set("x-test-user-id", "member-1")
      .set("x-test-role", "MEMBER")
      .send({ name: "Karatedo" });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe("Forbidden");
  });
});
