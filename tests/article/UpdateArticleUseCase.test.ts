import { describe, expect, it, vi } from "vitest";
import { UpdateArticleUseCase } from "../../src/application/use-cases/article/UpdateArticleUseCase";
import { AppError } from "../../src/shared/AppError";
import { createArticleRepositoryMock, createTagRepositoryMock } from "../helpers/repositoryMocks";

describe("UpdateArticleUseCase", () => {
  it("updates article when tags are valid", async () => {
    const articleRepo = createArticleRepositoryMock();
    const tagRepo = createTagRepositoryMock();

    articleRepo.findById = vi.fn().mockResolvedValue({ id: "article-1" });
    tagRepo.findByIds = vi.fn().mockResolvedValue([
      { id: "tag-1", name: "Karatedo", slug: "karatedo", createdAt: new Date(), updatedAt: new Date() },
    ]);
    articleRepo.update = vi.fn().mockResolvedValue({
      id: "article-1",
      title: "Updated Article",
      slug: "updated-article",
      content: "content",
      excerpt: null,
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

    const useCase = new UpdateArticleUseCase(articleRepo, tagRepo);
    const result = await useCase.execute("article-1", {
      title: "Updated Article",
      tagIds: ["tag-1"],
    });

    expect(tagRepo.findByIds).toHaveBeenCalledWith(["tag-1"]);
    expect(articleRepo.update).toHaveBeenCalledWith("article-1", {
      title: "Updated Article",
      tagIds: ["tag-1"],
    });
    expect(result.title).toBe("Updated Article");
  });

  it("rejects when more than 3 tags are provided", async () => {
    const articleRepo = createArticleRepositoryMock();
    const tagRepo = createTagRepositoryMock();

    articleRepo.findById = vi.fn().mockResolvedValue({ id: "article-1" });

    const useCase = new UpdateArticleUseCase(articleRepo, tagRepo);

    await expect(
      useCase.execute("article-1", { tagIds: ["1", "2", "3", "4"] }),
    ).rejects.toMatchObject<AppError>({
      message: "Maximum 3 tags allowed",
      statusCode: 400,
    });
  });
});
