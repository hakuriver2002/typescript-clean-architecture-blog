import { describe, expect, it, vi } from "vitest";
import { ToggleLikeArticleUseCase } from "../../src/application/use-cases/article/ToggleLikeArticleUseCase";
import { AppError } from "../../src/shared/AppError";
import { createArticleRepositoryMock, createLikeRepositoryMock } from "../helpers/repositoryMocks";

describe("ToggleLikeArticleUseCase", () => {
  it("creates like when like does not exist", async () => {
    const articleRepo = createArticleRepositoryMock();
    const likeRepo = createLikeRepositoryMock();

    articleRepo.findById = vi.fn().mockResolvedValue({ id: "article-1" });
    likeRepo.find = vi.fn().mockResolvedValue(null);
    likeRepo.create = vi.fn().mockResolvedValue(undefined);

    const useCase = new ToggleLikeArticleUseCase(articleRepo, likeRepo);
    const result = await useCase.execute({ articleId: "article-1", userId: "user-1" });

    expect(likeRepo.create).toHaveBeenCalled();
    expect(result).toEqual({
      liked: true,
      message: "Article liked",
    });
  });

  it("removes like when like already exists", async () => {
    const articleRepo = createArticleRepositoryMock();
    const likeRepo = createLikeRepositoryMock();

    articleRepo.findById = vi.fn().mockResolvedValue({ id: "article-1" });
    likeRepo.find = vi.fn().mockResolvedValue({
      articleId: "article-1",
      userId: "user-1",
      createdAt: new Date(),
    });
    likeRepo.delete = vi.fn().mockResolvedValue(undefined);

    const useCase = new ToggleLikeArticleUseCase(articleRepo, likeRepo);
    const result = await useCase.execute({ articleId: "article-1", userId: "user-1" });

    expect(likeRepo.delete).toHaveBeenCalledWith("user-1", "article-1");
    expect(result).toEqual({
      liked: false,
      message: "Article unliked",
    });
  });

  it("throws AppError when article does not exist", async () => {
    const articleRepo = createArticleRepositoryMock();
    const likeRepo = createLikeRepositoryMock();

    articleRepo.findById = vi.fn().mockResolvedValue(null);

    const useCase = new ToggleLikeArticleUseCase(articleRepo, likeRepo);

    await expect(
      useCase.execute({ articleId: "missing", userId: "user-1" }),
    ).rejects.toMatchObject<AppError>({
      message: "Article not found",
      statusCode: 404,
    });
  });
});
